/**
 * DDH - Digitale Handhaving
 * Main Application Entry Point
 * 
 * Orchestrates the entire application startup and module loading
 * Uses React createElement (h) for pure JS approach
 * 
 * @module app
 */

// React is available globally via window
const { createElement: h } = window.React;
const { createRoot } = window.ReactDOM;

import { DDHDashboard } from './components/dashboard.js';
import { createDDHDataService } from './services/ddhDataService.js';
import { createMockDataService } from './services/mockDataService.js';
import { TEMP_PLACEHOLDER_DATA } from './components/pageNavigation.js';
import FooterNavigation from './components/FooterNavigation.js';

/**
 * Main application class
 */
export class DDHApp {
    constructor() {
        this.config = null;
        this.dataService = null;
        this.root = null;
    }

    /**
     * Initialize the application
     * @param {Object} config - DDH configuration object
     */
    async init(config) {
        try {
            console.log('Initializing DDH Application...');
            
            // Store configuration
            this.config = config;
            
            // Check if we're in mock mode (local testing)
            const isMockMode = config.sharepoint?.baseUrl?.includes('localhost') || 
                             config.sharepoint?.baseUrl?.includes('127.0.0.1');
            
            // Create data service
            if (isMockMode) {
                console.log('🧪 Using mock data service for local testing');
                this.dataService = createMockDataService();
            } else {
                this.dataService = createDDHDataService(config);
            }
            
            // Get root element
            const rootElement = document.getElementById('ddh-root');
            if (!rootElement) {
                throw new Error('Root element #ddh-root not found');
            }
            
            // Create React root
            this.root = createRoot(rootElement);
            
            // Render application
            this.render();
            
            console.log('DDH Application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize DDH Application:', error);
            this.renderError(error);
        }
    }

    /**
     * Render the main application
     */
    render() {
        if (!this.root) {
            throw new Error('Application not initialized');
        }
        
        // Create app wrapper with footer navigation
        const AppWithNavigation = () => {
            return h('div', null,
                h(DDHDashboard, {
                    config: this.config,
                    dataService: this.dataService
                }),
                h(FooterNavigation)
            );
        };
        
        this.root.render(h(AppWithNavigation));
    }

    /**
     * Render error state
     * @param {Error} error - Error object
     */
    renderError(error) {
        const rootElement = document.getElementById('ddh-root');
        if (rootElement) {
            rootElement.innerHTML = `
                <div class="ddh-app">
                    <div class="error-container">
                        <h3>Applicatie fout</h3>
                        <p>Er is een fout opgetreden bij het starten van de DDH applicatie.</p>
                        <p><strong>Fout:</strong> ${error.message}</p>
                        <details>
                            <summary>Technische details</summary>
                            <pre>${error.stack || error.toString()}</pre>
                        </details>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            Pagina herladen
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Refresh application data
     */
    refresh() {
        if (this.root && this.config && this.dataService) {
            this.render();
        }
    }
}

/**
 * Global application instance
 */
export const app = new DDHApp();

/**
 * Initialize DDH application
 * @param {Object} config - DDH configuration object
 */
export const initDDHApp = async (config) => {
    await app.init(config);
};

export default {
    DDHApp,
    app,
    initDDHApp
};