import { useState, useMemo } from 'react';

export const useEducatorFilters = (educatorsData) => {
    const [includeInactiveEducators, setIncludeInactiveEducators] = useState(false);

    const filteredEducators = useMemo(() => {
        console.log('🔍 Filtering educators:', {
            totalEducators: educatorsData?.length,
            includeInactive: includeInactiveEducators,
            sampleEducatorsData: educatorsData?.slice(0, 3)
        });

        if (!educatorsData || !Array.isArray(educatorsData)) {
            console.log('⚠️ No educators data or not array');
            return [];
        }

        if (includeInactiveEducators) {
            console.log('✅ Including all educators:', educatorsData.length);
            return educatorsData;
        }

        // Filter to only show active educators
        const activeEducators = educatorsData.filter(educator => {
            // Use correct field names from Airtable
            const discoveryStatus = educator['Discovery status']; // lowercase 's'
            const individualType = educator['Individual Type'];
            const inactiveFlag = educator['Inactive Flag'];

            // Check if educator is active
            const isDiscoveryActive = discoveryStatus !== 'Paused';
            const isNotCommunityMember = individualType !== 'Community member';
            const isNotInactive = !inactiveFlag;

            const isActive = isDiscoveryActive && isNotCommunityMember && isNotInactive;

            return isActive;
        });

        console.log('✅ Active educators filtered:', activeEducators.length, 'out of', educatorsData.length);
        return activeEducators;
    }, [educatorsData, includeInactiveEducators]); // Make sure includeInactiveEducators is in the dependency array

    return {
        includeInactiveEducators,
        setIncludeInactiveEducators,
        filteredEducators
    };
};