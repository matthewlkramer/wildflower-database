import { useMemo } from 'react';

export const useTabCounts = (schoolsData, schoolsLoading, educatorsData, chartersData, includeInactiveSchools) => {
    return useMemo(() => {
        const schoolCount = schoolsLoading ? '...' : `${schoolsData?.length || 0}${includeInactiveSchools ? '' : ' active'}`;

        return [
            {
                id: 'schools',
                label: 'Schools',
                count: schoolCount
            },
            {
                id: 'educators',
                label: 'Educators',
                count: educatorsData?.length || 0
            },
            {
                id: 'charters',
                label: 'Charters',
                count: chartersData?.length || 0
            }
        ];
    }, [schoolsData?.length, schoolsLoading, educatorsData?.length, chartersData?.length, includeInactiveSchools]);
};