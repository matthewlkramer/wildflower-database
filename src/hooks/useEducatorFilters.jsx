import { useState, useMemo } from 'react';

export const useEducatorFilters = (educators) => {
    const [includeInactiveEducators, setIncludeInactiveEducators] = useState(false);

    const filteredEducators = useMemo(() => {
        console.log('🔍 Filtering educators:', {
            totalEducators: educators?.length,
            includeInactive: includeInactiveEducators
        });

        if (!educators || !Array.isArray(educators)) {
            console.log('❌ No educators data or not array');
            return [];
        }

        if (includeInactiveEducators) {
            console.log('✅ Including all educators:', educators.length);
            return educators;
        }

        console.log('✅ Active educators already filtered:', educators.length);
        return educators;
    }, [educators, includeInactiveEducators]);

    return {
        includeInactiveEducators,
        setIncludeInactiveEducators,
        filteredEducators
    };
};