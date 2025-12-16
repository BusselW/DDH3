/**
 * DDH - Digitale Handhaving
 * Icon Components Module
 * 
 * Centralized icon definitions using React createElement (h)
 * All icons are pure functions returning React elements
 * 
 * @module components/icons
 */

// React is available globally via window
const { createElement: h } = window.React;

/**
 * Expansion icon for expandable rows
 */
export const IconExpand = () => h('svg', { 
    viewBox: '0 0 24 24', 
    style: { color: '#0078d4', width: '16px', height: '16px', flexShrink: 0 } 
}, h('path', { 
    d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z', 
    fill: 'currentColor' 
}));

/**
 * Collapse icon for expanded rows
 */
export const IconCollapse = () => h('svg', { 
    viewBox: '0 0 24 24', 
    style: { color: '#d83b01', width: '16px', height: '16px', flexShrink: 0 } 
}, h('path', { 
    d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z', 
    fill: 'currentColor' 
}));

/**
 * Document icon for file links
 */
export const IconDocument = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '14px', height: '14px', flexShrink: 0 }
}, h('path', { 
    d: 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z' 
}));

/**
 * Report icon for reports and documentation
 */
export const IconReport = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '14px', height: '14px', flexShrink: 0 }
}, h('path', { 
    d: 'M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z' 
}));

/**
 * Location icon for geographic references
 */
export const IconLocation = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '16px', height: '16px', flexShrink: 0 }
}, h('path', { 
    d: 'M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z' 
}));

/**
 * Problem icon for issues and problems
 */
export const IconProblem = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '16px', height: '16px', flexShrink: 0 }
}, h('path', { 
    d: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.9,10.5 10,9.6 10,8.5C10,7.4 10.9,6.5 12,6.5C13.1,6.5 14,7.4 14,8.5C14,9.6 13.1,10.5 12,10.5Z' 
}));

/**
 * Plus icon for adding new items
 */
export const IconPlus = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '16px', height: '16px', flexShrink: 0 }
}, h('path', { 
    d: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' 
}));

/**
 * Close icon for modals and dismissible elements
 */
export const IconClose = () => h('svg', { 
    viewBox: '0 0 24 24', 
    fill: 'currentColor',
    style: { width: '16px', height: '16px', flexShrink: 0 }
}, h('path', { 
    d: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' 
}));

// Export all icons as default export for convenience
export default {
    IconExpand,
    IconCollapse,
    IconDocument,
    IconReport,
    IconLocation,
    IconProblem,
    IconPlus,
    IconClose
};