import { useState, useMemo } from 'react';

export const useEducatorFilters = (educatorsData) => {
    const [includeInactiveEducators, setIncludeInactiveEducators] = useState(false);

    const filteredEducators = useMemo(() => {
        if (!educatorsData || !Array.isArray(educatorsData)) {
            return [];
        }

        if (includeInactiveEducators) {
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

        return activeEducators;
    }, [educatorsData, includeInactiveEducators]); // Make sure includeInactiveEducators is in the dependency array

    return {
        includeInactiveEducators,
        setIncludeInactiveEducators,
        filteredEducators
    };
};