/**
 * DDH - Digitale Handhaving
 * SharePoint 2019 On-Premises Lijst Configuratie
 * 
 * Dit bestand bevat alle lijst definities voor het DDH systeem.
 * Alle velden, metadata en REST API endpoints zijn hier geconfigureerd.
 * 
 * @module config/lijsten
 * @author DDH Team
 */

// Basis configuratie voor SharePoint site
export const SHAREPOINT_CONFIG = {
  baseUrl: 'https://som.org.om.local/sites/',
  siteUrl: '/sites/MulderT/Onderdelen/Beoordelen/Verkeersborden',
  apiBase: '/sites/MulderT/Onderdelen/Beoordelen/Verkeersborden/_api'
};

/**
 * Helper functie om volledige API URLs te genereren
 * @param {string} endpoint - Het API endpoint pad
 * @returns {string} Volledige API URL
 */
export const maakApiUrl = (endpoint) => {
  return `${SHAREPOINT_CONFIG.apiBase}${endpoint}`;
};

/**
 * Lijst configuratie voor "Problemen pleeglocaties"
 * Deze lijst bevat alle gemelde problemen op handhavingslocaties
 */
export const LIJST_PROBLEMEN_PLEEGLOCATIES = {
  // Metadata
  lijstId: '7c464c17-ac09-477c-8d14-cbf0d47e541c',
  lijstTitel: 'Problemen pleeglocaties',
  interneNaam: 'Problemen%20pleeglocaties',
  webUrl: SHAREPOINT_CONFIG.siteUrl,
  verborgen: false,
  baseTemplate: 100,
  lijstBeschrijving: null,

  // REST API Endpoints
  endpoints: {
    alleItems: () => maakApiUrl('/web/lists/getbytitle(\'Problemen%20pleeglocaties\')/items'),
    specifiekItem: (itemId) => maakApiUrl(`/web/lists/getbytitle('Problemen%20pleeglocaties')/items(${itemId})`),
    aanmaken: () => maakApiUrl('/web/lists/getbytitle(\'Problemen%20pleeglocaties\')/items'),
    updaten: (itemId) => maakApiUrl(`/web/lists/getbytitle('Problemen%20pleeglocaties')/items(${itemId})`),
    verwijderen: (itemId) => maakApiUrl(`/web/lists/getbytitle('Problemen%20pleeglocaties')/items(${itemId})`),
    contextInfo: () => '/sites/MulderT/Onderdelen/Beoordelen/Verkeersborden/_api/contextinfo'
  },

  // Veld definities
  velden: {
    // Systeem velden
    id: {
      titel: 'Id',
      interneNaam: 'ID',
      type: 'Counter',
      verborgen: false,
      verwijderbaar: false,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    // Hoofdvelden
    pleeglocatie: {
      titel: 'Pleeglocatie',
      interneNaam: 'Title',
      type: 'Text',
      verborgen: false,
      verwijderbaar: false,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    aanmaakdatum: {
      titel: 'Aanmaakdatum',
      interneNaam: 'Aanmaakdatum',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: '[today]',
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    },

    actieBeoordelaars: {
      titel: 'Actie Beoordelaars',
      interneNaam: 'Actie_x0020_Beoordelaars',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: 'Geen actie nodig',
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Geen actie nodig',
        'Verzuim opvragen',
        'Vasthouden',
        'Vernietigen',
        'Wijzigen',
        'Bekrachtigen'
      ]
    },

    feitcodegroep: {
      titel: 'Feitcodegroep',
      interneNaam: 'Feitcodegroep',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Verkeersborden',
        'Parkeren',
        'Rijgedrag'
      ]
    },

    gemeente: {
      titel: 'Gemeente',
      interneNaam: 'Gemeente',
      type: 'Text',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    probleembeschrijving: {
      titel: 'Probleembeschrijving',
      interneNaam: 'Probleembeschrijving',
      type: 'Note',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        richText: false,
        numLines: 6,
        appendOnly: false
      }
    },

    status: {
      titel: 'Status',
      interneNaam: 'Opgelost_x003f_',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Aangemeld',
        'In behandeling',
        'Uitgezet bij OI',
        'Opgelost'
      ]
    },

    // User velden (speciale dataopslag)
    afhandelendeBeoordelaar: {
      titel: 'Afhandelende beoordelaar',
      interneNaam: 'Beoordelaar',
      type: 'UserMulti',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'ID Referentie (naar User Information List)',
        updateProperty: 'BeoordelaarId',
        multiValue: true,
        updateBody: { 
          __metadata: { type: 'Collection(Edm.Int32)' }, 
          results: '[userId1, userId2,...]'
        },
        leesTip: 'Gebruik $expand=Beoordelaar om waarde op te halen',
        userSelectionMode: 'PeopleOnly',
        userSelectionScope: '0'
      }
    },

    eigenaar: {
      titel: 'Eigenaar',
      interneNaam: 'Eigenaar',
      type: 'User',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'ID Referentie (naar User Information List)',
        updateProperty: 'EigenaarId',
        multiValue: false,
        updateBody: 'userId',
        leesTip: 'Gebruik $expand=Eigenaar om waarde op te halen',
        userSelectionMode: '0',
        userSelectionScope: '0'
      }
    },

    einddatum: {
      titel: 'Einddatum',
      interneNaam: 'Einddatum',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    },

    melder: {
      titel: 'Melder',
      interneNaam: 'Melder',
      type: 'User',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'ID Referentie (naar User Information List)',
        updateProperty: 'MelderId',
        multiValue: false,
        updateBody: 'userId',
        leesTip: 'Gebruik $expand=Melder om waarde op te halen',
        userSelectionMode: 'PeopleOnly',
        userSelectionScope: '0'
      }
    },

    // Berekende velden
    probleemID: {
      titel: 'ProbleemID',
      interneNaam: 'ProbleemID',
      type: 'Calculated',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      berekendeFormule: '=Gemeente&" - "&Pleeglocatie'
    },

    // Lookup veld
    probleemID2: {
      titel: 'ProbleemID2',
      interneNaam: 'ProbleemID2',
      type: 'Lookup',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'ID Referentie (naar andere lijst)',
        updateProperty: 'ProbleemID2Id',
        multiValue: false,
        updateBody: 'id',
        leesTip: 'Gebruik $expand=ProbleemID2 om waarde op te halen',
        lookupLijstGuid: '7c464c17-ac09-477c-8d14-cbf0d47e541c',
        lookupVeld: 'ProbleemID'
      }
    },

    startdatum: {
      titel: 'Startdatum',
      interneNaam: 'Startdatum',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    },

    uitlegActieBeoordelaar: {
      titel: 'Uitleg actie beoordelaar',
      interneNaam: 'Uitleg_x0020_actie_x0020_beoorde',
      type: 'Note',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        richText: false,
        numLines: 6,
        appendOnly: false
      }
    },

    veld1: {
      titel: 'veld1',
      interneNaam: 'veld1',
      type: 'Text',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    }
  }
};

/**
 * Lijst configuratie voor "Digitale handhaving"
 * Deze lijst bevat informatievoorziening voor digitale handhaving (DDH)
 */
export const LIJST_DIGITALE_HANDHAVING = {
  // Metadata
  lijstId: '8749ac16-c56e-4e21-a350-059df59d7862',
  lijstTitel: 'Digitale handhaving',
  interneNaam: 'Digitale%20handhaving',
  webUrl: SHAREPOINT_CONFIG.siteUrl,
  verborgen: false,
  baseTemplate: 100,
  lijstBeschrijving: 'Informatievoorziening voor digitale handhaving (DDH) lijst.',

  // REST API Endpoints
  endpoints: {
    alleItems: () => maakApiUrl('/web/lists/getbytitle(\'Digitale%20handhaving\')/items'),
    specifiekItem: (itemId) => maakApiUrl(`/web/lists/getbytitle('Digitale%20handhaving')/items(${itemId})`),
    aanmaken: () => maakApiUrl('/web/lists/getbytitle(\'Digitale%20handhaving\')/items'),
    updaten: (itemId) => maakApiUrl(`/web/lists/getbytitle('Digitale%20handhaving')/items(${itemId})`),
    verwijderen: (itemId) => maakApiUrl(`/web/lists/getbytitle('Digitale%20handhaving')/items(${itemId})`),
    contextInfo: () => '/sites/MulderT/Onderdelen/Beoordelen/Verkeersborden/_api/contextinfo'
  },

  // Veld definities
  velden: {
    // Systeem velden
    id: {
      titel: 'Id',
      interneNaam: 'ID',
      type: 'Counter',
      verborgen: false,
      verwijderbaar: false,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    // Hoofdvelden
    titel: {
      titel: 'Titel',
      interneNaam: 'Title',
      type: 'Text',
      verborgen: false,
      verwijderbaar: false,
      verplicht: true,
      beschrijving: 'Geef het bestand een naam (deze zal worden gebruikt voor de zoekmachine)',
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    feitcodegroep: {
      titel: 'Feitcodegroep',
      interneNaam: 'Feitcodegroep',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: 'Verkeersborden',
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Verkeersborden',
        'Parkeren',
        'Rijgedrag'
      ]
    },

    gemeente: {
      titel: 'Gemeente',
      interneNaam: 'Gemeente',
      type: 'Text',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    statusBenS: {
      titel: 'Status B&S',
      interneNaam: 'Status_x0020_B_x0026_S',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: 'Aangevraagd',
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Aangevraagd',
        'In behandeling',
        'Instemming verleend'
      ]
    },

    waarschuwingsperiode: {
      titel: 'Waarschuwingsperiode',
      interneNaam: 'Waarschuwingsperiode',
      type: 'Choice',
      verborgen: false,
      verwijderbaar: true,
      verplicht: true,
      beschrijving: null,
      standaardWaarde: 'Ja',
      uniekeWaarden: false,
      validatieFormule: null,
      keuzes: [
        'Ja',
        'Nee'
      ]
    },

    emailContactpersoon: {
      titel: 'E-mailadres contactpersoon',
      interneNaam: 'E_x002d_mailadres_x0020_contactp',
      type: 'Text',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null
    },

    eindeWaarschuwingsperiode: {
      titel: 'Einde Waarschuwingsperiode',
      interneNaam: 'Einde_x0020_Waarschuwingsperiode',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    },

    // Berekend veld
    gemeenteID: {
      titel: 'gemeenteID',
      interneNaam: 'gemeenteID',
      type: 'Calculated',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      berekendeFormule: '=Gemeente&" - "&Titel'
    },

    // URL velden
    instemmingsbesluit: {
      titel: 'Instemmingsbesluit',
      interneNaam: 'Instemmingsbesluit',
      type: 'URL',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'URL en Beschrijving',
        updateProperty: 'Instemmingsbesluit',
        leesTip: 'Waarde bevat Description en Url properties.',
        updateBody: { 
          __metadata: { type: 'SP.FieldUrlValue' }, 
          Description: 'Link Text', 
          Url: 'http://...' 
        }
      }
    },

    laatsteSchouw: {
      titel: 'Laatste schouw',
      interneNaam: 'Laatste_x0020_schouw',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    },

    linkAlgemeenPV: {
      titel: 'Link Algemeen PV',
      interneNaam: 'Link_x0020_Algemeen_x0020_PV',
      type: 'URL',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'URL en Beschrijving',
        updateProperty: 'Link_x0020_Algemeen_x0020_PV',
        leesTip: 'Waarde bevat Description en Url properties.',
        updateBody: { 
          __metadata: { type: 'SP.FieldUrlValue' }, 
          Description: 'Link Text', 
          Url: 'http://...' 
        }
      }
    },

    linkSchouwrapporten: {
      titel: 'Link Schouwrapporten',
      interneNaam: 'Link_x0020_Schouwrapporten',
      type: 'URL',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      dataOpslag: {
        type: 'URL en Beschrijving',
        updateProperty: 'Link_x0020_Schouwrapporten',
        leesTip: 'Waarde bevat Description en Url properties.',
        updateBody: { 
          __metadata: { type: 'SP.FieldUrlValue' }, 
          Description: 'Link Text', 
          Url: 'http://...' 
        }
      }
    },

    startWaarschuwingsperiode: {
      titel: 'Start Waarschuwingsperiode',
      interneNaam: 'Start_x0020_Waarschuwingsperiode',
      type: 'DateTime',
      verborgen: false,
      verwijderbaar: true,
      verplicht: false,
      beschrijving: null,
      standaardWaarde: null,
      uniekeWaarden: false,
      validatieFormule: null,
      formatting: {
        dateTimeFormat: 'Disabled'
      }
    }
  }
};

/**
 * Alle lijsten gegroepeerd voor makkelijke toegang
 */
export const LIJSTEN = {
  problemenPleeglocaties: LIJST_PROBLEMEN_PLEEGLOCATIES,
  digitaleHandhaving: LIJST_DIGITALE_HANDHAVING
};

/**
 * Relatie metadata - definieert hoe lijsten aan elkaar gekoppeld zijn
 */
export const LIJST_RELATIE_METADATA = {
  // Primaire sleutelvelden voor relaties
  sleutelVelden: {
    problemenPleeglocaties: {
      veldNaam: 'ProbleemID',
      interneNaam: 'ProbleemID',
      berekening: 'Gemeente + " - " + Title (Pleeglocatie)'
    },
    digitaleHandhaving: {
      veldNaam: 'gemeenteID',
      interneNaam: 'gemeenteID',
      berekening: 'Gemeente + " - " + Title (Titel)'
    }
  },
  
  // Relatie mapping
  relaties: {
    // Een DH locatie kan meerdere problemen hebben
    digitaleHandhavingNaarProblemen: {
      type: '1:N',
      bronLijst: 'digitaleHandhaving',
      doelLijst: 'problemenPleeglocaties',
      koppelVeld: 'gemeenteID -> ProbleemID'
    }
  }
};

/**
 * Helper functie om lijst op ID te vinden
 * @param {string} lijstId - De GUID van de lijst
 * @returns {Object|null} Lijst configuratie of null
 */
export const vindLijstOpId = (lijstId) => {
  return Object.values(LIJSTEN).find(lijst => lijst.lijstId === lijstId) || null;
};

/**
 * Helper functie om lijst op titel te vinden
 * @param {string} titel - De titel van de lijst
 * @returns {Object|null} Lijst configuratie of null
 */
export const vindLijstOpTitel = (titel) => {
  return Object.values(LIJSTEN).find(lijst => lijst.lijstTitel === titel) || null;
};

/**
 * HTTP Headers voor SharePoint REST API calls
 */
export const SHAREPOINT_HEADERS = {
  // Voor GET requests
  get: {
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose'
  },
  
  // Voor POST requests (create)
  post: (requestDigest) => ({
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose',
    'X-RequestDigest': requestDigest
  }),
  
  // Voor MERGE requests (update)
  merge: (requestDigest) => ({
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose',
    'X-RequestDigest': requestDigest,
    'IF-MATCH': '*',
    'X-HTTP-Method': 'MERGE'
  }),
  
  // Voor DELETE requests
  delete: (requestDigest) => ({
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose',
    'X-RequestDigest': requestDigest,
    'IF-MATCH': '*',
    'X-HTTP-Method': 'DELETE'
  })
};

// Export default voor makkelijke import
export default {
  SHAREPOINT_CONFIG,
  LIJSTEN,
  SHAREPOINT_HEADERS,
  maakApiUrl,
  vindLijstOpId,
  vindLijstOpTitel
};