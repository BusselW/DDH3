const { createElement: h, useState, useEffect } = window.React;
import { DDHAdminService } from '../services/ddhAdminService.js';

// Icons
const Icons = {
    Settings: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('circle', {cx: "12", cy: "12", r: "3"}), h('path', {d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})),
    Plus: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('line', {x1: "12", y1: "5", x2: "12", y2: "19"}), h('line', {x1: "5", y1: "12", x2: "19", y2: "12"})),
    Edit: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}), h('path', {d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})),
    Trash: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('polyline', {points: "3 6 5 6 21 6"}), h('path', {d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}))
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 } },
        h('div', { style: { background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' } },
                h('h3', { style: { margin: 0 } }, title),
                h('button', { onClick: onClose, style: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' } }, '×')
            ),
            children
        )
    );
};

export const AdminMenu = ({ selectedItem, isAdmin, onRefresh }) => {
    if (!isAdmin) return null;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const isDDHSelected = selectedItem?.type === 'locatie';

    const handleCreate = () => {
        setModalMode('create');
        setFormData({ Title: '', Gemeente: '', Status: '', Feitcodegroep: '' });
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        if (!isDDHSelected) return;
        setModalMode('edit');
        setFormData({
            Title: selectedItem.data.Title,
            Gemeente: selectedItem.data.Gemeente,
            Status: selectedItem.data.Status_x0020_B_x0026_S,
            Feitcodegroep: selectedItem.data.Feitcodegroep
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
            if (modalMode === 'create') {
                await DDHAdminService.addLocation(formData);
                alert('Locatie aangemaakt');
            } else {
                await DDHAdminService.updateLocation(selectedItem.data.Id, formData);
                alert('Locatie bijgewerkt');
            }
            setIsModalOpen(false);
            onRefresh();
        } catch (e) {
            alert('Fout bij opslaan: ' + e.message);
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
            h('form', { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                h('div', null,
                    h('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' } }, 'Locatie Naam (Title)'),
                    h('input', { 
                        type: 'text', 
                        required: true,
                        value: formData.Title || '', 
                        onChange: e => setFormData({...formData, Title: e.target.value}),
                        style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
                    })
                ),
                h('div', null,
                    h('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' } }, 'Gemeente'),
                    h('input', { 
                        type: 'text', 
                        required: true,
                        value: formData.Gemeente || '', 
                        onChange: e => setFormData({...formData, Gemeente: e.target.value}),
                        style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
                    })
                ),
                h('div', null,
                    h('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' } }, 'Status B&S'),
                    h('input', { 
                        type: 'text', 
                        value: formData.Status || '', 
                        onChange: e => setFormData({...formData, Status: e.target.value}),
                        style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
                    })
                ),
                h('div', null,
                    h('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' } }, 'Feitcodegroep'),
                    h('input', { 
                        type: 'text', 
                        value: formData.Feitcodegroep || '', 
                        onChange: e => setFormData({...formData, Feitcodegroep: e.target.value}),
                        style: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }
                    })
                ),
                h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' } },
                    h('button', { type: 'button', onClick: () => setIsModalOpen(false), style: { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' } }, 'Annuleren'),
                    h('button', { type: 'submit', disabled: loading, style: { padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } }, loading ? 'Bezig...' : 'Opslaan')
                )
            )
        )
    );
};
