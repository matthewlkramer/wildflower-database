import { useState, useMemo } from 'react';

export const useSchoolFilters = (schools) => {
    const [includeInactiveSchools, setIncludeInactiveSchools] = useState(false);

    const filteredSchools = useMemo(() => {
        console.log('?? Filtering schools:', {
            totalSchools: schools?.length,
            includeInactive: includeInactiveSchools,
            sampleSchoolsData: schools?.slice(0, 3)
        });

        if (!schools || !Array.isArray(schools)) {
            console.log('? No schools data or not array');
            return [];
        }

        if (includeInactiveSchools) {
            console.log('? Including all schools:', schools.length);
            return schools;
        }

        // Filter to only show active schools (Open and Emerging)
        const activeSchools = schools.filter(school => {
            const status = school.status;
            const isActive = status === 'Open' || status === 'Emerging';


            return isActive;
        });

        console.log('? Active schools filtered:', activeSchools.length, 'out of', schools.length);
        return activeSchools;
    }, [schools, includeInactiveSchools]);

    return {
        includeInactiveSchools,
        setIncludeInactiveSchools,
        filteredSchools
    };
};