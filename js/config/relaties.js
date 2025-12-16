/**
 * DDH - Digitale Handhaving
 * Relatie configuratie tussen SharePoint lijsten
 * 
 * Dit bestand definieert de relaties tussen de verschillende lijsten
 * en biedt helper functies voor het werken met gerelateerde data.
 * 
 * @module config/relaties
 */

import { LIJSTEN } from './lijsten.js';

/**
 * Relatie definities tussen lijsten
 * 
 * De hoofdrelatie is tussen Digitale Handhaving (1) en Problemen Pleeglocaties (many)
 * via de berekende velden gemeenteID en ProbleemID
 */
export const LIJST_RELATIES = {
  /**
   * Digitale Handhaving -> Problemen Pleeglocaties
   * Een digitale handhaving locatie kan meerdere problemen hebben
   */
  digitaleHandhavingNaarProblemen: {
    bronLijst: 'digitaleHandhaving',
    bronLijstId: LIJSTEN.digitaleHandhaving.lijstId,
    bronSleutelVeld: 'gemeenteID', // Berekend veld in Digitale Handhaving
    
    doelLijst: 'problemenPleeglocaties',
    doelLijstId: LIJSTEN.problemenPleeglocaties.lijstId,
    doelSleutelVeld: 'ProbleemID', // Berekend veld in Problemen
    
    relatieType: 'oneToMany', // 1 DH locatie -> N problemen
    
    // Velden die gebruikt worden voor de berekening
    bronBerekening: {
      veld1: 'Gemeente',
      veld2: 'Title', // "Titel" in UI
      formule: '[Gemeente] + " - " + [Title]'
    },
    
    doelBerekening: {
      veld1: 'Gemeente',
      veld2: 'Title', // "Pleeglocatie" in UI
      formule: '[Gemeente] + " - " + [Title]'
    }
  },
  
  /**
   * Problemen Pleeglocaties -> Digitale Handhaving (reverse lookup)
   * Voor het vinden van de bijbehorende DH locatie bij een probleem
   */
  problemenNaarDigitaleHandhaving: {
    bronLijst: 'problemenPleeglocaties',
    bronLijstId: LIJSTEN.problemenPleeglocaties.lijstId,
    bronSleutelVeld: 'ProbleemID',
    
    doelLijst: 'digitaleHandhaving',
    doelLijstId: LIJSTEN.digitaleHandhaving.lijstId,
    doelSleutelVeld: 'gemeenteID',
    
    relatieType: 'manyToOne', // N problemen -> 1 DH locatie
  }
};

/**
 * Helper functies voor het werken met relaties
 */
export const RelatieHelpers = {
  /**
   * Normaliseer een string voor consistente matching
   * @param {string} str - String om te normaliseren
   * @returns {string} Genormaliseerde string
   */
  normaliseString: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .trim()                           // Remove leading/trailing spaces
      .toLowerCase()                    // Convert to lowercase
      .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
      .replace(/[^\w\s-]/g, '')        // Remove special characters except dashes
      .trim();                         // Final trim after cleanup
  },

  /**
   * Genereer een genormaliseerde sleutel voor gemeente + locatie combinatie
   * @param {string} gemeente - Gemeente naam
   * @param {string} locatie - Locatie naam (pleeglocatie of titel)
   * @returns {string} Genormaliseerde gecombineerde sleutel
   */
  genereerSleutel: (gemeente, locatie) => {
    if (!gemeente || !locatie) {
      throw new Error('Gemeente en locatie zijn beide vereist voor sleutel generatie');
    }
    const normGemeente = RelatieHelpers.normaliseString(gemeente);
    const normLocatie = RelatieHelpers.normaliseString(locatie);
    return `${normGemeente} - ${normLocatie}`;
  },

  /**
   * Genereer een genormaliseerde sleutel direct van een object
   * @param {Object} item - Object met Gemeente en Title/Pleeglocatie velden
   * @param {string} locatieVeld - Naam van het locatie veld ('Title', 'Pleeglocatie', etc.)
   * @returns {string} Genormaliseerde sleutel
   */
  genereerSleutelVanObject: (item, locatieVeld = 'Title') => {
    if (!item) return '';
    const gemeente = item.Gemeente || '';
    const locatie = item[locatieVeld] || '';
    return RelatieHelpers.genereerSleutel(gemeente, locatie);
  },

  /**
   * Parse een sleutel terug naar gemeente en locatie
   * @param {string} sleutel - De gecombineerde sleutel
   * @returns {{gemeente: string, locatie: string}} Geparseerde waarden
   */
  parseSleutel: (sleutel) => {
    if (!sleutel || typeof sleutel !== 'string') {
      throw new Error('Ongeldige sleutel voor parsing');
    }
    
    const delen = sleutel.split(' - ');
    if (delen.length < 2) {
      throw new Error('Sleutel heeft niet het verwachte formaat "Gemeente - Locatie"');
    }
    
    return {
      gemeente: delen[0],
      locatie: delen.slice(1).join(' - ') // Voor het geval de locatie zelf " - " bevat
    };
  },

  /**
   * Valideer of twee sleutels overeenkomen
   * @param {string} sleutel1 - Eerste sleutel
   * @param {string} sleutel2 - Tweede sleutel
   * @returns {boolean} True als ze overeenkomen
   */
  sleutelsKomenOvereen: (sleutel1, sleutel2) => {
    // Case-insensitive vergelijking voor robuustheid
    return sleutel1?.toLowerCase() === sleutel2?.toLowerCase();
  },

  /**
   * Bouw een filter query voor het zoeken op sleutel
   * @param {string} veldNaam - Naam van het veld om te filteren
   * @param {string} sleutelWaarde - De waarde om op te zoeken
   * @returns {string} OData filter string
   */
  bouwSleutelFilter: (veldNaam, sleutelWaarde) => {
    // Escape enkele quotes in de waarde
    const escapeWaarde = sleutelWaarde.replace(/'/g, "''");
    return `${veldNaam} eq '${escapeWaarde}'`;
  }
};

/**
 * Query builders voor gerelateerde data
 */
export const RelatieQueries = {
  /**
   * Haal alle problemen op voor een specifieke digitale handhaving locatie
   * @param {string} gemeenteId - De gemeenteID van de DH locatie
   * @returns {Promise<Array>} Array van problemen
   */
  haalProblemenVoorDHLocatie: async (gemeenteId) => {
    const filter = RelatieHelpers.bouwSleutelFilter('ProbleemID', gemeenteId);
    const url = `${LIJSTEN.problemenPleeglocaties.endpoints.alleItems()}?$filter=${filter}&$expand=Eigenaar,Beoordelaar,Melder&$orderby=Aanmaakdatum desc`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fout bij ophalen problemen: ${response.status}`);
    }
    
    const data = await response.json();
    return data.d.results;
  },

  /**
   * Haal de digitale handhaving locatie op voor een specifiek probleem
   * @param {string} probleemId - De ProbleemID van het probleem
   * @returns {Promise<Object|null>} DH locatie of null
   */
  haalDHLocatieVoorProbleem: async (probleemId) => {
    const filter = RelatieHelpers.bouwSleutelFilter('gemeenteID', probleemId);
    const url = `${LIJSTEN.digitaleHandhaving.endpoints.alleItems()}?$filter=${filter}&$top=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fout bij ophalen DH locatie: ${response.status}`);
    }
    
    const data = await response.json();
    return data.d.results.length > 0 ? data.d.results[0] : null;
  },

  /**
   * Haal alle data op met relaties (JOIN-achtige functionaliteit)
   * @param {Object} opties - Query opties
   * @returns {Promise<Array>} Array van DH locaties met hun problemen
   */
  haalAllesMetRelaties: async (opties = {}) => {
    const { 
      filterDH = null, 
      filterProblemen = null,
      includeProblemenDetails = true 
    } = opties;

    // Haal eerst alle DH locaties op
    let dhUrl = LIJSTEN.digitaleHandhaving.endpoints.alleItems();
    if (filterDH) {
      dhUrl += `?$filter=${filterDH}`;
    }
    
    const dhResponse = await fetch(dhUrl, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      }
    });
    
    if (!dhResponse.ok) {
      throw new Error(`Fout bij ophalen DH locaties: ${dhResponse.status}`);
    }
    
    const dhData = await dhResponse.json();
    const dhLocaties = dhData.d.results;

    // Als we geen probleem details nodig hebben, return hier
    if (!includeProblemenDetails) {
      return dhLocaties;
    }

    // Haal alle problemen op in één query voor performance
    let problemenUrl = LIJSTEN.problemenPleeglocaties.endpoints.alleItems() + 
                       '?$select=*,Eigenaar/Title,Beoordelaar/Title,Melder/Title&$expand=Eigenaar,Beoordelaar,Melder';
    if (filterProblemen) {
      problemenUrl += `&$filter=${filterProblemen}`;
    }
    
    const problemenResponse = await fetch(problemenUrl, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      }
    });
    
    if (!problemenResponse.ok) {
      throw new Error(`Fout bij ophalen problemen: ${problemenResponse.status}`);
    }
    
    const problemenData = await problemenResponse.json();
    const alleProblemen = problemenData.d.results;

    // Groepeer problemen per genormaliseerde sleutel voor snelle lookup
    const problemenPerLocatie = {};
    alleProblemen.forEach(probleem => {
      // Use direct field matching with normalization
      // In problems list: 'Title' field contains the pleeglocatie name
      const sleutel = RelatieHelpers.genereerSleutelVanObject(probleem, 'Title');
      if (!problemenPerLocatie[sleutel]) {
        problemenPerLocatie[sleutel] = [];
      }
      problemenPerLocatie[sleutel].push(probleem);
    });

    // Debug logging to see what keys are being generated
    console.log('Problemen sleutels:', Object.keys(problemenPerLocatie));

    // Voeg problemen toe aan DH locaties met genormaliseerde matching
    const resultaat = dhLocaties.map(dhLocatie => {
      // Use direct field matching with normalization instead of calculated gemeenteID
      const dhSleutel = RelatieHelpers.genereerSleutelVanObject(dhLocatie, 'Title');
      const matchedProblemen = problemenPerLocatie[dhSleutel] || [];
      
      // Debug logging for each DH location
      if (matchedProblemen.length > 0) {
        console.log(`Match found: ${dhSleutel} -> ${matchedProblemen.length} problemen`);
      }
      
      return {
        ...dhLocatie,
        problemen: matchedProblemen,
        aantalProblemen: matchedProblemen.length,
        matchingKey: dhSleutel // Add for debugging
      };
    });

    return resultaat;
  }
};

/**
 * Validatie functies voor data integriteit
 */
export const RelatieValidatie = {
  /**
   * Controleer of een gemeente-locatie combinatie al bestaat
   * @param {string} gemeente - Gemeente naam
   * @param {string} locatie - Locatie naam
   * @param {string} lijstNaam - 'digitaleHandhaving' of 'problemenPleeglocaties'
   * @returns {Promise<boolean>} True als combinatie bestaat
   */
  bestaatCombinatie: async (gemeente, locatie, lijstNaam) => {
    const sleutel = RelatieHelpers.genereerSleutel(gemeente, locatie);
    const lijst = LIJSTEN[lijstNaam];
    
    if (!lijst) {
      throw new Error(`Onbekende lijst: ${lijstNaam}`);
    }
    
    const veldNaam = lijstNaam === 'digitaleHandhaving' ? 'gemeenteID' : 'ProbleemID';
    const filter = RelatieHelpers.bouwSleutelFilter(veldNaam, sleutel);
    const url = `${lijst.endpoints.alleItems()}?$filter=${filter}&$top=1&$select=Id`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fout bij validatie: ${response.status}`);
    }
    
    const data = await response.json();
    return data.d.results.length > 0;
  },

  /**
   * Valideer dat een probleem een bestaande DH locatie heeft
   * @param {string} gemeente - Gemeente van het probleem
   * @param {string} pleeglocatie - Pleeglocatie van het probleem
   * @returns {Promise<Object>} Validatie resultaat
   */
  valideerProbleemRelatie: async (gemeente, pleeglocatie) => {
    const sleutel = RelatieHelpers.genereerSleutel(gemeente, pleeglocatie);
    const dhLocatie = await RelatieQueries.haalDHLocatieVoorProbleem(sleutel);
    
    return {
      isGeldig: dhLocatie !== null,
      dhLocatie: dhLocatie,
      melding: dhLocatie 
        ? `Gekoppeld aan DH locatie: ${dhLocatie.Title}` 
        : `Geen DH locatie gevonden voor ${sleutel}`
    };
  }
};

/**
 * Statistieken en rapportage functies
 */
export const RelatieStatistieken = {
  /**
   * Tel problemen per status voor een DH locatie
   * @param {string} gemeenteId - De gemeenteID van de DH locatie
   * @returns {Promise<Object>} Status tellingen
   */
  telProblemenPerStatus: async (gemeenteId) => {
    const problemen = await RelatieQueries.haalProblemenVoorDHLocatie(gemeenteId);
    
    const statusTelling = {};
    problemen.forEach(probleem => {
      const status = probleem.Opgelost_x003f_ || 'Onbekend';
      statusTelling[status] = (statusTelling[status] || 0) + 1;
    });
    
    return {
      totaal: problemen.length,
      perStatus: statusTelling,
      problemen: problemen
    };
  },

  /**
   * Krijg overzicht van alle DH locaties met probleem statistieken
   * @returns {Promise<Array>} Array van statistieken per locatie
   */
  krijgVolledigOverzicht: async () => {
    const allesMetRelaties = await RelatieQueries.haalAllesMetRelaties();
    
    return allesMetRelaties.map(dhLocatie => {
      const statusTelling = {};
      dhLocatie.problemen.forEach(probleem => {
        const status = probleem.Opgelost_x003f_ || 'Onbekend';
        statusTelling[status] = (statusTelling[status] || 0) + 1;
      });
      
      return {
        id: dhLocatie.Id,
        gemeenteId: dhLocatie.gemeenteID,
        titel: dhLocatie.Title,
        gemeente: dhLocatie.Gemeente,
        statusBenS: dhLocatie.Status_x0020_B_x0026_S,
        waarschuwingsperiode: dhLocatie.Waarschuwingsperiode,
        aantalProblemen: dhLocatie.aantalProblemen,
        problemenPerStatus: statusTelling,
        laatsteSchouw: dhLocatie.Laatste_x0020_schouw
      };
    });
  }
};

// Export default voor makkelijke import
export default {
  LIJST_RELATIES,
  RelatieHelpers,
  RelatieQueries,
  RelatieValidatie,
  RelatieStatistieken
};