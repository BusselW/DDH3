/**
 * DDH - Digitale Handhaving
 * Data Services voor interactie met SharePoint lijsten
 * 
 * Deze module biedt een abstractielaag boven de SharePoint REST API
 * en maakt gebruik van de geconfigureerde relaties tussen lijsten.
 * 
 * @module services/dataServices
 */

import { DDH_CONFIG } from './config/index.js';

/**
 * Basis data service class met gemeenschappelijke functionaliteit
 */
class BasisDataService {
  constructor(lijstNaam) {
    this.lijstNaam = lijstNaam;
    this.lijst = DDH_CONFIG.lijsten[lijstNaam];
    
    if (!this.lijst) {
      throw new Error(`Lijst '${lijstNaam}' niet gevonden in configuratie`);
    }
  }

  /**
   * Haal Request Digest op voor write operaties
   * @returns {Promise<string>} Request Digest token
   */
  async haalRequestDigestOp() {
    try {
      const response = await fetch(DDH_CONFIG.helpers.maakApiUrl('/contextinfo'), {
        method: 'POST',
        headers: DDH_CONFIG.headers.get
      });
      
      const data = await response.json();
      return data.d.GetContextWebInformation.FormDigestValue;
    } catch (error) {
      console.error('Fout bij ophalen Request Digest:', error);
      throw error;
    }
  }

  /**
   * Haal metadata type naam op voor lijst items
   * @returns {string} Metadata type string
   */
  krijgMetadataType() {
    // SharePoint verwacht specifieke metadata type namen
    const lijstTitel = this.lijst.lijstTitel.replace(/\s/g, '_x0020_');
    return `SP.Data.${lijstTitel}ListItem`;
  }

  /**
   * Bereid data voor voor SharePoint
   * @param {Object} data - Raw data object
   * @param {boolean} isUpdate - True voor update, false voor create
   * @returns {Object} Prepared data met metadata
   */
  bereidDataVoor(data, isUpdate = false) {
    const bereideData = {
      __metadata: { type: this.krijgMetadataType() }
    };

    // Loop door de data en map naar interne veldnamen
    Object.entries(data).forEach(([key, value]) => {
      const veldConfig = this.lijst.velden[key];
      if (veldConfig && !veldConfig.verborgen && veldConfig.verwijderbaar) {
        // Speciale handling voor verschillende veld types
        switch (veldConfig.type) {
          case 'User':
          case 'UserMulti':
            // Gebruik de Id property voor user velden
            if (veldConfig.dataOpslag?.updateProperty) {
              bereideData[veldConfig.dataOpslag.updateProperty] = value;
            }
            break;
            
          case 'URL':
            // URL velden verwachten een object
            if (value && typeof value === 'object') {
              bereideData[veldConfig.interneNaam] = {
                __metadata: { type: 'SP.FieldUrlValue' },
                Description: value.Description || value.description || '',
                Url: value.Url || value.url || ''
              };
            }
            break;
            
          case 'Calculated':
          case 'Counter':
            // Deze velden kunnen niet worden gezet
            if (!isUpdate) {
              break;
            }
            
          default:
            // Standaard velden
            bereideData[veldConfig.interneNaam] = value;
        }
      }
    });

    return bereideData;
  }

  /**
   * Generieke CRUD operaties
   */
  
  async haalAlleItemsOp(opties = {}) {
    const { filter, select, expand, orderby, top } = opties;
    let url = this.lijst.endpoints.alleItems();
    
    const queryParams = [];
    if (filter) queryParams.push(`$filter=${filter}`);
    if (select) queryParams.push(`$select=${select}`);
    if (expand) queryParams.push(`$expand=${expand}`);
    if (orderby) queryParams.push(`$orderby=${orderby}`);
    if (top) queryParams.push(`$top=${top}`);
    
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
    
    try {
      const response = await fetch(url, {
        headers: DDH_CONFIG.headers.get
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.d.results;
    } catch (error) {
      console.error(`Fout bij ophalen items uit ${this.lijstNaam}:`, error);
      throw error;
    }
  }

  async haalItemOp(id, opties = {}) {
    const { select, expand } = opties;
    let url = this.lijst.endpoints.specifiekItem(id);
    
    const queryParams = [];
    if (select) queryParams.push(`$select=${select}`);
    if (expand) queryParams.push(`$expand=${expand}`);
    
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
    
    try {
      const response = await fetch(url, {
        headers: DDH_CONFIG.headers.get
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.d;
    } catch (error) {
      console.error(`Fout bij ophalen item ${id} uit ${this.lijstNaam}:`, error);
      throw error;
    }
  }

  async maakItemAan(itemData) {
    const digest = await this.haalRequestDigestOp();
    const bereideData = this.bereidDataVoor(itemData, false);
    
    try {
      const response = await fetch(this.lijst.endpoints.aanmaken(), {
        method: 'POST',
        headers: DDH_CONFIG.headers.post(digest),
        body: JSON.stringify(bereideData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data.d;
    } catch (error) {
      console.error(`Fout bij aanmaken item in ${this.lijstNaam}:`, error);
      throw error;
    }
  }

  async updateItem(id, itemData) {
    const digest = await this.haalRequestDigestOp();
    const bereideData = this.bereidDataVoor(itemData, true);
    
    try {
      const response = await fetch(this.lijst.endpoints.updaten(id), {
        method: 'POST',
        headers: DDH_CONFIG.headers.merge(digest),
        body: JSON.stringify(bereideData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      // MERGE requests geven geen body terug, haal updated item op
      return await this.haalItemOp(id);
    } catch (error) {
      console.error(`Fout bij updaten item ${id} in ${this.lijstNaam}:`, error);
      throw error;
    }
  }

  async verwijderItem(id) {
    const digest = await this.haalRequestDigestOp();
    
    try {
      const response = await fetch(this.lijst.endpoints.verwijderen(id), {
        method: 'POST',
        headers: DDH_CONFIG.headers.delete(digest)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return { success: true, id };
    } catch (error) {
      console.error(`Fout bij verwijderen item ${id} uit ${this.lijstNaam}:`, error);
      throw error;
    }
  }
}

/**
 * Service voor Problemen Pleeglocaties
 */
export class ProblemenService extends BasisDataService {
  constructor() {
    super('problemenPleeglocaties');
  }

  /**
   * Maak een nieuw probleem aan met validatie
   * @param {Object} probleemData - Probleem gegevens
   * @returns {Promise<Object>} Aangemaakt probleem
   */
  async maakProbleemAan(probleemData) {
    // Valideer verplichte velden
    const verplichtVelden = ['Title', 'Gemeente', 'Feitcodegroep', 'Probleembeschrijving'];
    const ontbrekendeVelden = verplichtVelden.filter(veld => !probleemData[veld]);
    
    if (ontbrekendeVelden.length > 0) {
      throw new Error(`Verplichte velden ontbreken: ${ontbrekendeVelden.join(', ')}`);
    }

    // Valideer dat de DH locatie bestaat
    const sleutel = DDH_CONFIG.helpers.genereerSleutel(
      probleemData.Gemeente, 
      probleemData.Title
    );
    
    const validatie = await DDH_CONFIG.validatie.valideerProbleemRelatie(
      probleemData.Gemeente,
      probleemData.Title
    );
    
    if (!validatie.isGeldig) {
      console.warn(validatie.melding);
      // Optioneel: gooi een error of ga door met waarschuwing
    }

    // Voeg standaard waarden toe
    const volledigeData = {
      Aanmaakdatum: new Date().toISOString(),
      Actie_x0020_Beoordelaars: 'Geen actie nodig',
      Opgelost_x003f_: 'Aangemeld',
      ...probleemData
    };

    return await this.maakItemAan(volledigeData);
  }

  /**
   * Haal problemen op voor een specifieke DH locatie
   * @param {string} gemeenteId - gemeenteID van de DH locatie
   * @returns {Promise<Array>} Array van problemen
   */
  async haalProblemenVoorDHLocatie(gemeenteId) {
    return await DDH_CONFIG.queries.haalProblemenVoorDHLocatie(gemeenteId);
  }

  /**
   * Haal problemen op gefilterd op status
   * @param {string} status - Status om op te filteren
   * @returns {Promise<Array>} Gefilterde problemen
   */
  async haalProblemenOpStatus(status) {
    const filter = `Opgelost_x003f_ eq '${status}'`;
    return await this.haalAlleItemsOp({
      filter,
      expand: 'Eigenaar,Beoordelaar,Melder',
      orderby: 'Aanmaakdatum desc'
    });
  }

  /**
   * Wijs probleem toe aan beoordelaar(s)
   * @param {number} probleemId - ID van het probleem
   * @param {Array<number>} beoordelaarIds - Array van user IDs
   * @returns {Promise<Object>} Geüpdatet probleem
   */
  async wijsBeoordelaarsToe(probleemId, beoordelaarIds) {
    return await this.updateItem(probleemId, {
      BeoordelaarId: {
        __metadata: { type: 'Collection(Edm.Int32)' },
        results: beoordelaarIds
      }
    });
  }
}

/**
 * Service voor Digitale Handhaving
 */
export class DigitaleHandhavingService extends BasisDataService {
  constructor() {
    super('digitaleHandhaving');
  }

  /**
   * Maak een nieuwe DH locatie aan
   * @param {Object} dhData - DH locatie gegevens
   * @returns {Promise<Object>} Aangemaakte DH locatie
   */
  async maakDHLocatieAan(dhData) {
    // Valideer verplichte velden
    const verplichtVelden = ['Title', 'Gemeente', 'Feitcodegroep'];
    const ontbrekendeVelden = verplichtVelden.filter(veld => !dhData[veld]);
    
    if (ontbrekendeVelden.length > 0) {
      throw new Error(`Verplichte velden ontbreken: ${ontbrekendeVelden.join(', ')}`);
    }

    // Controleer of gemeente-titel combinatie al bestaat
    const bestaat = await DDH_CONFIG.validatie.bestaatCombinatie(
      dhData.Gemeente,
      dhData.Title,
      'digitaleHandhaving'
    );
    
    if (bestaat) {
      throw new Error(`DH locatie '${dhData.Gemeente} - ${dhData.Title}' bestaat al`);
    }

    // Voeg standaard waarden toe
    const volledigeData = {
      Feitcodegroep: 'Verkeersborden',
      Status_x0020_B_x0026_S: 'Aangevraagd',
      Waarschuwingsperiode: 'Ja',
      ...dhData
    };

    return await this.maakItemAan(volledigeData);
  }

  /**
   * Haal DH locaties op met hun problemen
   * @param {Object} opties - Filter opties
   * @returns {Promise<Array>} DH locaties met problemen
   */
  async haalDHLocatiesMetProblemen(opties = {}) {
    return await DDH_CONFIG.queries.haalAllesMetRelaties(opties);
  }

  /**
   * Haal statistieken op voor een DH locatie
   * @param {string} gemeenteId - gemeenteID van de DH locatie
   * @returns {Promise<Object>} Statistieken object
   */
  async haalStatistiekenOp(gemeenteId) {
    return await DDH_CONFIG.statistieken.telProblemenPerStatus(gemeenteId);
  }

  /**
   * Update waarschuwingsperiode
   * @param {number} dhId - ID van de DH locatie
   * @param {Object} periodeData - Start en eind datum
   * @returns {Promise<Object>} Geüpdatet DH locatie
   */
  async updateWaarschuwingsperiode(dhId, periodeData) {
    const updateData = {};
    
    if (periodeData.start) {
      updateData.Start_x0020_Waarschuwingsperiode = periodeData.start;
    }
    
    if (periodeData.eind) {
      updateData.Einde_x0020_Waarschuwingsperiode = periodeData.eind;
    }
    
    if (periodeData.actief !== undefined) {
      updateData.Waarschuwingsperiode = periodeData.actief ? 'Ja' : 'Nee';
    }
    
    return await this.updateItem(dhId, updateData);
  }
}

/**
 * Gecombineerde service voor complexe operaties
 */
export class DDHDataService {
  constructor() {
    this.problemen = new ProblemenService();
    this.digitaleHandhaving = new DigitaleHandhavingService();
  }

  /**
   * Krijg volledig dashboard overzicht
   * @returns {Promise<Object>} Dashboard data
   */
  async krijgDashboardData() {
    try {
      // Haal alle data parallel op voor performance
      const [dhOverzicht, recenteProblemen] = await Promise.all([
        DDH_CONFIG.statistieken.krijgVolledigOverzicht(),
        this.problemen.haalAlleItemsOp({
          top: 10,
          orderby: 'Aanmaakdatum desc',
          expand: 'Eigenaar,Beoordelaar'
        })
      ]);

      // Bereken totalen
      const totalen = {
        dhLocaties: dhOverzicht.length,
        totaleProblemen: dhOverzicht.reduce((sum, dh) => sum + dh.aantalProblemen, 0),
        problemenPerStatus: {}
      };

      // Aggregeer status tellingen
      dhOverzicht.forEach(dh => {
        Object.entries(dh.problemenPerStatus).forEach(([status, aantal]) => {
          totalen.problemenPerStatus[status] = 
            (totalen.problemenPerStatus[status] || 0) + aantal;
        });
      });

      return {
        totalen,
        dhOverzicht,
        recenteProblemen,
        laatsteBijgewerkt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fout bij ophalen dashboard data:', error);
      throw error;
    }
  }

  /**
   * Zoek in beide lijsten
   * @param {string} zoekterm - Zoekterm
   * @returns {Promise<Object>} Zoekresultaten
   */
  async zoekAlles(zoekterm) {
    if (!zoekterm || zoekterm.length < 2) {
      throw new Error('Zoekterm moet minimaal 2 karakters bevatten');
    }

    const escapeZoekterm = zoekterm.replace(/'/g, "''");
    
    try {
      // Zoek parallel in beide lijsten
      const [problemen, dhLocaties] = await Promise.all([
        this.problemen.haalAlleItemsOp({
          filter: `substringof('${escapeZoekterm}', Title) or ` +
                  `substringof('${escapeZoekterm}', Gemeente) or ` +
                  `substringof('${escapeZoekterm}', Probleembeschrijving)`,
          expand: 'Eigenaar'
        }),
        this.digitaleHandhaving.haalAlleItemsOp({
          filter: `substringof('${escapeZoekterm}', Title) or ` +
                  `substringof('${escapeZoekterm}', Gemeente)`
        })
      ]);

      return {
        problemen,
        dhLocaties,
        totaalResultaten: problemen.length + dhLocaties.length
      };
    } catch (error) {
      console.error('Fout bij zoeken:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ddhDataService = new DDHDataService();

// Export classes voor directe instantiatie indien nodig
export default {
  ProblemenService,
  DigitaleHandhavingService,
  DDHDataService,
  ddhDataService
};