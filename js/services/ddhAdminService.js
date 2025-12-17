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
    addLocation: async (locationData) => {
        const digest = await getRequestDigest();
        const response = await fetch(DDH_CONFIG.helpers.maakApiUrl("/web/lists/getbytitle('Digitale handhaving')/items"), {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest
            },
            body: JSON.stringify({
                __metadata: { type: "SP.Data.Digitale_x0020_handhavingListItem" },
                Title: locationData.Title,
                Gemeente: locationData.Gemeente,
                Status_x0020_B_x0026_S: locationData.Status,
                Feitcodegroep: locationData.Feitcodegroep
            })
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    },

    updateLocation: async (id, locationData) => {
        const digest = await getRequestDigest();
        const response = await fetch(DDH_CONFIG.helpers.maakApiUrl(`/web/lists/getbytitle('Digitale handhaving')/items(${id})`), {
            method: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": digest,
                "X-HTTP-Method": "MERGE",
                "IF-MATCH": "*"
            },
            body: JSON.stringify({
                __metadata: { type: "SP.Data.Digitale_x0020_handhavingListItem" },
                Title: locationData.Title,
                Gemeente: locationData.Gemeente,
                Status_x0020_B_x0026_S: locationData.Status,
                Feitcodegroep: locationData.Feitcodegroep
            })
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
