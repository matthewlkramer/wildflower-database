// src/hooks/useMemoizedOptions.js
// Hook to properly memoize options objects to prevent unnecessary re-renders

import { useMemo } from 'react';

export const useMemoizedOptions = (options) => {
  return useMemo(() => {
    // Create a stable options object
    return options;
  }, [JSON.stringify(options)]);
};