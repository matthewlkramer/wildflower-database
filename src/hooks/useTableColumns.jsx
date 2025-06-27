import { useMemo } from 'react';
import StatusBadge from '../components/shared/StatusBadge';
import { TABS } from '../utils/constants';

export const useTableColumns = (dataType) => {
    return useMemo(() => {
        switch (dataType) {
            case TABS.SCHOOLS:
                return [
                    { key: 'shortName', label: 'Name' },
                    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
                    { key: 'governanceModel', label: 'Governance' },
                    { key: 'agesServed', label: 'Ages Served', render: (value) => Array.isArray(value) ? value.join(', ') : value },
                    {
                        key: 'location',
                        label: 'Location',
                        render: (value, item) => {
                            // Priority 1: Active location (city, state)
                            if (item.activeLocationCity && item.activeLocationState) {
                                return `${item.activeLocationCity}, ${item.activeLocationState}`;
                            }
                            // Priority 2: Target geo combined
                            if (item.targetCity && item.targetState) {
                                return `${item.targetCity}, ${item.targetState}`;
                            }
                            // Priority 3: Just target city if available
                            if (item.targetCity) {
                                return item.targetCity;
                            }
                            // Priority 4: Blank
                            return '-';
                        }
                    },
                    { key: 'membershipStatus', label: 'Membership', render: (value) => <StatusBadge status={value} /> }
                ];

            case TABS.EDUCATORS:
                return [
                    { key: 'fullName', label: 'Name', render: (value, item) => `${item.firstName} ${item.lastName}` },
                    { key: 'currentSchool', label: 'Current School' },
                    { key: 'role', label: 'Role(s)' },
                    { key: 'email', label: 'Email' },
                    { key: 'raceEthnicity', label: 'Race & Ethnicity', render: (value) => Array.isArray(value) ? value.join(', ') : value || '-' },
                    { key: 'discoveryStatus', label: 'Discovery Status', render: (value) => <StatusBadge status={value} /> }
                ];

            case TABS.CHARTERS:
                return [
                    { key: 'name', label: 'Name' },
                    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
                    { key: 'initialTargetCommunity', label: 'Target Community' }
                ];

            default:
                return [];
        }
    }, [dataType]);
};

