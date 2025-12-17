const { createElement: h, useState, useEffect, useRef } = window.React;
import { DDHAdminService } from '../services/ddhAdminService.js';

// Icons
const Icons = {
    Settings: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('circle', {cx: "12", cy: "12", r: "3"}), h('path', {d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})),
    Plus: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('line', {x1: "12", y1: "5", x2: "12", y2: "19"}), h('line', {x1: "5", y1: "12", x2: "19", y2: "12"})),
    Edit: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}), h('path', {d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})),
    Trash: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('polyline', {points: "3 6 5 6 21 6"}), h('path', {d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})),
    User: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}), h('circle', {cx: "12", cy: "7", r: "4"})),
    X: () => h('svg', {width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('line', {x1: "18", y1: "6", x2: "6", y2: "18"}), h('line', {x1: "6", y1: "6", x2: "18", y2: "18"}))
};

// --- Helper Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 } },
        h('div', { style: { background: 'white', padding: '24px', borderRadius: '12px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' } },
                h('h3', { style: { margin: 0 } }, title),
                h('button', { onClick: onClose, style: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' } }, '×')
            ),
            children
        )
    );
};

const FormSection = ({ title, children, columns = 2 }) => h('div', { style: { marginBottom: '24px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
    h('h4', { style: { margin: '0 0 16px 0', color: '#0f172a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' } }, title),
    h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '20px' } }, children)
);

const FormField = ({ label, required, children, colSpan = 1 }) => h('div', { style: { marginBottom: '0', gridColumn: `span ${colSpan}` } },
    h('label', { style: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#475569' } }, 
        label, required && h('span', { style: { color: '#ef4444', marginLeft: '4px' } }, '*')
    ),
    children
);

const SelectField = ({ value, onChange, options, required }) => h('select', {
    value: value || '',
    onChange: e => onChange(e.target.value),
    required: required,
    style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white' }
},
    h('option', { value: '' }, '-- Selecteer --'),
    options.map(opt => h('option', { key: opt, value: opt }, opt))
);

const DateField = ({ value, onChange }) => h('input', {
    type: 'date',
    value: value ? value.split('T')[0] : '',
    onChange: e => onChange(e.target.value ? new Date(e.target.value).toISOString() : null),
    style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
});

const UrlField = ({ value, onChange, placeholder }) => h('div', { style: { display: 'flex', gap: '10px' } },
    h('input', {
        type: 'text',
        placeholder: 'Omschrijving',
        value: value?.Description || '',
        onChange: e => onChange({ ...value, Description: e.target.value }),
        style: { flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
    }),
    h('input', {
        type: 'text',
        placeholder: 'URL (https://...)',
        value: value?.Url || '',
        onChange: e => onChange({ ...value, Url: e.target.value }),
        style: { flex: 2, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
    })
);

const PeoplePicker = ({ value, onChange }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeout = useRef(null);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const users = await DDHAdminService.searchUsers(query);
                setResults(users);
                setShowResults(true);
            } catch (e) {
                console.error("Search error", e);
            } finally {
                setSearching(false);
            }
        }, 500); // Debounce 500ms
    }, [query]);

    const handleSelect = (user) => {
        onChange(user); // Pass full user object back
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return h('div', { style: { position: 'relative' } },
        value ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' } },
            h(Icons.User),
            h('span', { style: { flex: 1, fontSize: '14px' } }, value.Title || value.title),
            h('button', { 
                type: 'button',
                onClick: () => onChange(null),
                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }
            }, h(Icons.X))
        ) : h('div', null,
            h('input', {
                type: 'text',
                placeholder: 'Zoek gebruiker (min. 3 tekens)...',
                value: query,
                onChange: e => setQuery(e.target.value),
                onFocus: () => query.length >= 3 && setShowResults(true),
                style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
            }),
            searching && h('div', { style: { position: 'absolute', right: '10px', top: '10px', fontSize: '12px', color: '#94a3b8' } }, 'Zoeken...')
        ),
        
        showResults && results.length > 0 && h('div', { style: { 
            position: 'absolute', top: '100%', left: 0, right: 0, 
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' 
        } },
            results.map(user => h('div', {
                key: user.loginName,
                onClick: () => handleSelect(user),
                style: { padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px' },
                onMouseOver: e => e.currentTarget.style.background = '#f8fafc',
                onMouseOut: e => e.currentTarget.style.background = 'white'
            }, 
                h('div', { style: { fontWeight: '600' } }, user.title),
                h('div', { style: { fontSize: '11px', color: '#64748b' } }, user.email)
            ))
        )
    );
};

// --- Main Component ---

export const AdminMenu = ({ selectedItem, isAdmin, onRefresh }) => {
    if (!isAdmin) return null;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const isDDHSelected = selectedItem?.type === 'locatie';

    const handleCreate = () => {
        setModalMode('create');
        setFormData({ 
            Title: '', Gemeente: '', Status: 'Aangevraagd', Feitcodegroep: 'Verkeersborden', Waarschuwing: 'Nee' 
        });
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        if (!isDDHSelected) return;
        const d = selectedItem.data;
        setModalMode('edit');
        setFormData({
            Title: d.Title,
            Gemeente: d.Gemeente,
            Status: d.Status_x0020_B_x0026_S,
            Feitcodegroep: d.Feitcodegroep,
            Waarschuwing: d.Waarschuwing,
            StartWaarschuwing: d.Start_x0020_Waarschuwingsperiode,
            EindeWaarschuwing: d.Einde_x0020_Waarschuwingsperiode,
            LaatsteSchouw: d.Laatste_x0020_schouw,
            EmailContact: d.E_x002d_mailadres_x0020_contactp,
            Contactpersoon: d.Contactpersoon, // Object { Title, Id, ... }
            LinkAlgemeenPV: d.Link_x0020_Algemeen_x0020_PV, // Object { Description, Url }
            LinkSchouwrapporten: d.Link_x0020_Schouwrapporten,
            Instemmingsbesluit: d.Instemmingsbesluit
        });
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!isDDHSelected) return;
        if (confirm(`Weet u zeker dat u "${selectedItem.data.Title}" wilt verwijderen?`)) {
            try {
                setLoading(true);
                await DDHAdminService.deleteLocation(selectedItem.data.Id);
                alert('Locatie verwijderd');
                onRefresh();
            } catch (e) {
                alert('Fout bij verwijderen: ' + e.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Prepare data for service
            const serviceData = {
                ...formData,
                ContactpersoonId: formData.Contactpersoon?.id || formData.Contactpersoon?.Id // Handle both picker result and existing SP data
            };

            if (modalMode === 'create') {
                await DDHAdminService.addLocation(serviceData);
                alert('Locatie aangemaakt');
            } else {
                await DDHAdminService.updateLocation(selectedItem.data.Id, serviceData);
                alert('Locatie bijgewerkt');
            }
            setIsModalOpen(false);
            onRefresh();
        } catch (e) {
            alert('Fout bij opslaan: ' + e.message);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return h('div', null,
        h('div', { className: 'admin-menu' },
            h('div', { className: 'admin-header' }, h(Icons.Settings), 'Beheer Menu'),
            
            h('div', { className: 'admin-section' },
                h('div', { className: 'admin-section-title' }, 'DDH Locaties'),
                h('button', { className: 'admin-btn', onClick: handleCreate, disabled: loading }, 
                    h(Icons.Plus), 'Toevoegen'
                ),
                h('button', { 
                    className: 'admin-btn', 
                    disabled: !isDDHSelected || loading,
                    onClick: handleEdit
                }, 
                    h(Icons.Edit), 'Bewerken'
                ),
                h('button', { 
                    className: `admin-btn ${isDDHSelected ? 'danger' : ''}`,
                    disabled: !isDDHSelected || loading,
                    onClick: handleDelete
                }, 
                    h(Icons.Trash), 'Verwijderen'
                )
            ),
            
            h('div', { className: 'admin-section' },
                h('div', { className: 'admin-section-title' }, 'Problemen'),
                h('div', { style: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' } }, 'Selecteer een probleem...')
            )
        ),

        // Modal
        h(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: modalMode === 'create' ? 'Nieuwe Locatie' : 'Locatie Bewerken' },
            h('form', { onSubmit: handleSubmit },
                
                // Section 1: Algemene Informatie
                h(FormSection, { title: 'Algemene Informatie', columns: 2 },
                    h(FormField, { label: 'Locatie Naam (Title)', required: true, colSpan: 2 },
                        h('input', { 
                            type: 'text', required: true,
                            value: formData.Title || '', 
                            onChange: e => setFormData({...formData, Title: e.target.value}),
                            style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
                        })
                    ),
                    h(FormField, { label: 'Gemeente', required: true },
                        h('input', { 
                            type: 'text', required: true,
                            value: formData.Gemeente || '', 
                            onChange: e => setFormData({...formData, Gemeente: e.target.value}),
                            style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
                        })
                    ),
                    h(FormField, { label: 'Feitcodegroep', required: true },
                        h(SelectField, {
                            value: formData.Feitcodegroep,
                            onChange: v => setFormData({...formData, Feitcodegroep: v}),
                            options: ['Verkeersborden', 'Parkeren', 'Rijgedrag'],
                            required: true
                        })
                    )
                ),

                // Section 2: Status & Planning
                h(FormSection, { title: 'Status & Planning', columns: 2 },
                    h(FormField, { label: 'Status B&S', required: true },
                        h(SelectField, {
                            value: formData.Status,
                            onChange: v => setFormData({...formData, Status: v}),
                            options: ['Aangevraagd', 'In behandeling', 'Instemming verleend'],
                            required: true
                        })
                    ),
                    h(FormField, { label: 'Laatste Schouw' },
                        h(DateField, {
                            value: formData.LaatsteSchouw,
                            onChange: v => setFormData({...formData, LaatsteSchouw: v})
                        })
                    )
                ),

                // Section 3: Waarschuwingen
                h(FormSection, { title: 'Waarschuwingen', columns: 3 },
                    h(FormField, { label: 'Waarschuwing Actief?', required: true },
                        h(SelectField, {
                            value: formData.Waarschuwing,
                            onChange: v => setFormData({...formData, Waarschuwing: v}),
                            options: ['Ja', 'Nee'],
                            required: true
                        })
                    ),
                    formData.Waarschuwing === 'Ja' && h(React.Fragment, null,
                        h(FormField, { label: 'Start Datum' },
                            h(DateField, {
                                value: formData.StartWaarschuwing,
                                onChange: v => setFormData({...formData, StartWaarschuwing: v})
                            })
                        ),
                        h(FormField, { label: 'Eind Datum' },
                            h(DateField, {
                                value: formData.EindeWaarschuwing,
                                onChange: v => setFormData({...formData, EindeWaarschuwing: v})
                            })
                        )
                    )
                ),

                // Section 4: Contact
                h(FormSection, { title: 'Contactpersoon', columns: 2 },
                    h(FormField, { label: 'Zoek Gebruiker' },
                        h(PeoplePicker, {
                            value: formData.Contactpersoon,
                            onChange: user => setFormData({...formData, Contactpersoon: user})
                        })
                    ),
                    h(FormField, { label: 'Email Adres' },
                        h('input', { 
                            type: 'email',
                            value: formData.EmailContact || '', 
                            onChange: e => setFormData({...formData, EmailContact: e.target.value}),
                            style: { width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }
                        })
                    )
                ),

                // Section 5: Documenten
                h(FormSection, { title: 'Documenten & Links', columns: 1 },
                    h(FormField, { label: 'Link Algemeen PV' },
                        h(UrlField, {
                            value: formData.LinkAlgemeenPV,
                            onChange: v => setFormData({...formData, LinkAlgemeenPV: v})
                        })
                    ),
                    h(FormField, { label: 'Link Schouwrapporten' },
                        h(UrlField, {
                            value: formData.LinkSchouwrapporten,
                            onChange: v => setFormData({...formData, LinkSchouwrapporten: v})
                        })
                    ),
                    h(FormField, { label: 'Instemmingsbesluit' },
                        h(UrlField, {
                            value: formData.Instemmingsbesluit,
                            onChange: v => setFormData({...formData, Instemmingsbesluit: v})
                        })
                    )
                ),

                // Footer Buttons
                h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' } },
                    h('button', { type: 'button', onClick: () => setIsModalOpen(false), style: { padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#64748b' } }, 'Annuleren'),
                    h('button', { type: 'submit', disabled: loading, style: { padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' } }, loading ? 'Bezig...' : 'Opslaan')
                )
            )
        )
    );
};
