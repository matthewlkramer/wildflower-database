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
            schoolMap[school.id] = school.shortName || school.Name || school.name;
        });
        
        // Enrich each educator with their current school and role
        return educators.map(educator => {
            // Find all relationships for this educator
            const educatorRelationships = relationships.filter(
                rel => rel.educatorId === educator.id || rel.Educator?.[0] === educator.id
            );
            
            // Find current (active) relationships
            const currentRelationships = educatorRelationships.filter(
                rel => !rel.endDate && !rel['End Date']
            );
            
            // Get current school names and roles
            const currentSchools = [];
            const currentRoles = [];
            
            currentRelationships.forEach(rel => {
                const schoolId = rel.schoolId || rel.School?.[0];
                const schoolName = schoolId ? schoolMap[schoolId] : null;
                if (schoolName) {
                    currentSchools.push(schoolName);
                }
                
                const role = rel.Role || rel.role;
                if (role && !currentRoles.includes(role)) {
                    currentRoles.push(role);
                }
            });
            
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