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
  useCachedMembershipFees,
  useCachedEmailAddresses,
  useCachedSSJForms,
  useCachedMontessoriCerts,
  useCachedEducatorNotes,
  useCachedEventAttendance
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
    const { data: rawData, loading, error, refetch } = useCachedEducatorNotes(educatorId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            // Transform educator notes data
            const transformed = rawData.map(note => ({
                id: note.id,
                noteText: note['Note Text'] || note.note_text || note.Note || note.Notes || '',
                noteType: note['Note Type'] || note.note_type || note.Type || '',
                createdBy: note['Created By'] || note.created_by || note.Author || '',
                createdDate: note['Created Date'] || note.created_date || note.Created || '',
                modifiedDate: note['Modified Date'] || note.modified_date || note.Modified || '',
                category: note.Category || note.category || '',
                priority: note.Priority || note.priority || '',
                educatorId: note.Educator || note.educator_id || educatorId
            })).filter(Boolean);
            
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
    }, [rawData, loading, error, refetch, educatorId]);
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
    const { data: rawData, loading, error, refetch } = useCachedSSJForms(educatorId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            // Transform SSJ forms data
            const transformed = rawData.map(form => ({
                id: form.id,
                formName: form['Form Name'] || form.form_name || form.Name || '',
                submissionDate: form['Submission Date'] || form.submission_date || form.Submitted || '',
                status: form.Status || form.status || '',
                formType: form['Form Type'] || form.form_type || form.Type || '',
                notes: form.Notes || form.notes || '',
                link: form.Link || form.link || form.URL || '',
                educatorId: form.Educator || form.educator_id || educatorId
            })).filter(Boolean);
            
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
    }, [rawData, loading, error, refetch, educatorId]);
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
    const { data: rawData, loading, error, refetch } = useCachedMontessoriCerts(educatorId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            // Transform Montessori certification data
            const transformed = rawData.map(cert => ({
                id: cert.id,
                certificationName: cert['Certification Name'] || cert.certification_name || cert.Name || '',
                certificationLevel: cert['Certification Level'] || cert.certification_level || cert.Level || '',
                trainingCenter: cert['Training Center'] || cert.training_center || cert.Center || '',
                completionDate: cert['Completion Date'] || cert.completion_date || cert.Completed || '',
                expirationDate: cert['Expiration Date'] || cert.expiration_date || cert.Expires || '',
                status: cert.Status || cert.status || '',
                notes: cert.Notes || cert.notes || '',
                educatorId: cert.Educator || cert.educator_id || educatorId
            })).filter(Boolean);
            
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
    }, [rawData, loading, error, refetch, educatorId]);
};

export const useEvents = (educatorId) => {
    const { data: rawData, loading, error, refetch } = useCachedEventAttendance(educatorId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            // Transform event attendance data
            const transformed = rawData.map(event => ({
                id: event.id,
                eventName: event['Event Name'] || event.event_name || event.Event || '',
                eventDate: event['Event Date'] || event.event_date || event.Date || '',
                eventType: event['Event Type'] || event.event_type || event.Type || '',
                attendanceStatus: event['Attendance Status'] || event.attendance_status || event.Status || '',
                registrationDate: event['Registration Date'] || event.registration_date || event.Registered || '',
                role: event.Role || event.role || '',
                notes: event.Notes || event.notes || '',
                location: event.Location || event.location || '',
                educatorId: event.Educator || event.educator_id || educatorId
            })).filter(Boolean);
            
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
    }, [rawData, loading, error, refetch, educatorId]);
};

export const useEmailAddresses = (educatorId) => {
    const { data: rawData, loading, error, refetch } = useCachedEmailAddresses(educatorId);
    
    return useMemo(() => {
        if (!loading && !error && Array.isArray(rawData) && rawData.length > 0) {
            // Transform email addresses data if needed
            const transformed = rawData.map(email => ({
                id: email.id,
                emailAddress: email['Email Address'] || email.email_address || email.Email || '',
                emailType: email['Email Type'] || email.email_type || email.Type || '',
                isPrimary: email['Is Primary'] || email.is_primary || email.Primary || false,
                notes: email.Notes || email.notes || '',
                createdDate: email['Created Date'] || email.created_date || email.Created || '',
                educatorId: email.Educator || email.educator_id || educatorId
            })).filter(Boolean);
            
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
    }, [rawData, loading, error, refetch, educatorId]);
};

export default useUnifiedData;