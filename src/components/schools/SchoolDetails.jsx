// src/components/schools/SchoolDetails.jsx
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Plus, ExternalLink, FileText } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import DetailRow, { EditableDetailRow } from '../shared/DetailRow';
import LocationEditModal from '../modals/LocationEditModal';
import SchoolTLs from './SchoolTLs';
import SchoolLocations from './SchoolLocations';

// Import the hooks and data you need
import { 
  useEducatorsXSchools,
  useSchoolLocations,
  useSchoolNotes,
  useActionSteps,
  useGovernanceDocs,
  useGuideAssignments,
  useGrants,
  useLoans,
  useMembershipFeeRecords,
  useMembershipFeeUpdates
} from '../../hooks/useUnifiedData';

import useUnifiedData from '../../hooks/useUnifiedData';
import { useCachedMutations } from '../../hooks/useCachedData';
import { TABS } from '../../utils/constants';

const SchoolDetails = ({ school, onBack, onEducatorOpen }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchool, setEditedSchool] = useState(school);
  
  console.log('🏫 SchoolDetails - school prop:', school);
  console.log('🏫 School ID:', school?.id);
  
  // Location modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);

  // Safety check - if no school data, show error
  if (!school) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No School Data</h2>
          <p className="text-gray-600 mb-4">School data was not provided to this component.</p>
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

  // Get all educators for the stint functionality
  const { data: allEducators } = useUnifiedData(TABS.EDUCATORS, { includeInactive: true });
  
  // Get educators x schools relationships
  const { data: educatorsXSchools } = useEducatorsXSchools();
  
  // Get cached mutations for data operations
  const { createRecord, updateRecord, deleteRecord, loading: mutationLoading } = useCachedMutations();

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'tls', label: 'TLs' },
    { id: 'locations', label: 'Locations' },
    { id: 'governance', label: 'Governance' },
    { id: 'guides', label: 'Guides' },
    { id: 'ssj-oss', label: 'SSJ / OSS' },
    { id: 'membership-fees', label: 'Membership fees' },
    { id: 'grants-loans', label: 'Grants and Loans' },
    { id: 'linked-mtgs', label: 'Linked mtgs/emails' },
    { id: 'notes-actions', label: 'Notes/Action steps' }
  ];

  // Helper functions for data - using hooks instead of sample data
  const getSchoolEducators = () => {
    return educatorsXSchools?.filter(exs => exs.schoolId === school.id) || [];
  };

  // Get data using hooks
  const { data: schoolLocations, refetch: refetchLocations } = useSchoolLocations(school.id);
  const { data: schoolNotes } = useSchoolNotes(school.id);
  const { data: actionSteps } = useActionSteps(school.id);
  const { data: governanceDocs } = useGovernanceDocs(school.id);
  const { data: guideAssignments } = useGuideAssignments(school.id);
  const { data: grants } = useGrants(school.id);
  const { data: loans } = useLoans(school.id);
  const { data: membershipFeeRecords } = useMembershipFeeRecords(school.id);

  // Edit functionality
  const handleEditSave = () => {
    console.log('Saving school data:', editedSchool);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedSchool(school);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedSchool(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return renderSummaryTab();
      case 'tls':
        return renderTLsTab();
      case 'locations':
        return renderLocationsTab();
      case 'governance':
        return renderGovernanceTab();
      case 'guides':
        return renderGuidesTab();
      case 'ssj-oss':
        return renderSSJOSSTab();
      case 'membership-fees':
        return renderMembershipFeesTab();
      case 'grants-loans':
        return renderGrantsLoansTab();
      case 'notes-actions':
        return renderNotesActionsTab();
      case 'linked-mtgs':
        return (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Linked Meetings/Emails</h3>
            <p>This section will be implemented later</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} content would go here
          </div>
        );
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
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm"
            >
              Update
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
        {/* School Logo */}
        <div className="row-span-3 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        
        {/* Basic Info using enhanced DetailRow */}
        {isEditing ? (
          <>
            <EditableDetailRow 
              label="School Name" 
              field="name" 
              value={editedSchool.name}
              onChange={handleInputChange}
              required
            />
            <EditableDetailRow 
              label="Short Name" 
              field="shortName" 
              value={editedSchool.shortName}
              onChange={handleInputChange}
            />
            <EditableDetailRow 
              label="Ages Served" 
              field="agesServed" 
              value={editedSchool.agesServed}
              onChange={handleInputChange}
              type="array"
              placeholder="Primary, Lower Elementary, etc."
            />
            <EditableDetailRow 
              label="Governance Model" 
              field="governanceModel" 
              value={editedSchool.governanceModel}
              onChange={handleInputChange}
              type="select"
              options={['Independent', 'Charter', 'District']}
            />
            <EditableDetailRow 
              label="Founders" 
              field="founders" 
              value={editedSchool.founders}
              onChange={handleInputChange}
              type="array"
              placeholder="Founder names"
            />
            <EditableDetailRow 
              label="Current TLs" 
              field="currentTLs" 
              value={editedSchool.currentTLs}
              onChange={handleInputChange}
              type="array"
              placeholder="Teacher leader names"
            />
            <EditableDetailRow 
              label="School Open Date" 
              field="schoolOpenDate" 
              value={editedSchool.schoolOpenDate || editedSchool.opened}
              onChange={handleInputChange}
              type="date"
            />
            <EditableDetailRow 
              label="School Status" 
              field="status" 
              value={editedSchool.status}
              onChange={handleInputChange}
              type="select"
              options={['Emerging', 'Open', 'Permanently Closed', 'Disaffiliated', 'Disaffiliating']}
            />
            <EditableDetailRow 
              label="Membership Status" 
              field="membershipStatus" 
              value={editedSchool.membershipStatus}
              onChange={handleInputChange}
              type="select"
              options={['Member School', 'Pending', 'Former Member']}
            />
          </>
        ) : (
          <>
            <DetailRow label="School Name" value={editedSchool.name} />
            <DetailRow label="Short Name" value={editedSchool.shortName} />
            <DetailRow label="Ages Served" value={editedSchool.agesServed} />
            <DetailRow label="Governance Model" value={editedSchool.governanceModel} />
            <DetailRow label="Founders" value={editedSchool.founders} />
            <DetailRow label="Current TLs" value={editedSchool.currentTLs} />
            <DetailRow label="School Open Date" value={editedSchool.schoolOpenDate || editedSchool.opened} type="date" />
            <DetailRow label="School Status" value={<StatusBadge status={editedSchool.status} />} />
            <DetailRow label="Membership Status" value={<StatusBadge status={editedSchool.membershipStatus} />} />
          </>
        )}
      </div>

      {/* Additional School Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">School Information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          {isEditing ? (
            <>
              <EditableDetailRow 
                label="Program Focus" 
                field="programFocus" 
                value={editedSchool.programFocus}
                onChange={handleInputChange}
                placeholder="Nature-based Montessori, etc."
              />
              <EditableDetailRow 
                label="Max Capacity" 
                field="maxCapacityEnrollments" 
                value={editedSchool.maxCapacityEnrollments}
                onChange={handleInputChange}
                type="number"
              />
              <EditableDetailRow 
                label="Number of Classrooms" 
                field="numberOfClassrooms" 
                value={editedSchool.numberOfClassrooms}
                onChange={handleInputChange}
                type="number"
              />
              <EditableDetailRow 
                label="Public Funding" 
                field="publicFunding" 
                value={editedSchool.publicFunding}
                onChange={handleInputChange}
                type="boolean"
              />
            </>
          ) : (
            <>
              <DetailRow label="Program Focus" value={editedSchool.programFocus} />
              <DetailRow label="Max Capacity" value={editedSchool.maxCapacityEnrollments} />
              <DetailRow label="Number of Classrooms" value={editedSchool.numberOfClassrooms} />
              <DetailRow label="Public Funding" value={editedSchool.publicFunding} />
            </>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          {isEditing ? (
            <>
              <EditableDetailRow 
                label="School Email" 
                field="schoolEmail" 
                value={editedSchool.schoolEmail}
                onChange={handleInputChange}
                type="email"
              />
              <EditableDetailRow 
                label="School Phone" 
                field="phone" 
                value={editedSchool.phone}
                onChange={handleInputChange}
                type="phone"
              />
              <EditableDetailRow 
                label="Website" 
                field="website" 
                value={editedSchool.website}
                onChange={handleInputChange}
                type="url"
              />
              <EditableDetailRow 
                label="Email Domain" 
                field="emailDomain" 
                value={editedSchool.emailDomain}
                onChange={handleInputChange}
                placeholder="schoolname.org"
              />
            </>
          ) : (
            <>
              <DetailRow label="School Email" value={editedSchool.schoolEmail} type="email" />
              <DetailRow label="School Phone" value={editedSchool.phone} type="phone" />
              <DetailRow label="Website" value={editedSchool.website} type="url" />
              <DetailRow label="Email Domain" value={editedSchool.emailDomain} />
            </>
          )}
        </div>
      </div>

      {/* Legal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Legal Entity</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          {isEditing ? (
            <>
              <EditableDetailRow 
                label="EIN" 
                field="ein" 
                value={editedSchool.ein}
                onChange={handleInputChange}
                placeholder="99-1234567"
              />
              <EditableDetailRow 
                label="Legal Name" 
                field="legalName" 
                value={editedSchool.legalName}
                onChange={handleInputChange}
              />
              <EditableDetailRow 
                label="Incorporation Date" 
                field="incorporationDate" 
                value={editedSchool.incorporationDate}
                onChange={handleInputChange}
                type="date"
              />
              <EditableDetailRow 
                label="Nonprofit Status" 
                field="nonprofitStatus" 
                value={editedSchool.nonprofitStatus}
                onChange={handleInputChange}
                type="select"
                options={['501(c)(3)', 'group exemption', 'pending', 'for-profit']}
              />
            </>
          ) : (
            <>
              <DetailRow label="EIN" value={editedSchool.ein} />
              <DetailRow label="Legal Name" value={editedSchool.legalName} />
              <DetailRow label="Incorporation Date" value={editedSchool.incorporationDate} type="date" />
              <DetailRow label="Nonprofit Status" value={editedSchool.nonprofitStatus} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderTLsTab = () => {
    return <SchoolTLs school={school} onEducatorOpen={onEducatorOpen} allEducators={allEducators} />;
  };

  const renderLocationsTab = () => {
    return <SchoolLocations school={school} />;
  };

  const renderGovernanceTab = () => {
    return (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Board Members</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />Add Member
            </button>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="text-center py-8 text-gray-500">No board members added yet.</div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Policies and Documents</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />Add Document
            </button>
          </div>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {governanceDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{doc.documentType}</div>
                      {doc.docNotes && <div className="text-sm text-gray-500 mt-1">{doc.docNotes}</div>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{doc.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => window.open(doc.docLink, '_blank')} className="text-blue-600 hover:text-blue-900 mr-3">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {governanceDocs.length === 0 && <div className="text-center py-8 text-gray-500">No governance documents added yet.</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderGuidesTab = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Guide Assignments</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
            <Plus className="w-4 h-4 mr-2" />Add Assignment
          </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guideAssignments.map(assignment => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {assignment.guideShortName?.split(' ').map(n => n[0]).join('') || '??'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{assignment.guideShortName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {assignment.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.endDate || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.currentlyActive ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Open</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {guideAssignments.length === 0 && <div className="text-center py-8 text-gray-500">No guide assignments for this school yet.</div>}
        </div>
      </div>
    );
  };

  const renderSSJOSSTab = () => (
    <div className="grid grid-cols-4 gap-8">
      <div className="space-y-4">
        <DetailRow label="SSJ Stage" value={school.ssjStage} />
        <DetailRow label="SSJ - Target City" value={school.ssjTargetCity} />
        <DetailRow label="SSJ - Board development" value={school.ssjBoardDevelopment} />
        <DetailRow label="SSJ - Has the ETL identified a partner?" value={school.ssjHasETLPartner} />
        <DetailRow label="SSJ - Total Startup Funding Needed" value={school.ssjTotalStartupFunding} type="currency" />
        <DetailRow label="SSJ - Fundraising narrative" value={school.ssjFundraisingNarrative} type="multiline" />
      </div>
      <div className="space-y-4">
        <DetailRow label="SSJ - Original Projected Open Date" value={school.ssjOriginalProjectedOpenDate} type="date" />
        <DetailRow label="SSJ - Target State" value={school.ssjTargetState} />
        <DetailRow label="SSJ - Readiness to Open Rating" value={school.ssjReadinessRating} />
        <DetailRow label="SSJ - Facility" value={school.ssjFacility} />
        <DetailRow label="Building4Good Firm & Attorney" value={school.building4GoodFirm} />
      </div>
      <div className="space-y-4">
        <DetailRow label="SSJ - Proj Open School Year" value={school.ssjProjOpenSchoolYear} />
        <DetailRow label="Risk Factors" value={school.riskFactors} />
        <DetailRow label="Entered Visioning Date" value={school.enteredVisioningDate} type="date" />
        <DetailRow label="Entered Planning Date" value={school.enteredPlanningDate} type="date" />
        <DetailRow label="Entered Startup Date" value={school.enteredStartupDate} type="date" />
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <DetailRow label="SSJ - Projected Open" value={school.ssjProjectedOpen} type="date" />
          <DetailRow label="Watchlist" value={school.watchlist} />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Systems</h4>
          <div className="space-y-4">
            <DetailRow label="Google Voice" value={school.googleVoice} />
            <DetailRow label="Budget Utility" value={school.budgetUtility} />
            <DetailRow label="Admissions System" value={school.admissionsSystem} />
            <DetailRow label="QBO" value={school.qbo} />
            <DetailRow label="Website tool" value={school.websiteTool} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembershipFeesTab = () => {
    const { data: membershipUpdates } = useMembershipFeeUpdates(school.id, selectedSchoolYear);
    const selectedRecord = selectedSchoolYear ? membershipFeeRecords.find(record => record.schoolYear === selectedSchoolYear) : null;

    return (
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <h3 className="text-lg font-semibold mb-4">School Years</h3>
          <div className="space-y-2">
            {membershipFeeRecords.map(record => (
              <button
                key={record.id}
                onClick={() => setSelectedSchoolYear(record.schoolYear)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  selectedSchoolYear === record.schoolYear ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {record.schoolYear}
              </button>
            ))}
            {membershipFeeRecords.length === 0 && <div className="text-center py-8 text-gray-500">No fee records found</div>}
          </div>
        </div>

        <div className="col-span-5">
          {selectedRecord ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedRecord.schoolYear} Details</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <DetailRow label="School Year" value={selectedRecord.schoolYear} />
                  <DetailRow label="Initial Fee" value={selectedRecord.initialFee} type="currency" />
                  <DetailRow label="Revised Amount" value={selectedRecord.revisedAmount} type="currency" />
                  <DetailRow label="Amount Paid" value={selectedRecord.amountPaid} type="currency" />
                  <DetailRow label="Amount Receivable" value={selectedRecord.amountReceivable} type="currency" />
                  <DetailRow label="Revenue" value={selectedRecord.revenue} type="currency" />
                  <DetailRow label="Exemption Status" value={selectedRecord.exemptionStatus} />
                  <DetailRow label="Nth Year" value={selectedRecord.nthYear} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-semibold mb-2">Select a School Year</h3>
              <p>Choose a school year from the left to view fee details</p>
            </div>
          )}
        </div>

        <div className="col-span-4">
          {selectedSchoolYear ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedSchoolYear} Updates</h3>
              <div className="space-y-3">
                {membershipUpdates.map(update => (
                  <div key={update.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{update.updateType}</span>
                      <span className="text-sm text-gray-500">{update.date}</span>
                    </div>
                    {update.amountPaid && (
                      <div className="text-sm text-green-600 mb-1">Amount: ${update.amountPaid.toLocaleString()}</div>
                    )}
                    {update.revisedFeeAmount && (
                      <div className="text-sm text-blue-600 mb-1">New Fee: ${update.revisedFeeAmount.toLocaleString()}</div>
                    )}
                    <div className="text-sm text-gray-600">{update.explanation}</div>
                  </div>
                ))}
                {membershipUpdates.length === 0 && <div className="text-center py-8 text-gray-500">No updates for this school year</div>}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Select a school year to view updates</div>
          )}
        </div>
      </div>
    );
  };

  const renderGrantsLoansTab = () => {
    return (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Grants</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />Create New Grant
            </button>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grants.map(grant => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{grant.issueDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${grant.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grant.issuedBy}</div>
                      <div className="text-sm text-gray-500">{grant.partnerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={grant.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Open</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {grants.length === 0 && <div className="text-center py-8 text-gray-500">No grants found for this school.</div>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Loans</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />Create New Loan
            </button>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map(loan => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{loan.issueDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${loan.amount?.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{(loan.interestRate * 100).toFixed(1)}% interest</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={loan.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Open</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loans.length === 0 && <div className="text-center py-8 text-gray-500">No loans found for this school.</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderNotesActionsTab = () => {
    return (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">School Notes</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />Add Note
            </button>
          </div>
          
          <div className="space-y-4">
            {schoolNotes.map(note => (
              <div key={note.id} className="bg-white border rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {note.createdBy?.split(' ').map(n => n[0]).join('') || '??'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{note.createdBy}</div>
                      <div className="text-sm text-gray-500">{note.createdDate}</div>
                    </div>
                    {note.isPrivate && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Private
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                  </div>
                </div>
                <div className="text-sm text-gray-900">{note.noteText}</div>
              </div>
            ))}
            {schoolNotes.length === 0 && <div className="text-center py-8 text-gray-500">No notes found for this school.</div>}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {actionSteps.map(action => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{action.item}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{action.assignee}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={action.status} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{action.dueDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {actionSteps.length === 0 && <div className="text-center py-8 text-gray-500">No action steps found for this school.</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50 px-6 py-3">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SchoolDetails;