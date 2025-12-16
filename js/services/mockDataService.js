/**
 * Mock Data Service for DDH Dashboard
 * Provides test data for local development when SharePoint is not available
 */

// Mock data for Digitale Handhaving locations
const mockDHLocations = [
    {
        Id: 1,
        Title: "Hoofdstraat 123",
        Gemeente: "Amsterdam",
        Feitcodegroep: "Verkeersborden",
        Status_x0020_B_x0026_S: "Aangevraagd",
        Waarschuwingsperiode: "Ja",
        Start_x0020_Waarschuwingsperiode: "2024-01-15T00:00:00Z",
        Einde_x0020_Waarschuwingsperiode: "2024-02-15T00:00:00Z",
        Laatste_x0020_schouw: "2024-01-10T00:00:00Z",
        E_x002d_mailadres_x0020_contactp: "contact@amsterdam.nl",
        Link_x0020_Algemeen_x0020_PV: {
            Url: "https://example.com/pv1.pdf",
            Description: "Algemeen PV"
        },
        Link_x0020_Schouwrapporten: {
            Url: "https://example.com/schouw1.pdf", 
            Description: "Schouwrapporten"
        },
        Instemmingsbesluit: {
            Url: "https://example.com/instemming1.pdf",
            Description: "Instemmingsbesluit"
        }
    },
    {
        Id: 2,
        Title: "Kerkstraat 45",
        Gemeente: "Utrecht",
        Feitcodegroep: "Parkeren",
        Status_x0020_B_x0026_S: "In behandeling",
        Waarschuwingsperiode: "Nee",
        Start_x0020_Waarschuwingsperiode: null,
        Einde_x0020_Waarschuwingsperiode: null,
        Laatste_x0020_schouw: "2024-01-05T00:00:00Z",
        E_x002d_mailadres_x0020_contactp: "handhaving@utrecht.nl",
        Link_x0020_Algemeen_x0020_PV: {
            Url: "https://example.com/pv2.pdf",
            Description: "Algemeen PV"
        },
        Link_x0020_Schouwrapporten: null,
        Instemmingsbesluit: null
    },
    {
        Id: 3,
        Title: "Marktplein 8",
        Gemeente: "Den Haag",
        Feitcodegroep: "Rijgedrag",
        Status_x0020_B_x0026_S: "Instemming verleend",
        Waarschuwingsperiode: "Ja",
        Start_x0020_Waarschuwingsperiode: "2024-01-20T00:00:00Z",
        Einde_x0020_Waarschuwingsperiode: "2024-02-20T00:00:00Z",
        Laatste_x0020_schouw: "2024-01-18T00:00:00Z",
        E_x002d_mailadres_x0020_contactp: "digitaal@denhaag.nl",
        Link_x0020_Algemeen_x0020_PV: {
            Url: "https://example.com/pv3.pdf",
            Description: "Algemeen PV"
        },
        Link_x0020_Schouwrapporten: {
            Url: "https://example.com/schouw3.pdf",
            Description: "Schouwrapporten"
        },
        Instemmingsbesluit: {
            Url: "https://example.com/instemming3.pdf",
            Description: "Instemmingsbesluit"
        }
    }
];

// Mock data for Problemen
const mockProblems = [
    {
        Id: 101,
        Title: "Hoofdstraat 123", // Matches DH location
        Gemeente: "Amsterdam",
        Feitcodegroep: "Verkeersborden",
        Probleembeschrijving: "Verkeersbord niet zichtbaar door begroeiing",
        Opgelost_x003f_: "Aangemeld",
        Aanmaakdatum: "2024-01-12T10:30:00Z",
        Actie_x0020_Beoordelaars: "Verzuim opvragen",
        Eigenaar: {
            Title: "Jan Janssen",
            Id: 1
        },
        ProbleemID: "Amsterdam - Hoofdstraat 123"
    },
    {
        Id: 102,
        Title: "Hoofdstraat 123",
        Gemeente: "Amsterdam", 
        Feitcodegroep: "Verkeersborden",
        Probleembeschrijving: "Verkeersbord beschadigd door vandalisme",
        Opgelost_x003f_: "In behandeling",
        Aanmaakdatum: "2024-01-14T14:15:00Z",
        Actie_x0020_Beoordelaars: "Wijzigen",
        Eigenaar: {
            Title: "Maria Peters",
            Id: 2
        },
        ProbleemID: "Amsterdam - Hoofdstraat 123"
    },
    {
        Id: 103,
        Title: "Kerkstraat 45",
        Gemeente: "Utrecht",
        Feitcodegroep: "Parkeren",
        Probleembeschrijving: "Onjuiste parkeertijd op bord",
        Opgelost_x003f_: "Uitgezet bij OI",
        Aanmaakdatum: "2024-01-08T09:00:00Z",
        Actie_x0020_Beoordelaars: "Bekrachtigen",
        Eigenaar: {
            Title: "Piet Bakker",
            Id: 3
        },
        ProbleemID: "Utrecht - Kerkstraat 45"
    },
    {
        Id: 104,
        Title: "Marktplein 8",
        Gemeente: "Den Haag",
        Feitcodegroep: "Rijgedrag",
        Probleembeschrijving: "Snelheidsbeperking niet duidelijk aangegeven",
        Opgelost_x003f_: "Opgelost",
        Aanmaakdatum: "2024-01-16T11:45:00Z",
        Actie_x0020_Beoordelaars: "Geen actie nodig",
        Eigenaar: {
            Title: "Karin de Vries",
            Id: 4
        },
        ProbleemID: "Den Haag - Marktplein 8"
    },
    {
        Id: 105,
        Title: "Marktplein 8",
        Gemeente: "Den Haag",
        Feitcodegroep: "Rijgedrag", 
        Probleembeschrijving: "Onduidelijke markering op wegdek",
        Opgelost_x003f_: "Aangemeld",
        Aanmaakdatum: "2024-01-19T16:20:00Z",
        Actie_x0020_Beoordelaars: "Vasthouden",
        Eigenaar: {
            Title: "Tom Hendriks",
            Id: 5
        },
        ProbleemID: "Den Haag - Marktplein 8"
    }
];

/**
 * Mock Data Service Class
 * Simulates SharePoint REST API responses for local testing
 */
export class MockDataService {
    constructor() {
        this.dhLocations = [...mockDHLocations];
        this.problems = [...mockProblems];
    }

    /**
     * Simulate API delay
     */
    async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fetch all data with relationships
     */
    async fetchAll() {
        await this.delay();
        
        // Combine DH locations with their problems
        const result = this.dhLocations.map(dh => {
            const dhKey = `${dh.Gemeente} - ${dh.Title}`;
            const relatedProblems = this.problems.filter(problem => 
                problem.ProbleemID === dhKey
            );
            
            return {
                ...dh,
                problemen: relatedProblems
            };
        });

        return result;
    }

    /**
     * Add new DH location
     */
    async addDH(item) {
        await this.delay();
        
        const newId = Math.max(...this.dhLocations.map(dh => dh.Id)) + 1;
        const newDH = {
            Id: newId,
            Title: item.Title,
            Gemeente: item.Gemeente,
            Feitcodegroep: item.Feitcodegroep,
            Status_x0020_B_x0026_S: item.Status_x0020_B_x0026_S || 'Aangevraagd',
            Waarschuwingsperiode: item.Waarschuwingsperiode || 'Ja',
            Start_x0020_Waarschuwingsperiode: item.Start_x0020_Waarschuwingsperiode || null,
            Einde_x0020_Waarschuwingsperiode: item.Einde_x0020_Waarschuwingsperiode || null,
            Laatste_x0020_schouw: item.Laatste_x0020_schouw || null,
            E_x002d_mailadres_x0020_contactp: item.E_x002d_mailadres_x0020_contactp || null,
            Link_x0020_Algemeen_x0020_PV: item.Link_x0020_Algemeen_x0020_PV || null,
            Link_x0020_Schouwrapporten: item.Link_x0020_Schouwrapporten || null,
            Instemmingsbesluit: item.Instemmingsbesluit || null
        };
        
        this.dhLocations.push(newDH);
        return newDH;
    }

    /**
     * Update DH location
     */
    async updateDH(id, item) {
        await this.delay();
        
        const index = this.dhLocations.findIndex(dh => dh.Id === id);
        if (index === -1) {
            throw new Error(`DH location with id ${id} not found`);
        }
        
        this.dhLocations[index] = { ...this.dhLocations[index], ...item };
        return this.dhLocations[index];
    }

    /**
     * Add new problem
     */
    async addProblem(item) {
        await this.delay();
        
        const newId = Math.max(...this.problems.map(p => p.Id)) + 1;
        const newProblem = {
            Id: newId,
            Title: item.Title,
            Gemeente: item.Gemeente,
            Feitcodegroep: item.Feitcodegroep,
            Probleembeschrijving: item.Probleembeschrijving,
            Opgelost_x003f_: item.Opgelost_x003f_ || 'Aangemeld',
            Aanmaakdatum: new Date().toISOString(),
            Actie_x0020_Beoordelaars: item.Actie_x0020_Beoordelaars || 'Geen actie nodig',
            Eigenaar: item.Eigenaar || { Title: 'Onbekend', Id: 0 },
            ProbleemID: `${item.Gemeente} - ${item.Title}`
        };
        
        this.problems.push(newProblem);
        return newProblem;
    }

    /**
     * Update problem
     */
    async updateProblem(id, item) {
        await this.delay();
        
        const index = this.problems.findIndex(p => p.Id === id);
        if (index === -1) {
            throw new Error(`Problem with id ${id} not found`);
        }
        
        this.problems[index] = { ...this.problems[index], ...item };
        return this.problems[index];
    }
}

/**
 * Create mock data service instance
 */
export const createMockDataService = () => {
    return new MockDataService();
};

export default MockDataService;