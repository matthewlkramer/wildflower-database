import { useState, useMemo } from 'react';

export const useSchoolFilters = (schools) => {
    const [includeInactiveSchools, setIncludeInactiveSchools] = useState(false);

    const filteredSchools = useMemo(() => {
        if (!schools || !Array.isArray(schools)) {
            return [];
        }

        if (includeInactiveSchools) {
            return schools;
        }

        // Filter to only show active schools (Open and Emerging)
        const activeSchools = schools.filter(school => {
            const status = school.status;
            const isActive = status === 'Open' || status === 'Emerging';


            return isActive;
        });

        return activeSchools;
    }, [schools, includeInactiveSchools]);

    return {
        includeInactiveSchools,
        setIncludeInactiveSchools,
        filteredSchools
    };
};