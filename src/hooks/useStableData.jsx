// src/hooks/useStableData.jsx
// Custom hook to prevent duplicate data fetching

import { useRef, useEffect, useState } from 'react';

export const useStableData = (fetchFunction, dependencies = []) => {
  const isMountedRef = useRef(true);
  const lastDepsRef = useRef(dependencies);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    // Check if dependencies actually changed
    const depsChanged = dependencies.some((dep, i) => dep !== lastDepsRef.current[i]);
    
    if (!depsChanged && lastDepsRef.current.length === dependencies.length) {
      return; // Skip if dependencies haven't changed
    }

    lastDepsRef.current = dependencies;
    
    // Increment fetch ID to cancel previous fetches
    fetchIdRef.current += 1;
    const currentFetchId = fetchIdRef.current;

    const performFetch = async () => {
      if (!isMountedRef.current || currentFetchId !== fetchIdRef.current) {
        return; // Component unmounted or newer fetch started
      }
      
      await fetchFunction();
    };

    performFetch();
  }, dependencies);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return null;
};

// Hook to debounce values
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};