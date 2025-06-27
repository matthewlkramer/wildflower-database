import { useMemo } from 'react';
import StatusBadge from '../components/shared/StatusBadge';
import { TABS } from '../utils/constants';

export const useTableColumns = (dataType) => {
    return useMemo(() => {
        switch (dataType) {
            case 'educators':
                return [
                    {
                        key: 'fullName',
                        label: 'Full Name',
                        render: (value, item) => `${item.firstName} ${item.lastName}`
                    },
                    {
                        key: 'currentSchool',
                        label: 'Current School',
                        render: (value) => value || '-'
                    },
                    {
                        key: 'role',
                        label: 'Role',
                        render: (value) => value || '-'
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        render: (value) => value || '-'
                    },
                    {
                        key: 'raceEthnicity',
                        label: 'Race & Ethnicity',
                        render: (value) => Array.isArray(value) ? value.join(', ') : value || '-'
                    },
                    {
                        key: 'discoveryStatus',
                        label: 'Discovery Status',
                        render: (value) => value ? <StatusBadge status={value} /> : '-'
                    },
                    {
                        key: 'individualType',
                        label: 'Type',
                        render: (value) => value || '-'
                    }
                ];

            case 'schools':
                return [
                    { key: 'shortName', label: 'Short Name' },
                    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
                    { key: 'governanceModel', label: 'Governance' },
                    { key: 'agesServed', label: 'Ages Served', render: (value) => Array.isArray(value) ? value.join(', ') : value },
                    {
                        key: 'location',
                        label: 'Location',
                        render: (value, item) => {
                            if (item.activeLocationCity && item.activeLocationState) {
                                return `${item.activeLocationCity}, ${item.activeLocationState}`;
                            }
                            if (item.targetCity && item.targetState) {
                                return `${item.targetCity}, ${item.targetState}`;
                            }
                            if (item.targetCity) {
                                return item.targetCity;
                            }
                            return '-';
                        }
                    },
                    { key: 'membershipStatus', label: 'Membership', render: (value) => <StatusBadge status={value} /> }
                ];

            case 'charters':
                return [
                    { key: 'name', label: 'Charter Name' },
                    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
                    { key: 'initialTargetCommunity', label: 'Target Community' }
                ];

            default:
                return [];
        }
    }, [dataType]);
};