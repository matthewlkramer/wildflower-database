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
            // Try different possible field names for discovery status
            const discoveryStatus = educator['Discovery Status'] || educator.discoveryStatus || educator.Status;
            // Try different possible field names for individual type
            const individualType = educator['Individual Type'] || educator.individualType || educator.Type;

            const isDiscoveryActive = discoveryStatus !== 'Paused';
            const isNotCommunityMember = individualType !== 'Community member';

            const isActive = isDiscoveryActive && isNotCommunityMember;

            if (!isActive) {
                console.log('🚫 Filtering out educator:', educator['Full Name'] || educator.fullName, {
                    discoveryStatus,
                    individualType,
                    isDiscoveryActive,
                    isNotCommunityMember
                });
            }

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