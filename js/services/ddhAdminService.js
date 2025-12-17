import DDH_CONFIG from '../config/index.js';

const getRequestDigest = async () => {
    const response = await fetch(DDH_CONFIG.helpers.maakApiUrl("/contextinfo"), {
        method: "POST",
        headers: { "Accept": "application/json; odata=verbose" }
    });
    const data = await response.json();
    return data.d.GetContextWebInformation.FormDigestValue;
};

export const DDHAdminService = {
    searchUsers: async (query) => {
        if (!query || query.length < 3) return [];
        
        const endpoint = DDH_CONFIG.helpers.maakApiUrl("/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser");
        const digest = await getRequestDigest();
        
        const payload = {
            queryParams: {
                __metadata: { type: 'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters' },
                AllowEmailAddresses: true,
                AllowMultipleEntities: false,
                AllUrlZones: false,
                MaximumEntitySuggestions: 10,
                PrincipalSource: 15,
                PrincipalType: 15, 
                QueryString: query
            }
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        const results = JSON.parse(data.d.ClientPeoplePickerSearchUser);
        
        return results.map(u => ({
            id: u.EntityData.SPUserID, 
            title: u.DisplayText,
            email: u.EntityData.Email,
            loginName: u.Key
        }));
    },

    ensureUser: async (loginName) => {
        const digest = await getRequestDigest();
        const endpoint = DDH_CONFIG.helpers.maakApiUrl(`/web/ensureuser('${encodeURIComponent(loginName)}')`);
        
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest
            }
        });
        
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return data.d.Id;
    },

    addLocation: async (locationData) => {
        const digest = await getRequestDigest();
        
        const payload = {
            __metadata: { type: "SP.Data.Digitale_x0020_handhavingListItem" },
            Title: locationData.Title,
            Gemeente: locationData.Gemeente,
            Status_x0020_B_x0026_S: locationData.Status,
            Feitcodegroep: locationData.Feitcodegroep,
            Waarschuwing: locationData.Waarschuwing,
            E_x002d_mailadres_x0020_contactp: locationData.EmailContact,
            Start_x0020_Waarschuwingsperiode: locationData.StartWaarschuwing || null,
            Einde_x0020_Waarschuwingsperiode: locationData.EindeWaarschuwing || null,
            Laatste_x0020_schouw: locationData.LaatsteSchouw || null,
        };

        if (locationData.LinkAlgemeenPV && locationData.LinkAlgemeenPV.Url) {
            payload.Link_x0020_Algemeen_x0020_PV = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.LinkAlgemeenPV.Description || locationData.LinkAlgemeenPV.Url,
                Url: locationData.LinkAlgemeenPV.Url
            };
        }
        if (locationData.LinkSchouwrapporten && locationData.LinkSchouwrapporten.Url) {
            payload.Link_x0020_Schouwrapporten = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.LinkSchouwrapporten.Description || locationData.LinkSchouwrapporten.Url,
                Url: locationData.LinkSchouwrapporten.Url
            };
        }
        if (locationData.Instemmingsbesluit && locationData.Instemmingsbesluit.Url) {
            payload.Instemmingsbesluit = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.Instemmingsbesluit.Description || locationData.Instemmingsbesluit.Url,
                Url: locationData.Instemmingsbesluit.Url
            };
        }

        if (locationData.ContactpersoonId) {
            payload.ContactpersoonId = locationData.ContactpersoonId;
        }

        const response = await fetch(DDH_CONFIG.helpers.maakApiUrl("/web/lists/getbytitle('Digitale handhaving')/items"), {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    },

    updateLocation: async (id, locationData) => {
        const digest = await getRequestDigest();
        
        const payload = {
            __metadata: { type: "SP.Data.Digitale_x0020_handhavingListItem" },
            Title: locationData.Title,
            Gemeente: locationData.Gemeente,
            Status_x0020_B_x0026_S: locationData.Status,
            Feitcodegroep: locationData.Feitcodegroep,
            Waarschuwing: locationData.Waarschuwing,
            E_x002d_mailadres_x0020_contactp: locationData.EmailContact,
            Start_x0020_Waarschuwingsperiode: locationData.StartWaarschuwing || null,
            Einde_x0020_Waarschuwingsperiode: locationData.EindeWaarschuwing || null,
            Laatste_x0020_schouw: locationData.LaatsteSchouw || null,
        };

        if (locationData.LinkAlgemeenPV) {
            payload.Link_x0020_Algemeen_x0020_PV = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.LinkAlgemeenPV.Description || locationData.LinkAlgemeenPV.Url,
                Url: locationData.LinkAlgemeenPV.Url
            };
        }
        if (locationData.LinkSchouwrapporten) {
            payload.Link_x0020_Schouwrapporten = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.LinkSchouwrapporten.Description || locationData.LinkSchouwrapporten.Url,
                Url: locationData.LinkSchouwrapporten.Url
            };
        }
        if (locationData.Instemmingsbesluit) {
            payload.Instemmingsbesluit = {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: locationData.Instemmingsbesluit.Description || locationData.Instemmingsbesluit.Url,
                Url: locationData.Instemmingsbesluit.Url
            };
        }

        if (locationData.ContactpersoonId) {
            payload.ContactpersoonId = locationData.ContactpersoonId;
        }

        const response = await fetch(DDH_CONFIG.helpers.maakApiUrl(`/web/lists/getbytitle('Digitale handhaving')/items(${id})`), {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest,
                "X-HTTP-Method": "MERGE",
                "IF-MATCH": "*"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(await response.text());
    },

    deleteLocation: async (id) => {
        const digest = await getRequestDigest();
        const response = await fetch(DDH_CONFIG.helpers.maakApiUrl(`/web/lists/getbytitle('Digitale handhaving')/items(${id})`), {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": digest,
                "X-HTTP-Method": "DELETE",
                "IF-MATCH": "*"
            }
        });
        if (!response.ok) throw new Error(await response.text());
    }
};
