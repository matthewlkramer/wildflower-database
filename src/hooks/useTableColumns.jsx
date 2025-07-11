import { useMemo } from 'react';
import StatusBadge from '../components/shared/StatusBadge';
import Pills from '../components/shared/Pills';
import { TABS } from '../utils/constants.js';

export const useTableColumns = (dataType) => {
    return useMemo(() => {
        switch (dataType) {
            case 'educators':
                return [
                    {
                        key: 'fullName',
                        label: 'Name',
                        defaultWidth: 100,
                        render: (value, item) => {
                            // Try different possible field names
                            const name = item.fullName || item['Full Name'] || 
                                       (item['First Name'] && item['Last Name'] ? 
                                        `${item['First Name']} ${item['Last Name']}` : '') ||
                                       item.Name || '-';
                            return name;
                        }
                    },
                    {
                        key: 'currentSchool',
                        label: 'Current School',
                        defaultWidth: 160,
                        render: (value, item) => {
                            return item.currentSchool || '-';
                        }
                    },
                    {
                        key: 'stageStatus',
                        label: 'Stage Status',
                        defaultWidth: 120,
                        render: (value, item) => {
                            return item.stageStatus ? <StatusBadge status={item.stageStatus} /> : '-';
                        },
                        filterType: 'multiselect'
                    },
                    {
                        key: 'role',
                        label: 'Role(s)',
                        defaultWidth: 150,
                        render: (value, item) => {
                            return <Pills values={item.role} colorScheme="blue" />;
                        }
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        defaultWidth: 180,
                        render: (value, item) => {
                            return item.email || '-';
                        }
                    },
                    {
                        key: 'raceEthnicity',
                        label: 'Race & Ethnicity',
                        defaultWidth: 200,
                        render: (value, item) => {
                            const values = Array.isArray(item.raceEthnicity) ? item.raceEthnicity : [];
                            
                            // Map full names to shortened versions
                            const shortLabels = {
                                'African-American, Afro-Caribbean or Black': 'Black',
                                'White': 'White',
                                'Asian-American': 'Asian-Am',
                                'Hispanic, Latino, or Spanish Origin': 'Latino',
                                'Native American or Alaska Native': 'Native',
                                'Middle Eastern or North African': 'MENA',
                                'Native Hawaiian or Other Pacific Islander': 'Pac. Isl.',
                                'A not-listed or more specific ethnicity or origin': 'Other',
                                'Other': 'Other'
                            };
                            
                            const shortValues = values.map(v => shortLabels[v] || v);
                            
                            return <Pills values={shortValues} colorScheme="purple" />;
                        },
                        filterType: 'multiselect',
                        // Custom filter options getter
                        getFilterValue: (item) => {
                            const values = Array.isArray(item.raceEthnicity) ? item.raceEthnicity : [];
                            const shortLabels = {
                                'African-American, Afro-Caribbean or Black': 'Black',
                                'White': 'White',
                                'Asian-American': 'Asian-Am',
                                'Hispanic, Latino, or Spanish Origin': 'Latino',
                                'Native American or Alaska Native': 'Native',
                                'Middle Eastern or North African': 'MENA',
                                'Native Hawaiian or Other Pacific Islander': 'Pac. Isl.',
                                'A not-listed or more specific ethnicity or origin': 'Other',
                                'Other': 'Other'
                            };
                            // Return shortened values for filtering
                            return values.map(v => shortLabels[v] || v);
                        }
                    },
                    {
                        key: 'discoveryStatus',
                        label: 'Discovery Status',
                        defaultWidth: 80,
                        render: (value, item) => {
                            return item.discoveryStatus ? <StatusBadge status={item.discoveryStatus} /> : '-';
                        }
                    },
                    {
                        key: 'individualType',
                        label: 'Type',
                        defaultWidth: 60,
                        render: (value, item) => {
                            return item.individualType || '-';
                        }
                    }
                ];

            case 'schools':
                return [
                    { key: 'shortName', label: 'Name' , defaultWidth: 120,},
                    { key: 'status', label: 'Status', defaultWidth: 80, render: (value) => <StatusBadge status={value} />},
                    { key: 'governanceModel', label: 'Governance', defaultWidth: 100},
                    { key: 'agesServed', label: 'Ages Served', defaultWidth: 150, render: (value) => <Pills values={value} colorScheme="green" />},
                    {
                        key: 'location',
                        label: 'Location',
                        defaultWidth: 140,
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
                    { key: 'membershipStatus', label: 'Membership', defaultWidth: 80, render: (value) => <StatusBadge status={value} /> }
                ];

            case 'charters':
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