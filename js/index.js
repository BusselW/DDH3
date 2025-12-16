/**
 * DDH - Digitale Handhaving
 * Hoofdbestand voor de applicatie
 * 
 * Dit bestand initialiseert de DDH applicatie met React (als 'h')
 * en demonstreert het gebruik van de lijst configuraties.
 * 
 * @module index
 */

// Import lijst configuraties
import { 
  LIJSTEN, 
  SHAREPOINT_CONFIG,
  SHAREPOINT_HEADERS,
  maakApiUrl 
} from './config/lijsten.js';

// React is globaal beschikbaar via window
const { createElement: h, useState, useEffect } = window.React;
const { render } = window.ReactDOM;

/**
 * Helper functie om Request Digest op te halen voor POST/UPDATE/DELETE operaties
 * @returns {Promise<string>} Request Digest token
 */
const haalRequestDigestOp = async () => {
  try {
    const response = await fetch(maakApiUrl('/contextinfo'), {
      method: 'POST',
      headers: SHAREPOINT_HEADERS.get
    });
    
    const data = await response.json();
    return data.d.GetContextWebInformation.FormDigestValue;
  } catch (error) {
    console.error('Fout bij ophalen Request Digest:', error);
    throw error;
  }
};

/**
 * Service voor interactie met de Problemen Pleeglocaties lijst
 */
const ProblemenService = {
  /**
   * Haal alle problemen op
   * @param {Object} opties - Query opties zoals $filter, $select, $expand
   * @returns {Promise<Array>} Array van problemen
   */
  haalAlleProblemenOp: async (opties = {}) => {
    const { filter, select, expand, orderby } = opties;
    let url = LIJSTEN.problemenPleeglocaties.endpoints.alleItems();
    
    // Bouw query parameters
    const queryParams = [];
    if (filter) queryParams.push(`$filter=${filter}`);
    if (select) queryParams.push(`$select=${select}`);
    if (expand) queryParams.push(`$expand=${expand}`);
    if (orderby) queryParams.push(`$orderby=${orderby}`);
    
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
    
    try {
      const response = await fetch(url, {
        headers: SHAREPOINT_HEADERS.get
      });
      const data = await response.json();
      return data.d.results;
    } catch (error) {
      console.error('Fout bij ophalen problemen:', error);
      throw error;
    }
  },

  /**
   * Maak een nieuw probleem aan
   * @param {Object} probleem - Probleem data
   * @returns {Promise<Object>} Aangemaakte probleem
   */
  maakProbleemAan: async (probleem) => {
    const digest = await haalRequestDigestOp();
    
    // Voeg metadata toe
    const body = {
      __metadata: { type: 'SP.Data.Problemen_x0020_pleeglocatiesListItem' },
      ...probleem
    };
    
    try {
      const response = await fetch(LIJSTEN.problemenPleeglocaties.endpoints.aanmaken(), {
        method: 'POST',
        headers: SHAREPOINT_HEADERS.post(digest),
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data.d;
    } catch (error) {
      console.error('Fout bij aanmaken probleem:', error);
      throw error;
    }
  }
};

/**
 * Service voor interactie met de Digitale Handhaving lijst
 */
const DigitaleHandhavingService = {
  /**
   * Haal alle digitale handhaving items op
   * @param {Object} opties - Query opties
   * @returns {Promise<Array>} Array van items
   */
  haalAlleItemsOp: async (opties = {}) => {
    const { filter, select, expand, orderby } = opties;
    let url = LIJSTEN.digitaleHandhaving.endpoints.alleItems();
    
    // Bouw query parameters
    const queryParams = [];
    if (filter) queryParams.push(`$filter=${filter}`);
    if (select) queryParams.push(`$select=${select}`);
    if (expand) queryParams.push(`$expand=${expand}`);
    if (orderby) queryParams.push(`$orderby=${orderby}`);
    
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }
    
    try {
      const response = await fetch(url, {
        headers: SHAREPOINT_HEADERS.get
      });
      const data = await response.json();
      return data.d.results;
    } catch (error) {
      console.error('Fout bij ophalen digitale handhaving:', error);
      throw error;
    }
  }
};

/**
 * Hoofdcomponent van de DDH applicatie
 */
const DDHApp = () => {
  const [problemen, setProblemen] = useState([]);
  const [digitaleHandhaving, setDigitaleHandhaving] = useState([]);
  const [laadStatus, setLaadStatus] = useState('laden');
  const [geselecteerdeLijst, setGeselecteerdeLijst] = useState('problemen');
  const [foutmelding, setFoutmelding] = useState(null);

  // Laad data bij component mount
  useEffect(() => {
    laadLijstData();
  }, [geselecteerdeLijst]);

  /**
   * Laad data van de geselecteerde lijst
   */
  const laadLijstData = async () => {
    setLaadStatus('laden');
    setFoutmelding(null);
    
    try {
      if (geselecteerdeLijst === 'problemen') {
        // Haal problemen op met uitgebreide gebruikersinformatie
        const data = await ProblemenService.haalAlleProblemenOp({
          select: '*,Eigenaar/Title,Eigenaar/EMail,Beoordelaar/Title,Melder/Title',
          expand: 'Eigenaar,Beoordelaar,Melder',
          orderby: 'Aanmaakdatum desc'
        });
        setProblemen(data);
      } else {
        // Haal digitale handhaving data op
        const data = await DigitaleHandhavingService.haalAlleItemsOp({
          orderby: 'Created desc'
        });
        setDigitaleHandhaving(data);
      }
      
      setLaadStatus('klaar');
    } catch (error) {
      console.error('Fout bij laden data:', error);
      setLaadStatus('fout');
      setFoutmelding(error.message || 'Er is een onbekende fout opgetreden');
    }
  };

  /**
   * Formatteer datum voor weergave
   */
  const formatteerDatum = (datum) => {
    if (!datum) return '-';
    const d = new Date(datum);
    return d.toLocaleDateString('nl-NL');
  };

  /**
   * Render een probleem rij
   */
  const renderProbleemRij = (probleem) => {
    return h('tr', { key: probleem.Id },
      h('td', null, probleem.Title || '-'),
      h('td', null, probleem.Gemeente || '-'),
      h('td', null, probleem.Feitcodegroep || '-'),
      h('td', null, 
        h('span', { 
          className: `status-badge status-${(probleem.Opgelost_x003f_ || '').toLowerCase().replace(/\s+/g, '-')}`
        }, probleem.Opgelost_x003f_ || '-')
      ),
      h('td', null, probleem.Actie_x0020_Beoordelaars || '-'),
      h('td', null, probleem.Eigenaar?.Title || '-'),
      h('td', null, 
        h('button', { 
          className: 'btn-detail',
          onClick: () => toonDetail('probleem', probleem)
        }, 'Details')
      )
    );
  };

  /**
   * Render een digitale handhaving rij
   */
  const renderDigitaleHandhavingRij = (item) => {
    return h('tr', { key: item.Id },
      h('td', null, item.Title || '-'),
      h('td', null, item.Gemeente || '-'),
      h('td', null, item.Feitcodegroep || '-'),
      h('td', null, 
        h('span', {
          className: `status-badge status-${(item.Status_x0020_B_x0026_S || '').toLowerCase().replace(/\s+/g, '-')}`
        }, item.Status_x0020_B_x0026_S || '-')
      ),
      h('td', null, item.Waarschuwingsperiode || '-'),
      h('td', null, item.E_x002d_mailadres_x0020_contactp || '-'),
      h('td', null,
        h('button', {
          className: 'btn-detail',
          onClick: () => toonDetail('digitaleHandhaving', item)
        }, 'Details')
      )
    );
  };

  /**
   * Toon detail van een item
   */
  const toonDetail = (type, item) => {
    console.log(`Detail voor ${type}:`, item);
    // TODO: Implementeer detail modal
    alert(`Details voor ${type} ID: ${item.Id}\n\nTitel: ${item.Title}\nGemeente: ${item.Gemeente}`);
  };

  // Render de applicatie
  return h('div', { className: 'ddh-app' },
    // Header
    h('header', { className: 'ddh-header' },
      h('h1', null, 'DDH - Digitale Handhaving'),
      h('p', null, `SharePoint Site: ${SHAREPOINT_CONFIG.siteUrl}`)
    ),

    // Lijst selector
    h('div', { className: 'lijst-selector' },
      h('button', {
        className: geselecteerdeLijst === 'problemen' ? 'actief' : '',
        onClick: () => setGeselecteerdeLijst('problemen')
      }, 'Problemen Pleeglocaties'),
      h('button', {
        className: geselecteerdeLijst === 'digitaleHandhaving' ? 'actief' : '',
        onClick: () => setGeselecteerdeLijst('digitaleHandhaving')
      }, 'Digitale Handhaving')
    ),

    // Content area
    h('main', { className: 'ddh-content' },
      laadStatus === 'laden' ? 
        h('div', { className: 'laden' }, 'Data wordt geladen...') :
      laadStatus === 'fout' ?
        h('div', { className: 'fout' }, 
          h('h3', null, 'Er is een fout opgetreden'),
          h('p', null, foutmelding),
          h('button', { onClick: laadLijstData }, 'Opnieuw proberen')
        ) :
      geselecteerdeLijst === 'problemen' ?
        // Problemen tabel
        h('div', null,
          h('h2', null, `Problemen Pleeglocaties (${problemen.length} items)`),
          problemen.length === 0 ?
            h('p', { className: 'geen-data' }, 'Geen problemen gevonden.') :
            h('table', { className: 'data-tabel' },
              h('thead', null,
                h('tr', null,
                  h('th', null, 'Pleeglocatie'),
                  h('th', null, 'Gemeente'),
                  h('th', null, 'Feitcodegroep'),
                  h('th', null, 'Status'),
                  h('th', null, 'Actie'),
                  h('th', null, 'Eigenaar'),
                  h('th', null, 'Acties')
                )
              ),
              h('tbody', null, problemen.map(renderProbleemRij))
            )
        ) :
        // Digitale handhaving tabel
        h('div', null,
          h('h2', null, `Digitale Handhaving (${digitaleHandhaving.length} items)`),
          digitaleHandhaving.length === 0 ?
            h('p', { className: 'geen-data' }, 'Geen digitale handhaving items gevonden.') :
            h('table', { className: 'data-tabel' },
              h('thead', null,
                h('tr', null,
                  h('th', null, 'Titel'),
                  h('th', null, 'Gemeente'),
                  h('th', null, 'Feitcodegroep'),
                  h('th', null, 'Status B&S'),
                  h('th', null, 'Waarschuwing'),
                  h('th', null, 'Contactpersoon'),
                  h('th', null, 'Acties')
                )
              ),
              h('tbody', null, digitaleHandhaving.map(renderDigitaleHandhavingRij))
            )
        )
    ),

    // Footer
    h('footer', { className: 'ddh-footer' },
      h('p', null, '© 2025 DDH - Digitale Handhaving')
    )
  );
};

// Initialiseer de applicatie wanneer DOM geladen is
const initialiseerApp = () => {
  const rootElement = document.getElementById('ddh-root');
  if (rootElement) {
    render(h(DDHApp), rootElement);
    console.log('DDH applicatie succesvol geïnitialiseerd');
  } else {
    console.error('Root element niet gevonden. Zorg ervoor dat er een element met id="ddh-root" bestaat.');
  }
};

// Wacht tot React beschikbaar is
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseerApp);
  } else {
    initialiseerApp();
  }
}

// Export voor gebruik in andere modules
export { DDHApp, ProblemenService, DigitaleHandhavingService };