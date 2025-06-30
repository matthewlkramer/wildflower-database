import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { useSchoolLocations } from '../../hooks/useUnifiedData';
import { useAirtableMutations } from '../../hooks/useAirtableData';
import LocationEditModal from '../modals/LocationEditModal';

const SchoolLocations = ({ school }) => {
    const [showLocationEditModal, setShowLocationEditModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const { data: schoolLocations, loading: locationsLoading, refetch: refetchLocations } = useSchoolLocations(school.id);
    const { updateRecord, deleteRecord, loading: mutationLoading } = useAirtableMutations();
    
    // SchoolLocations component

    const handleEditLocation = (location) => {
        setSelectedLocation(location);
        setShowLocationEditModal(true);
    };

    const handleEndLocationPeriod = async (locationId) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await updateRecord('Locations', locationId, {
                'End Date': today,
                'Current Mailing Address': false,
                'Current Physical Address': false,
                'Currently Active': false
            });

            refetchLocations();
            alert('Location period ended successfully');
        } catch (error) {
            console.error('Error ending location period:', error);
            alert('Failed to end location period. Please try again.');
        }
    };

    const handleDeleteLocation = async (locationId, address) => {
        if (window.confirm(`Are you sure you want to delete the location "${address}"? This action cannot be undone.`)) {
            try {
                await deleteRecord('Locations', locationId);
                refetchLocations();
                alert('Location deleted successfully');
            } catch (error) {
                console.error('Error deleting location:', error);
                alert('Failed to delete location. Please try again.');
            }
        }
    };

    const handleUpdateLocation = async (updatedLocation) => {
        try {
            await updateRecord('Locations', updatedLocation.id, {
                'Address': updatedLocation.address,
                'Location Type': updatedLocation.locationType,
                'Start Date': updatedLocation.startDate,
                'End Date': updatedLocation.endDate || null,
                'Current Mailing Address': updatedLocation.currentMailingAddress,
                'Current Physical Address': updatedLocation.currentPhysicalAddress,
                'Currently Active': updatedLocation.currentlyActive
            });

            refetchLocations();
            alert('Location updated successfully');
        } catch (error) {
            console.error('Error updating location:', error);
            alert('Failed to update location. Please try again.');
        }
    };

    const handleAddLocation = () => {
        // You can implement this to show an "Add Location" modal
        // For now, we'll just show an alert
        alert('Add Location functionality would be implemented here');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Locations</h3>
                <button
                    onClick={handleAddLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                </button>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Mailing Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Physical Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {schoolLocations.map(location => (
                            <tr key={location.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {location.address}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {location.locationType}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {location.startDate || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {location.endDate || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {location.currentMailingAddress ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {location.currentPhysicalAddress ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditLocation(location)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                            disabled={mutationLoading}
                                        >
                                            Edit
                                        </button>
                                        {location.currentlyActive && (
                                            <button
                                                onClick={() => handleEndLocationPeriod(location.id)}
                                                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                                                disabled={mutationLoading}
                                            >
                                                {mutationLoading ? 'Ending...' : 'End period'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteLocation(location.id, location.address)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                            disabled={mutationLoading}
                                        >
                                            {mutationLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {locationsLoading && (
                    <div className="text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading locations...</p>
                        </div>
                    </div>
                )}
                
                {!locationsLoading && schoolLocations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No locations added for this school yet.
                    </div>
                )}
            </div>

            {/* Location Edit Modal */}
            <LocationEditModal
                isOpen={showLocationEditModal}
                onClose={() => {
                    setShowLocationEditModal(false);
                    setSelectedLocation(null);
                }}
                onSubmit={handleUpdateLocation}
                location={selectedLocation}
            />
        </div>
    );
};

export default React.memo(SchoolLocations);