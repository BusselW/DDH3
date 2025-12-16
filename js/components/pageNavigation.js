/**
 * DDH Page Navigation Component
 * Provides footer navigation between different dashboard designs
 */

// Complete list of available pages
const ALL_PAGES = [
    { name: 'Portal-Design1-Cards.aspx', title: 'Portal Design 1: Cards' },
    { name: 'Portal-Design2-Tree.aspx', title: 'Portal Design 2: Tree' },
    { name: 'Portal-Design3-Map.aspx', title: 'Portal Design 3: Map' },
    { name: 'Portal-Design4-Timeline.aspx', title: 'Portal Design 4: Timeline' },
    { name: 'Portal-Design5-Dashboard.aspx', title: 'Portal Design 5: Dashboard' },
    { name: 'Portal-Design6-Layered.aspx', title: 'Portal Design 6: Layered' },
    { name: 'Portal-Design7-Modern.aspx', title: 'Portal Design 7: Modern' },
    { name: 'ProblemDashboard-Design1.aspx', title: 'Problem Dashboard 1' },
    { name: 'ProblemDashboard-Design2.aspx', title: 'Problem Dashboard 2' },
    { name: 'ProblemDashboard-Design3.aspx', title: 'Problem Dashboard 3' },
    { name: 'ProblemDashboard-Design4.aspx', title: 'Problem Dashboard 4' },
    { name: 'ProblemDashboard-Design5.aspx', title: 'Problem Dashboard 5' },
    { name: 'ProblemDashboard-Design6.aspx', title: 'Problem Dashboard 6' },
    { name: 'ProblemDashboard-Design7.aspx', title: 'Problem Dashboard 7' },
    { name: 'ProblemDashboard-Design8.aspx', title: 'Problem Dashboard 8: Minimalist' },
    { name: 'ProblemDashboard-Design9.aspx', title: 'Problem Dashboard 9: Dark' },
    { name: 'ProblemDashboard-Design10.aspx', title: 'Problem Dashboard 10: Vibrant' },
    { name: 'ProblemDashboard-Design11.aspx', title: 'Problem Dashboard 11: Newspaper' },
    { name: 'ProblemDashboard-Design12.aspx', title: 'Problem Dashboard 12: Mobile' },
    { name: 'ProblemDashboard-Design13.aspx', title: 'Problem Dashboard 13' },
    { name: 'Dashboard.aspx', title: 'Main Dashboard' },
    { name: 'DDH.aspx', title: 'DDH Main' }
];

// Get current page filename
const getCurrentPageName = () => {
    const path = window.location.pathname;
    return path.split('/').pop();
};

// Find current page index
const getCurrentPageIndex = () => {
    const currentPage = getCurrentPageName();
    return ALL_PAGES.findIndex(page => page.name === currentPage);
};

// Get next valid page with retry logic
const getNextValidPage = async (startIndex = 0, attempts = 0) => {
    if (attempts >= ALL_PAGES.length) {
        console.error('No valid pages found after checking all pages');
        return null;
    }
    
    const nextIndex = (startIndex + 1) % ALL_PAGES.length;
    const nextPage = ALL_PAGES[nextIndex];
    
    try {
        // Check if page exists by making a HEAD request
        const response = await fetch(nextPage.name, { method: 'HEAD' });
        if (response.ok) {
            return nextPage;
        } else {
            // Page doesn't exist, try next one
            return getNextValidPage(nextIndex, attempts + 1);
        }
    } catch (error) {
        // Network error or page doesn't exist, try next one
        return getNextValidPage(nextIndex, attempts + 1);
    }
};

// Get previous valid page with retry logic
const getPreviousValidPage = async (startIndex = 0, attempts = 0) => {
    if (attempts >= ALL_PAGES.length) {
        console.error('No valid pages found after checking all pages');
        return null;
    }
    
    const prevIndex = startIndex - 1 < 0 ? ALL_PAGES.length - 1 : startIndex - 1;
    const prevPage = ALL_PAGES[prevIndex];
    
    try {
        // Check if page exists by making a HEAD request
        const response = await fetch(prevPage.name, { method: 'HEAD' });
        if (response.ok) {
            return prevPage;
        } else {
            // Page doesn't exist, try previous one
            return getPreviousValidPage(prevIndex, attempts + 1);
        }
    } catch (error) {
        // Network error or page doesn't exist, try previous one
        return getPreviousValidPage(prevIndex, attempts + 1);
    }
};

// Navigate to next page
const navigateToNext = async () => {
    const currentIndex = getCurrentPageIndex();
    const nextPage = await getNextValidPage(currentIndex);
    
    if (nextPage) {
        window.location.href = nextPage.name;
    } else {
        console.error('Could not find next valid page');
    }
};

// Navigate to previous page
const navigateToPrevious = async () => {
    const currentIndex = getCurrentPageIndex();
    const prevPage = await getPreviousValidPage(currentIndex);
    
    if (prevPage) {
        window.location.href = prevPage.name;
    } else {
        console.error('Could not find previous valid page');
    }
};

// Get current page info
const getCurrentPageInfo = () => {
    const currentIndex = getCurrentPageIndex();
    if (currentIndex === -1) {
        return { name: 'Unknown', title: 'Unknown Page', index: -1, total: ALL_PAGES.length };
    }
    
    return {
        ...ALL_PAGES[currentIndex],
        index: currentIndex + 1,
        total: ALL_PAGES.length
    };
};

// Temporary placeholder data for testing
const TEMP_PLACEHOLDER_DATA = [
    {
        Id: 1,
        Title: "Camera Locatie 1",
        Gemeente: "Amsterdam",
        Status_x0020_B_x0026_S: "Actief",
        Feitcodegroep: "Verkeer",
        gemeenteID: "Amsterdam - Camera Locatie 1",
        problemen: [
            {
                Id: 101,
                Probleembeschrijving: "Camera defect - geen beeld",
                Opgelost_x003f_: "Aangemeld",
                Aanmaakdatum: "2024-01-15T10:30:00Z",
                Feitcodegroep: "Technisch"
            },
            {
                Id: 102,
                Probleembeschrijving: "Slechte beeldkwaliteit door vervuiling",
                Opgelost_x003f_: "In behandeling",
                Aanmaakdatum: "2024-01-10T14:20:00Z",
                Feitcodegroep: "Onderhoud"
            }
        ]
    },
    {
        Id: 2,
        Title: "Handhaving Punt 2",
        Gemeente: "Rotterdam",
        Status_x0020_B_x0026_S: "Actief",
        Feitcodegroep: "Parkeren",
        gemeenteID: "Rotterdam - Handhaving Punt 2",
        problemen: [
            {
                Id: 201,
                Probleembeschrijving: "Parkeerautomaat buiten werking",
                Opgelost_x003f_: "Opgelost",
                Aanmaakdatum: "2024-01-08T09:15:00Z",
                Feitcodegroep: "Technisch"
            }
        ]
    },
    {
        Id: 3,
        Title: "Controle Locatie 3",
        Gemeente: "Utrecht",
        Status_x0020_B_x0026_S: "Inactief",
        Feitcodegroep: "Milieu",
        gemeenteID: "Utrecht - Controle Locatie 3",
        problemen: [
            {
                Id: 301,
                Probleembeschrijving: "Sensor geeft onjuiste metingen",
                Opgelost_x003f_: "Uitgezet",
                Aanmaakdatum: "2024-01-12T16:45:00Z",
                Feitcodegroep: "Kalibratie"
            },
            {
                Id: 302,
                Probleembeschrijving: "Dataverbinding onderbroken",
                Opgelost_x003f_: "Aangemeld",
                Aanmaakdatum: "2024-01-14T11:30:00Z",
                Feitcodegroep: "Connectiviteit"
            },
            {
                Id: 303,
                Probleembeschrijving: "Behuizing beschadigd door vandalen",
                Opgelost_x003f_: "In behandeling",
                Aanmaakdatum: "2024-01-13T08:20:00Z",
                Feitcodegroep: "Vandalisme"
            }
        ]
    },
    {
        Id: 4,
        Title: "Monitoring Station 4",
        Gemeente: "Den Haag",
        Status_x0020_B_x0026_S: "Actief",
        Feitcodegroep: "Verkeer",
        gemeenteID: "Den Haag - Monitoring Station 4",
        problemen: []
    },
    {
        Id: 5,
        Title: "Toezicht Punt 5",
        Gemeente: "Amsterdam",
        Status_x0020_B_x0026_S: "Actief",
        Feitcodegroep: "Openbare Orde",
        gemeenteID: "Amsterdam - Toezicht Punt 5",
        problemen: [
            {
                Id: 501,
                Probleembeschrijving: "Geluidssensor defect",
                Opgelost_x003f_: "Opgelost",
                Aanmaakdatum: "2024-01-05T13:10:00Z",
                Feitcodegroep: "Technisch"
            },
            {
                Id: 502,
                Probleembeschrijving: "Software update vereist",
                Opgelost_x003f_: "In behandeling",
                Aanmaakdatum: "2024-01-16T10:00:00Z",
                Feitcodegroep: "Software"
            }
        ]
    },
    {
        Id: 6,
        Title: "Controle Camera 6",
        Gemeente: "Rotterdam",
        Status_x0020_B_x0026_S: "Actief",
        Feitcodegroep: "Verkeer",
        gemeenteID: "Rotterdam - Controle Camera 6",
        problemen: [
            {
                Id: 601,
                Probleembeschrijving: "Lens moet gereinigd worden",
                Opgelost_x003f_: "Aangemeld",
                Aanmaakdatum: "2024-01-17T07:30:00Z",
                Feitcodegroep: "Onderhoud"
            }
        ]
    }
];

// Export everything for use in pages
export {
    ALL_PAGES,
    getCurrentPageName,
    getCurrentPageIndex,
    getNextValidPage,
    getPreviousValidPage,
    navigateToNext,
    navigateToPrevious,
    getCurrentPageInfo,
    TEMP_PLACEHOLDER_DATA
};