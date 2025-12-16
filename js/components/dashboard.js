/**
 * DDH - Digitale Handhaving
 * Dashboard Component Module
 * 
 * Main dashboard component that orchestrates the entire application
 * Uses React createElement (h) for pure JS approach
 * 
 * @module components/dashboard
 */

// React is available globally via window
const { createElement: h, useState, useEffect, useCallback } = window.React;

import { SubmissionModal } from './forms.js';
import { DDHTable } from './table.js';
import { IconPlus } from './icons.js';

/**
 * Main DDH Dashboard Component
 * @param {Object} props - Component props
 * @param {Object} props.config - DDH configuration object
 * @param {Object} props.dataService - Data service instance
 * @returns {React.Element} Dashboard component
 */
export const DDHDashboard = ({ config, dataService }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [modalConfig, setModalConfig] = useState(null);

    /**
     * Fetch data from the data service
     */
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await dataService.fetchAll();
            setData(result);
        } catch (err) {
            console.error("Fout bij ophalen data:", err);
            setError(err.message || 'Kon data niet laden.');
        } finally {
            setLoading(false);
        }
    }, [dataService]);

    // Initial data load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Handle form submission for both DH locations and problems
     * @param {string} type - 'dh' or 'probleem'
     * @param {Object} submissionData - Form data
     * @param {number} id - ID for updates (optional)
     */
    const handleFormSubmit = async (type, submissionData, id = null) => {
        console.log("Submitting:", type, submissionData, id);
        try {
            if (type === 'dh') {
                if (id) {
                    await dataService.updateDH(id, submissionData);
                } else {
                    await dataService.addDH(submissionData);
                }
            } else {
                if (id) {
                    await dataService.updateProblem(id, submissionData);
                } else {
                    await dataService.addProblem(submissionData);
                }
            }
            setModalConfig(null);
            fetchData(); // Refresh data after submission
        } catch (err) {
            console.error("Fout bij opslaan data:", err);
            alert(`Fout bij opslaan: ${err.message}`);
        }
    };

    /**
     * Toggle row expansion
     * @param {number} id - Row ID to toggle
     */
    const toggleRow = (id) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id);
        } else {
            newExpandedRows.add(id);
        }
        setExpandedRows(newExpandedRows);
    };

    /**
     * Handle new problem button click
     * @param {Object} dh - DH location data
     */
    const handleNewProblem = (dh) => {
        setModalConfig({ type: 'probleem', data: dh });
    };

    /**
     * Handle new DH location button click
     */
    const handleNewDHLocation = () => {
        setModalConfig({ type: 'dh', data: {} });
    };

    // Loading state
    if (loading) {
        return h('div', { className: 'loading-overlay' }, 'Data wordt geladen...');
    }

    // Error state
    if (error) {
        return h('div', { className: 'error-overlay' }, 
            h('div', null, `Fout: ${error}`),
            h('button', { 
                className: 'btn btn-primary', 
                onClick: fetchData,
                style: { marginTop: '10px' }
            }, 'Opnieuw proberen')
        );
    }

    // Main render
    return h('div', { className: 'ddh-app' },
        // Modal
        h(SubmissionModal, { 
            modalConfig, 
            closeModal: () => setModalConfig(null), 
            onFormSubmit: handleFormSubmit,
            config
        }),
        
        // Header
        h('header', { className: 'ddh-header' },
            h('h1', null, 'DDH Unified Dashboard'),
            h('p', null, 'Overzicht van handhavingslocaties en gerelateerde problemen')
        ),
        
        // Top actions
        h('div', { className: 'top-actions' },
            h('button', { 
                className: 'btn btn-primary',
                onClick: handleNewDHLocation
            }, IconPlus(), 'Nieuwe Handhavingslocatie')
        ),
        
        // Main content
        h('main', { className: 'ddh-content' },
            h('h2', null, 
                'Handhavingslocaties',
                h('span', { className: 'hint' }, '(klik op een rij om problemen te tonen)')
            ),
            h(DDHTable, {
                data,
                expandedRows,
                toggleRow,
                onNewProblem: handleNewProblem
            })
        )
    );
};

export default DDHDashboard;