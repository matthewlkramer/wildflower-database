import { useMemo } from 'react';
import useUnifiedData, { useEducatorsXSchools } from './useUnifiedData';
import { TABS } from '../utils/constants';

export const useEnrichedEducators = (options = {}) => {
    // Get base educators data
    const educatorsResult = useUnifiedData(TABS.EDUCATORS, options);
    
    // Get educators x schools relationships
    const educatorsXSchoolsResult = useEducatorsXSchools();
    
    // Get schools data to map school IDs to names
    const schoolsResult = useUnifiedData(TABS.SCHOOLS, { includeInactive: true });
    
    // Combine the data
    const enrichedData = useMemo(() => {
        if (educatorsResult.loading || educatorsXSchoolsResult.loading || schoolsResult.loading) {
            return [];
        }
        
        const educators = educatorsResult.data || [];
        const relationships = educatorsXSchoolsResult.data || [];
        const schools = schoolsResult.data || [];
        
        // Create a map of school IDs to school names
        const schoolMap = {};
        schools.forEach(school => {
            // Log first school to see available fields
            if (Object.keys(schoolMap).length === 0) {
                console.log('🏫 First school fields:', Object.keys(school));
                console.log('🏫 First school data:', school);
            }
            const schoolName = school.shortName || school['Short Name'] || school.Name || school.name;
            if (schoolName) {
                schoolMap[school.id] = schoolName;
            }
        });
        
        // Log to debug the mapping
        console.log('📚 School map sample:', Object.entries(schoolMap).slice(0, 3));
        console.log('🔗 Relationships sample:', relationships.slice(0, 3));
        
        // Enrich each educator with their current school and role
        return educators.map(educator => {
            // Find all relationships for this educator
            const educatorRelationships = relationships.filter(rel => {
                return rel.educatorId === educator.id;
            });
            
            // Find current (active) relationships
            const currentRelationships = educatorRelationships.filter(rel => {
                // A relationship is current if it has no end date
                return !rel.endDate;
            });
            
            // Get current school names and roles
            const currentSchools = [];
            const currentRoles = [];
            
            currentRelationships.forEach(rel => {
                // Get school name from the map
                const schoolName = rel.schoolId ? schoolMap[rel.schoolId] : null;
                
                // If we have a school name, add it
                if (schoolName && !currentSchools.includes(schoolName)) {
                    currentSchools.push(schoolName);
                }
                
                // Get role - it's directly on the relationship
                const role = rel.role;
                if (role && !currentRoles.includes(role)) {
                    currentRoles.push(role);
                }
            });
            
            // Also check if the educator has current schools listed directly
            if (educator['Assigned Partner'] && currentSchools.length === 0) {
                // Assigned Partner might contain school IDs as an array
                const assignedPartners = Array.isArray(educator['Assigned Partner']) 
                    ? educator['Assigned Partner'] 
                    : [educator['Assigned Partner']];
                
                assignedPartners.forEach(partnerId => {
                    const schoolName = schoolMap[partnerId];
                    if (schoolName && !currentSchools.includes(schoolName)) {
                        currentSchools.push(schoolName);
                    }
                });
            }
            
            return {
                ...educator,
                currentSchools: currentSchools.join(', ') || null,
                currentRoles: currentRoles.join(', ') || null
            };
        });
    }, [educatorsResult.data, educatorsXSchoolsResult.data, schoolsResult.data, 
        educatorsResult.loading, educatorsXSchoolsResult.loading, schoolsResult.loading]);
    
    return {
        data: enrichedData,
        loading: educatorsResult.loading || educatorsXSchoolsResult.loading || schoolsResult.loading,
        error: educatorsResult.error || educatorsXSchoolsResult.error || schoolsResult.error
    };
};