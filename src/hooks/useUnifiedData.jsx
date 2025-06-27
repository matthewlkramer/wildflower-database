
import { useMemo } from 'react';
import { useSchools, useEducators } from './useAirtableData';
import { transformSchoolsData } from '../utils/dataTransformers';
import { 
  sampleSchools, 
  sampleEducators, 
  sampleCharters,
  sampleEducatorsXSchools,
  sampleLocations,
  sampleSSJFilloutForms,
  sampleEventAttendance,
  sampleMontessoriCerts,
  sampleEducatorNotes,
  sampleSchoolNotes,
  sampleActionSteps,
  sampleMembershipFeeRecords,
  sampleMembershipFeeUpdates,
  sampleGovernanceDocs,
  sampleGuideAssignments,
  sampleGrants,
  sampleLoans
} from '../data/sampleData';
import { TABS } from '../utils/constants';

const useUnifiedData = (dataType, options = {}) => {
    switch (dataType) {
        case TABS.SCHOOLS:
            return useUnifiedSchools(options);
        case TABS.EDUCATORS:
            return useUnifiedEducators(options);
        case TABS.CHARTERS:
            return useUnifiedCharters(options);
        default:
            return { data: [], loading: false, error: null, isUsingFallback: true };
    }
};

const useUnifiedSchools = (options = {}) => {
    const { includeInactive = false } = options;

    // Get real data from Airtable
    const schoolsHookResult = useSchools(includeInactive);

    // Debug logging
    console.log('🔍 Schools Hook Result:', schoolsHookResult);

    // Extract data more carefully
    const rawSchoolsData = schoolsHookResult?.data || schoolsHookResult || [];
    const loading = schoolsHookResult?.loading || false;
    const error = schoolsHookResult?.error || null;

    const transformedData = useMemo(() => {
        console.log('🔄 Processing schools data:', {
            rawDataLength: rawSchoolsData?.length,
            isArray: Array.isArray(rawSchoolsData),
            loading,
            error,
            firstItem: rawSchoolsData?.[0]
        });

        // Only use real data if we have it and it's not loading
        if (!loading && !error && Array.isArray(rawSchoolsData) && rawSchoolsData.length > 0) {
            console.log('✅ Using REAL schools data:', rawSchoolsData.length, 'schools');

            // Transform the data
            const transformed = transformSchoolsData(rawSchoolsData);
            console.log('🔄 Transformed data:', transformed.length, 'schools');

            return transformed;
        }

        console.log('⚠️ Using sample data - Real data not available');
        console.log('  Reasons: loading =', loading, ', error =', error, ', dataLength =', rawSchoolsData?.length);

        // Return empty array instead of sample data to avoid confusion
        return [];
    }, [rawSchoolsData, loading, error]);

  return {
    data: transformedData,
    loading,
    error,
    isUsingFallback: loading || error || !Array.isArray(rawSchoolsData) || rawSchoolsData.length === 0
  };
};

const useUnifiedEducators = (options = {}) => {
    const { includeInactive = false } = options;
    const educatorsHookResult = useEducators(includeInactive);

    // Extract data safely
    const rawEducatorsData = educatorsHookResult?.data || [];
    const loading = educatorsHookResult?.loading || false;
    const error = educatorsHookResult?.error || null;

    const data = useMemo(() => {
        console.log('🔍 Processing educators data:', {
            rawDataLength: rawEducatorsData?.length,
            loading,
            error,
            firstItem: rawEducatorsData?.[0]
        });

        if (!loading && !error && Array.isArray(rawEducatorsData) && rawEducatorsData.length > 0) {
            console.log('✅ Using real educators data:', rawEducatorsData.length, 'educators');
            return rawEducatorsData;
        }

        console.log('⚠️ Using empty educators array - Real data not available');
        return [];
    }, [rawEducatorsData, loading, error]);

    return {
        data,
        loading,
        error,
        isUsingFallback: data.length === 0 && !loading
    };
};

const useUnifiedCharters = () => {
  // For now, charters are always sample data since there's no real hook
  return {
    data: sampleCharters,
    loading: false,
    error: null,
    isUsingFallback: true
  };
};

// Related data hooks that always use sample data for now
export const useEducatorsXSchools = () => {
  return {
    data: sampleEducatorsXSchools,
    loading: false,
    error: null
  };
};

export const useSchoolLocations = (schoolId) => {
  const filteredLocations = sampleLocations.filter(loc => loc.schoolId === schoolId);
  return {
    data: filteredLocations,
    loading: false,
    error: null
  };
};

export const useSSJForms = (educatorId) => {
  const filteredForms = sampleSSJFilloutForms.filter(form => form.educatorId === educatorId);
  return {
    data: filteredForms,
    loading: false,
    error: null
  };
};

export const useEventAttendance = (educatorId) => {
  const filteredEvents = sampleEventAttendance.filter(event => event.educatorId === educatorId);
  return {
    data: filteredEvents,
    loading: false,
    error: null
  };
};

export const useMontessoriCerts = (educatorId) => {
  const filteredCerts = sampleMontessoriCerts.filter(cert => cert.educatorId === educatorId);
  return {
    data: filteredCerts,
    loading: false,
    error: null
  };
};

export const useEducatorNotes = (educatorId) => {
  const filteredNotes = sampleEducatorNotes.filter(note => note.educatorId === educatorId);
  return {
    data: filteredNotes,
    loading: false,
    error: null
  };
};

export const useSchoolNotes = (schoolId) => {
  const filteredNotes = sampleSchoolNotes.filter(note => note.schoolId === schoolId);
  return {
    data: filteredNotes,
    loading: false,
    error: null
  };
};

export const useActionSteps = (schoolId) => {
  const filteredActions = sampleActionSteps.filter(action => action.schoolId === schoolId);
  return {
    data: filteredActions,
    loading: false,
    error: null
  };
};

export const useMembershipFeeRecords = (schoolId) => {
  const filteredRecords = sampleMembershipFeeRecords.filter(record => record.schoolId === schoolId);
  return {
    data: filteredRecords,
    loading: false,
    error: null
  };
};

export const useMembershipFeeUpdates = (schoolId, schoolYear = null) => {
  let filteredUpdates = sampleMembershipFeeUpdates.filter(update => update.schoolId === schoolId);
  
  if (schoolYear) {
    filteredUpdates = filteredUpdates.filter(update => update.schoolYear === schoolYear);
  }
  
  return {
    data: filteredUpdates,
    loading: false,
    error: null
  };
};

export const useGovernanceDocs = (schoolId) => {
  const filteredDocs = sampleGovernanceDocs.filter(doc => doc.schoolId === schoolId);
  return {
    data: filteredDocs,
    loading: false,
    error: null
  };
};

export const useGuideAssignments = (schoolId) => {
  const filteredAssignments = sampleGuideAssignments.filter(assignment => assignment.schoolId === schoolId);
  return {
    data: filteredAssignments,
    loading: false,
    error: null
  };
};

export const useGrants = (schoolId) => {
  const filteredGrants = sampleGrants.filter(grant => grant.schoolId === schoolId);
  return {
    data: filteredGrants,
    loading: false,
    error: null
  };
};

export const useLoans = (schoolId) => {
  const filteredLoans = sampleLoans.filter(loan => loan.schoolId === schoolId);
  return {
    data: filteredLoans,
    loading: false,
    error: null
  };
};

export default useUnifiedData;