import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Plus, ExternalLink, FileText, Mail, Phone, MapPin } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import DetailRow, { EditableDetailRow } from '../shared/DetailRow';
import Pills from '../shared/Pills';
import TabContainer from '../shared/TabContainer';

// Import hooks
import { 
  useEducatorsXSchools,
  useEducatorNotes,
  useActionSteps,
  useOnlineForms,
  useEarlyCultivation,
  useGuideAssignments,
  useCertifications,
  useEvents
} from '../../hooks/useUnifiedData';

import { useCachedMutations } from '../../hooks/useCachedData';
import { EDUCATOR_TABS } from '../../utils/constants';

const EducatorDetails = ({ educator, onBack, onSchoolOpen }) => {
  const [activeTab, setActiveTab] = useState(EDUCATOR_TABS.SUMMARY);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEducator, setEditedEducator] = useState(educator);
  
  // Get cached mutations
  const { createRecord, updateRecord, deleteRecord, loading: mutationLoading } = useCachedMutations();

  // Safety check
  if (!educator) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Educator Data</h2>
          <p className="text-gray-600 mb-4">Educator data was not provided to this component.</p>
          <button 
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Tab definitions
  const tabs = [
    { id: EDUCATOR_TABS.SUMMARY, label: 'Summary' },
    { id: EDUCATOR_TABS.DEMOGRAPHICS, label: 'Demographics' },
    { id: EDUCATOR_TABS.CONTACT_INFO, label: 'Contact Info' },
    { id: EDUCATOR_TABS.SCHOOLS, label: 'Schools' },
    { id: EDUCATOR_TABS.ONLINE_FORMS, label: 'Online Forms' },
    { id: EDUCATOR_TABS.EARLY_CULTIVATION, label: 'Early Cultivation' },
    { id: EDUCATOR_TABS.GUIDES, label: 'Guides' },
    { id: EDUCATOR_TABS.CERTS, label: 'Certs' },
    { id: EDUCATOR_TABS.NOTES, label: 'Notes' },
    { id: EDUCATOR_TABS.EVENTS, label: 'Events' },
    { id: EDUCATOR_TABS.LINKED_MTGS_EMAILS, label: 'Linked mtgs/emails' }
  ];

  // Conditional data fetching based on active tab
  const { data: allEducatorsXSchools } = useEducatorsXSchools();
  
  const { data: educatorNotes } = useEducatorNotes(
    activeTab === EDUCATOR_TABS.NOTES ? educator.id : null
  );
  
  const { data: actionSteps } = useActionSteps(
    activeTab === EDUCATOR_TABS.NOTES ? educator.id : null
  );
  
  const { data: onlineForms } = useOnlineForms(
    activeTab === EDUCATOR_TABS.ONLINE_FORMS ? educator.id : null
  );
  
  const { data: earlyCultivation } = useEarlyCultivation(
    activeTab === EDUCATOR_TABS.EARLY_CULTIVATION ? educator.id : null
  );
  
  const { data: guideAssignments } = useGuideAssignments(
    activeTab === EDUCATOR_TABS.GUIDES ? educator.id : null
  );
  
  const { data: certifications } = useCertifications(
    activeTab === EDUCATOR_TABS.CERTS ? educator.id : null
  );
  
  const { data: events } = useEvents(
    activeTab === EDUCATOR_TABS.EVENTS ? educator.id : null
  );

  // Edit functionality
  const handleEditSave = async () => {
    try {
      await updateRecord('Educators', educator.id, {
        'First Name': editedEducator.firstName,
        'Last Name': editedEducator.lastName,
        'Current Primary Email Address': editedEducator.email,
        'Primary phone': editedEducator.primaryPhone,
        'Pronouns': editedEducator.pronouns,
        'Discovery status': editedEducator.discoveryStatus,
        'Montessori Certified': editedEducator.montessoriCertified
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating educator:', error);
      alert('Failed to update educator. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditedEducator(educator);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedEducator(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case EDUCATOR_TABS.SUMMARY:
        return renderSummaryTab();
      case EDUCATOR_TABS.DEMOGRAPHICS:
        return renderDemographicsTab();
      case EDUCATOR_TABS.CONTACT_INFO:
        return renderContactInfoTab();
      case EDUCATOR_TABS.SCHOOLS:
        return renderSchoolsTab();
      case EDUCATOR_TABS.ONLINE_FORMS:
        return renderOnlineFormsTab();
      case EDUCATOR_TABS.EARLY_CULTIVATION:
        return renderEarlyCultivationTab();
      case EDUCATOR_TABS.GUIDES:
        return renderGuidesTab();
      case EDUCATOR_TABS.CERTS:
        return renderCertsTab();
      case EDUCATOR_TABS.NOTES:
        return renderNotesTab();
      case EDUCATOR_TABS.EVENTS:
        return renderEventsTab();
      case EDUCATOR_TABS.LINKED_MTGS_EMAILS:
        return (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Linked Meetings/Emails</h3>
            <p>This section will be implemented later</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSummaryTab = () => (
    <div className="space-y-8">
      {/* Edit Button */}
      <div className="flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
          >
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleEditSave}
              disabled={mutationLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm disabled:bg-green-300"
            >
              {mutationLoading ? 'Saving...' : 'Update'}
            </button>
            <button
              onClick={handleEditCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
        {/* Profile Photo */}
        <div className="row-span-3 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-medium text-gray-600">
              {educator.fullName?.split(' ').map(n => n[0]).join('') || '??'}
            </span>
          </div>
        </div>
        
        {/* Basic Info */}
        {isEditing ? (
          <>
            <EditableDetailRow 
              label="First Name" 
              field="firstName" 
              value={editedEducator.firstName}
              onChange={handleInputChange}
              required
            />
            <EditableDetailRow 
              label="Last Name" 
              field="lastName" 
              value={editedEducator.lastName}
              onChange={handleInputChange}
              required
            />
            <EditableDetailRow 
              label="Pronouns" 
              field="pronouns" 
              value={editedEducator.pronouns}
              onChange={handleInputChange}
            />
            <EditableDetailRow 
              label="Primary Email" 
              field="email" 
              value={editedEducator.email}
              onChange={handleInputChange}
              type="email"
            />
            <EditableDetailRow 
              label="Current School" 
              field="currentSchool" 
              value={editedEducator.currentSchool}
              onChange={handleInputChange}
              readonly
            />
            <EditableDetailRow 
              label="Role" 
              field="role" 
              value={editedEducator.role}
              onChange={handleInputChange}
              type="array"
            />
          </>
        ) : (
          <>
            <DetailRow label="First Name" value={educator.firstName} />
            <DetailRow label="Last Name" value={educator.lastName} />
            <DetailRow label="Pronouns" value={educator.pronouns} />
            <DetailRow label="Primary Email" value={educator.email} type="email" />
            <DetailRow label="Current School" value={educator.currentSchool} />
            <DetailRow label="Role" value={educator.role} />
          </>
        )}
      </div>

      {/* Professional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Professional Information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          {isEditing ? (
            <>
              <EditableDetailRow 
                label="Discovery Status" 
                field="discoveryStatus" 
                value={editedEducator.discoveryStatus}
                onChange={handleInputChange}
                type="select"
                options={['Complete', 'In Progress', 'Not Started', 'Paused']}
              />
              <EditableDetailRow 
                label="Montessori Certified" 
                field="montessoriCertified" 
                value={editedEducator.montessoriCertified}
                onChange={handleInputChange}
                type="boolean"
              />
              <EditableDetailRow 
                label="Individual Type" 
                field="individualType" 
                value={editedEducator.individualType}
                onChange={handleInputChange}
                type="select"
                options={['Educator', 'Community Member']}
              />
              <EditableDetailRow 
                label="Primary Phone" 
                field="primaryPhone" 
                value={editedEducator.primaryPhone}
                onChange={handleInputChange}
                type="phone"
              />
            </>
          ) : (
            <>
              <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
              <DetailRow label="Montessori Certified" value={educator.montessoriCertified} />
              <DetailRow label="Individual Type" value={educator.individualType} />
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

  const renderDemographicsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Demographics Information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          <DetailRow label="Race & Ethnicity" value={educator.raceEthnicity} />
          <DetailRow label="Gender" value={educator.gender} />
          <DetailRow label="LGBTQIA+" value={educator.lgbtqia} />
          <DetailRow label="Household Income" value={educator.householdIncome} />
          <DetailRow label="Languages" value={educator.languages} />
        </div>
      </div>
    </div>
  );

  const renderContactInfoTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Email Addresses</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Primary Email</p>
              <p className="text-sm font-medium">{educator.email || '-'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Wildflower Email</p>
              <p className="text-sm font-medium">{educator.wildflowerEmail || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Phone Numbers</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Primary Phone</p>
              <p className="text-sm font-medium">{educator.primaryPhone || '-'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Secondary Phone</p>
              <p className="text-sm font-medium">{educator.secondaryPhone || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Home Address</h3>
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium">{educator.homeAddress || 'No address on file'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchoolsTab = () => {
    // Filter educator's school relationships
    const educatorSchools = allEducatorsXSchools.filter(exs => exs.educatorId === educator.id);
    
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">School Affiliations</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add School Stint
          </button>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
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
              {educatorSchools.map(relationship => (
              <tr key={relationship.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {relationship.schoolName || 'Unknown School'}
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
                  <button
                    onClick={() => onSchoolOpen && onSchoolOpen(relationship.schoolId)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 mr-2"
                  >
                    Open School
                  </button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          {educatorSchools.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No school affiliations found.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOnlineFormsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Online Forms</h3>
      </div>
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-8 text-gray-500">
          No online forms data available yet.
        </div>
      </div>
    </div>
  );

  const renderEarlyCultivationTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Early Cultivation</h3>
      </div>
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-8 text-gray-500">
          No early cultivation data available yet.
        </div>
      </div>
    </div>
  );

  const renderGuidesTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Guide Assignments</h3>
      </div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currently Active</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(guideAssignments || []).length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No guide assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCertsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </button>
      </div>
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-8 text-gray-500">
          No certifications data available yet.
        </div>
      </div>
    </div>
  );

  const renderNotesTab = () => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Educator Notes</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Note
          </button>
        </div>
        
        <div className="space-y-4">
          {(educatorNotes || []).map(note => (
            <div key={note.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{note.createdBy || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{note.createdDate || '-'}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </div>
              </div>
              <div className="text-sm text-gray-900">{note.noteText || ''}</div>
            </div>
          ))}
          {(educatorNotes || []).length === 0 && <div className="text-center py-8 text-gray-500">No notes found.</div>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Action Steps</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Action
          </button>
        </div>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(actionSteps || []).length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    No action steps found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Events</h3>
      </div>
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center py-8 text-gray-500">
          No events data available yet.
        </div>
      </div>
    </div>
  );

  return (
    <TabContainer
      title={educator.fullName || 'Educator Details'}
      onBack={onBack}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </TabContainer>
  );
};

export default React.memo(EducatorDetails);