<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DDH Relatie Beheer</title>
    
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9; margin: 0; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { margin-top: 0; color: #1e293b; }
        .controls { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 6px; display: flex; gap: 10px; align-items: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; font-weight: 600; color: #475569; }
        tr:hover { background: #f1f5f9; }
        
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .status-ok { background: #dcfce7; color: #166534; }
        .status-error { background: #fee2e2; color: #991b1b; }
        
        select { padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; width: 100%; max-width: 400px; }
        button { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; transition: background 0.2s; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }
        .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
        
        .loading { text-align: center; padding: 40px; color: #64748b; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="module">
        import { DDH_CONFIG } from './js/config/index.js';
        import { createDDHDataService } from './js/services/ddhDataService.js';
        import { RelatieHelpers } from './js/config/relaties.js';

        const h = React.createElement;
        const useState = React.useState;
        const useEffect = React.useEffect;

        function App() {
            const [loading, setLoading] = useState(true);
            const [locations, setLocations] = useState([]);
            const [problems, setProblems] = useState([]);
            const [filter, setFilter] = useState('all'); // all, unlinked
            const [saving, setSaving] = useState(null); // ID of problem being saved

            const dataService = React.useMemo(() => createDDHDataService(DDH_CONFIG), []);

            useEffect(() => {
                loadData();
            }, []);

            const loadData = async () => {
                setLoading(true);
                try {
                    // Fetch Locations (DDH)
                    // We need to ensure we get the calculated field 'gemeenteID'
                    const dhUrl = DDH_CONFIG.lijsten.digitaleHandhaving.endpoints.alleItems() + '?$select=*,gemeenteID&$top=5000';
                    const dhRes = await fetch(dhUrl, { headers: DDH_CONFIG.headers.get });
                    const dhData = await dhRes.json();
                    const locs = dhData.d.results;

                    // Fetch Problems
                    const probUrl = DDH_CONFIG.lijsten.problemenPleeglocaties.endpoints.alleItems() + '?$top=5000';
                    const probRes = await fetch(probUrl, { headers: DDH_CONFIG.headers.get });
                    const probData = await probRes.json();
                    const probs = probData.d.results;

                    // Sort locations by gemeenteID for the dropdown
                    locs.sort((a, b) => (a.gemeenteID || '').localeCompare(b.gemeenteID || ''));

                    setLocations(locs);
                    setProblems(probs);
                } catch (err) {
                    console.error('Error loading data:', err);
                    alert('Fout bij laden data. Zie console.');
                } finally {
                    setLoading(false);
                }
            };

            const handleUpdate = async (problemId, newKey) => {
                if (!confirm(`Weet je zeker dat je probleem #${problemId} wilt koppelen aan "${newKey}"?`)) return;

                setSaving(problemId);
                try {
                    await dataService.updateProblem(problemId, {
                        ProbleemID: newKey
                    });
                    
                    // Update local state
                    setProblems(prev => prev.map(p => 
                        p.Id === problemId ? { ...p, ProbleemID: newKey } : p
                    ));
                    
                } catch (err) {
                    console.error('Error updating problem:', err);
                    alert('Fout bij opslaan. Zie console.');
                } finally {
                    setSaving(null);
                }
            };

            const getStatus = (problem) => {
                const pKey = RelatieHelpers.normaliseString(problem.ProbleemID);
                if (!pKey) return { type: 'error', label: 'Geen ID', match: null };

                // Check if it starts with any location key
                const match = locations.find(loc => {
                    const lKey = RelatieHelpers.normaliseString(loc.gemeenteID);
                    return lKey && pKey.startsWith(lKey);
                });
                
                if (match) {
                    return { type: 'ok', label: 'Gekoppeld', match: match.gemeenteID };
                }
                return { type: 'error', label: 'Niet gekoppeld', match: null };
            };

            const filteredProblems = problems.filter(p => {
                if (filter === 'all') return true;
                const status = getStatus(p);
                return status.type === 'error';
            });

            if (loading) return h('div', { className: 'loading' }, 'Data laden...');

            return h('div', { className: 'container' },
                h('h1', null, 'DDH Relatie Beheer'),
                h('p', null, 'Gebruik deze tool om problemen correct te koppelen aan DDH locaties.'),
                
                h('div', { className: 'controls' },
                    h('label', null, 
                        h('input', { 
                            type: 'radio', 
                            name: 'filter', 
                            checked: filter === 'all',
                            onChange: () => setFilter('all')
                        }),
                        ' Alle Problemen'
                    ),
                    h('label', null, 
                        h('input', { 
                            type: 'radio', 
                            name: 'filter', 
                            checked: filter === 'unlinked',
                            onChange: () => setFilter('unlinked')
                        }),
                        ' Alleen Ongekoppeld'
                    ),
                    h('span', { style: { marginLeft: 'auto', color: '#64748b' } }, 
                        `${filteredProblems.length} items getoond`
                    )
                ),

                h('table', null,
                    h('thead', null,
                        h('tr', null,
                            h('th', null, 'ID'),
                            h('th', null, 'Gemeente'),
                            h('th', null, 'Beschrijving'),
                            h('th', null, 'Huidige Sleutel (ProbleemID)'),
                            h('th', null, 'Status / Match'),
                            h('th', null, 'Nieuwe Koppeling (Selecteer DDH Locatie)'),
                            h('th', null, 'Actie')
                        )
                    ),
                    h('tbody', null,
                        filteredProblems.map(problem => {
                            const status = getStatus(problem);
                            // Find the best matching location to pre-select in dropdown if possible
                            // or just use the current value if it matches exactly
                            
                            return h(ProblemRow, {
                                key: problem.Id,
                                problem,
                                locations,
                                status,
                                onSave: handleUpdate,
                                isSaving: saving === problem.Id
                            });
                        })
                    )
                )
            );
        }

        function ProblemRow({ problem, locations, status, onSave, isSaving }) {
            const [selectedLoc, setSelectedLoc] = useState(problem.ProbleemID || '');
            const [hasChanged, setHasChanged] = useState(false);

            const handleChange = (e) => {
                setSelectedLoc(e.target.value);
                setHasChanged(true);
            };

            return h('tr', null,
                h('td', null, problem.Id),
                h('td', null, problem.Gemeente),
                h('td', null, 
                    h('div', { style: { fontWeight: 'bold' } }, problem.Title),
                    h('div', { style: { fontSize: '12px', color: '#64748b' } }, problem.Probleembeschrijving)
                ),
                h('td', null, 
                    h('code', { style: { background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' } }, 
                        problem.ProbleemID || '-'
                    )
                ),
                h('td', null,
                    h('div', null, h('span', { className: `status-badge status-${status.type}` }, status.label)),
                    status.match && h('div', { style: { fontSize: '11px', color: '#166534', marginTop: '4px' } }, 
                        `Match: ${status.match}`
                    )
                ),
                h('td', null,
                    h('select', { value: selectedLoc, onChange: handleChange },
                        h('option', { value: '' }, '-- Selecteer Locatie --'),
                        locations.map(loc => 
                            h('option', { key: loc.Id, value: loc.gemeenteID }, loc.gemeenteID)
                        )
                    )
                ),
                h('td', null,
                    h('button', { 
                        className: 'btn-primary',
                        disabled: !hasChanged || isSaving,
                        onClick: () => onSave(problem.Id, selectedLoc)
                    }, isSaving ? 'Bezig...' : 'Opslaan')
                )
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(h(App));
    </script>
</body>
</html>