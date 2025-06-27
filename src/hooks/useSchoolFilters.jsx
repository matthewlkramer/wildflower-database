import { useState, useMemo } from 'react';

export const useSchoolFilters = (schools) => {
    const [includeInactiveSchools, setIncludeInactiveSchools] = useState(false);

    const filteredSchools = useMemo(() => {
        if (!schools) return [];

        if (includeInactiveSchools) {
            return schools;
        }

        // Filter out inactive schools
        return schools.filter(school =>
            school.status !== 'Permanently Closed' &&
            school.status !== 'Disaffiliated' &&
            school.status !== 'Disaffiliating' &&
            school.status !== 'Paused'
        );
    }, [schools, includeInactiveSchools]);

    return {
        includeInactiveSchools,
        setIncludeInactiveSchools,
        filteredSchools
    };
};

