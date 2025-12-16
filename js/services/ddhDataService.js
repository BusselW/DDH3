/**
 * DDH - Digitale Handhaving
 * Data Service Module
 * 
 * Handles all SharePoint data operations using the configuration system
 * Provides CRUD operations for DDH locations and problems
 * 
 * @module services/ddhDataService
 */

/**
 * Main DDH Data Service
 * Provides methods for interacting with SharePoint lists
 */
export class DDHDataService {
    constructor(config) {
        this.config = config;
    }

    /**
     * Haal Request Digest op voor SharePoint operaties
     * @returns {Promise<string>} Request Digest token
     */
    async haalRequestDigestOp() {
        try {
            const response = await fetch(this.config.helpers.maakApiUrl('/contextinfo'), {
                method: 'POST',
                headers: this.config.headers.get
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.d.GetContextWebInformation.FormDigestValue;
        } catch (error) {
            console.error('Fout bij ophalen Request Digest:', error);
            throw error;
        }
    }

    /**
     * Haal alle data op met relaties (JOIN-achtige functionaliteit)
     * @returns {Promise<Array>} Array van DH locaties met hun problemen
     */
    async fetchAll() {
        try {
            const result = await this.config.queries.haalAllesMetRelaties();
            return result;
        } catch (error) {
            console.error('Fout bij ophalen data:', error);
            throw error;
        }
    }

    /**
     * Maak nieuwe DH locatie aan
     * @param {Object} item - DH locatie data
     * @returns {Promise<Object>} Aangemaakte DH locatie
     */
    async addDH(item) {
        try {
            // Voeg metadata toe voor SharePoint
            const body = {
                __metadata: { type: 'SP.Data.Digitale_x0020_handhavingListItem' },
                Title: item.Title,
                Gemeente: item.Gemeente,
                Feitcodegroep: item.Feitcodegroep,
                Status_x0020_B_x0026_S: 'Aangevraagd',
                Waarschuwingsperiode: 'Ja'
            };

            const digest = await this.haalRequestDigestOp();
            const response = await fetch(this.config.lijsten.digitaleHandhaving.endpoints.aanmaken(), {
                method: 'POST',
                headers: this.config.headers.post(digest),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.d;
        } catch (error) {
            console.error('Fout bij aanmaken DH locatie:', error);
            throw error;
        }
    }

    /**
     * Maak nieuw probleem aan
     * @param {Object} item - Probleem data
     * @returns {Promise<Object>} Aangemaakte probleem
     */
    async addProblem(item) {
        try {
            // Voeg metadata toe voor SharePoint
            const body = {
                __metadata: { type: 'SP.Data.Problemen_x0020_pleeglocatiesListItem' },
                Title: item.Title,
                Gemeente: item.Gemeente,
                Probleembeschrijving: item.Probleembeschrijving,
                Feitcodegroep: item.Feitcodegroep,
                Opgelost_x003f_: 'Aangemeld',
                Actie_x0020_Beoordelaars: 'Geen actie nodig',
                Aanmaakdatum: new Date().toISOString()
            };

            const digest = await this.haalRequestDigestOp();
            const response = await fetch(this.config.lijsten.problemenPleeglocaties.endpoints.aanmaken(), {
                method: 'POST',
                headers: this.config.headers.post(digest),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.d;
        } catch (error) {
            console.error('Fout bij aanmaken probleem:', error);
            throw error;
        }
    }

    /**
     * Update bestaande DH locatie
     * @param {number} id - ID van de DH locatie
     * @param {Object} updates - Velden om te updaten
     * @returns {Promise<Object>} Updated DH locatie
     */
    async updateDH(id, updates) {
        try {
            const body = {
                __metadata: { type: 'SP.Data.Digitale_x0020_handhavingListItem' },
                ...updates
            };

            const digest = await this.haalRequestDigestOp();
            const response = await fetch(this.config.lijsten.digitaleHandhaving.endpoints.updaten(id), {
                method: 'POST',
                headers: this.config.headers.merge(digest),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return { success: true, id };
        } catch (error) {
            console.error('Fout bij updaten DH locatie:', error);
            throw error;
        }
    }

    /**
     * Update bestaand probleem
     * @param {number} id - ID van het probleem
     * @param {Object} updates - Velden om te updaten
     * @returns {Promise<Object>} Updated probleem
     */
    async updateProblem(id, updates) {
        try {
            const body = {
                __metadata: { type: 'SP.Data.Problemen_x0020_pleeglocatiesListItem' },
                ...updates
            };

            const digest = await this.haalRequestDigestOp();
            const response = await fetch(this.config.lijsten.problemenPleeglocaties.endpoints.updaten(id), {
                method: 'POST',
                headers: this.config.headers.merge(digest),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return { success: true, id };
        } catch (error) {
            console.error('Fout bij updaten probleem:', error);
            throw error;
        }
    }
}

/**
 * Create een DDH Data Service instance
 * @param {Object} config - DDH configuratie object
 * @returns {DDHDataService} Service instance
 */
export const createDDHDataService = (config) => {
    return new DDHDataService(config);
};

export default DDHDataService;