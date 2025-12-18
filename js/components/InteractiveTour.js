const { createElement: h, useState, useEffect } = window.React;

export const InteractiveTour = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            target: '.portal-header',
            title: 'Welkom',
            content: 'Welkom op het portaal! Hier vindt u een overzicht van alle handhavingslocaties en problemen.'
        },
        {
            target: '.recent-changes-bar',
            title: 'Recente Activiteit',
            content: 'Hier ziet u in één oogopslag wat er recent is gewijzigd of toegevoegd. Klik op een kaart om direct naar het item te gaan.'
        },
        {
            target: '.content-area',
            title: 'Details & Statistieken',
            content: 'Hier ziet u de details. Bovenin staan statistieken (tegels). Deze zijn klikbaar! Klik op "Actieve Problemen" om direct naar locaties met problemen te gaan.'
        },
        {
            target: '.detail-card.warning',
            title: 'Interactieve Statistieken',
            content: 'Probeer het eens: klik op deze tegel om te filteren op actieve problemen.',
            condition: () => document.querySelector('.detail-card.warning') !== null
        },
        {
            target: '.sidebar',
            title: 'Navigatie',
            content: 'Gebruik de boomstructuur om door gemeentes en locaties te bladeren. U kunt ook zoeken op naam.'
        },
        {
            target: '.tree-item.gemeente',
            title: 'Stap 1: Gemeente Selecteren',
            content: 'Klik op een gemeente (bijv. Amsterdam) om de onderliggende locaties te zien. Klik op het pijltje om uit te klappen.'
        },
        {
            target: '.tree-item.locatie',
            title: 'Stap 2: Locatie Selecteren',
            content: 'Klik op een locatie om de details en eventuele problemen te bekijken. Locaties met actieve problemen zijn rood gemarkeerd.',
            condition: () => document.querySelector('.tree-item.locatie') !== null
        },
        {
            target: '.admin-menu',
            title: 'Beheer',
            content: 'Voor beheerders: hier vindt u de knoppen om nieuwe items toe te voegen of te wijzigen.',
            condition: () => document.querySelector('.admin-menu') !== null
        }
    ];

    // Filter steps based on condition
    const activeSteps = steps.filter(step => !step.condition || step.condition());

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const step = activeSteps[currentStep];
    const targetEl = document.querySelector(step.target);
    
    if (!targetEl) {
        // Skip step if target not found (fallback)
        if (currentStep < activeSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
        return null;
    }

    const rect = targetEl.getBoundingClientRect();
    const isLastStep = currentStep === activeSteps.length - 1;

    return h('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 4000 } },
        // Backdrop with hole
        h('div', { style: { 
            position: 'absolute', inset: 0, 
            background: 'rgba(0,0,0,0.6)',
            clipPath: `polygon(
                0% 0%, 0% 100%, 
                ${rect.left}px 100%, 
                ${rect.left}px ${rect.top}px, 
                ${rect.right}px ${rect.top}px, 
                ${rect.right}px ${rect.bottom}px, 
                ${rect.left}px ${rect.bottom}px, 
                ${rect.left}px 100%, 
                100% 100%, 100% 0%
            )`
        }}),
        
        // Highlight border
        h('div', { style: {
            position: 'absolute',
            top: rect.top - 4, left: rect.left - 4,
            width: rect.width + 8, height: rect.height + 8,
            border: '2px solid #3b82f6', borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3)',
            pointerEvents: 'none',
            transition: 'all 0.3s ease'
        }}),

        // Tooltip Card
        h('div', { style: {
            position: 'absolute',
            top: rect.bottom + 20 > window.innerHeight - 200 ? rect.top - 200 : rect.bottom + 20,
            left: Math.max(20, Math.min(window.innerWidth - 320, rect.left)),
            width: '300px',
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            zIndex: 4001
        }},
            h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                h('h3', { style: { margin: 0, fontSize: '16px', color: '#1e293b' } }, step.title),
                h('span', { style: { fontSize: '12px', color: '#94a3b8' } }, `${currentStep + 1} / ${activeSteps.length}`)
            ),
            h('p', { style: { fontSize: '14px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' } }, step.content),
            h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                h('button', {
                    onClick: onClose,
                    style: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }
                }, 'Overslaan'),
                h('div', { style: { display: 'flex', gap: '8px' } },
                    currentStep > 0 && h('button', {
                        onClick: () => setCurrentStep(currentStep - 1),
                        style: { padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#475569' }
                    }, 'Vorige'),
                    h('button', {
                        onClick: () => isLastStep ? onClose() : setCurrentStep(currentStep + 1),
                        style: { padding: '6px 16px', background: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontWeight: '600' }
                    }, isLastStep ? 'Klaar' : 'Volgende')
                )
            )
        )
    );
};
