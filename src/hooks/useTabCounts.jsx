import { useMemo } from 'react';

export const useTabCounts = (schoolsData, schoolsLoading, educatorsData, chartersData, includeInactiveSchools) => {
    return useMemo(() => {
        const schoolCount = schoolsLoading ? '...' : `${schoolsData.length}${includeInactiveSchools ? '' : ' active'}`;

        return [
            {
                id: 'schools',
                label: 'Schools',
                count: schoolCount
            },
            {
                id: 'educators',
                label: 'Educators',
                count: educatorsData.length
            },
            {
                id: 'charters',
                label: 'Charters',
                count: chartersData.length
            }
        ];
    }, [schoolsData.length, schoolsLoading, educatorsData.length, chartersData.length, includeInactiveSchools]);
};