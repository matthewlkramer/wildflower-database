import { useState } from 'react';

export const useEducatorFilters = () => {
    const [includeInactiveEducators, setIncludeInactiveEducators] = useState(false);
    return { includeInactiveEducators, setIncludeInactiveEducators };
};