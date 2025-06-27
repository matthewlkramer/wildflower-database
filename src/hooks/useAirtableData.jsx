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
                        fullName: educator['Full Name'] || 'Unknown',
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
                        raceEthnicity: educator
