// src/hooks/useCachedData.jsx
// Cached versions of your data hooks

import { useState, useEffect, useCallback } from 'react';
import { dataCache, CACHE_KEYS } from '../utils/dataCache';
import { airtableService } from '../airtableService';

// Generic cached data hook
export const useCachedData = (cacheKey, fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cached = dataCache.get(cacheKey, options);
        if (cached) {
          setData(cached.data || []);
          setLoading(false);
          setError(cached.error);
          return cached.data;
        }
      }

      // Check if already loading to prevent duplicate requests
      if (dataCache.isLoading(cacheKey, options)) {
        console.log(`⏳ Already loading ${cacheKey}, skipping duplicate request`);
        return;
      }

      console.log(`🔄 Fetching fresh data for ${cacheKey}${forceRefresh ? ' (forced)' : ''}`);
      
      setLoading(true);
      setError(null);
      dataCache.setLoading(cacheKey, true, options);
      
      const result = await fetchFunction();
      
      // Cache the result
      dataCache.set(cacheKey, result, options);
      
      setData(result || []);
      setLoading(false);
      
      return result;
    } catch (err) {
      console.error(`❌ Error fetching ${cacheKey}:`, err);
      setError(err);
      setLoading(false);
      
      // Cache the error too
      dataCache.set(cacheKey, [], options, err);
      throw err;
    } finally {
      dataCache.setLoading(cacheKey, false, options);
    }
  }, [cacheKey, fetchFunction, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  const invalidateCache = useCallback(() => {
    dataCache.invalidate(cacheKey, options);
  }, [cacheKey, options]);

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
    console.log('🏫 Fetching schools from API, includeInactive:', includeInactive);
    return await airtableService.fetchSchools(includeInactive);
  }, [includeInactive]);

  return useCachedData(CACHE_KEYS.SCHOOLS, fetchFunction, options);
};

// Cached Educators Hook
export const useCachedEducators = (includeInactive = false) => {
  const options = { includeInactive };
  
  const fetchFunction = useCallback(async () => {
    console.log('👩‍🏫 Fetching educators from API, includeInactive:', includeInactive);
    return await airtableService.fetchEducators(includeInactive);
  }, [includeInactive]);

  return useCachedData(CACHE_KEYS.EDUCATORS, fetchFunction, options);
};

// Cached EducatorsXSchools Hook
export const useCachedEducatorsXSchools = () => {
  const fetchFunction = useCallback(async () => {
    console.log('🔗 Fetching educators x schools from API');
    return await airtableService.fetchEducatorsXSchools();
  }, []);

  return useCachedData(CACHE_KEYS.EDUCATORS_X_SCHOOLS, fetchFunction);
};

// Cached School-specific data hooks (these can be cached per school)
export const useCachedSchoolLocations = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('📍 Fetching school locations from API for:', schoolId);
    
    // Fetch ALL locations and filter client-side due to Airtable filter issues
    const allLocations = await airtableService.fetchRecords('Locations', { maxRecords: 1000 });
    console.log('🌍 All locations fetched:', allLocations.length);
    
    // Debug first few locations to see the structure
    if (allLocations.length > 0) {
      console.log('🔍 First location structure:', allLocations[0]);
      console.log('🔍 Location field names:', Object.keys(allLocations[0]));
      console.log('🔍 School field:', allLocations[0].School);
      console.log('🔍 Schools field:', allLocations[0].Schools);
      console.log('🔍 school_id field:', allLocations[0].school_id);
    }
    
    // Filter locations that belong to this school
    const schoolLocations = allLocations.filter(location => {
      // Prioritize school_id field as it works better
      if (location.school_id === schoolId) {
        console.log('✅ Location matches via school_id:', location.Address || location.address);
        return true;
      }
      // Check school_ids array field as fallback
      if (Array.isArray(location.school_ids) && location.school_ids.includes(schoolId)) {
        console.log('✅ Location matches via school_ids array:', location.Address || location.address);
        return true;
      }
      // Last resort - check School linked field
      if (Array.isArray(location.School) && location.School.includes(schoolId)) {
        console.log('✅ Location matches via School array:', location.Address || location.address, location.School);
        return true;
      }
      return false;
    });
    
    console.log(`🎯 Filtered ${schoolLocations.length} locations for school ${schoolId}`);
    return schoolLocations;
  }, [schoolId]);

  return useCachedData(CACHE_KEYS.SCHOOL_LOCATIONS, fetchFunction, options);
};

export const useCachedSchoolNotes = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('📝 Fetching school notes from API for:', schoolId);
    return await airtableService.fetchSchoolNotes(schoolId);
  }, [schoolId]);

  return useCachedData(CACHE_KEYS.SCHOOL_NOTES, fetchFunction, options);
};

export const useCachedActionSteps = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('✅ Fetching action steps from API for:', schoolId);
    
    // Fetch all and filter client-side
    const allSteps = await airtableService.fetchRecords('Action steps', { maxRecords: 1000 });
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

  return useCachedData(CACHE_KEYS.ACTION_STEPS, fetchFunction, options);
};

export const useCachedGovernanceDocs = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('📋 Fetching governance docs from API for:', schoolId);
    
    // Fetch all and filter client-side
    const allDocs = await airtableService.fetchRecords('Governance docs', { maxRecords: 1000 });
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

  return useCachedData(CACHE_KEYS.GOVERNANCE_DOCS, fetchFunction, options);
};

export const useCachedGuideAssignments = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('👥 Fetching guide assignments from API for:', schoolId);
    
    // Fetch all and filter client-side
    const allAssignments = await airtableService.fetchRecords('Guides assignments', { maxRecords: 1000 });
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

  return useCachedData(CACHE_KEYS.GUIDE_ASSIGNMENTS, fetchFunction, options);
};

export const useCachedGrants = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('💰 Fetching grants from API for:', schoolId);
    return await airtableService.fetchSchoolGrants(schoolId);
  }, [schoolId]);

  return useCachedData(CACHE_KEYS.GRANTS, fetchFunction, options);
};

export const useCachedLoans = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('🏦 Fetching loans from API for:', schoolId);
    return await airtableService.fetchSchoolLoans(schoolId);
  }, [schoolId]);

  return useCachedData(CACHE_KEYS.LOANS, fetchFunction, options);
};

export const useCachedMembershipFees = (schoolId) => {
  const options = { schoolId };
  
  const fetchFunction = useCallback(async () => {
    if (!schoolId) return [];
    console.log('💳 Fetching membership fees from API for:', schoolId);
    return await airtableService.fetchSchoolMembershipFees(schoolId);
  }, [schoolId]);

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
  console.log(`🗑️ Invalidating cache for table: ${tableName}`);
  
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
      console.log(`⚠️ No cache invalidation rule for table: ${tableName}`);
  }
};