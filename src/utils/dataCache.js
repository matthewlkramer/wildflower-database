// src/utils/dataCache.js
// Simple in-memory cache for application data

class DataCache {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.errors = new Map();
    this.timestamps = new Map();
    
    // Cache timeout (5 minutes)
    this.CACHE_TIMEOUT = 5 * 60 * 1000;
  }

  // Generate cache key
  getCacheKey(type, options = {}) {
    const optionsStr = Object.keys(options).length > 0 ? JSON.stringify(options) : '';
    return `${type}${optionsStr}`;
  }

  // Check if cache is valid (not expired)
  isCacheValid(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return false;
    
    return Date.now() - timestamp < this.CACHE_TIMEOUT;
  }

  // Get cached data
  get(type, options = {}) {
    const key = this.getCacheKey(type, options);
    
    if (this.isCacheValid(key)) {
      // Cache HIT
      return {
        data: this.cache.get(key),
        loading: false,
        error: this.errors.get(key) || null,
        fromCache: true
      };
    }
    
    // Cache MISS
    return null;
  }

  // Set cached data
  set(type, data, options = {}, error = null) {
    const key = this.getCacheKey(type, options);
    
    this.cache.set(key, data);
    this.errors.set(key, error);
    this.timestamps.set(key, Date.now());
    this.loading.set(key, false);
    
    // Cached data
  }

  // Set loading state
  setLoading(type, isLoading, options = {}) {
    const key = this.getCacheKey(type, options);
    this.loading.set(key, isLoading);
  }

  // Get loading state
  isLoading(type, options = {}) {
    const key = this.getCacheKey(type, options);
    return this.loading.get(key) || false;
  }

  // Invalidate specific cache entry
  invalidate(type, options = {}) {
    const key = this.getCacheKey(type, options);
    
    this.cache.delete(key);
    this.loading.delete(key);
    this.errors.delete(key);
    this.timestamps.delete(key);
    
    // Invalidated cache
  }

  // Invalidate all cache entries for a type
  invalidateType(type) {
    const keysToDelete = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(type)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.loading.delete(key);
      this.errors.delete(key);
      this.timestamps.delete(key);
    });
    
    // Invalidated all cache entries for type
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.loading.clear();
    this.errors.clear();
    this.timestamps.clear();
    
    // Cleared all cache
  }

  // Get cache stats
  getStats() {
    return {
      totalEntries: this.cache.size,
      types: [...new Set([...this.cache.keys()].map(key => key.split('{')[0]))],
      oldestEntry: Math.min(...this.timestamps.values()),
      newestEntry: Math.max(...this.timestamps.values())
    };
  }
}

// Create singleton instance
export const dataCache = new DataCache();

// Cache keys constants
export const CACHE_KEYS = {
  SCHOOLS: 'schools',
  EDUCATORS: 'educators',
  CHARTERS: 'charters',
  EDUCATORS_X_SCHOOLS: 'educatorsXSchools',
  SCHOOL_LOCATIONS: 'schoolLocations',
  SCHOOL_NOTES: 'schoolNotes',
  ACTION_STEPS: 'actionSteps',
  GOVERNANCE_DOCS: 'governanceDocs',
  GUIDE_ASSIGNMENTS: 'guideAssignments',
  GRANTS: 'grants',
  LOANS: 'loans',
  MEMBERSHIP_FEES: 'membershipFees',
  EMAIL_ADDRESSES: 'emailAddresses',
  SSJ_FORMS: 'ssjForms',
  MONTESSORI_CERTS: 'montessoriCerts',
  EDUCATOR_NOTES: 'educatorNotes',
  EVENT_ATTENDANCE: 'eventAttendance'
};