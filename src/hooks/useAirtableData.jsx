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
export const useEducators = (includeInactive = false) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllEducators = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('🔄 Fetching educators with includeInactive:', includeInactive);

                // Fetch educators and relationships
                const [educatorsData, educatorsXSchoolsData] = await Promise.all([
                    airtableService.fetchEducators(includeInactive),
                    airtableService.fetchEducatorsXSchools()
                ]);

                console.log('📊 Raw educators data:', {
                    totalEducators: educatorsData.length,
                    totalRelationships: educatorsXSchoolsData.length,
                    firstEducator: educatorsData[0],
                    educatorFields: educatorsData[0] ? Object.keys(educatorsData[0]) : []
                });

                // Filter educators based on relationships if not including inactive
                let filteredEducators = educatorsData;

                if (!includeInactive) {
                    // Get educators who have active relationships
                    const activeEducatorIds = new Set(
                        educatorsXSchoolsData
                            .filter(rel => rel['Currently Active'] === true)
                            .map(rel => {
                                if (Array.isArray(rel.Educator)) {
                                    return rel.Educator[0];
                                }
                                return rel.Educator;
                            })
                            .filter(Boolean)
                    );

                    console.log('👥 Active educator IDs from relationships:', activeEducatorIds.size);

                    filteredEducators = educatorsData.filter(educator => {
                        const hasAnyRelationship = educatorsXSchoolsData.some(rel => {
                            const relEducatorId = Array.isArray(rel.Educator) ? rel.Educator[0] : rel.Educator;
                            return relEducatorId === educator.id;
                        });
                        const hasActiveRelationship = activeEducatorIds.has(educator.id);

                        const shouldInclude = hasActiveRelationship || !hasAnyRelationship;

                        if (!shouldInclude) {
                            console.log('🚫 Filtering out educator:', educator['First Name'], educator['Last Name'], 'has relationships but none active');
                        }

                        return shouldInclude;
                    });

                    console.log('✅ After relationship filtering:', filteredEducators.length, 'educators');
                }

                // Transform the data using the clean email structure
                const transformedEducators = filteredEducators.map(educator => {

                    return {
                        id: educator.id,
                        fullName: educator[`Full Name`] || `Unknown`,
                        firstName: educator['First Name'] || '-',
                        lastName: educator['Last Name'] || '-',

                        // Email handling - simplified to use only the two remaining fields
                        email: Array.isArray(educator['Current Primary Email Address'])
                            ? educator['Current Primary Email Address'][0]
                            : educator['Current Primary Email Address'] || '',

                        // Store reference to linked email records (for future use if needed)
                        emailAddresses: educator['Email Addresses'] || [],

                        // Contact info
                        phone: educator['Primary phone'] || '',
                        secondaryPhone: educator['Secondary phone'] || '',
                        homeAddress: educator['Home Address'] || '',

                        // Personal info
                        pronouns: educator['Pronouns'] || '',
                        pronounsOther: educator['Pronouns Other'] || '',
                        nickname: educator['Nickname'] || '',

                        // Professional info
                        discoveryStatus: educator['Discovery status'] || '',
                        individualType: educator['Individual Type'] || '',
                        montessoriCertified: educator['Montessori Certified'] || false,

                        // Current school info (using lookup fields)
                        currentSchool: Array.isArray(educator['Currently Active School'])
                            ? educator['Currently Active School'][0]
                            : educator['Currently Active School'] || '',
                        role: Array.isArray(educator['Current Role'])
                            ? educator['Current Role'][0]
                            : educator['Current Role'] || '',

                        // Demographics
                        raceEthnicity: educator['Race & Ethnicity'] || [],
                        raceEthnicityOther: educator['Race & Ethnicity Other'] || '',
                        gender: educator['Gender'] || '',
                        genderOther: educator['Gender - Other'] || '',
                        householdIncome: educator['Household Income'] || '',
                        incomeBackground: educator['Income Background'] || [],
                        lgbtqia: educator['LGBTQIA'] || '',
                        primaryLanguage: Array.isArray(educator['Primary Language'])
                            ? educator['Primary Language'][0]
                            : educator['Primary Language'] || '',
                        otherLanguages: educator['Other languages'] || [],

                        // Location/targeting
                        targetGeo: educator['Target geo combined'] || '',
                        targetCity: educator['Target city'] || '',
                        targetState: educator['Target state'] || '',
                        targetIntl: educator['Target - international'] || '',

                        // Additional fields
                        holaspirit: educator['Active Holaspirit'] || false,
                        tcUserId: educator['TC User ID'] || '',
                        createdTime: educator['Created'] || educator.createdTime,
                        selfReflection: educator['Self-reflection'] || '',

                        // School relationship info
                        currentActiveSchool: educator['Currently Active School'] || '',
                        allSchools: educator['All Schools'] || [],
                        schoolStatuses: educator['School Statuses'] || [],
                        activeSchoolAffiliationStatus: Array.isArray(educator['Active School Affiliation Status'])
                            ? educator['Active School Affiliation Status'][0]
                            : educator['Active School Affiliation Status'] || ''
                    };
                });

                console.log('✅ Transformed educators:', transformedEducators.length);
                console.log('📊 Sample transformed educator:', transformedEducators[0]);

                setData(transformedEducators);
            } catch (err) {
                console.error('❌ Error fetching educators:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEducators();
    }, [includeInactive]);

    return { data, loading, error };
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
    governanceDocs: [],
    nineNineties: [],
    familySurveys: [],
    assessmentData: []
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
        governanceDocs,
        nineNineties,
        familySurveys,
        assessmentData
      ] = await Promise.all([
        airtableService.fetchSchoolNotes(schoolId),
        airtableService.fetchSchoolGrants(schoolId),
        airtableService.fetchSchoolLoans(schoolId),
        airtableService.fetchSchoolActionSteps(schoolId),
        airtableService.fetchSchoolLocations(schoolId),
        airtableService.fetchSchoolMembershipFees(schoolId),
        airtableService.fetchSchoolGuideAssignments(schoolId),
        airtableService.fetchSchoolGovernanceDocs(schoolId),
        airtableService.fetchSchoolNineNineties(schoolId),
        airtableService.fetchSchoolFamilySurveys(schoolId),
        airtableService.fetchSchoolAssessmentData(schoolId)
      ]);

      setSchoolData({
        notes,
        grants,
        loans,
        actionSteps,
        locations,
        membershipFees,
        guideAssignments,
        governanceDocs,
        nineNineties,
        familySurveys,
        assessmentData
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
