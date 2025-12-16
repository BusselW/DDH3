/**
 * DDH Footer Navigation Component
 * React component for page navigation footer
 */

import { 
    navigateToNext, 
    navigateToPrevious, 
    getCurrentPageInfo 
} from './pageNavigation.js';

const FooterNavigation = () => {
    const { createElement: h, useState, useEffect } = window.React;
    
    const [pageInfo, setPageInfo] = useState(getCurrentPageInfo());
    const [isNavigating, setIsNavigating] = useState(false);
    
    useEffect(() => {
        setPageInfo(getCurrentPageInfo());
    }, []);
    
    const handleNext = async () => {
        setIsNavigating(true);
        try {
            await navigateToNext();
        } catch (error) {
            console.error('Navigation error:', error);
            setIsNavigating(false);
        }
    };
    
    const handlePrevious = async () => {
        setIsNavigating(true);
        try {
            await navigateToPrevious();
        } catch (error) {
            console.error('Navigation error:', error);
            setIsNavigating(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            handlePrevious();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            handleNext();
        }
    };
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);
    
    return h('footer', {
        style: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            fontSize: '14px',
            fontFamily: 'monospace',
            borderTop: '2px solid #333'
        }
    },
        // Left side - Previous button
        h('div', {
            style: { display: 'flex', alignItems: 'center', gap: '10px' }
        },
            h('button', {
                onClick: handlePrevious,
                disabled: isNavigating,
                style: {
                    backgroundColor: '#007aff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: isNavigating ? 'not-allowed' : 'pointer',
                    opacity: isNavigating ? 0.6 : 1,
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            }, '← Vorige (A)'),
            h('span', { style: { color: '#ccc' } }, 'Gebruik pijltjestoetsen of A/D om te navigeren')
        ),
        
        // Center - Page info
        h('div', {
            style: { 
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #444'
            }
        },
            h('div', { style: { fontWeight: 'bold', marginBottom: '2px' } }, pageInfo.title),
            h('div', { style: { fontSize: '11px', color: '#ccc' } }, `Pagina ${pageInfo.index} van ${pageInfo.total}`)
        ),
        
        // Right side - Next button
        h('div', {
            style: { display: 'flex', alignItems: 'center', gap: '10px' }
        },
            h('span', { style: { color: '#ccc' } }, 'Tijdelijke Demo Modus'),
            h('button', {
                onClick: handleNext,
                disabled: isNavigating,
                style: {
                    backgroundColor: '#007aff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: isNavigating ? 'not-allowed' : 'pointer',
                    opacity: isNavigating ? 0.6 : 1,
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            }, 'Volgende (D) →')
        )
    );
};

export default FooterNavigation;