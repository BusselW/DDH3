/**
 * DDH - Digitale Handhaving
 * Business rules, constanten en validatie regels
 * 
 * Dit bestand bevat alle business logic constanten, validatie regels
 * en andere configureerbare waarden die gebruikt worden in de applicatie.
 * 
 * @module config/constanten
 */

/**
 * Status waarden en hun eigenschappen
 */
export const PROBLEEM_STATUSSEN = {
  AANGEMELD: {
    waarde: 'Aangemeld',
    kleur: '#fff4ce',
    tekstKleur: '#855e00',
    icon: '📝',
    volgorde: 1,
    kanNaar: ['In behandeling', 'Uitgezet bij OI']
  },
  IN_BEHANDELING: {
    waarde: 'In behandeling',
    kleur: '#cce5ff',
    tekstKleur: '#004085',
    icon: '🔄',
    volgorde: 2,
    kanNaar: ['Uitgezet bij OI', 'Opgelost', 'Aangemeld']
  },
  UITGEZET_BIJ_OI: {
    waarde: 'Uitgezet bij OI',
    kleur: '#d4edda',
    tekstKleur: '#155724',
    icon: '📤',
    volgorde: 3,
    kanNaar: ['In behandeling', 'Opgelost']
  },
  OPGELOST: {
    waarde: 'Opgelost',
    kleur: '#d1ecf1',
    tekstKleur: '#0c5460',
    icon: '✅',
    volgorde: 4,
    kanNaar: ['In behandeling'] // Voor heropenen
  }
};

/**
 * Digitale Handhaving status waarden
 */
export const DH_STATUSSEN = {
  AANGEVRAAGD: {
    waarde: 'Aangevraagd',
    kleur: '#fff4ce',
    tekstKleur: '#855e00',
    icon: '📋',
    volgorde: 1,
    kanNaar: ['In behandeling']
  },
  IN_BEHANDELING: {
    waarde: 'In behandeling',
    kleur: '#cce5ff',
    tekstKleur: '#004085',
    icon: '⚙️',
    volgorde: 2,
    kanNaar: ['Instemming verleend', 'Aangevraagd']
  },
  INSTEMMING_VERLEEND: {
    waarde: 'Instemming verleend',
    kleur: '#d4edda',
    tekstKleur: '#155724',
    icon: '✓',
    volgorde: 3,
    kanNaar: ['In behandeling'] // Voor wijzigingen
  }
};

/**
 * Actie types voor beoordelaars
 */
export const BEOORDELAAR_ACTIES = {
  GEEN_ACTIE: {
    waarde: 'Geen actie nodig',
    beschrijving: 'Er is geen actie vereist voor dit probleem',
    icon: '➖',
    prioriteit: 1
  },
  VERZUIM_OPVRAGEN: {
    waarde: 'Verzuim opvragen',
    beschrijving: 'Verzuiminformatie moet worden opgevraagd',
    icon: '📊',
    prioriteit: 2
  },
  VASTHOUDEN: {
    waarde: 'Vasthouden',
    beschrijving: 'Het probleem wordt vastgehouden voor nader onderzoek',
    icon: '⏸️',
    prioriteit: 3
  },
  VERNIETIGEN: {
    waarde: 'Vernietigen',
    beschrijving: 'Het probleem moet worden vernietigd',
    icon: '🗑️',
    prioriteit: 4
  },
  WIJZIGEN: {
    waarde: 'Wijzigen',
    beschrijving: 'Het probleem vereist wijzigingen',
    icon: '✏️',
    prioriteit: 5
  },
  BEKRACHTIGEN: {
    waarde: 'Bekrachtigen',
    beschrijving: 'Het probleem wordt bekrachtigd',
    icon: '✔️',
    prioriteit: 6
  }
};

/**
 * Feitcodegroepen configuratie
 */
export const FEITCODEGROEPEN = {
  VERKEERSBORDEN: {
    waarde: 'Verkeersborden',
    code: 'VB',
    icon: '🚦',
    beschrijving: 'Overtredingen met betrekking tot verkeersborden'
  },
  PARKEREN: {
    waarde: 'Parkeren',
    code: 'PK',
    icon: '🅿️',
    beschrijving: 'Parkeer gerelateerde overtredingen'
  },
  RIJGEDRAG: {
    waarde: 'Rijgedrag',
    code: 'RG',
    icon: '🚗',
    beschrijving: 'Overtredingen met betrekking tot rijgedrag'
  }
};

/**
 * Validatie regels
 */
export const VALIDATIE_REGELS = {
  // Minimale en maximale lengtes
  gemeente: {
    min: 2,
    max: 50,
    regex: /^[a-zA-Z\s\-']+$/,
    foutmelding: 'Gemeente naam moet tussen 2 en 50 karakters zijn en alleen letters bevatten'
  },
  
  pleeglocatie: {
    min: 3,
    max: 100,
    regex: /^[a-zA-Z0-9\s\-,.'()]+$/,
    foutmelding: 'Pleeglocatie moet tussen 3 en 100 karakters zijn'
  },
  
  probleembeschrijving: {
    min: 10,
    max: 2000,
    foutmelding: 'Probleembeschrijving moet tussen 10 en 2000 karakters zijn'
  },
  
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    foutmelding: 'Ongeldig e-mailadres formaat'
  },
  
  // Datum validatie
  waarschuwingsperiode: {
    minDagen: 7,
    maxDagen: 90,
    foutmelding: 'Waarschuwingsperiode moet tussen 7 en 90 dagen zijn'
  }
};

/**
 * Tijd gerelateerde constanten
 */
export const TIJD_CONSTANTEN = {
  // Waarschuwingsperiode defaults
  standaardWaarschuwingsDagen: 30,
  
  // Auto-refresh intervallen (in milliseconden)
  dashboardRefresh: 60000, // 1 minuut
  lijstRefresh: 30000,     // 30 seconden
  
  // Timeout waarden
  apiTimeout: 30000,       // 30 seconden
  
  // Datum formaten
  datumFormaat: 'DD-MM-YYYY',
  datumTijdFormaat: 'DD-MM-YYYY HH:mm',
  
  // Werkdagen voor berekeningen
  werkdagen: [1, 2, 3, 4, 5] // Maandag t/m vrijdag
};

/**
 * UI configuratie constanten
 */
export const UI_CONSTANTEN = {
  // Paginering
  itemsPerPagina: 25,
  paginaOpties: [10, 25, 50, 100],
  
  // Zoeken
  minimaleZoeklengte: 2,
  zoekDelay: 300, // milliseconden
  
  // Notificaties
  notificatieDuur: 5000, // 5 seconden
  
  // Maximum aantal items voor verschillende weergaves
  maxRecenteItems: 10,
  maxDashboardItems: 5,
  
  // Grafiek kleuren
  grafiekKleuren: [
    '#0078d4', // Primair blauw
    '#40e0d0', // Turquoise
    '#ff6b6b', // Rood
    '#4ecdc4', // Mint
    '#45b7d1', // Licht blauw
    '#f9ca24', // Geel
    '#6c5ce7', // Paars
    '#a29bfe'  // Licht paars
  ]
};

/**
 * Permissie levels
 */
export const PERMISSIES = {
  LEZER: {
    niveau: 1,
    naam: 'Lezer',
    kan: ['lezen', 'zoeken', 'exporteren']
  },
  MELDER: {
    niveau: 2,
    naam: 'Melder',
    kan: ['lezen', 'zoeken', 'exporteren', 'probleem_aanmaken']
  },
  BEOORDELAAR: {
    niveau: 3,
    naam: 'Beoordelaar',
    kan: ['lezen', 'zoeken', 'exporteren', 'probleem_aanmaken', 'probleem_bewerken', 'status_wijzigen']
  },
  BEHEERDER: {
    niveau: 4,
    naam: 'Beheerder',
    kan: ['lezen', 'zoeken', 'exporteren', 'probleem_aanmaken', 'probleem_bewerken', 
          'status_wijzigen', 'dh_aanmaken', 'dh_bewerken', 'verwijderen']
  }
};

/**
 * Business rule functies
 */
export const BusinessRules = {
  /**
   * Controleer of een status wijziging toegestaan is
   * @param {string} huidigeStatus - Huidige status
   * @param {string} nieuweStatus - Gewenste nieuwe status
   * @param {string} type - 'probleem' of 'dh'
   * @returns {boolean} True als wijziging toegestaan
   */
  isStatusWijzigingToegestaan: (huidigeStatus, nieuweStatus, type = 'probleem') => {
    const statussen = type === 'probleem' ? PROBLEEM_STATUSSEN : DH_STATUSSEN;
    const huidigeConfig = Object.values(statussen).find(s => s.waarde === huidigeStatus);
    
    if (!huidigeConfig) return false;
    return huidigeConfig.kanNaar.includes(nieuweStatus);
  },

  /**
   * Bereken einddatum waarschuwingsperiode
   * @param {Date} startDatum - Start datum
   * @param {number} dagen - Aantal dagen (default: 30)
   * @returns {Date} Eind datum
   */
  berekenEindDatumWaarschuwing: (startDatum = new Date(), dagen = TIJD_CONSTANTEN.standaardWaarschuwingsDagen) => {
    const eindDatum = new Date(startDatum);
    eindDatum.setDate(eindDatum.getDate() + dagen);
    return eindDatum;
  },

  /**
   * Controleer of waarschuwingsperiode verlopen is
   * @param {string|Date} eindDatum - Eind datum van waarschuwingsperiode
   * @returns {boolean} True als verlopen
   */
  isWaarschuwingsperiodeVerlopen: (eindDatum) => {
    if (!eindDatum) return false;
    const eind = new Date(eindDatum);
    return new Date() > eind;
  },

  /**
   * Bepaal prioriteit van een probleem
   * @param {Object} probleem - Probleem object
   * @returns {number} Prioriteit score (hoger = urgenter)
   */
  bepaalProbleemPrioriteit: (probleem) => {
    let prioriteit = 0;
    
    // Status prioriteit
    const statusConfig = Object.values(PROBLEEM_STATUSSEN).find(s => s.waarde === probleem.Opgelost_x003f_);
    if (statusConfig) {
      prioriteit += (5 - statusConfig.volgorde) * 10;
    }
    
    // Actie prioriteit
    const actieConfig = Object.values(BEOORDELAAR_ACTIES).find(a => a.waarde === probleem.Actie_x0020_Beoordelaars);
    if (actieConfig) {
      prioriteit += actieConfig.prioriteit;
    }
    
    // Ouderdom (dagen sinds aanmaak)
    if (probleem.Aanmaakdatum) {
      const dagen = Math.floor((new Date() - new Date(probleem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
      prioriteit += Math.min(dagen, 30); // Max 30 punten voor ouderdom
    }
    
    return prioriteit;
  },

  /**
   * Valideer data volgens regels
   * @param {Object} data - Te valideren data
   * @param {string} type - Type validatie ('probleem' of 'dh')
   * @returns {{isGeldig: boolean, fouten: Array}} Validatie resultaat
   */
  valideerData: (data, type) => {
    const fouten = [];
    
    // Gemeente validatie
    if (data.Gemeente) {
      const regel = VALIDATIE_REGELS.gemeente;
      if (data.Gemeente.length < regel.min || data.Gemeente.length > regel.max) {
        fouten.push(regel.foutmelding);
      }
      if (!regel.regex.test(data.Gemeente)) {
        fouten.push(regel.foutmelding);
      }
    }
    
    // Type specifieke validatie
    if (type === 'probleem') {
      // Pleeglocatie validatie
      if (data.Title) {
        const regel = VALIDATIE_REGELS.pleeglocatie;
        if (data.Title.length < regel.min || data.Title.length > regel.max) {
          fouten.push(regel.foutmelding);
        }
      }
      
      // Probleembeschrijving validatie
      if (data.Probleembeschrijving) {
        const regel = VALIDATIE_REGELS.probleembeschrijving;
        if (data.Probleembeschrijving.length < regel.min || data.Probleembeschrijving.length > regel.max) {
          fouten.push(regel.foutmelding);
        }
      }
    }
    
    // Email validatie indien aanwezig
    if (data.E_x002d_mailadres_x0020_contactp) {
      if (!VALIDATIE_REGELS.email.regex.test(data.E_x002d_mailadres_x0020_contactp)) {
        fouten.push(VALIDATIE_REGELS.email.foutmelding);
      }
    }
    
    return {
      isGeldig: fouten.length === 0,
      fouten
    };
  }
};

/**
 * Export alle constanten als één object voor gemak
 */
export const DDH_CONSTANTEN = {
  PROBLEEM_STATUSSEN,
  DH_STATUSSEN,
  BEOORDELAAR_ACTIES,
  FEITCODEGROEPEN,
  VALIDATIE_REGELS,
  TIJD_CONSTANTEN,
  UI_CONSTANTEN,
  PERMISSIES,
  BusinessRules
};

export default DDH_CONSTANTEN;