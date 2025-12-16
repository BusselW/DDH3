/**
 * Mock Configuration for DDH Dashboard
 * Used for local testing when SharePoint is not available
 */

export const MOCK_CONFIG = {
    // Mock SharePoint configuration
    sharepoint: {
        baseUrl: 'http://localhost:8000',
        siteUrl: '/',
        apiBase: '/mock-api'
    },
    
    // Mock list configurations
    lijsten: {
        problemenPleeglocaties: {
            lijstTitel: 'Problemen pleeglocaties',
            velden: {
                probleemID: {
                    type: 'Calculated',
                    interneNaam: 'ProbleemID'
                }
            }
        },
        digitaleHandhaving: {
            lijstTitel: 'Digitale handhaving',
            velden: {
                gemeenteID: {
                    type: 'Calculated',
                    interneNaam: 'gemeenteID'
                }
            }
        }
    },
    
    // Mock headers
    headers: {
        get: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },
    
    // Mock relations
    relaties: {
        digitaleHandhavingNaarProblemen: {
            type: '1:N',
            bronLijst: 'digitaleHandhaving',
            doelLijst: 'problemenPleeglocaties'
        }
    },
    
    // Mock constants
    constanten: {
        PROBLEEM_STATUSSEN: ['Aangemeld', 'In behandeling', 'Uitgezet bij OI', 'Opgelost'],
        BusinessRules: {
            validateProbleem: () => true,
            validateDH: () => true
        }
    },
    
    // Mock helpers
    helpers: {
        maakApiUrl: (endpoint) => `/mock-api${endpoint}`,
        vindLijstOpId: () => null,
        vindLijstOpTitel: () => null
    },
    
    // Mock queries
    queries: {},
    
    // Mock validation
    validatie: {
        validateProbleem: () => true,
        validateDH: () => true
    },
    
    // Mock statistics
    statistieken: {}
};

/**
 * Mock configuration validation
 */
export const valideerMockConfiguratie = () => {
    console.log('✓ Mock configuratie gevalideerd');
    return { isGeldig: true, fouten: [] };
};

export default MOCK_CONFIG;