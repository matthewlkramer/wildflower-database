// hooks/useAirtableData.js
import { useState, useEffect, useCallback } from 'react';
import { airtableService } from '../airtableService';

// Generic hook for fetching data
export const useAirtableData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useSchools = (includeInactive = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching schools, includeInactive:', includeInactive);
      
      const rawSchools = await airtableService.fetchSchools(includeInactive);
      console.log('✅ Raw schools received:', rawSchools);
      
      setData(rawSchools || []);
      
    } catch (err) {
      console.error('❌ Error fetching schools:', err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [includeInactive]); // Re-fetch when includeInactive changes

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchSchools 
  };
};

// Hook for fetching educators
export const useEducators = () => {
  return useAirtableData(() => airtableService.fetchEducators());
};

// Hook for fetching charters
export const useCharters = () => {
  return useAirtableData(() => airtableService.fetchCharters());
};

// Hook for fetching educator-school relationships
export const useEducatorsXSchools = () => {
  return useAirtableData(() => airtableService.fetchEducatorsXSchools());
};

// Hook for fetching school-specific data
export const useSchoolData = (schoolId) => {
  const [schoolData, setSchoolData] = useState({
    notes: [],
    grants: [],
    loans: [],
    actionSteps: [],
    locations: [],
    membershipFees: [],
    guideAssignments: [],
    governanceDocs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolData = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [
        notes,
        grants,
        loans,
        actionSteps,
        locations,
        membershipFees,
        guideAssignments,
        governanceDocs
      ] = await Promise.all([
        airtableService.fetchSchoolNotes(schoolId),
        airtableService.fetchSchoolGrants(schoolId),
        airtableService.fetchSchoolLoans(schoolId),
        airtableService.fetchSchoolActionSteps(schoolId),
        airtableService.fetchSchoolLocations(schoolId),
        airtableService.fetchSchoolMembershipFees(schoolId),
        airtableService.fetchSchoolGuideAssignments(schoolId),
        airtableService.fetchSchoolGovernanceDocs(schoolId)
      ]);

      setSchoolData({
        notes,
        grants,
        loans,
        actionSteps,
        locations,
        membershipFees,
        guideAssignments,
        governanceDocs
      });
    } catch (err) {
      setError(err);
      console.error('Error fetching school data:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  const refetch = useCallback(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  return { schoolData, loading, error, refetch };
};

// Hook for fetching educator-specific data
export const useEducatorData = (educatorId) => {
  const [educatorData, setEducatorData] = useState({
    notes: [],
    ssjForms: [],
    eventAttendance: [],
    montessoriCerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEducatorData = useCallback(async () => {
    if (!educatorId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [
        notes,
        ssjForms,
        eventAttendance,
        montessoriCerts
      ] = await Promise.all([
        airtableService.fetchEducatorNotes(educatorId),
        airtableService.fetchEducatorSSJForms(educatorId),
        airtableService.fetchEducatorEventAttendance(educatorId),
        airtableService.fetchEducatorMontessoriCerts(educatorId)
      ]);

      setEducatorData({
        notes,
        ssjForms,
        eventAttendance,
        montessoriCerts
      });
    } catch (err) {
      setError(err);
      console.error('Error fetching educator data:', err);
    } finally {
      setLoading(false);
    }
  }, [educatorId]);

  useEffect(() => {
    fetchEducatorData();
  }, [fetchEducatorData]);

  const refetch = useCallback(() => {
    fetchEducatorData();
  }, [fetchEducatorData]);

  return { educatorData, loading, error, refetch };
};

// Hook for creating/updating records
export const useAirtableMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRecord = useCallback(async (tableName, fields) => {
    try {
      setLoading(true);
      setError(null);
      const result = await airtableService.createRecord(tableName, fields);
      return result;
    } catch (err) {
      setError(err);
      console.error('Error creating record:', err);
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
      return result;
    } catch (err) {
      setError(err);
      console.error('Error updating record:', err);
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
      return result;
    } catch (err) {
      setError(err);
      console.error('Error deleting record:', err);
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

// Hook for managing search and filtering
export const useDataFiltering = (data, searchTerm) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!searchTerm || !data) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const searchableFields = Object.values(item).join(' ').toLowerCase();
      return searchableFields.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
  }, [data, searchTerm]);

  return filteredData;
};

// Hook for fetching school locations
export const useSchoolLocations = (schoolId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    if (!schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      const locations = await airtableService.fetchSchoolLocations(schoolId);
      setData(locations || []);
    } catch (err) {
      setError(err);
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { data, loading, error, refetch: fetchLocations };
};