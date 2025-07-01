import React from 'react';
import UnifiedDetail from '../shared/UnifiedDetail';
import SchoolSummary from './SchoolSummary';
import DetailRow, { EditableDetailRow } from '../shared/DetailRow';
import StatusBadge from '../shared/StatusBadge';
import Pills from '../shared/Pills';
import { SCHOOL_TABS } from '../../utils/constants';
import { 
  useSchoolLocations,
  useSchoolNotes,
  useActionSteps,
  useGrants,
  useLoans,
  useGuideAssignments,
  useGovernanceDocs,
  useMembershipFeeRecords
} from '../../hooks/useUnifiedData';

const SchoolDetailsRefactored = ({ school, onBack, onEducatorOpen }) => {
  
  // Define data hooks for each tab
  const tabDataHooks = {
    [SCHOOL_TABS.LOCATIONS]: (schoolId) => useSchoolLocations(schoolId),
    [SCHOOL_TABS.GUIDES]: (schoolId) => useGuideAssignments(schoolId),
    [SCHOOL_TABS.GRANTS_LOANS]: (schoolId) => {
      const grants = useGrants(schoolId);
      const loans = useLoans(schoolId);
      return {
        data: { grants: grants.data, loans: loans.data },
        loading: grants.loading || loans.loading,
        error: grants.error || loans.error
      };
    },
    [SCHOOL_TABS.GOVERNANCE]: (schoolId) => useGovernanceDocs(schoolId),
    [SCHOOL_TABS.NOTES_ACTIONS]: (schoolId) => {
      const notes = useSchoolNotes(schoolId);
      const actionSteps = useActionSteps(schoolId);
      return {
        data: { notes: notes.data, actionSteps: actionSteps.data },
        loading: notes.loading || actionSteps.loading,
        error: notes.error || actionSteps.error
      };
    },
    [SCHOOL_TABS.MEMBERSHIP_FEES]: (schoolId) => useMembershipFeeRecords(schoolId)
  };

  // Custom summary tab renderer
  const renderSummaryTab = (school, editState) => {
    const { isEditing, setIsEditing, editedEntity, handleInputChange, handleEditSave, mutationLoading } = editState;
    
    return (
      <div className="space-y-8">
        {/* Edit Button */}
        <div className="flex justify-end">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditSave({
                  'Name': editedEntity.name,
                  'Short Name': editedEntity.shortName,
                  'School Status': editedEntity.status,
                  'School Phone': editedEntity.phone,
                  'Website': editedEntity.website,
                  'School Email': editedEntity.schoolEmail
                })}
                disabled={mutationLoading}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm disabled:bg-cyan-300"
              >
                {mutationLoading ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setEditedEntity(school);
                  setIsEditing(false);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* School Summary Component */}
        <SchoolSummary school={editedEntity} />
        
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2">
            {isEditing ? (
              <>
                <EditableDetailRow label="School Name" field="name" value={editedEntity.name} onChange={handleInputChange} />
                <EditableDetailRow label="Short Name" field="shortName" value={editedEntity.shortName} onChange={handleInputChange} />
                <EditableDetailRow label="Status" field="status" value={editedEntity.status} onChange={handleInputChange} type="select" options={['Visioning', 'Planning', 'Operating', 'Closed']} />
                <EditableDetailRow label="Phone" field="phone" value={editedEntity.phone} onChange={handleInputChange} type="phone" />
                <EditableDetailRow label="Website" field="website" value={editedEntity.website} onChange={handleInputChange} type="url" />
                <EditableDetailRow label="Email" field="schoolEmail" value={editedEntity.schoolEmail} onChange={handleInputChange} type="email" />
              </>
            ) : (
              <>
                <DetailRow label="School Name" value={school.name} />
                <DetailRow label="Short Name" value={school.shortName} />
                <DetailRow label="Status" value={<StatusBadge status={school.status} />} />
                <DetailRow label="Phone" value={school.phone} type="phone" />
                <DetailRow label="Website" value={school.website} type="url" />
                <DetailRow label="Email" value={school.schoolEmail} type="email" />
              </>
            )}
          </div>
        </div>
        
        {/* Additional sections can be added here */}
      </div>
    );
  };

  // Custom renderer for specific tabs that need special handling
  const renderCustomTab = (tabKey, school, tabData, editState) => {
    switch (tabKey) {
      case SCHOOL_TABS.NOTES_ACTIONS:
        // Custom renderer for notes tab with sections
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">School Notes</h3>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm">
                  Add Note
                </button>
              </div>
              {/* Notes table would go here */}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Action Steps</h3>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm">
                  Add Action Step
                </button>
              </div>
              {/* Action steps table would go here */}
            </div>
          </div>
        );
        
      default:
        return null; // Use default rendering
    }
  };

  // Handle action clicks
  const handleActionClick = (action, item, tableType) => {
    switch (action) {
      case 'open':
        if (item && item.schoolId) {
          // Navigate to school
        }
        break;
        
      case 'edit':
        console.log(`Edit ${tableType}:`, item);
        break;
        
      case 'delete':
        if (window.confirm(`Are you sure you want to delete this ${tableType}?`)) {
          console.log(`Delete ${tableType}:`, item);
        }
        break;
        
      case 'add':
        console.log(`Add new ${tableType}`);
        break;
        
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  return (
    <UnifiedDetail
      entity={school}
      entityType="schools"
      onBack={onBack}
      renderSummaryTab={renderSummaryTab}
      renderCustomTab={renderCustomTab}
      tabDataHooks={tabDataHooks}
      onActionClick={handleActionClick}
      title={school.name}
    />
  );
};

export default React.memo(SchoolDetailsRefactored);