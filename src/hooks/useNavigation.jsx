// src/hooks/useNavigation.jsx
import { useState, useCallback } from 'react';

export const useNavigation = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const navigateToItem = useCallback((type, data) => {
    console.log('Navigating to:', type, data.name || data.firstName);
    setSelectedItem({ type, data });
  }, []);

  const navigateBack = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const navigateToEducator = useCallback((educatorId, allEducators) => {
    const educator = allEducators.find(ed => ed.id === educatorId);
    if (educator) {
      setSelectedItem({ type: 'educators', data: educator });
    }
  }, []);

  return { 
    selectedItem, 
    navigateToItem, 
    navigateBack, 
    navigateToEducator 
  };
};

// src/hooks/useFilters.js
import { useState, useCallback, useMemo } from 'react';

export const useFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  const handleColumnFilterChange = useCallback((columnKey, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
    setSearchTerm('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchTerm.trim() || Object.keys(columnFilters).some(key => {
      const filter = columnFilters[key];
      if (Array.isArray(filter)) return filter.length > 0;
      return filter && filter.trim();
    });
  }, [searchTerm, columnFilters]);

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    columnFilters,
    setColumnFilters,
    handleColumnFilterChange,
    clearAllFilters,
    hasActiveFilters
  };
};

// src/hooks/useSchoolFilters.js
import { useState, useMemo } from 'react';

export const useSchoolFilters = (schools) => {
  const [includeInactiveSchools, setIncludeInactiveSchools] = useState(false);

  const filteredSchools = useMemo(() => {
    if (!schools) return [];
    
    if (includeInactiveSchools) {
      return schools;
    }
    
    // Filter out inactive schools
    return schools.filter(school => 
      school.status !== 'Permanently Closed' && 
      school.status !== 'Disaffiliated' && 
      school.status !== 'Disaffiliating'
    );
  }, [schools, includeInactiveSchools]);

  return {
    includeInactiveSchools,
    setIncludeInactiveSchools,
    filteredSchools
  };
};

// src/hooks/useTableColumns.js
import { useMemo } from 'react';
import StatusBadge from '../components/shared/StatusBadge';
import { TABS } from '../utils/constants';

export const useTableColumns = (dataType) => {
  return useMemo(() => {
    switch (dataType) {
      case TABS.SCHOOLS:
        return [
          { key: 'shortName', label: 'Short Name' },
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
          { key: 'fullName', label: 'Full Name', render: (value, item) => `${item.firstName} ${item.lastName}` },
          { key: 'currentSchool', label: 'Current School' },
          { key: 'role', label: 'Role' },
          { key: 'email', label: 'Email' },
          { key: 'raceEthnicity', label: 'Race & Ethnicity', render: (value) => Array.isArray(value) ? value.join(', ') : value || '-' },
          { key: 'discoveryStatus', label: 'Discovery Status', render: (value) => <StatusBadge status={value} /> }
        ];

      case TABS.CHARTERS:
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

// src/hooks/useTabCounts.js
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