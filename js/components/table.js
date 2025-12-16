/**
 * DDH - Digitale Handhaving
 * Table Components Module
 * 
 * Modular table rendering components for DDH data display
 * Uses React createElement (h) for pure JS approach
 * 
 * @module components/table
 */

// React is available globally via window
const { createElement: h } = window.React;

import { 
    IconExpand, 
    IconCollapse, 
    IconDocument, 
    IconReport, 
    IconLocation, 
    IconProblem 
} from './icons.js';

/**
 * Formats date string to Dutch locale
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Renders status badge with appropriate styling
 * @param {string} status - Status value
 * @returns {React.Element} Status badge component
 */
export const renderStatusBadge = (status) => {
    const className = `status-badge status-${(status || '').toLowerCase().replace(/\s+/g, '-')}`;
    return h('span', { className }, status || '-');
};

/**
 * Renders location information panel in expanded rows
 * @param {Object} dh - Digitale Handhaving location data
 * @returns {React.Element} Location info component
 */
export const renderLocationInfo = (dh) => {
    const links = [];
    
    // Add links if they exist
    if (dh.Link_x0020_Algemeen_x0020_PV?.Url) {
        links.push(h('a', {
            key: 'algemeen-pv',
            href: dh.Link_x0020_Algemeen_x0020_PV.Url,
            target: '_blank',
            className: 'location-link'
        }, IconDocument(), 'Algemeen PV'));
    }
    
    if (dh.Link_x0020_Schouwrapporten?.Url) {
        links.push(h('a', {
            key: 'schouwrapporten',
            href: dh.Link_x0020_Schouwrapporten.Url,
            target: '_blank',
            className: 'location-link'
        }, IconReport(), 'Schouwrapporten'));
    }
    
    if (dh.Instemmingsbesluit?.Url) {
        links.push(h('a', {
            key: 'instemmingsbesluit',
            href: dh.Instemmingsbesluit.Url,
            target: '_blank',
            className: 'location-link'
        }, IconDocument(), 'Instemmingsbesluit'));
    }

    return h('div', { className: 'location-info' },
        h('h3', null, IconLocation(), dh.Title, ' - ', dh.Gemeente),
        h('div', { className: 'location-details' },
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Status B&S'),
                h('div', { className: 'location-detail-value' }, renderStatusBadge(dh.Status_x0020_B_x0026_S))
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Feitcodegroep'),
                h('div', { className: 'location-detail-value' }, dh.Feitcodegroep || '-')
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Waarschuwingsperiode'),
                h('div', { className: 'location-detail-value' }, dh.Waarschuwingsperiode || '-')
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Start Waarschuwing'),
                h('div', { className: 'location-detail-value' }, formatDate(dh.Start_x0020_Waarschuwingsperiode))
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Einde Waarschuwing'),
                h('div', { className: 'location-detail-value' }, formatDate(dh.Einde_x0020_Waarschuwingsperiode))
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Laatste Schouw'),
                h('div', { className: 'location-detail-value' }, formatDate(dh.Laatste_x0020_schouw))
            ),
            h('div', { className: 'location-detail' },
                h('div', { className: 'location-detail-label' }, 'Contactpersoon'),
                h('div', { className: 'location-detail-value' }, dh.E_x002d_mailadres_x0020_contactp || '-')
            )
        ),
        links.length > 0 && h('div', { className: 'location-links' }, ...links)
    );
};

/**
 * Renders individual problem card
 * @param {Object} problem - Problem data
 * @returns {React.Element} Problem card component
 */
export const renderProblemCard = (problem) => {
    const statusClass = `problem-card status-${(problem.Opgelost_x003f_ || '').toLowerCase().replace(/\s+/g, '-')}`;
    
    return h('div', { key: problem.Id, className: statusClass },
        h('div', { className: 'problem-header' },
            h('div', { className: 'problem-title' }, problem.Feitcodegroep || 'Algemeen'),
            h('div', { className: 'problem-date' }, formatDate(problem.Aanmaakdatum))
        ),
        h('div', { className: 'problem-description' }, problem.Probleembeschrijving || 'Geen beschrijving'),
        h('div', { className: 'problem-meta' },
            h('div', { className: 'problem-category' }, renderStatusBadge(problem.Opgelost_x003f_)),
            problem.Actie_x0020_Beoordelaars && h('div', { className: 'problem-category' }, problem.Actie_x0020_Beoordelaars),
            problem.Eigenaar?.Title && h('div', { className: 'problem-category' }, `Eigenaar: ${problem.Eigenaar.Title}`)
        )
    );
};

/**
 * Renders expanded child row content
 * @param {Object} props - Component props
 * @param {Object} props.dh - DH location data
 * @returns {React.Element} Child row content
 */
export const renderChildContent = ({ dh }) => {
    return h('div', { className: 'child-container' },
        renderLocationInfo(dh),
        h('div', { className: 'section-title' },
            IconProblem(),
            `Gemelde Problemen (${dh.problemen.length})`
        ),
        h('div', { className: 'problems-grid' },
            ...dh.problemen.map(renderProblemCard)
        )
    );
};

/**
 * Main table component for DDH data
 * @param {Object} props - Component props
 * @param {Array} props.data - DDH data array
 * @param {Set} props.expandedRows - Set of expanded row IDs
 * @param {Function} props.toggleRow - Function to toggle row expansion
 * @param {Function} props.onNewProblem - Handler for new problem button
 * @returns {React.Element} Table component
 */
export const DDHTable = ({ data, expandedRows, toggleRow, onNewProblem }) => {
    const renderTableRows = () => {
        const rows = [];
        
        data.forEach(dh => {
            const isExpanded = expandedRows.has(dh.Id);
            const hasProblemen = dh.problemen && dh.problemen.length > 0;

            // Main row
            rows.push(h('tr', { 
                key: dh.Id, 
                className: `dh-row ${hasProblemen ? 'expandable' : ''}`, 
                onClick: () => hasProblemen && toggleRow(dh.Id) 
            },
                h('td', { style: { display: 'flex', alignItems: 'center' } }, 
                    h('span', { className: `expander ${isExpanded ? 'expanded' : ''}` }, 
                        hasProblemen ? (isExpanded ? IconCollapse() : IconExpand()) : null
                    ),
                    h('span', { style: { fontWeight: hasProblemen ? '600' : 'normal' } }, dh.Title)
                ),
                h('td', null, dh.Gemeente),
                h('td', null, renderStatusBadge(dh.Status_x0020_B_x0026_S)),
                h('td', null, dh.Waarschuwingsperiode),
                h('td', null, 
                    h('span', { 
                        style: { 
                            color: hasProblemen ? '#d83b01' : '#666',
                            fontWeight: hasProblemen ? '600' : 'normal'
                        } 
                    }, dh.problemen?.length || 0)
                ),
                h('td', null, 
                    h('button', { 
                        className: 'btn btn-secondary', 
                        onClick: (e) => {
                            e.stopPropagation();
                            onNewProblem(dh);
                        }
                    }, 'Nieuw Probleem')
                )
            ));

            // Expanded child row
            if (isExpanded && hasProblemen) {
                rows.push(h('tr', { key: `child-${dh.Id}`, className: 'child-row' },
                    h('td', { colSpan: 6, className: 'child-content' },
                        renderChildContent({ dh })
                    )
                ));
            }
        });
        
        return rows;
    };

    return h('div', { className: 'data-tabel-container' },
        h('table', { className: 'data-tabel' },
            h('thead', null, h('tr', null,
                h('th', null, 'Locatie'),
                h('th', null, 'Gemeente'),
                h('th', null, 'Status B&S'),
                h('th', null, 'Waarschuwing'),
                h('th', null, 'Problemen'),
                h('th', null, 'Acties')
            )),
            h('tbody', null, renderTableRows())
        )
    );
};

export default {
    DDHTable,
    renderLocationInfo,
    renderProblemCard,
    renderChildContent,
    renderStatusBadge,
    formatDate
};