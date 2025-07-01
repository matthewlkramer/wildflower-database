import React from 'react';
import { CheckCircle } from 'lucide-react';
import UnifiedDetail from '../shared/unifiedDetail';
import EducatorSummary from './EducatorSummary';
import DetailRow, { EditableDetailRow } from '../shared/DetailRow';
import StatusBadge from '../shared/StatusBadge';
import Pills from '../shared/Pills';
import { EDUCATOR_TABS } from '../../utils/constants';
import { 
  useEducatorsXSchools,
  useEducatorNotes,
  useOnlineForms,
  useEarlyCultivation,
  useCertifications,
  useEvents,
  useEmailAddresses
} from '../../hooks/useUnifiedData';

const EducatorDetailsRefactored = ({ educator, onBack, onSchoolOpen }) => {
  
  // Get all educator-school relationships for the schools tab
  const { data: allEducatorsXSchools = [] } = useEducatorsXSchools();
  
  // Define data hooks for each tab
  const tabDataHooks = {
    [EDUCATOR_TABS.SCHOOLS]: (educatorId) => {
      const educatorSchools = allEducatorsXSchools.filter(exs => exs.educatorId === educatorId);
      return {
        data: educatorSchools,
        loading: false,
        error: null
      };
    },
    [EDUCATOR_TABS.ONLINE_FORMS]: (educatorId) => useOnlineForms(educatorId),
    [EDUCATOR_TABS.EARLY_CULTIVATION]: (educatorId) => useEarlyCultivation(educatorId),
    [EDUCATOR_TABS.CERTS]: (educatorId) => useCertifications(educatorId),
    [EDUCATOR_TABS.NOTES]: (educatorId) => useEducatorNotes(educatorId),
    [EDUCATOR_TABS.EVENTS]: (educatorId) => useEvents(educatorId),
    [EDUCATOR_TABS.CONTACT_INFO]: (educatorId) => useEmailAddresses(educatorId)
  };

  // Custom summary tab renderer
  const renderSummaryTab = (educator, editState) => {
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
                  'First Name': editedEntity.firstName,
                  'Last Name': editedEntity.lastName,
                  'Middle Name': editedEntity.middleName,
                  'Nickname': editedEntity.nickname,
                  'Pronouns': editedEntity.pronouns,
                  'Contact Email': editedEntity.email
                })}
                disabled={mutationLoading}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm disabled:bg-cyan-300"
              >
                {mutationLoading ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setEditedEntity(educator);
                  setIsEditing(false);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* Educator Summary Component */}
        <EducatorSummary educator={editedEntity} />
        
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2">
            {isEditing ? (
              <>
                <EditableDetailRow label="First Name" field="firstName" value={editedEntity.firstName} onChange={handleInputChange} />
                <EditableDetailRow label="Last Name" field="lastName" value={editedEntity.lastName} onChange={handleInputChange} />
                <EditableDetailRow label="Middle Name" field="middleName" value={editedEntity.middleName} onChange={handleInputChange} />
                <EditableDetailRow label="Nickname" field="nickname" value={editedEntity.nickname} onChange={handleInputChange} />
                <EditableDetailRow label="Pronouns" field="pronouns" value={editedEntity.pronouns} onChange={handleInputChange} />
                <EditableDetailRow label="Primary Email" field="email" value={editedEntity.email} onChange={handleInputChange} type="email" />
              </>
            ) : (
              <>
                <DetailRow label="Full Name" value={educator.fullName} />
                <DetailRow label="Nickname" value={educator.nickname} />
                <DetailRow label="Pronouns" value={educator.pronouns} />
                <DetailRow label="Primary Email" value={educator.email} type="email" />
                <DetailRow label="Current School" value={educator.currentSchool} />
                <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
                <DetailRow label="Montessori Certified" value={educator.montessoriCertified} />
                <DetailRow label="Primary Phone" value={educator.primaryPhone} type="phone" />
              </>
            )}
          </div>
        </div>
        
        {/* Target Location Information */}
        {educator.targetGeography && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Target Location</h3>
            <div className="grid grid-cols-4 gap-x-6 gap-y-2">
              <DetailRow label="Target Geography" value={educator.targetGeography} />
              <DetailRow label="Target City" value={educator.targetCity} />
              <DetailRow label="Target State" value={educator.targetState} />
              <DetailRow label="Target Start Date" value={educator.targetStartDate} type="date" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom renderer for specific tabs
  const renderCustomTab = (tabKey, educator, tabData, editState) => {
    const { isEditing, setIsEditing, editedEntity, handleInputChange, handleEditSave, mutationLoading } = editState;
    
    switch (tabKey) {
      case EDUCATOR_TABS.DEMOGRAPHICS:
        return renderDemographicsTab(educator, editedEntity, isEditing, setIsEditing, handleInputChange, handleEditSave, mutationLoading);
        
      case EDUCATOR_TABS.CONTACT_INFO:
        return renderContactInfoTab(educator, editedEntity, tabData.data, isEditing, setIsEditing, handleInputChange, handleEditSave, mutationLoading);
        
      default:
        return null; // Use default rendering
    }
  };

  // Demographics tab renderer
  const renderDemographicsTab = (educator, editedEntity, isEditing, setIsEditing, handleInputChange, handleEditSave, mutationLoading) => {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm">
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditSave({
                  'Race & Ethnicity': editedEntity.raceEthnicity,
                  'Gender': editedEntity.gender,
                  'LGBTQIA': editedEntity.lgbtqia,
                  'Educational Attainment': editedEntity.educationalAttainment,
                  'Household Income': editedEntity.householdIncome,
                  'Primary Language': editedEntity.primaryLanguage
                })}
                disabled={mutationLoading}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm disabled:bg-cyan-300"
              >
                {mutationLoading ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setEditedEntity(educator);
                  setIsEditing(false);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Demographics Information</h3>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2">
            {isEditing ? (
              <>
                <EditableDetailRow 
                  label="Race & Ethnicity" 
                  field="raceEthnicity" 
                  value={editedEntity.raceEthnicity}
                  onChange={handleInputChange}
                  type="multiselect"
                  options={['African-American, Afro-Caribbean or Black', 'White', 'Asian-American', 'Hispanic, Latino, or Spanish Origin', 'Native American or Alaska Native', 'Middle Eastern or North African', 'Native Hawaiian or Other Pacific Islander', 'A not-listed or more specific ethnicity or origin']}
                />
                <EditableDetailRow 
                  label="Gender" 
                  field="gender" 
                  value={editedEntity.gender}
                  onChange={handleInputChange}
                  type="select"
                  options={['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to answer']}
                />
                <EditableDetailRow label="LGBTQIA+" field="lgbtqia" value={editedEntity.lgbtqia} onChange={handleInputChange} type="boolean" />
                <EditableDetailRow label="Educational Attainment" field="educationalAttainment" value={editedEntity.educationalAttainment} onChange={handleInputChange} />
                <EditableDetailRow label="Household Income" field="householdIncome" value={editedEntity.householdIncome} onChange={handleInputChange} />
                <EditableDetailRow label="Primary Language" field="primaryLanguage" value={editedEntity.primaryLanguage} onChange={handleInputChange} />
              </>
            ) : (
              <>
                <DetailRow label="Race & Ethnicity" value={educator.raceEthnicity} />
                <DetailRow label="Gender" value={educator.gender} />
                <DetailRow label="LGBTQIA+" value={educator.lgbtqia} />
                <DetailRow label="Educational Attainment" value={educator.educationalAttainment} />
                <DetailRow label="Household Income" value={educator.householdIncome} />
                <DetailRow label="Primary Language" value={educator.primaryLanguage} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Contact info tab renderer
  const renderContactInfoTab = (educator, editedEntity, emailAddresses, isEditing, setIsEditing, handleInputChange, handleEditSave, mutationLoading) => {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm">
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditSave({
                  'Primary phone': editedEntity.primaryPhone,
                  'Secondary phone': editedEntity.secondaryPhone,
                  'Home Address': editedEntity.homeAddress
                })}
                disabled={mutationLoading}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm disabled:bg-cyan-300"
              >
                {mutationLoading ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setEditedEntity(educator);
                  setIsEditing(false);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Phone Numbers and Address Row */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2">
            {isEditing ? (
              <>
                <EditableDetailRow label="Primary Phone" field="primaryPhone" value={editedEntity.primaryPhone} onChange={handleInputChange} type="phone" />
                <EditableDetailRow label="Secondary Phone" field="secondaryPhone" value={editedEntity.secondaryPhone} onChange={handleInputChange} type="phone" />
                <EditableDetailRow label="Home Address" field="homeAddress" value={editedEntity.homeAddress} onChange={handleInputChange} />
              </>
            ) : (
              <>
                <DetailRow label="Primary Phone" value={educator.primaryPhone} type="phone" />
                <DetailRow label="Secondary Phone" value={educator.secondaryPhone} type="phone" />
                <DetailRow label="Home Address" value={educator.homeAddress} />
              </>
            )}
          </div>
        </div>

        {/* Email Addresses Table */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Email Addresses</h3>
            <button 
              onClick={() => onActionClick && onActionClick('add', null, 'contact-info')}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm"
            >
              Add Email
            </button>
          </div>
          
          {/* Let the default table renderer handle the email addresses */}
          {tabData.data && tabData.data.length > 0 ? (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tabData.data.map(email => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`mailto:${email.emailAddress}`} className="text-cyan-600 hover:underline">
                          {email.emailAddress || '-'}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{email.emailType || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {email.isPrimary ? <CheckCircle className="w-5 h-5 text-green-600" /> : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{email.notes || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => onActionClick && onActionClick('edit', email, 'contact-info')} className="text-cyan-600 hover:text-cyan-900 mr-3">Edit</button>
                        <button onClick={() => onActionClick && onActionClick('delete', email, 'contact-info')} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6">
              <div className="text-center py-8 text-gray-500">No email addresses found.</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle action clicks
  const handleActionClick = (action, item, tableType) => {
    switch (action) {
      case 'open':
        if (item && item.schoolId) {
          onSchoolOpen(item.schoolId);
        }
        break;
        
      case 'editStint':
        console.log('Edit school stint:', item);
        break;
        
      case 'endStint':
        console.log('End school stint:', item);
        break;
        
      case 'deleteStint':
        if (window.confirm('Are you sure you want to delete this school stint?')) {
          console.log('Delete school stint:', item);
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
      entity={educator}
      entityType="educators"
      onBack={onBack}
      renderSummaryTab={renderSummaryTab}
      renderCustomTab={renderCustomTab}
      tabDataHooks={tabDataHooks}
      onActionClick={handleActionClick}
      title={educator.fullName}
    />
  );
};

export default React.memo(EducatorDetailsRefactored);