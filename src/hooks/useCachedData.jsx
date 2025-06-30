// src/hooks/useCachedData.jsx
// Cached versions of your data hooks

import { useState, useEffect, useCallback, useRef } from 'react';
import { dataCache, CACHE_KEYS } from '../utils/dataCache';
import { airtableService } from '../airtableService';

// Global cache for all locations/tables to prevent multiple fetches
const globalTableCache = {
  Locations: { data: null, loading: false, timestamp: 0 },
  'Action steps': { data: null, loading: false, timestamp: 0 },
  'Governance docs': { data: null, loading: false, timestamp: 0 },
  'Guides assignments': { data: null, loading: false, timestamp: 0 },
  'School notes': { data: null, loading: false, timestamp: 0 },
  'Grants': { data: null, loading: false, timestamp: 0 },
  'Loans': { data: null, loading: false, timestamp: 0 },
  'Membership fee overview': { data: null, loading: false, timestamp: 0 }
};

const GLOBAL_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Generic cached data hook
export const useCachedData = (cacheKey, fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use refs to prevent unnecessary re-fetches
  const fetchFunctionRef = useRef(fetchFunction);
  const optionsRef = useRef(options);
  const hasInitializedRef = useRef(false);
  
  // Update refs when values change
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      const currentOptions = optionsRef.current;
      
      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cached = dataCache.get(cacheKey, currentOptions);
        if (cached) {
          setData(cached.data || []);
          setLoading(false);
          setError(cached.error);
          return cached.data;
        }
      }

      // Check if already loading to prevent duplicate requests
      if (dataCache.isLoading(cacheKey, currentOptions)) {
        // Already loading, skip duplicate request
        return;
      }
      
      setLoading(true);
      setError(null);
      dataCache.setLoading(cacheKey, true, currentOptions);
      
      const result = await fetchFunctionRef.current();
      
      // Cache the result
      dataCache.set(cacheKey, result, currentOptions);
      
      setData(result || []);
      setLoading(false);
      
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      
      // Cache the error too
      dataCache.set(cacheKey, [], optionsRef.current, err);
      throw err;
    } finally {
      dataCache.setLoading(cacheKey, false, optionsRef.current);
    }
  }, [cacheKey]); // Remove fetchFunction and options from dependencies

  const prevOptionsKeyRef = useRef(JSON.stringify(options));
  
  useEffect(() => {
    // For school-specific hooks, skip if schoolId is explicitly null
    if ('schoolId' in options && options.schoolId === null) {
      setData([]);
      setLoading(false);
      return;
    }
    
    // Only fetch if this is the first time or if key options changed
    const optionsKey = JSON.stringify(options);
    
    const shouldFetch = !hasInitializedRef.current || prevOptionsKeyRef.current !== optionsKey;
    
    if (shouldFetch) {
      hasInitializedRef.current = true;
      prevOptionsKeyRef.current = optionsKey;
      fetchData();
    }
  }, [fetchData, options]);

  const refetch = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  const invalidateCache = useCallback(() => {
    dataCache.invalidate(cacheKey, optionsRef.current);
  }, [cacheKey]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    invalidateCache
  };
};

// Cached Schools Hook
export const useCachedSchools = (includeInactive = false) => {
  const options = { includeInactive };
  
  const fetchFunction = useCallback(async () => {
    return await airtableService.fetchSchools(includeInactive);
  }, [includeInactive]);

  return useCachedData(CACHE_KEYS.SCHOOLS, fetchFunction, options);
};

// Cached Educators Hook
export const useCachedEducators = (includeInactive = false) => {
  const options = { includeInactive };
  
  const fetchFunction = useCallback(async () => {
    return await airtableService.fetchEducators(includeInactive);
  }, [includeInactive]);

  return useCachedData(CACHE_KEYS.EDUCATORS, fetchFunction, options);
};

// Cached EducatorsXSchools Hook
export const useCachedEducatorsXSchools = () => {
  const fetchFunction = useCallback(async () => {
    return await airtableService.fetchEducatorsXSchools();
  }, []);

  return useCachedData(CACHE_KEYS.EDUCATORS_X_SCHOOLS, fetchFunction, {});
};

// Cached School-specific data hooks (these can be cached per school)
export const useCachedSchoolLocations = (schoolId) => {
  const options = { schoolId };
  
  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    
    const tableName = 'Locations';
    const cache = globalTableCache[tableName];
    
    // Check if we have valid cached data
    if (cache.data && (Date.now() - cache.timestamp < GLOBAL_CACHE_TIMEOUT)) {
      // Filter from cache
      const filtered = cache.data.filter(location => {
        if (location.school_id === schoolId) return true;
        if (Array.isArray(location.school_ids) && location.school_ids.includes(schoolId)) return true;
        if (Array.isArray(location.School) && location.School.includes(schoolId)) return true;
        return false;
      });
      return filtered;
    }
    
    // Check if already loading
    if (cache.loading) {
      // Wait for loading to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!globalTableCache[tableName].loading && globalTableCache[tableName].data) {
            clearInterval(checkInterval);
            const filtered = globalTableCache[tableName].data.filter(location => {
              if (location.school_id === schoolId) return true;
              if (Array.isArray(location.school_ids) && location.school_ids.includes(schoolId)) return true;
              if (Array.isArray(location.School) && location.School.includes(schoolId)) return true;
              return false;
            });
            resolve(filtered);
          }
        }, 100);
      });
    }
    
    // Fetch fresh data
    globalTableCache[tableName].loading = true;
    
    try {
      const allLocations = await airtableService.fetchRecords(tableName, { maxRecords: 10000 });
      
      // Update global cache
      globalTableCache[tableName] = {
        data: allLocations,
        loading: false,
        timestamp: Date.now()
      };
      
      // Filter for this school
      const schoolLocations = allLocations.filter(location => {
        if (location.school_id === schoolId) return true;
        if (Array.isArray(location.school_ids) && location.school_ids.includes(schoolId)) return true;
        if (Array.isArray(location.School) && location.School.includes(schoolId)) return true;
        return false;
      });
      
      return schoolLocations;
    } catch (error) {
      globalTableCache[tableName].loading = false;
      throw error;
    }
  }, [schoolId]);

  return useCachedData(CACHE_KEYS.SCHOOL_LOCATIONS, fetchFunction, options);
};

export const useCachedSchoolNotes = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    return await airtableService.fetchSchoolNotes(schoolId);
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.SCHOOL_NOTES, fetchFunction, options);
};

export const useCachedActionSteps = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    
    // Fetch all and filter client-side
    const allSteps = await airtableService.fetchRecords('Action steps', { maxRecords: 10000 });
    return allSteps.filter(step => {
      if (Array.isArray(step.School)) {
        return step.School.includes(schoolId);
      }
      if (Array.isArray(step.Schools)) {
        return step.Schools.includes(schoolId);
      }
      return step.school_id === schoolId || (Array.isArray(step.school_ids) && step.school_ids.includes(schoolId));
    });
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.ACTION_STEPS, fetchFunction, options);
};

export const useCachedGovernanceDocs = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    
    // Fetch all and filter client-side
    const allDocs = await airtableService.fetchRecords('Governance docs', { maxRecords: 10000 });
    return allDocs.filter(doc => {
      if (Array.isArray(doc.School)) {
        return doc.School.includes(schoolId);
      }
      if (Array.isArray(doc.Schools)) {
        return doc.Schools.includes(schoolId);
      }
      return doc.school_id === schoolId || (Array.isArray(doc.school_ids) && doc.school_ids.includes(schoolId));
    });
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.GOVERNANCE_DOCS, fetchFunction, options);
};

export const useCachedGuideAssignments = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    
    // Fetch all and filter client-side
    const allAssignments = await airtableService.fetchRecords('Guides assignments', { maxRecords: 10000 });
    return allAssignments.filter(assignment => {
      if (Array.isArray(assignment.School)) {
        return assignment.School.includes(schoolId);
      }
      if (Array.isArray(assignment.Schools)) {
        return assignment.Schools.includes(schoolId);
      }
      return assignment.school_id === schoolId || (Array.isArray(assignment.school_ids) && assignment.school_ids.includes(schoolId));
    });
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.GUIDE_ASSIGNMENTS, fetchFunction, options);
};

export const useCachedGrants = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    return await airtableService.fetchSchoolGrants(schoolId);
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.GRANTS, fetchFunction, options);
};

export const useCachedLoans = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    return await airtableService.fetchSchoolLoans(schoolId);
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.LOANS, fetchFunction, options);
};

export const useCachedMembershipFees = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    return await airtableService.fetchSchoolMembershipFees(schoolId);
  }, [schoolId]);

  // Early return if no schoolId
  if (!schoolId) {
    return { data: [], loading: false, error: null, refetch: () => {}, invalidateCache: () => {} };
  }

  return useCachedData(CACHE_KEYS.MEMBERSHIP_FEES, fetchFunction, options);
};

// Mutation hook that invalidates relevant cache entries
export const useCachedMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRecord = useCallback(async (tableName, fields) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await airtableService.createRecord(tableName, fields);
      
      // Invalidate relevant cache entries
      invalidateCacheForTable(tableName);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (tableName, recordId, fields) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await airtableService.updateRecord(tableName, recordId, fields);
      
      // Invalidate relevant cache entries
      invalidateCacheForTable(tableName);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecord = useCallback(async (tableName, recordId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await airtableService.deleteRecord(tableName, recordId);
      
      // Invalidate relevant cache entries
      invalidateCacheForTable(tableName);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createRecord,
    updateRecord,
    deleteRecord,
    loading,
    error
  };
};

// Helper function to invalidate cache based on table name
const invalidateCacheForTable = (tableName) => {
  
  switch (tableName) {
    case 'Schools':
      dataCache.invalidateType(CACHE_KEYS.SCHOOLS);
      break;
    case 'Educators':
      dataCache.invalidateType(CACHE_KEYS.EDUCATORS);
      break;
    case 'Educators x Schools':
      dataCache.invalidateType(CACHE_KEYS.EDUCATORS_X_SCHOOLS);
      break;
    case 'Locations':
      dataCache.invalidateType(CACHE_KEYS.SCHOOL_LOCATIONS);
      break;
    case 'School notes':
      dataCache.invalidateType(CACHE_KEYS.SCHOOL_NOTES);
      break;
    case 'Action steps':
      dataCache.invalidateType(CACHE_KEYS.ACTION_STEPS);
      break;
    case 'Governance docs':
      dataCache.invalidateType(CACHE_KEYS.GOVERNANCE_DOCS);
      break;
    case 'Guides Assignments':
      dataCache.invalidateType(CACHE_KEYS.GUIDE_ASSIGNMENTS);
      break;
    case 'Grants':
      dataCache.invalidateType(CACHE_KEYS.GRANTS);
      break;
    case 'Loans':
      dataCache.invalidateType(CACHE_KEYS.LOANS);
      break;
    case 'Membership fee overview':
      dataCache.invalidateType(CACHE_KEYS.MEMBERSHIP_FEES);
      break;
    default:
      // No cache invalidation rule for table
  }
};