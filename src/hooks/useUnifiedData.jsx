// src/hooks/useUnifiedData.jsx - Clean version without sample data

import { useMemo } from 'react';
import { 
  useCachedSchools, 
  useCachedEducators, 
  useCachedEducatorsXSchools,
  useCachedSchoolLocations,
  useCachedSchoolNotes,
  useCachedActionSteps,
  useCachedGovernanceDocs,
  useCachedGuideAssignments,
  useCachedGrants,
  useCachedLoans,
  useCachedMembershipFees
} from './useCachedData';
import { transformSchoolsData, transformEducatorsXSchoolsData, transformLocationsData } from '../utils/dataTransformers.js';
import { TABS } from '../utils/constants.js';

const useUnifiedData = (dataType, options = {}) => {
    switch (dataType) {
        case TABS.SCHOOLS:
            return useUnifiedSchools(options);
        case TABS.EDUCATORS:
            return useUnifiedEducators(options);
        case TABS.CHARTERS:
            return useUnifiedCharters(options);
        default:
            return { data: [], loading: false, error: null };
    }
};

const useUnifiedSchools = (options = {}) => {
    const { includeInactive = false } = options;
    const schoolsResult = useCachedSchools(includeInactive);

    const transformedData = useMemo(() => {
        const { data: rawSchoolsData, loading, error } = schoolsResult;

        if (!loading && !error && Array.isArray(rawSchoolsData) && rawSchoolsData.length > 0) {
            console.log('✅ Using schools data:', rawSchoolsData.length, 'schools');
            return transformSchoolsData(rawSchoolsData);
        }

        if (loading) {
            console.log('⏳ Schools still loading...');
        } else if (error) {
            console.log('❌ Schools error:', error.message);
        } else {
            console.log('📭 No schools data available');
        }

        return [];
    }, [schoolsResult]);

    return {
        data: transformedData,
        loading: schoolsResult.loading,
        error: schoolsResult.error,
        refetch: schoolsResult.refetch
    };
};

const useUnifiedEducators = (options = {}) => {
    const { includeInactive = false } = options;
    const educatorsResult = useCachedEducators(includeInactive);

    const data = useMemo(() => {
        const { data: rawEducatorsData, loading, error } = educatorsResult;

        if (!loading && !error && Array.isArray(rawEducatorsData) && rawEducatorsData.length > 0) {
            console.log('✅ Using educators data:', rawEducatorsData.length, 'educators');
            console.log('🔍 Sample educator data:', rawEducatorsData[0]);
            console.log('🔍 Educator field names:', Object.keys(rawEducatorsData[0] || {}));
            return rawEducatorsData;
        }

        if (loading) {
            console.log('⏳ Educators still loading...');
        } else if (error) {
            console.log('❌ Educators error:', error.message);
        } else {
            console.log('📭 No educators data available');
        }

        return [];
    }, [educatorsResult]);

    return {
        data,
        loading: educatorsResult.loading,
        error: educatorsResult.error,
        refetch: educatorsResult.refetch
    };
};

const useUnifiedCharters = () => {
    // TODO: Implement real charters data when needed

    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

// Related data hooks - all real data, no fallbacks
export const useEducatorsXSchools = () => {
    const realDataResult = useCachedEducatorsXSchools();
    
    return useMemo(() => {
        const { data: realData, loading, error } = realDataResult;
  
        if (!loading && !error && Array.isArray(realData) && realData.length > 0) {
            console.log('✅ Using EducatorsXSchools data:', realData.length, 'relationships');
            console.log('🔍 Sample EducatorsXSchools record:', realData[0]);
            const transformed = transformEducatorsXSchoolsData(realData);
            console.log('🔍 Sample transformed record:', transformed[0]);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch: realDataResult.refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch: realDataResult.refetch
        };
    }, [realDataResult]);
};

export const useSchoolLocations = (schoolId) => {
    const realDataResult = useCachedSchoolLocations(schoolId);
    
    return useMemo(() => {
        const { data: realData, loading, error } = realDataResult;
        
        if (!loading && !error && Array.isArray(realData)) {
            if (realData.length > 0) {
                console.log('✅ Using locations data for school:', schoolId, realData.length, 'locations');
                return {
                    data: transformLocationsData(realData),
                    loading: false,
                    error: null,
                    refetch: realDataResult.refetch
                };
            } else {
                console.log('📭 No locations found for school:', schoolId);
            }
        }
        
        return {
            data: [],
            loading,
            error,
            refetch: realDataResult.refetch
        };
    }, [realDataResult, schoolId]);
};

// Clean school-specific data hooks
export const useSchoolNotes = (schoolId) => {
    const result = useCachedSchoolNotes(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useActionSteps = (schoolId) => {
    const result = useCachedActionSteps(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useGovernanceDocs = (schoolId) => {
    const result = useCachedGovernanceDocs(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useGuideAssignments = (schoolId) => {
    const result = useCachedGuideAssignments(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useGrants = (schoolId) => {
    const result = useCachedGrants(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useLoans = (schoolId) => {
    const result = useCachedLoans(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

export const useMembershipFeeRecords = (schoolId) => {
    const result = useCachedMembershipFees(schoolId);
    
    return {
        data: result.data || [],
        loading: result.loading,
        error: result.error,
        refetch: result.refetch
    };
};

// Placeholder hooks for features not yet implemented
export const useSSJForms = (educatorId) => {

    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useEventAttendance = (educatorId) => {

    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useMontessoriCerts = (educatorId) => {

    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useEducatorNotes = (educatorId) => {
    console.log('⚠️ Educator Notes not implemented yet for educator:', educatorId);
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useMembershipFeeUpdates = (schoolId, schoolYear = null) => {
    console.log('⚠️ Membership Fee Updates not implemented yet for school:', schoolId, 'year:', schoolYear);
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export default useUnifiedData;