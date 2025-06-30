import { useMemo } from 'react';
import StatusBadge from '../components/shared/StatusBadge';
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
                            // Log first item only to see field structure
                            if (!window._educatorLogged) {
                                console.log('🔍 Educator item fields:', Object.keys(item));
                                console.log('🔍 Full educator item:', item);
                                window._educatorLogged = true;
                            }
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
                            // Handle array of school names or single school
                            const schools = item['Current Schools'] || item.currentSchool || item['Current School'];
                            if (Array.isArray(schools)) {
                                return schools.join(', ') || '-';
                            }
                            return schools || '-';
                        }
                    },
                    {
                        key: 'role',
                        label: 'Role(s)',
                        defaultWidth: 120,
                        render: (value, item) => {
                            const role = item.Role || item.role || item['Primary Role'] || item.Roles;
                            if (Array.isArray(role)) {
                                return role.join(', ') || '-';
                            }
                            return role || '-';
                        }
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        defaultWidth: 180,
                        render: (value, item) => {
                            return item.Email || item.email || item['Primary Email'] || '-';
                        }
                    },
                    {
                        key: 'raceEthnicity',
                        label: 'Race & Ethnicity',
                        defaultWidth: 100,
                        render: (value, item) => {
                            const race = item['Race & Ethnicity'] || item.raceEthnicity || item['Race/Ethnicity'];
                            if (Array.isArray(race)) {
                                return race.join(', ') || '-';
                            }
                            return race || '-';
                        }
                    },
                    {
                        key: 'discoveryStatus',
                        label: 'Discovery Status',
                        defaultWidth: 80,
                        render: (value, item) => {
                            const status = item['Discovery Status'] || item.discoveryStatus || item.Status;
                            return status ? <StatusBadge status={status} /> : '-';
                        }
                    },
                    {
                        key: 'individualType',
                        label: 'Type',
                        defaultWidth: 60,
                        render: (value, item) => {
                            return item['Individual Type'] || item.individualType || item.Type || '-';
                        }
                    }
                ];

            case 'schools':
                return [
                    { key: 'shortName', label: 'Name' , defaultWidth: 120,},
                    { key: 'status', label: 'Status', defaultWidth: 80, render: (value) => <StatusBadge status={value} />},
                    { key: 'governanceModel', label: 'Governance', defaultWidth: 100},
                    { key: 'agesServed', label: 'Ages Served', defaultWidth: 100, render: (value) => Array.isArray(value) ? value.join(', ') : value},
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