// src/hooks/useAllTableData.jsx
// Hook to fetch and cache entire tables once, then filter from cache

import { useState, useEffect, useCallback } from 'react';
import { airtableService } from '../airtableService';
import { dataCache } from '../utils/dataCache';

// Cache key for full table data
const FULL_TABLE_CACHE_KEY = 'fullTableData';

// Tables that need full data for filtering
const TABLES_TO_CACHE = [
  'Locations',
  'Action steps',
  'Governance docs',
  'Guides assignments',
  'Grants',
  'Loans',
  'Membership fee overview',
  'School notes'
];

export const useAllTableData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState({});

  const fetchAllTables = useCallback(async () => {
    try {
      // Check if we have cached data
      const cached = dataCache.get(FULL_TABLE_CACHE_KEY);
      if (cached && cached.data) {
        console.log('✅ Using cached full table data');
        setTableData(cached.data);
        setLoading(false);
        return cached.data;
      }

      // Check if already loading to prevent duplicate requests
      if (dataCache.isLoading(FULL_TABLE_CACHE_KEY)) {
        console.log('⏳ Already loading full table data, waiting...');
        // Wait a bit and check again
        setTimeout(() => {
          const cachedAfterWait = dataCache.get(FULL_TABLE_CACHE_KEY);
          if (cachedAfterWait && cachedAfterWait.data) {
            setTableData(cachedAfterWait.data);
            setLoading(false);
          }
        }, 1000);
        return;
      }

      console.log('🔄 Fetching all table data...');
      setLoading(true);
      dataCache.setLoading(FULL_TABLE_CACHE_KEY, true);

      const data = {};
      
      // Fetch all tables in parallel
      const promises = TABLES_TO_CACHE.map(async (tableName) => {
        try {
          const records = await airtableService.fetchRecords(tableName, { maxRecords: 10000 });
          data[tableName] = records;
        } catch (err) {
          console.error(`❌ Error fetching ${tableName}:`, err);
          data[tableName] = [];
        }
      });

      await Promise.all(promises);

      // Cache the results
      dataCache.set(FULL_TABLE_CACHE_KEY, data);
      
      setTableData(data);
      setLoading(false);
      
      return data;
    } catch (err) {
      console.error('❌ Error fetching table data:', err);
      setError(err);
      setLoading(false);
      dataCache.setLoading(FULL_TABLE_CACHE_KEY, false);
    }
  }, []);

  useEffect(() => {
    fetchAllTables();
  }, [fetchAllTables]);

  // Function to get filtered data for a school
  const getSchoolData = useCallback((tableName, schoolId) => {
    const allRecords = tableData[tableName] || [];
    
    return allRecords.filter(record => {
      // Prioritize school_id field
      if (record.school_id === schoolId) return true;
      
      // Check school_ids array
      if (Array.isArray(record.school_ids) && record.school_ids.includes(schoolId)) return true;
      
      // Check School linked field
      if (Array.isArray(record.School) && record.School.includes(schoolId)) return true;
      
      return false;
    });
  }, [tableData]);

  // Function to refresh data
  const refresh = useCallback(() => {
    dataCache.invalidate(FULL_TABLE_CACHE_KEY);
    return fetchAllTables();
  }, [fetchAllTables]);

  return {
    loading,
    error,
    tableData,
    getSchoolData,
    refresh
  };
};