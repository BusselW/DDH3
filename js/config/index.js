/**
 * DDH - Digitale Handhaving
 * Centrale configuratie index
 * 
 * Dit bestand exporteert alle configuratie modules voor eenvoudige import
 * 
 * @module config
 */

// Export alle configuraties
export * from './lijsten.js';
export * from './relaties.js';
export * from './constanten.js';

// Import en herexporteer specifieke modules voor gemak
import lijstenConfig from './lijsten.js';
import relatiesConfig from './relaties.js';
import constantenConfig from './constanten.js';

/**
 * Gecombineerde configuratie object
 */
export const DDH_CONFIG = {
  // SharePoint basis configuratie
  sharepoint: lijstenConfig.SHAREPOINT_CONFIG,
  
  // Lijst definities
  lijsten: lijstenConfig.LIJSTEN,
  
  // Headers voor API calls
  headers: lijstenConfig.SHAREPOINT_HEADERS,
  
  // Relatie configuraties
  relaties: relatiesConfig.LIJST_RELATIES,
  
  // Constanten en business rules
  constanten: constantenConfig,
  
  // Helper functies
  helpers: {
    // Lijst helpers
    maakApiUrl: lijstenConfig.maakApiUrl,
    vindLijstOpId: lijstenConfig.vindLijstOpId,
    vindLijstOpTitel: lijstenConfig.vindLijstOpTitel,
    
    // Relatie helpers
    ...relatiesConfig.RelatieHelpers
  },
  
  // Query builders
  queries: {
    ...relatiesConfig.RelatieQueries
  },
  
  // Validatie functies
  validatie: {
    ...relatiesConfig.RelatieValidatie,
    ...constantenConfig.BusinessRules
  },
  
  // Statistiek functies
  statistieken: {
    ...relatiesConfig.RelatieStatistieken
  }
};

/**
 * Configuratie validatie bij laden
 * Controleert of alle vereiste configuraties aanwezig zijn
 */
export const valideerConfiguratie = () => {
  const fouten = [];
  
  // Controleer SharePoint config
  if (!DDH_CONFIG.sharepoint.baseUrl) {
    fouten.push('SharePoint baseUrl ontbreekt');
  }
  
  // Controleer lijst configuraties
  if (!DDH_CONFIG.lijsten.problemenPleeglocaties) {
    fouten.push('Problemen Pleeglocaties lijst configuratie ontbreekt');
  }
  
  if (!DDH_CONFIG.lijsten.digitaleHandhaving) {
    fouten.push('Digitale Handhaving lijst configuratie ontbreekt');
  }
  
  // Controleer relatie configuraties
  if (!DDH_CONFIG.relaties.digitaleHandhavingNaarProblemen) {
    fouten.push('Relatie configuratie tussen lijsten ontbreekt');
  }
  
  // Controleer sleutelvelden
  const problemenSleutel = DDH_CONFIG.lijsten.problemenPleeglocaties.velden.probleemID;
  const dhSleutel = DDH_CONFIG.lijsten.digitaleHandhaving.velden.gemeenteID;
  
  if (!problemenSleutel || problemenSleutel.type !== 'Calculated') {
    fouten.push('ProbleemID berekend veld ontbreekt of is niet van type Calculated');
  }
  
  if (!dhSleutel || dhSleutel.type !== 'Calculated') {
    fouten.push('gemeenteID berekend veld ontbreekt of is niet van type Calculated');
  }
  
  // Controleer constanten
  if (!DDH_CONFIG.constanten.PROBLEEM_STATUSSEN) {
    fouten.push('Probleem statussen configuratie ontbreekt');
  }
  
  if (!DDH_CONFIG.constanten.BusinessRules) {
    fouten.push('Business rules configuratie ontbreekt');
  }
  
  if (fouten.length > 0) {
    console.error('Configuratie fouten gevonden:', fouten);
    return { isGeldig: false, fouten };
  }
  
  console.log('✓ DDH configuratie succesvol gevalideerd');
  return { isGeldig: true, fouten: [] };
};

// Voer validatie uit bij module laden
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const validatie = valideerConfiguratie();
    if (!validatie.isGeldig) {
      console.error('DDH Configuratie is niet geldig:', validatie.fouten);
    }
  });
}

// Export default configuratie object
export default DDH_CONFIG;