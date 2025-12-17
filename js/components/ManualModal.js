const { createElement: h } = window.React;

const Icons = {
    X: () => h('svg', {width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('line', {x1: "18", y1: "6", x2: "6", y2: "18"}), h('line', {x1: "6", y1: "6", x2: "18", y2: "18"})),
    Book: () => h('svg', {width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}), h('path', {d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"}))
};

export const ManualModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 } },
        h('div', { style: { background: 'white', width: '800px', maxWidth: '90%', maxHeight: '85vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' } },
            // Header
            h('div', { style: { padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
                    h('div', { style: { color: '#3b82f6' } }, h(Icons.Book)),
                    h('h2', { style: { margin: 0, fontSize: '20px', color: '#1e293b' } }, 'Handleiding Portal')
                ),
                h('button', { 
                    onClick: onClose,
                    style: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }
                }, h(Icons.X))
            ),
            
            // Content
            h('div', { style: { padding: '24px', overflowY: 'auto', lineHeight: '1.6', color: '#334155' } },
                h('h3', null, '1. Inleiding'),
                h('p', null, 'Welkom bij het Digitale Handhaving en Probleemlocaties portaal. Dit systeem biedt een overzicht van gemeentes, locaties en bijbehorende problemen.'),
                
                h('h3', null, '2. Navigatie'),
                h('p', null, 'Aan de linkerkant vindt u de navigatieboom. Hier kunt u:'),
                h('ul', null,
                    h('li', null, 'Klikken op een gemeente om locaties te zien.'),
                    h('li', null, 'Klikken op een locatie om problemen te zien.'),
                    h('li', null, 'Gebruik de zoekbalk bovenin om snel specifieke items te vinden.')
                ),

                h('h3', null, '3. Details Bekijken'),
                h('p', null, 'Wanneer u een item selecteert, verschijnt de informatie in het midden van het scherm. Hier vindt u:'),
                h('ul', null,
                    h('li', null, 'Algemene status en voortgang.'),
                    h('li', null, 'Links naar relevante documenten (SharePoint, Schouwrapporten).'),
                    h('li', null, 'Contactinformatie en betrokken personen.')
                ),

                h('h3', null, '4. Recente Veranderingen'),
                h('p', null, 'Bovenin het scherm ziet u een balk met de meest recente wijzigingen. Klik op een kaart om direct naar dat item te navigeren.'),

                h('h3', null, '5. Beheer (Alleen Admins)'),
                h('p', null, 'Beheerders hebben toegang tot extra functies via het menu onder de navigatieboom. Hier kunnen nieuwe locaties en problemen worden toegevoegd of gewijzigd.')
            ),

            // Footer
            h('div', { style: { padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' } },
                h('button', { 
                    onClick: onClose,
                    style: { padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#475569' }
                }, 'Sluiten')
            )
        )
    );
};
