import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

// Import components
import ResizableDataTable from './shared/ResizableDataTable'; // CAN WE DELETE THE PLAIN DATATABLE.JS FILE?
import SchoolDetails from './schools/SchoolDetails';
import EducatorDetails from './educators/EducatorDetails';
import CharterDetails from './charters/CharterDetails';

// Import refactored components for testing
import SchoolDetailsRefactored from './schools/SchoolDetailsRefactored';
import EducatorDetailsRefactored from './educators/EducatorDetailsRefactored';

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
    const [useRefactored, setUseRefactored] = useState(false); // Toggle for testing
    

    // Navigation
    const { selectedItem, navigateToItem, navigateBack, navigateToEducator, navigateToSchool } = useNavigation();

    // Filters
    const {
        searchTerm,
        setSearchTerm,
        showFilters,
        setShowFilters,
        columnFilters,
        handleColumnFilterChange,
        clearAllFilters,
        hasActiveFilters = false
    } = useFilters();

    // Data fetching - get all data first, then filter
    const schoolsResult = useUnifiedData(TABS.SCHOOLS, { includeInactive: true });
    const educatorsResult = useUnifiedData(TABS.EDUCATORS, { includeInactive: true });
    const chartersResult = useUnifiedData(TABS.CHARTERS);
    

    // Apply filters to the data
    const { includeInactiveSchools, setIncludeInactiveSchools, filteredSchools } = useSchoolFilters(schoolsResult.data);
    const { includeInactiveEducators, setIncludeInactiveEducators, filteredEducators } = useEducatorFilters(educatorsResult.data);

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
    
    // Get loading state based on active tab
    const isLoading = () => {
        switch (mainTab) {
            case TABS.SCHOOLS:
                return schoolsResult.loading;
            case TABS.EDUCATORS:
                return educatorsResult.loading;
            case TABS.CHARTERS:
                return chartersResult.loading;
            default:
                return false;
        }
    };

    // Table columns
    const columns = useTableColumns(mainTab);

    // Tab counts
    const mainTabs = useTabCounts(
        filteredSchools || [],
        schoolsResult.loading,
        filteredEducators || [],
        chartersResult.data || [],
        includeInactiveSchools
    );

    // Event handlers
    const handleRowClick = (item) => {
        navigateToItem(mainTab, item);
    };

    const handleEducatorOpen = (educatorId) => {
        navigateToEducator(educatorId, educatorsResult.data);
    };

    const handleSchoolOpen = (schoolId) => {
        navigateToSchool(schoolId, schoolsResult.data);
    };

    // Show loading state
    if (educatorsResult.loading && mainTab === TABS.EDUCATORS) {
        console.log('🔄 Showing educators loading state');
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
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

    // Render the appropriate detail content
    const renderDetailContent = () => {
        if (!selectedItem) return null;
        
        switch (selectedItem.type) {
            case TABS.SCHOOLS:
                return useRefactored ? 
                    <SchoolDetailsRefactored school={selectedItem.data} onBack={navigateBack} onEducatorOpen={handleEducatorOpen} /> :
                    <SchoolDetails school={selectedItem.data} onBack={navigateBack} onEducatorOpen={handleEducatorOpen} />;
            case TABS.EDUCATORS:
                return useRefactored ?
                    <EducatorDetailsRefactored educator={selectedItem.data} onBack={navigateBack} onSchoolOpen={handleSchoolOpen} /> :
                    <EducatorDetails educator={selectedItem.data} onBack={navigateBack} onSchoolOpen={handleSchoolOpen} />;
            case TABS.CHARTERS:
                return <CharterDetails charter={selectedItem.data} onBack={navigateBack} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header with title and breadcrumb/tabs */}
            <div className="bg-white shadow-sm border-b">
                <div className="w-full px-6 lg:px-8 xl:px-12">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Wildflower</h1>
                                {selectedItem && (
                                    <p className="text-gray-600">
                                        {selectedItem.data.name || selectedItem.data.fullName || selectedItem.data.Name || 'Details'}
                                    </p>
                                )}
                            </div>
                            
                            {/* Test toggle for refactored components */}
                            {selectedItem && (
                                <div className="flex items-center space-x-2 ml-8">
                                    <label className="text-sm text-gray-600">Use Refactored:</label>
                                    <button
                                        onClick={() => setUseRefactored(!useRefactored)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            useRefactored ? 'bg-teal-600' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                useRefactored ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Main tabs - always visible */}
                        <div className="flex space-x-8">
                            {mainTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (selectedItem) {
                                            navigateBack();
                                        }
                                        setMainTab(tab.id);
                                    }}
                                    className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                                        !selectedItem && mainTab === tab.id
                                            ? 'bg-teal-100 text-teal-700'
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
                {selectedItem ? (
                    // Detail view
                    <div className="h-full">
                        {renderDetailContent()}
                    </div>
                ) : (
                    // List view
                    <div className="w-full px-6 lg:px-8 xl:px-12 h-full">
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
                                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
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
                                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-gray-700">Include inactive educators</span>
                                            </label>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className={`p-2 transition-colors ${showFilters
                                                        ? 'text-teal-600 bg-teal-50'
                                                        : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                            >
                                                <Filter className="w-4 h-4" />
                                            </button>

                                            {showFilters && (hasActiveFilters || false) && (
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
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <button 
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center"
                                            style={{ backgroundColor: '#0d9488', color: 'white' }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Data table */}
                            <div className="flex-1 overflow-auto">
                                <ResizableDataTable 
                                data={getCurrentData()}
                                columns={columns}
                                onRowClick={handleRowClick}
                                searchTerm={searchTerm}
                                showFilters={showFilters}
                                columnFilters={columnFilters}
                                onColumnFilterChange={handleColumnFilterChange}
                                tableKey={mainTab} // This saves different widths for schools vs educators vs charters
                                loading={isLoading()} // Pass loading state
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )};

export default WildflowerDatabase;