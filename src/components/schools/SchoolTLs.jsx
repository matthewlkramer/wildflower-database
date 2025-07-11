import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { useEducatorsXSchools } from '../../hooks/useUnifiedData';
import { useCachedMutations } from '../../hooks/useCachedData';
import AddEducatorStintModal from '../modals/AddEducatorStintModal';
import CreateEducatorModal from '../../CreateEducatorModal';
import Pills from '../shared/Pills';

const SchoolTLs = ({ school, onEducatorOpen, allEducators = [], allEducatorsLoading = false }) => {
    const [showAddStintModal, setShowAddStintModal] = useState(false);
    const [showCreateEducatorModal, setShowCreateEducatorModal] = useState(false);

    const { data: educatorsXSchools, loading: educatorsXSchoolsLoading, refetch: refetchEducatorsXSchools } = useEducatorsXSchools();
    const { createRecord, updateRecord, deleteRecord, loading: mutationLoading } = useCachedMutations();

    // Filter relationships for this school and enrich with educator names
    const schoolEducators = useMemo(() => {
        const relationships = educatorsXSchools.filter(exs => {
            return exs.schoolId === school.id;
        });
        
        // Create educator map for quick lookup using the allEducators prop
        const educatorMap = {};
        if (allEducators && allEducators.length > 0) {
            allEducators.forEach(educator => {
                educatorMap[educator.id] = educator;
            });
        }
        
        // Enrich relationships with educator data if available
        return relationships.map(rel => ({
            ...rel,
            // Use the educatorName from the relationship first, then try to enrich from allEducators
            educatorName: rel.educatorName || educatorMap[rel.educatorId]?.['Full Name'] || 'Unknown Educator',
            educatorEmail: educatorMap[rel.educatorId]?.['Current Primary Email Address'] || null
        }));
    }, [educatorsXSchools, school.id, allEducators]);

    const handleEndStint = async (stintId) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await updateRecord('Educators x Schools', stintId, {
                'End Date': today,
                'Currently Active': false
            });

            refetchEducatorsXSchools();
            alert('Stint ended successfully');
        } catch (error) {
            console.error('Error ending stint:', error);
            alert('Failed to end stint. Please try again.');
        }
    };

    const handleDeleteStint = async (stintId, educatorName) => {
        if (window.confirm(`Are you sure you want to delete the connection between ${educatorName} and this school? This action cannot be undone.`)) {
            try {
                await deleteRecord('Educators x Schools', stintId);
                refetchEducatorsXSchools();
                alert('Stint deleted successfully');
            } catch (error) {
                console.error('Error deleting stint:', error);
                alert('Failed to delete stint. Please try again.');
            }
        }
    };

    const handleAddStint = async (newStint) => {
        try {
            await createRecord('Educators x Schools', {
                'Educator': [newStint.educatorId],
                'School': [newStint.schoolId],
                'Start Date': newStint.startDate,
                'Currently Active': newStint.currentlyActive,
                'Roles': newStint.roles
            });

            refetchEducatorsXSchools();
            alert('Educator stint added successfully');
        } catch (error) {
            console.error('Error adding stint:', error);
            alert('Failed to add stint. Please try again.');
        }
    };

    const handleCreateEducator = async ({ educator, stint }) => {
        try {
            // First create the educator
            const newEducatorRecord = await createRecord('Educators', {
                'First Name': educator.firstName,
                'Last Name': educator.lastName,
                'Contact Email': educator.email,
                'Primary phone': educator.phone,
                'Pronouns': educator.pronouns,
                'Discovery status': educator.discoveryStatus,
                'Montessori Certified': educator.montessoriCertified
            });

            // Then create the educator x school relationship
            await createRecord('Educators x Schools', {
                'Educator': [newEducatorRecord.id],
                'School': [stint.schoolId],
                'Start Date': stint.startDate,
                'Currently Active': stint.currentlyActive,
                'Roles': stint.roles
            });

            refetchEducatorsXSchools();
            alert('Educator created and added to school successfully');
        } catch (error) {
            console.error('Error creating educator:', error);
            alert('Failed to create educator. Please try again.');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Teacher Leaders & Staff</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowAddStintModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm"
                        style={{ backgroundColor: '#0d9488', color: 'white' }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add stint for educator in database
                    </button>
                    <button
                        onClick={() => setShowCreateEducatorModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm"
                        style={{ backgroundColor: '#0d9488', color: 'white' }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create new educator in database
                    </button>
                </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                {(educatorsXSchoolsLoading || allEducatorsLoading) ? (
                    <div className="text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                            <p className="text-gray-600">Loading educators...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Educator
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role(s)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Currently Active
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {schoolEducators.map(relationship => (
                            <tr key={relationship.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {(relationship.educatorName && typeof relationship.educatorName === 'string' ? relationship.educatorName.split(' ').map(n => n[0]).join('') : '??')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {relationship.educatorName || 'Unknown Educator'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Pills values={relationship.roles} colorScheme="blue" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {relationship.startDate || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {relationship.endDate || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {relationship.currentlyActive ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEducatorOpen && onEducatorOpen(relationship.educatorId)}
                                            className="bg-teal-600 text-white px-3 py-1 rounded text-xs hover:bg-teal-700"
                                        >
                                            Open
                                        </button>
                                        {relationship.currentlyActive && (
                                            <button
                                                onClick={() => handleEndStint(relationship.id)}
                                                disabled={mutationLoading}
                                                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed"
                                            >
                                                {mutationLoading ? 'Ending...' : 'End stint'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteStint(relationship.id, relationship.educatorName)}
                                            disabled={mutationLoading}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                                        >
                                            {mutationLoading ? 'Deleting...' : 'Delete stint'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {schoolEducators.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No educators assigned to this school yet.
                    </div>
                )}
                    </>
                )}
            </div>

            {/* Modals */}
            <AddEducatorStintModal
                isOpen={showAddStintModal}
                onClose={() => setShowAddStintModal(false)}
                onSubmit={handleAddStint}
                schoolId={school.id}
                allEducators={allEducators}
            />

            <CreateEducatorModal
                isOpen={showCreateEducatorModal}
                onClose={() => setShowCreateEducatorModal(false)}
                onSubmit={handleCreateEducator}
                schoolId={school.id}
            />
        </div>
    );
};

export default React.memo(SchoolTLs);