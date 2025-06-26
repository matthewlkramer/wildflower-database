import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ExternalLink, ArrowLeft, CheckCircle, XCircle, FileText } from 'lucide-react';
import './App.css';

// Sample data
const sampleSchools = [
  {
    id: 'rec1',
    name: 'Yellow Rose Montessori',
    shortName: 'Yellow Rose',
    status: 'Emerging',
    governanceModel: 'Independent',
    agesServed: ['Primary'],
    opened: null,
    founders: ['Ashten Sommer', 'Gabrielle Tyree'],
    membershipStatus: 'Member School',
    membershipAgreementDate: '5/28/2024',
    location: 'Austin, TX',
    phone: null,
    website: 'https://www.yellowrosemontessori.org/',
    emailDomain: 'yellowrosemontessori.org',
    pod: 'TX Pod',
    ein: '99-2818038',
    legalName: 'Yellow Rose Montessori',
    incorporationDate: '4/9/2024',
    nonprofitStatus: 'group exemption',
    groupExemptionStatus: 'Active',
    dateReceivedGroupExemption: '5/30/2024',
    currentFYEnd: '6/30',
    nondiscriminationOnApplication: true,
    nondiscriminationOnWebsite: true,
    guidestarRequested: true,
    flexibleTuitionModel: false,
    activePodMember: 'Yes, regular attendee/role holder',
    // SSJ/OSS Data
    ssjStage: 'Startup',
    ssjTargetCity: 'Houston',
    ssjTargetState: 'TX',
    ssjOriginalProjectedOpenDate: '9/10/2024, 12:00 AM',
    ssjProjOpenSchoolYear: '2027',
    ssjProjectedOpen: '9/1/2026, 12:00 AM',
    riskFactors: '-',
    watchlist: '-',
    ssjBoardDevelopment: 'Board is forming, 1-2 mtgs',
    ssjCohortStatus: '-',
    enteredVisioningDate: '1/9/2024, 12:00 AM',
    cohorts: '-',
    visioningAlbumComplete: '-',
    ssjHasETLPartner: 'No partner',
    ssjOpsGuideTrack: '1:1 Support',
    enteredPlanningDate: '3/14/2024, 12:00 AM',
    planningAlbum: '-',
    ssjReadinessRating: 'Low',
    ssjTool: 'My Wildflower - Sensible Default',
    enteredStartupDate: '5/28/2024, 12:00 AM',
    logoDesigner: 'internal design',
    trademarkFiled: '-',
    nameSelectionProposal: '-',
    ssjNameReserved: 'reserved',
    ssjFacility: 'Searching, intending to rent',
    building4GoodFirm: '-',
    ssjBuilding4GoodStatus: '-',
    ssjDateSharedN4G: '-',
    ssjAmountRaised: '-',
    ssjGapInFunding: '-',
    ssjLoanApprovedAmt: '-',
    ssjLoanEligibility: '-',
    ssjTotalStartupFunding: '$200,000',
    ssjViablePathway: 'Maybe, prospects identified but not secured',
    ssjFundraisingNarrative: 'Biggest barrier is finding a facility. Funding gap is complicated, without a facility.',
    ssjInternalFunding: 'Yes, loan',
    ssjBudgetStage: '-',
    ssjEnrollmentTrack: '-',
    ssjNextDecision: 'Pre-program office with Daniela, Maya and team for Powell app',
    // Systems
    googleVoice: '-',
    budgetUtility: '-',
    admissionsSystem: 'TC',
    billComAccount: '-',
    bookkeeper: '-',
    businessInsurance: '-',
    tcRecordkeeping: '-',
    tcAdmissions: '-',
    qbo: 'internal license - active',
    tcSchoolId: '-',
    websiteTool: 'Wix v2',
    gusto: '-'
  },
  {
    id: 'rec2',
    name: 'Wildflower Montessori School Boston',
    shortName: 'WF Boston',
    status: 'Open',
    governanceModel: 'Independent',
    agesServed: ['Primary', 'Lower Elementary'],
    opened: '2018-09-01',
    founders: ['Sarah Johnson'],
    membershipStatus: 'Member School',
    location: 'Boston, MA',
    phone: '(617) 555-0123',
    website: 'https://boston.wildflowerschools.org',
    pod: 'Mass: Broadway'
  }
];

const sampleEducators = [
  {
    id: 'ed1',
    firstName: 'Ashten',
    lastName: 'Sommer',
    email: 'ashten@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    montessoriCertified: true,
    pronouns: 'she/her/hers',
    phone: '(512) 555-0789',
    discoveryStatus: 'Complete',
    // Demographics
    raceEthnicity: ['African-American', 'Hispanic, Latino, or Spanish Origin'],
    gender: 'Female/Woman',
    householdIncome: 'Upper Income',
    lgbtqia: false,
    primaryLanguage: 'English',
    otherLanguages: ['Spanish - Español'],
    // Contact Info
    primaryPersonalEmail: 'ashten.personal@gmail.com',
    wildflowerEmail: 'ashten@wildflowerschools.org',
    otherPersonalEmails: '',
    primaryWorkEmail: 'ashten@yellowrosemontessori.org',
    homeAddress: '456 Oak Street, Austin, TX 78704',
    secondaryPhone: '(512) 555-1234'
  },
  {
    id: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    email: 'gabrielle@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    montessoriCertified: false,
    pronouns: 'she/her/hers',
    phone: '(512) 555-0321',
    discoveryStatus: 'Complete',
    // Demographics
    raceEthnicity: ['White'],
    gender: 'Female/Woman',
    householdIncome: 'Middle Income',
    lgbtqia: true,
    primaryLanguage: 'English',
    otherLanguages: [],
    // Contact Info
    primaryPersonalEmail: 'gabrielle.personal@gmail.com',
    wildflowerEmail: 'gabrielle@wildflowerschools.org',
    otherPersonalEmails: 'gabi.alt@hotmail.com',
    primaryWorkEmail: 'gabrielle@yellowrosemontessori.org',
    homeAddress: '789 Pine Avenue, Austin, TX 78705',
    secondaryPhone: '(512) 555-5678'
  },
  {
    id: 'ed3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@wildflowerschools.org',
    currentSchool: 'WF Boston',
    role: 'Teacher Leader',
    montessoriCertified: true,
    pronouns: 'she/her/hers',
    phone: '(617) 555-0789',
    discoveryStatus: 'Complete',
    // Demographics
    raceEthnicity: ['White', 'Hispanic, Latino, or Spanish Origin'],
    gender: 'Female/Woman',
    householdIncome: 'Middle Income',
    lgbtqia: false,
    primaryLanguage: 'English',
    otherLanguages: ['Spanish - Español'],
    // Contact Info
    primaryPersonalEmail: 'sarah.personal@gmail.com',
    wildflowerEmail: 'sarah.johnson@wildflowerschools.org',
    otherPersonalEmails: 'sarah.alt@yahoo.com',
    primaryWorkEmail: 'sarah@bostonmontessori.org',
    homeAddress: '123 Beacon St, Boston, MA 02116',
    secondaryPhone: '(617) 555-9876'
  }
];

const sampleCharters = [
  {
    id: 'ch1',
    name: 'Denver Charter Network',
    shortName: 'Denver Charter',
    status: 'Applying',
    initialTargetCommunity: 'Denver Metro',
    schools: ['Denver Wildflower Site 1', 'Denver Wildflower Site 2'],
    totalEmergingSchools: 2,
    totalOpenSchools: 0
  }
];

// Educators x Schools relationship data
const sampleEducatorsXSchools = [
  {
    id: 'exs1',
    educatorId: 'ed1',
    schoolId: 'rec1', // Yellow Rose
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true,
    roles: ['Founder', 'Teacher Leader'],
    educatorName: 'Ashten Sommer'
  },
  {
    id: 'exs2',
    educatorId: 'ed2',
    schoolId: 'rec1', // Yellow Rose
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true,
    roles: ['Founder'],
    educatorName: 'Gabrielle Tyree'
  },
  {
    id: 'exs3',
    educatorId: 'ed3',
    schoolId: 'rec2', // WF Boston
    startDate: '2018-09-01',
    endDate: null,
    currentlyActive: true,
    roles: ['Teacher Leader'],
    educatorName: 'Sarah Johnson'
  },
  {
    id: 'exs4',
    educatorId: 'ed1',
    schoolId: 'rec2', // WF Boston - example of educator at multiple schools
    startDate: '2019-06-01',
    endDate: '2022-12-31',
    currentlyActive: false,
    roles: ['Fellow'],
    educatorName: 'Ashten Sommer'
  }
];

// SSJ Fillout Forms data
const sampleSSJFilloutForms = [
  {
    id: 'ssj1',
    educatorId: 'ed1',
    firstName: 'Ashten',
    lastName: 'Sommer',
    entryDate: '2022-11-15',
    routedTo: 'daniela.vasan@wildflowerschools.org',
    sendGridSentDate: '2022-11-16',
    assignedPartner: 'Rachel Kelley-Cohen',
    assignedPartnerOverride: 'N/A',
    oneOnOneStatus: 'Completed',
    personResponsibleForFollowUp: 'rachel.kelley-cohn@wildflowerschools.org',
    city: 'Austin',
    state: 'TX',
    message: 'Interested in starting a Montessori school focused on outdoor education'
  },
  {
    id: 'ssj2',
    educatorId: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    entryDate: '2022-12-03',
    routedTo: 'daniela.vasan@wildflowerschools.org',
    sendGridSentDate: '2022-12-04',
    assignedPartner: 'Rachel Kelley-Cohen',
    assignedPartnerOverride: 'N/A',
    oneOnOneStatus: 'Completed',
    personResponsibleForFollowUp: 'rachel.kelley-cohn@wildflowerschools.org',
    city: 'Austin',
    state: 'TX',
    message: 'Partner with Ashten on new school initiative'
  },
  {
    id: 'ssj3',
    educatorId: 'ed3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    entryDate: '2017-08-22',
    routedTo: 'jeana.olszewski@wildflowerschools.org',
    sendGridSentDate: '2017-08-23',
    assignedPartner: 'Sarah Martinez',
    assignedPartnerOverride: 'N/A',
    oneOnOneStatus: 'Completed',
    personResponsibleForFollowUp: 'jeana.olszewski@wildflowerschools.org',
    city: 'Boston',
    state: 'MA',
    message: 'Experienced Montessori educator looking to start independent school'
  }
];

// Additional sample data would continue here...
// (I'll continue with the rest of the sample data and components in the next part)

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Emerging': return 'bg-yellow-100 text-yellow-800';
      case 'Paused': return 'bg-gray-100 text-gray-800';
      case 'Member School': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Applying': return 'bg-orange-100 text-orange-800';
      case 'Issued': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-orange-100 text-orange-800';
      case 'Certified': return 'bg-green-100 text-green-800';
      case 'Incomplete': return 'bg-red-100 text-red-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const DataTable = ({ data, columns, onRowClick, searchTerm }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item, index) => (
            <tr 
              key={item.id || index} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SchoolDetails = ({ school, onBack, onEducatorOpen }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);

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

  const DetailRow = ({ label, value, span = false }) => (
    <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-sm text-gray-900">
        {value === true ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
         value === false ? <XCircle className="w-4 h-4 text-red-600" /> :
         typeof value === 'number' ? value.toLocaleString() :
         value || '-'}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Educator details</h1>
        </div>
        
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
        {activeTab === 'summary' && (
          <div className="space-y-8">
            {/* Educator Header */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">
                  {educator.firstName[0]}{educator.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{educator.firstName} {educator.lastName}</h2>
                <div className="mt-1 space-y-1">
                  <div className="text-blue-600">{educator.email}</div>
                  <div className="text-gray-600">{educator.pronouns}</div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 border-t pt-6">
              <DetailRow label="First Name" value={educator.firstName} />
              <DetailRow label="Last Name" value={educator.lastName} />
              
              <DetailRow label="Primary Email" value={educator.email} />
              <DetailRow label="Phone" value={educator.phone} />
              
              <DetailRow label="Pronouns" value={educator.pronouns} />
              <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
              
              <DetailRow label="Montessori Certified" value={educator.montessoriCertified} />
              <DetailRow label="Current School" value={educator.currentSchool} />
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">School Affiliations</h3>
            <div className="space-y-4">
              {sampleEducatorsXSchools
                .filter(exs => exs.educatorId === educator.id)
                .map(relationship => (
                <div key={relationship.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{sampleSchools.find(s => s.id === relationship.schoolId)?.name || 'Unknown School'}</h4>
                      <p className="text-sm text-gray-600">{relationship.roles.join(', ')}</p>
                      <p className="text-sm text-gray-500">{relationship.startDate} - {relationship.endDate || 'Present'}</p>
                    </div>
                    <div className="text-right">
                      {relationship.currentlyActive ? (
                        <StatusBadge status="Active" />
                      ) : (
                        <StatusBadge status="Inactive" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Demographics</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <DetailRow label="Race & Ethnicity" value={educator.raceEthnicity} />
                  <DetailRow label="Gender" value={educator.gender} />
                  <DetailRow label="Pronouns" value={educator.pronouns} />
                  <DetailRow label="LGBTQIA" value={educator.lgbtqia} />
                  <DetailRow label="Household Income" value={educator.householdIncome} />
                  <DetailRow label="Primary Language" value={educator.primaryLanguage} />
                  <DetailRow label="Other Languages" value={educator.otherLanguages} span={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact-info' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <DetailRow label="Primary Personal Email" value={educator.primaryPersonalEmail} />
                  <DetailRow label="Wildflower Email" value={educator.wildflowerEmail} />
                  <DetailRow label="Other Personal Emails" value={educator.otherPersonalEmails} />
                  <DetailRow label="Primary Work Email (non-WF)" value={educator.primaryWorkEmail} />
                  <DetailRow label="Primary Phone" value={educator.phone} />
                  <DetailRow label="Secondary Phone" value={educator.secondaryPhone} />
                  <DetailRow label="Home Address" value={educator.homeAddress} span={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'summary' && activeTab !== 'schools' && activeTab !== 'demographics' && activeTab !== 'contact-info' && (
          <div className="text-center py-8 text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} content would go here
          </div>
        )}
      </div>
    </div>
  );
};

const CharterDetails = ({ charter, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Charter details</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold">{charter.name}</h2>
        <p className="text-gray-600">{charter.initialTargetCommunity}</p>
      </div>
    </div>
  );
};

const WildflowerDatabase = () => {
  const [mainTab, setMainTab] = useState('schools');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const mainTabs = [
    { id: 'schools', label: 'Schools', count: sampleSchools.length },
    { id: 'educators', label: 'Educators', count: sampleEducators.length },
    { id: 'charters', label: 'Charters', count: sampleCharters.length }
  ];

  const schoolColumns = [
    { key: 'name', label: 'School Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'governanceModel', label: 'Governance' },
    { key: 'location', label: 'Location' },
    { key: 'membershipStatus', label: 'Membership', render: (value) => <StatusBadge status={value} /> }
  ];

  const educatorColumns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'currentSchool', label: 'Current School' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'discoveryStatus', label: 'Discovery Status', render: (value) => <StatusBadge status={value} /> }
  ];

  const charterColumns = [
    { key: 'name', label: 'Charter Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'initialTargetCommunity', label: 'Target Community' },
    { key: 'totalEmergingSchools', label: 'Emerging Schools' },
    { key: 'totalOpenSchools', label: 'Open Schools' }
  ];

  const getCurrentData = () => {
    switch (mainTab) {
      case 'schools': return sampleSchools;
      case 'educators': return sampleEducators;
      case 'charters': return sampleCharters;
      default: return [];
    }
  };

  const getCurrentColumns = () => {
    switch (mainTab) {
      case 'schools': return schoolColumns;
      case 'educators': return educatorColumns;
      case 'charters': return charterColumns;
      default: return [];
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem({ type: mainTab, data: item });
  };

  const handleEducatorOpen = (educatorId) => {
    const educator = sampleEducators.find(ed => ed.id === educatorId);
    if (educator) {
      setSelectedItem({ type: 'educators', data: educator });
    }
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    switch (selectedItem.type) {
      case 'schools':
        return <SchoolDetails school={selectedItem.data} onBack={handleBack} onEducatorOpen={handleEducatorOpen} />;
      case 'educators':
        return <EducatorDetails educator={selectedItem.data} onBack={handleBack} />;
      case 'charters':
        return <CharterDetails charter={selectedItem.data} onBack={handleBack} />;
      default:
        return null;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wildflower Schools Database</h1>
              <p className="text-gray-600">Manage schools, educators, and network data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
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
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  mainTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{mainTab}</h2>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <DataTable 
                data={getCurrentData()}
                columns={getCurrentColumns()}
                onRowClick={handleRowClick}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildflowerDatabase;
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">School details</h1>
        </div>
        
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
        {activeTab === 'summary' && (
          <div className="space-y-8">
            {/* School Header */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{school.name}</h2>
                <div className="mt-1 space-y-1">
                  <div className="text-blue-600">{school.agesServed?.join(', ')}</div>
                  <div className="text-blue-600">{school.governanceModel}</div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 border-t pt-6">
              <DetailRow label="Short Name" value={school.shortName} />
              <DetailRow label="School Status" value={<StatusBadge status={school.status} />} />
              
              <DetailRow label="Number of classrooms" value={school.numberOfClassrooms} />
              <DetailRow label="Enrollment at Full Capacity" value={school.enrollmentAtFullCapacity} />
              
              <DetailRow label="Membership Status" value={school.membershipStatus} />
              <DetailRow label="Membership Agreement date" value={school.membershipAgreementDate} />
              
              <DetailRow label="School calendar" value={school.schoolCalendar} />
              <DetailRow label="School schedule" value={school.schoolSchedule} />
              
              <DetailRow label="Institutional partner" value={school.institutionalPartner} />
              <DetailRow label="Errors" value={school.errors} />
              
              <DetailRow label="GuideStar Listing Requested?" value={school.guidestarRequested} />
              
              <DetailRow label="Email Domain" value={school.emailDomain} />
              <DetailRow label="School Email" value={school.schoolEmail} />
              
              <DetailRow label="Instagram" value={school.instagram} />
              <DetailRow label="School Phone" value={school.schoolPhone} />
              
              <DetailRow label="EIN" value={school.ein} />
              <DetailRow label="Legal Name" value={school.legalName} />
              
              <DetailRow label="Incorporation Date" value={school.incorporationDate} />
              <DetailRow label="Nonprofit status" value={school.nonprofitStatus} />
              
              <DetailRow label="Date withdrawn from Group Exemption" value={school.dateWithdrawnFromGroupExemption} />
              <DetailRow label="Group exemption status" value={school.groupExemptionStatus} />
              
              <DetailRow label="Left Network Date" value={school.leftNetworkDate} />
              <DetailRow label="Left Network Reason" value={school.leftNetworkReason} />
              
              <DetailRow label="Founders" value={school.founders?.join(', ')} />
              <DetailRow label="Prior Names" value={school.priorNames} />
              
              <DetailRow label="Public funding sources" value={school.publicFundingSources} />
              <DetailRow label="Flexible Tuition Model" value={school.flexibleTuitionModel} />
              
              <DetailRow 
                label="Signed Membership Agreement" 
                value={school.signedMembershipAgreement ? (
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Yellow Rose Montessori Network... .pdf
                  </a>
                ) : null}
              />
              <DetailRow label="Agreement Version" value={school.agreementVersion} />
              
              <DetailRow label="Pod" value={school.pod} />
              <DetailRow label="Active Pod Member" value={school.activePodMember} />
              
              <DetailRow label="Nondiscrimination Policy on Application" value={school.nondiscriminationOnApplication} />
              <DetailRow label="Nondiscrimination Policy on Website" value={school.nondiscriminationOnWebsite} />
              
              <DetailRow 
                label="Website" 
                value={school.website ? (
                  <a href={school.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {school.website}
                  </a>
                ) : null}
              />
              <DetailRow label="Facebook" value={school.facebook} />
              
              <DetailRow label="Legal structure" value={school.legalStructure} />
              <DetailRow label="Current FY end" value={school.currentFYEnd} />
              
              <DetailRow label="Date received group exemption" value={school.dateReceivedGroupExemption} />
              <DetailRow label="Loan Report Name" value={school.loanReportName} />
            </div>
          </div>
        )}

        {activeTab === 'tls' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Teacher Leaders & Staff</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Educator
              </button>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
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
                  {sampleEducatorsXSchools
                    .filter(exs => exs.schoolId === school.id)
                    .map(relationship => (
                    <tr key={relationship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {relationship.educatorName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {relationship.educatorName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {relationship.roles.map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {relationship.startDate}
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
                          onClick={() => onEducatorOpen(relationship.educatorId)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Open
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleEducatorsXSchools.filter(exs => exs.schoolId === school.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No educators assigned to this school yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'summary' && activeTab !== 'tls' && (
          <div className="text-center py-8 text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} content would go here
          </div>
        )}
      </div>
    </div>
  );
};

const EducatorDetails = ({ educator, onBack }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'schools', label: 'Schools' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'contact-info', label: 'Contact Info' }
  ];

  const DetailRow = ({ label, value, span = false }) => (
    <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-sm text-gray-900">
        {value === true ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
         value === false ? <XCircle className="w-4 h-4 text-red-600" /> :
         Array.isArray(value) ? value.join(', ') :
         value || '-'}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">