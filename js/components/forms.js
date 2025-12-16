/**
 * DDH - Digitale Handhaving
 * Form Components Module
 * 
 * Reusable form components for creating and editing DDH data
 * Uses React createElement (h) for pure JS approach
 * 
 * @module components/forms
 */

// React is available globally via window
const { createElement: h } = window.React;

/**
 * Form fields for creating/editing Digitale Handhaving locations
 * @param {Object} props - Component props
 * @param {Object} props.config - DDH configuration object
 * @param {Object} props.initialData - Initial form data (for editing)
 * @returns {React.Element} Form fields component
 */
export const DHFormFields = ({ config, initialData = {} }) => {
    const feitcodegroepen = config.constanten.FEITCODEGROEPEN;
    
    return h('div', { className: 'form-grid' },
        h('div', { className: 'form-group full-width' },
            h('label', { htmlFor: 'Title' }, 'Titel / Locatie'),
            h('input', { 
                type: 'text', 
                id: 'Title', 
                name: 'Title', 
                required: true,
                defaultValue: initialData.Title || ''
            })
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Gemeente' }, 'Gemeente'),
            h('input', { 
                type: 'text', 
                id: 'Gemeente', 
                name: 'Gemeente', 
                required: true,
                defaultValue: initialData.Gemeente || ''
            })
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Feitcodegroep' }, 'Feitcodegroep'),
            h('select', { 
                id: 'Feitcodegroep', 
                name: 'Feitcodegroep',
                defaultValue: initialData.Feitcodegroep || ''
            },
                Object.values(feitcodegroepen).map(groep => 
                    h('option', { 
                        key: groep.waarde, 
                        value: groep.waarde 
                    }, groep.waarde)
                )
            )
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Waarschuwingsperiode' }, 'Waarschuwingsperiode'),
            h('select', { 
                id: 'Waarschuwingsperiode', 
                name: 'Waarschuwingsperiode',
                defaultValue: initialData.Waarschuwingsperiode || 'Ja'
            },
                h('option', { value: 'Ja' }, 'Ja'),
                h('option', { value: 'Nee' }, 'Nee')
            )
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'E_x002d_mailadres_x0020_contactp' }, 'E-mailadres contactpersoon'),
            h('input', { 
                type: 'email', 
                id: 'E_x002d_mailadres_x0020_contactp', 
                name: 'E_x002d_mailadres_x0020_contactp',
                defaultValue: initialData.E_x002d_mailadres_x0020_contactp || ''
            })
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Status_x0020_B_x0026_S' }, 'Status B&S'),
            h('select', { 
                id: 'Status_x0020_B_x0026_S', 
                name: 'Status_x0020_B_x0026_S',
                defaultValue: initialData.Status_x0020_B_x0026_S || 'Aangevraagd'
            },
                h('option', { value: 'Aangevraagd' }, 'Aangevraagd'),
                h('option', { value: 'In behandeling' }, 'In behandeling'),
                h('option', { value: 'Instemming verleend' }, 'Instemming verleend')
            )
        )
    );
};

/**
 * Form fields for creating/editing problems
 * @param {Object} props - Component props
 * @param {Object} props.config - DDH configuration object
 * @param {Object} props.dhData - Parent DH location data
 * @param {Object} props.initialData - Initial form data (for editing)
 * @returns {React.Element} Form fields component
 */
export const ProbleemFormFields = ({ config, dhData, initialData = {} }) => {
    const feitcodegroepen = config.constanten.FEITCODEGROEPEN;
    const acties = config.constanten.BEOORDELAAR_ACTIES;
    
    return h('div', { className: 'form-grid' },
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Title' }, 'Pleeglocatie'),
            h('input', { 
                type: 'text', 
                id: 'Title', 
                name: 'Title', 
                readOnly: true, 
                value: dhData.Title 
            })
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Gemeente' }, 'Gemeente'),
            h('input', { 
                type: 'text', 
                id: 'Gemeente', 
                name: 'Gemeente', 
                readOnly: true, 
                value: dhData.Gemeente 
            })
        ),
        h('div', { className: 'form-group full-width' },
            h('label', { htmlFor: 'Probleembeschrijving' }, 'Probleembeschrijving'),
            h('textarea', { 
                id: 'Probleembeschrijving', 
                name: 'Probleembeschrijving', 
                required: true,
                defaultValue: initialData.Probleembeschrijving || ''
            })
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Feitcodegroep' }, 'Feitcodegroep'),
            h('select', { 
                id: 'Feitcodegroep', 
                name: 'Feitcodegroep',
                defaultValue: initialData.Feitcodegroep || dhData.Feitcodegroep || ''
            },
                Object.values(feitcodegroepen).map(groep => 
                    h('option', { 
                        key: groep.waarde, 
                        value: groep.waarde 
                    }, groep.waarde)
                )
            )
        ),
        h('div', { className: 'form-group' },
            h('label', { htmlFor: 'Actie_x0020_Beoordelaars' }, 'Actie Beoordelaars'),
            h('select', { 
                id: 'Actie_x0020_Beoordelaars', 
                name: 'Actie_x0020_Beoordelaars',
                defaultValue: initialData.Actie_x0020_Beoordelaars || 'Geen actie nodig'
            },
                Object.values(acties).map(actie => 
                    h('option', { 
                        key: actie.waarde, 
                        value: actie.waarde 
                    }, actie.waarde)
                )
            )
        ),
        h('div', { className: 'form-group full-width' },
            h('label', { htmlFor: 'Uitleg_x0020_actie_x0020_beoorde' }, 'Uitleg actie beoordelaar'),
            h('textarea', { 
                id: 'Uitleg_x0020_actie_x0020_beoorde', 
                name: 'Uitleg_x0020_actie_x0020_beoorde',
                defaultValue: initialData.Uitleg_x0020_actie_x0020_beoorde || ''
            })
        )
    );
};

/**
 * Generic modal component for forms
 * @param {Object} props - Component props
 * @param {Object} props.modalConfig - Modal configuration
 * @param {Function} props.closeModal - Function to close modal
 * @param {Function} props.onFormSubmit - Form submission handler
 * @param {Object} props.config - DDH configuration object
 * @returns {React.Element|null} Modal component or null
 */
export const SubmissionModal = ({ modalConfig, closeModal, onFormSubmit, config }) => {
    if (!modalConfig) return null;

    const { type, data, isEdit = false } = modalConfig;
    const isDH = type === 'dh';
    const title = isEdit 
        ? (isDH ? 'Bewerk Handhavingslocatie' : 'Bewerk Probleem')
        : (isDH ? 'Nieuwe Handhavingslocatie' : `Nieuw Probleem voor ${data.Title}`);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submissionData = Object.fromEntries(formData.entries());
        onFormSubmit(type, submissionData, isEdit ? data.Id : null);
    };

    return h('div', { className: 'modal-overlay' },
        h('div', { className: 'modal-content' },
            h('form', { onSubmit: handleSubmit },
                h('div', { className: 'modal-header' },
                    h('h2', null, title),
                    h('button', { 
                        type: 'button', 
                        className: 'modal-close-btn', 
                        onClick: closeModal 
                    }, '×')
                ),
                isDH 
                    ? h(DHFormFields, { config, initialData: isEdit ? data : {} })
                    : h(ProbleemFormFields, { config, dhData: data, initialData: isEdit ? data : {} }),
                h('div', { className: 'modal-footer' },
                    h('button', { 
                        type: 'button', 
                        className: 'btn btn-secondary', 
                        onClick: closeModal 
                    }, 'Annuleren'),
                    h('button', { 
                        type: 'submit', 
                        className: 'btn btn-primary' 
                    }, isEdit ? 'Bijwerken' : 'Opslaan')
                )
            )
        )
    );
};

export default {
    DHFormFields,
    ProbleemFormFields,
    SubmissionModal
};