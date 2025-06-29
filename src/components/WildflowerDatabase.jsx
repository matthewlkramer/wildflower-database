import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

// Import components
import DataTable from './shared/DataTable';
import SchoolDetails from './schools/SchoolDetails';
import EducatorDetails from './educators/EducatorDetails';
import CharterDetails from './charters/CharterDetails';

// Import hooks
import useUnifiedData from '../hooks/useUnifiedData';
import { useNavigation } from '../hooks/useNavigation';
import { useFilters } from '../hooks/useFilters';
import { useSchoolFilters } from '../hooks/useSchoolFilters';
import { useTableColumns } from '../hooks/useTableColumns';
import { useTabCounts } from '../hooks/useTabCounts';
import { useEducatorFilters } from '../hooks/useEducatorFilters';

// Import constants
import { TABS } from '../utils/constants.js';

const WildflowerDatabase = () => {
    const [mainTab, setMainTab] = useState(TABS.SCHOOLS);

    // Navigation
    const { selectedItem, navigateToItem, navigateBack, navigateToEducator } = useNavigation();

    // Filters
    const {
        searchTerm,
        setSearchTerm,
        showFilters,
        setShowFilters,
        columnFilters,
        handleColumnFilterChange,
        clearAllFilters,
        hasActiveFilters
    } = useFilters();

    // Data fetching - FIXED: Get all data first, then filter
    const schoolsResult = useUnifiedData(TABS.SCHOOLS, { includeInactive: true });
    const educatorsResult = useUnifiedData(TABS.EDUCATORS, { includeInactive: true }); // Always get all data
    const chartersResult = useUnifiedData(TABS.CHARTERS);

    // Apply filters to the data
    const { includeInactiveSchools, setIncludeInactiveSchools, filteredSchools } = useSchoolFilters(schoolsResult.data);
    const { includeInactiveEducators, setIncludeInactiveEducators, filteredEducators } = useEducatorFilters(educatorsResult.data);
    // Add this temporary test after your hooks
    useEffect(() => {
        const testEducatorsAPI = async () => {
            try {
                console.log('🧪 Testing Educators API directly...');
                const { airtableService } = await import('../airtableService.jsx');
                const allEducators = await airtableService.fetchEducators(true);
                console.log('🧪 Direct API call result:', allEducators.length, 'educators');
            } catch (error) {
                console.error('🧪 Direct API test failed:', error);
            }
        };

        testEducatorsAPI();
    }, []); // Run once on mount


    // Get current data based on active tab
    const getCurrentData = () => {
        switch (mainTab) {
            case TABS.SCHOOLS:
                return filteredSchools || [];
            case TABS.EDUCATORS:
                return filteredEducators || [];
            case TABS.CHARTERS:
                return chartersResult.data || [];
            default:
                return [];
        }
    };

    // Table columns
    const columns = useTableColumns(mainTab);

    // Tab counts - FIXED: Use filtered educators length
    const mainTabs = useTabCounts(
        filteredSchools || [],
        schoolsResult.loading,
        filteredEducators || [], // Use filtered educators for count
        chartersResult.data || [],
        includeInactiveSchools
    );

    // Event handlers
    const handleRowClick = (item) => {
        console.log('Row clicked, item:', item);
        navigateToItem(mainTab, item);
    };

    const handleEducatorOpen = (educatorId) => {
        navigateToEducator(educatorId, educatorsResult.data);
    };

    // Show loading state
    if (educatorsResult.loading && mainTab === TABS.EDUCATORS) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading educators data...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (educatorsResult.error && mainTab === TABS.EDUCATORS) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading educators data</p>
                    <p className="text-gray-600">{educatorsResult.error.message}</p>
                </div>
            </div>
        );
    }

    // If viewing details, render the appropriate detail component
    if (selectedItem) {
        switch (selectedItem.type) {
            case TABS.SCHOOLS:
                return <SchoolDetails school={selectedItem.data} onBack={navigateBack} onEducatorOpen={handleEducatorOpen} />;
            case TABS.EDUCATORS:
                return <EducatorDetails educator={selectedItem.data} onBack={navigateBack} />;
            case TABS.CHARTERS:
                return <CharterDetails charter={selectedItem.data} onBack={navigateBack} />;
            default:
                return null;
        }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header with title and main tabs */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Wildflower Schools Database</h1>
                            <p className="text-gray-600">Manage schools, educators, and network data</p>
                        </div>

                        {/* Main tabs */}
                        <div className="flex space-x-8">
                            {mainTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setMainTab(tab.id)}
                                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors ${mainTab === tab.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
                    <div className="bg-white rounded-lg shadow h-full flex flex-col">
                        {/* Controls bar */}
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    {/* Left side - empty for now */}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Status Filter Toggle */}
                                    {mainTab === TABS.SCHOOLS && (
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={includeInactiveSchools}
                                                onChange={(e) => setIncludeInactiveSchools(e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">Include inactive schools</span>
                                        </label>
                                    )}

                                    {mainTab === TABS.EDUCATORS && (
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={includeInactiveEducators}
                                                onChange={(e) => setIncludeInactiveEducators(e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">Include inactive educators</span>
                                        </label>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className={`p-2 transition-colors ${showFilters
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <Filter className="w-4 h-4" />
                                        </button>

                                        {(showFilters && hasActiveFilters) && (
                                            <button
                                                onClick={clearAllFilters}
                                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Data table */}
                        <div className="flex-1 overflow-auto">
                            <DataTable
                                data={getCurrentData()}
                                columns={columns}
                                onRowClick={handleRowClick}
                                searchTerm={searchTerm}
                                showFilters={showFilters}
                                columnFilters={columnFilters}
                                onColumnFilterChange={handleColumnFilterChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WildflowerDatabase;