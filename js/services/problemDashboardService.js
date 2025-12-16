/**
 * DDH - Problem Dashboard Data Service
 * Optimized data loading and caching for problem-focused dashboards
 * 
 * Provides efficient data retrieval with caching, filtering, and transformation
 * specifically designed for the three dashboard designs.
 * 
 * @module services/problemDashboardService
 */

import { DDH_CONFIG } from '../config/index.js';

/**
 * Problem Dashboard Service
 * Handles all data operations for problem-focused dashboards
 */
export class ProblemDashboardService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.lastFetch = null;
        this.isLoading = false;
    }

    /**
     * Get fresh data with caching support
     * @param {boolean} forceRefresh - Force refresh even if cache is valid
     * @returns {Promise<Array>} Array of locations with problems
     */
    async fetchData(forceRefresh = false) {
        const now = Date.now();
        const cacheKey = 'dashboard_data';
        
        // Check cache validity
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheTimeout) {
                console.log('📦 Using cached dashboard data');
                return cached.data;
            }
        }

        // Prevent multiple simultaneous requests
        if (this.isLoading) {
            return this.waitForLoad();
        }

        this.isLoading = true;
        console.log('🔄 Fetching fresh dashboard data...');

        try {
            const startTime = performance.now();
            
            // Use the optimized query that fetches everything with relationships
            const rawData = await DDH_CONFIG.queries.haalAllesMetRelaties({
                includeProblemenDetails: true
            });

            // Transform and enrich the data
            const enrichedData = this.enrichData(rawData);
            
            const loadTime = Math.round(performance.now() - startTime);
            console.log(`✅ Dashboard data loaded in ${loadTime}ms`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: enrichedData,
                timestamp: now
            });

            this.lastFetch = now;
            return enrichedData;

        } catch (error) {
            console.error('❌ Error fetching dashboard data:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Wait for ongoing load operation
     * @returns {Promise<Array>} Data when loading completes
     */
    async waitForLoad() {
        const maxWait = 30000; // 30 seconds max wait
        const startWait = Date.now();
        
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (!this.isLoading) {
                    clearInterval(checkInterval);
                    const cached = this.cache.get('dashboard_data');
                    resolve(cached ? cached.data : []);
                } else if (Date.now() - startWait > maxWait) {
                    clearInterval(checkInterval);
                    reject(new Error('Data loading timeout'));
                }
            }, 100);
        });
    }

    /**
     * Enrich raw data with calculated fields and metadata
     * @param {Array} rawData - Raw data from SharePoint
     * @returns {Array} Enriched data
     */
    enrichData(rawData) {
        return rawData.map(location => {
            const problems = location.problemen || [];
            
            // Calculate problem statistics
            const problemStats = this.calculateProblemStats(problems);
            
            // Add visual indicators
            const hasActiveProblems = problems.some(p => p.Opgelost_x003f_ !== 'Opgelost');
            const hasUrgentProblems = problems.some(p => this.isUrgentProblem(p));
            
            // Enrich each problem with metadata
            const enrichedProblems = problems.map(problem => ({
                ...problem,
                // Add calculated fields
                daysSinceCreated: Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24)),
                priority: this.calculatePriority(problem),
                isUrgent: this.isUrgentProblem(problem),
                isOverdue: this.isOverdueProblem(problem),
                statusColor: this.getStatusColor(problem.Opgelost_x003f_),
                
                // Location context
                locationTitle: location.Title,
                gemeente: location.Gemeente,
                
                // Search-friendly fields
                searchText: `${problem.Probleembeschrijving} ${problem.Feitcodegroep} ${location.Title} ${location.Gemeente}`.toLowerCase()
            }));

            return {
                ...location,
                problemen: enrichedProblems,
                
                // Location statistics
                ...problemStats,
                hasActiveProblems,
                hasUrgentProblems,
                
                // Visual indicators
                statusIndicator: this.getLocationStatusIndicator(location, problemStats),
                priorityLevel: this.getLocationPriorityLevel(problemStats),
                
                // Search-friendly field
                searchText: `${location.Title} ${location.Gemeente} ${location.Feitcodegroep}`.toLowerCase()
            };
        });
    }

    /**
     * Calculate problem statistics for a location
     * @param {Array} problems - Array of problems
     * @returns {Object} Statistics object
     */
    calculateProblemStats(problems) {
        const stats = {
            totalProblems: problems.length,
            activeProblems: 0,
            resolvedProblems: 0,
            urgentProblems: 0,
            overdueProblems: 0,
            averageAge: 0,
            statusBreakdown: {},
            categoryBreakdown: {}
        };

        if (problems.length === 0) return stats;

        let totalAge = 0;

        problems.forEach(problem => {
            const status = problem.Opgelost_x003f_ || 'Onbekend';
            const category = problem.Feitcodegroep || 'Onbekend';
            const age = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
            
            totalAge += age;
            
            // Status counting
            if (status !== 'Opgelost') stats.activeProblems++;
            else stats.resolvedProblems++;
            
            stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1;
            stats.categoryBreakdown[category] = (stats.categoryBreakdown[category] || 0) + 1;
            
            // Urgency and overdue checking
            if (this.isUrgentProblem(problem)) stats.urgentProblems++;
            if (this.isOverdueProblem(problem)) stats.overdueProblems++;
        });

        stats.averageAge = Math.round(totalAge / problems.length);
        
        return stats;
    }

    /**
     * Calculate priority based on problem age and status
     * @param {Object} problem - Problem object
     * @returns {string} Priority level
     */
    calculatePriority(problem) {
        const daysSinceCreated = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
        const status = problem.Opgelost_x003f_;
        
        if (status === 'Opgelost') return 'resolved';
        if (status === 'Aangemeld' && daysSinceCreated > 14) return 'critical';
        if (status === 'Aangemeld' && daysSinceCreated > 7) return 'high';
        if (status === 'In behandeling' && daysSinceCreated > 21) return 'high';
        if (status === 'In behandeling') return 'medium';
        return 'low';
    }

    /**
     * Check if problem is urgent
     * @param {Object} problem - Problem object
     * @returns {boolean} True if urgent
     */
    isUrgentProblem(problem) {
        const daysSinceCreated = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
        const status = problem.Opgelost_x003f_;
        
        return (status === 'Aangemeld' && daysSinceCreated > 10) ||
               (status === 'In behandeling' && daysSinceCreated > 21);
    }

    /**
     * Check if problem is overdue
     * @param {Object} problem - Problem object
     * @returns {boolean} True if overdue
     */
    isOverdueProblem(problem) {
        const daysSinceCreated = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
        return daysSinceCreated > 30;
    }

    /**
     * Get status color for visual representation
     * @param {string} status - Problem status
     * @returns {string} Color code
     */
    getStatusColor(status) {
        const colors = {
            'Aangemeld': '#ffc107',
            'In behandeling': '#007bff',
            'Uitgezet bij OI': '#28a745',
            'Opgelost': '#6c757d'
        };
        return colors[status] || '#868e96';
    }

    /**
     * Get location status indicator
     * @param {Object} location - Location object
     * @param {Object} stats - Problem statistics
     * @returns {string} Status indicator
     */
    getLocationStatusIndicator(location, stats) {
        if (stats.urgentProblems > 0) return 'urgent';
        if (stats.activeProblems > 3) return 'busy';
        if (stats.activeProblems > 0) return 'active';
        return 'normal';
    }

    /**
     * Get location priority level
     * @param {Object} stats - Problem statistics
     * @returns {string} Priority level
     */
    getLocationPriorityLevel(stats) {
        if (stats.urgentProblems > 2) return 'critical';
        if (stats.urgentProblems > 0 || stats.activeProblems > 5) return 'high';
        if (stats.activeProblems > 2) return 'medium';
        return 'low';
    }

    /**
     * Get filtered and sorted data for different dashboard views
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} Filtered data with metadata
     */
    async getFilteredData(filters = {}) {
        const {
            gemeente = null,
            status = null,
            category = null,
            priority = null,
            timeRange = null,
            searchTerm = null,
            sortBy = 'newest',
            limit = null
        } = filters;

        const data = await this.fetchData();
        let allProblems = [];
        
        // Flatten problems with location context
        data.forEach(location => {
            (location.problemen || []).forEach(problem => {
                allProblems.push({
                    ...problem,
                    locationData: location
                });
            });
        });

        // Apply filters
        let filtered = allProblems.filter(problem => {
            // Gemeente filter
            if (gemeente && problem.gemeente !== gemeente) return false;
            
            // Status filter
            if (status && problem.Opgelost_x003f_ !== status) return false;
            
            // Category filter
            if (category && problem.Feitcodegroep !== category) return false;
            
            // Priority filter
            if (priority && problem.priority !== priority) return false;
            
            // Time range filter
            if (timeRange) {
                const days = problem.daysSinceCreated;
                switch (timeRange) {
                    case 'recent': if (days > 7) return false; break;
                    case 'week': if (days < 7 || days > 14) return false; break;
                    case 'month': if (days < 30) return false; break;
                }
            }
            
            // Search term filter
            if (searchTerm && !problem.searchText.includes(searchTerm.toLowerCase())) return false;
            
            return true;
        });

        // Sort results
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.Aanmaakdatum) - new Date(a.Aanmaakdatum));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.Aanmaakdatum) - new Date(b.Aanmaakdatum));
                break;
            case 'priority':
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, resolved: 4 };
                filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'location':
                filtered.sort((a, b) => a.locationTitle.localeCompare(b.locationTitle));
                break;
        }

        // Apply limit
        if (limit && filtered.length > limit) {
            filtered = filtered.slice(0, limit);
        }

        return {
            problems: filtered,
            totalCount: allProblems.length,
            filteredCount: filtered.length,
            filters: filters,
            metadata: this.generateMetadata(filtered)
        };
    }

    /**
     * Generate metadata for filtered results
     * @param {Array} problems - Filtered problems
     * @returns {Object} Metadata object
     */
    generateMetadata(problems) {
        const metadata = {
            statusCounts: {},
            categoryCounts: {},
            priorityCounts: {},
            gemeenteCounts: {},
            averageAge: 0,
            oldestProblem: null,
            newestProblem: null
        };

        if (problems.length === 0) return metadata;

        let totalAge = 0;
        let oldest = problems[0];
        let newest = problems[0];

        problems.forEach(problem => {
            // Count by status
            const status = problem.Opgelost_x003f_ || 'Onbekend';
            metadata.statusCounts[status] = (metadata.statusCounts[status] || 0) + 1;
            
            // Count by category
            const category = problem.Feitcodegroep || 'Onbekend';
            metadata.categoryCounts[category] = (metadata.categoryCounts[category] || 0) + 1;
            
            // Count by priority
            metadata.priorityCounts[problem.priority] = (metadata.priorityCounts[problem.priority] || 0) + 1;
            
            // Count by gemeente
            metadata.gemeenteCounts[problem.gemeente] = (metadata.gemeenteCounts[problem.gemeente] || 0) + 1;
            
            // Age calculations
            totalAge += problem.daysSinceCreated;
            
            if (new Date(problem.Aanmaakdatum) < new Date(oldest.Aanmaakdatum)) {
                oldest = problem;
            }
            if (new Date(problem.Aanmaakdatum) > new Date(newest.Aanmaakdatum)) {
                newest = problem;
            }
        });

        metadata.averageAge = Math.round(totalAge / problems.length);
        metadata.oldestProblem = oldest;
        metadata.newestProblem = newest;

        return metadata;
    }

    /**
     * Get summary statistics for dashboard overview
     * @returns {Promise<Object>} Summary statistics
     */
    async getSummaryStats() {
        const data = await this.fetchData();
        
        const stats = {
            totalLocations: data.length,
            totalProblems: 0,
            activeProblems: 0,
            resolvedProblems: 0,
            urgentProblems: 0,
            averageProblemsPerLocation: 0,
            locationsWithProblems: 0,
            mostCommonCategory: null,
            mostProblematicLocation: null
        };

        let allProblems = [];
        let categoryCounts = {};
        let locationProblemCounts = {};

        data.forEach(location => {
            const problems = location.problemen || [];
            allProblems = allProblems.concat(problems);
            
            if (problems.length > 0) {
                stats.locationsWithProblems++;
                locationProblemCounts[location.Title] = problems.length;
            }

            problems.forEach(problem => {
                stats.totalProblems++;
                
                if (problem.Opgelost_x003f_ !== 'Opgelost') {
                    stats.activeProblems++;
                } else {
                    stats.resolvedProblems++;
                }
                
                if (this.isUrgentProblem(problem)) {
                    stats.urgentProblems++;
                }
                
                const category = problem.Feitcodegroep || 'Onbekend';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
        });

        // Calculate averages and find maximums
        if (stats.totalLocations > 0) {
            stats.averageProblemsPerLocation = Math.round(stats.totalProblems / stats.totalLocations * 10) / 10;
        }

        // Find most common category
        if (Object.keys(categoryCounts).length > 0) {
            const mostCommon = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
            stats.mostCommonCategory = mostCommon[0];
        }

        // Find most problematic location
        if (Object.keys(locationProblemCounts).length > 0) {
            const mostProblematic = Object.entries(locationProblemCounts).sort((a, b) => b[1] - a[1])[0];
            stats.mostProblematicLocation = mostProblematic[0];
        }

        return stats;
    }

    /**
     * Clear cache and force refresh
     */
    clearCache() {
        console.log('🗑️ Clearing dashboard cache');
        this.cache.clear();
        this.lastFetch = null;
    }

    /**
     * Get cache status
     * @returns {Object} Cache information
     */
    getCacheStatus() {
        const cacheKey = 'dashboard_data';
        const cached = this.cache.get(cacheKey);
        
        return {
            hasCachedData: !!cached,
            cacheAge: cached ? Date.now() - cached.timestamp : null,
            isValid: cached ? (Date.now() - cached.timestamp) < this.cacheTimeout : false,
            lastFetch: this.lastFetch,
            isLoading: this.isLoading
        };
    }
}

// Export singleton instance
export const problemDashboardService = new ProblemDashboardService();

// Export class for direct instantiation if needed
export default {
    ProblemDashboardService,
    problemDashboardService
};