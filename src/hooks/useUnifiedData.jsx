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
import { 
  transformSchoolsData,
  transformEducatorsData,
  transformEducatorsXSchoolsData, 
  transformLocationsData,
  transformGovernanceDocData,
  transformGuideAssignmentData,
  transformGrantData,
  transformLoanData,
  transformActionStepData,
  transformSchoolNoteData
} from '../utils/dataTransformers.js';
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
            return transformSchoolsData(rawSchoolsData);
        }

        if (loading) {
            // Schools loading
        } else if (error) {
            console.error('Schools error:', error.message);
        } else {
            // No schools data available
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
            // Using educators data
            return transformEducatorsData(rawEducatorsData);
        }

        if (loading) {
            // Educators loading
        } else if (error) {
            console.error('Educators error:', error.message);
        } else {
            // No educators data available
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
    const { data: realData, loading, error, refetch } = useCachedEducatorsXSchools();
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(realData) && realData.length > 0) {
            const transformed = transformEducatorsXSchoolsData(realData);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [realData, loading, error, refetch]);
};

export const useSchoolLocations = (schoolId) => {
    const { data: realData, loading, error, refetch } = useCachedSchoolLocations(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(realData)) {
            if (realData.length > 0) {
                // Using locations data for school
                return {
                    data: transformLocationsData(realData),
                    loading: false,
                    error: null,
                    refetch
                };
            } else {
                // No locations found for school
            }
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [realData, loading, error, refetch, schoolId]);
};

// Clean school-specific data hooks
export const useSchoolNotes = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedSchoolNotes(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(note => transformSchoolNoteData(note)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
};

export const useActionSteps = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedActionSteps(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(step => transformActionStepData(step)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
};

export const useGovernanceDocs = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedGovernanceDocs(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(doc => transformGovernanceDocData(doc)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
};

export const useGuideAssignments = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedGuideAssignments(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(assignment => transformGuideAssignmentData(assignment)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
};

export const useGrants = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedGrants(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(grant => transformGrantData(grant)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
};

export const useLoans = (schoolId) => {
    const { data: rawData, loading, error, refetch } = useCachedLoans(schoolId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            const transformed = rawData.map(loan => transformLoanData(loan)).filter(Boolean);
            return {
                data: transformed,
                loading: false,
                error: null,
                refetch
            };
        }
        
        return {
            data: [],
            loading,
            error,
            refetch
        };
    }, [rawData, loading, error, refetch]);
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
    // Educator Notes not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useMembershipFeeUpdates = (schoolId, schoolYear = null) => {
    // Membership Fee Updates not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useOnlineForms = (educatorId) => {
    // Online Forms not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useEarlyCultivation = (educatorId) => {
    // Early Cultivation not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useCertifications = (educatorId) => {
    // Certifications not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export const useEvents = (educatorId) => {
    // Events not implemented yet
    return {
        data: [],
        loading: false,
        error: null,
        refetch: () => Promise.resolve([])
    };
};

export default useUnifiedData;