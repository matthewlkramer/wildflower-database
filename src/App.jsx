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
    location: 'Austin, TX',
    membershipStatus: 'Member School',
    founders: ['Ashten Sommer', 'Gabrielle Tyree'],
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
    membershipAgreementDate: '5/28/2024',
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
    location: 'Boston, MA',
    membershipStatus: 'Member School',
    phone: '(617) 555-0123',
    website: 'https://boston.wildflowerschools.org',
    pod: 'Mass: Broadway',
    opened: '2018-09-01',
    founders: ['Sarah Johnson']
  }
];

// School Notes data
const sampleSchoolNotes = [
  {
    id: 'sn1',
    schoolId: 'rec1',
    noteText: 'Initial founder meeting went very well. Strong vision for authentic Montessori implementation with focus on outdoor learning components.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-02-15',
    isPrivate: false
  },
  {
    id: 'sn2',
    schoolId: 'rec1',
    noteText: 'Facility search proving challenging in Austin market. May need to consider alternative locations or modify timeline.',
    createdBy: 'Daniela Vasan',
    createdDate: '2023-07-08',
    isPrivate: false
  },
  {
    id: 'sn3',
    schoolId: 'rec1',
    noteText: 'Confidential: Board concerns about fundraising timeline and potential delays due to permit issues.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-09-12',
    isPrivate: true
  },
  {
    id: 'sn4',
    schoolId: 'rec2',
    noteText: 'Celebrating 5 years of successful operation! School has exceeded enrollment targets and maintains excellent parent satisfaction scores.',
    createdBy: 'Sara Hernandez',
    createdDate: '2023-09-01',
    isPrivate: false
  },
  {
    id: 'sn5',
    schoolId: 'rec2',
    noteText: 'Exploring expansion opportunities. Sarah Johnson has expressed interest in opening a second location in Cambridge.',
    createdBy: 'Sara Hernandez',
    createdDate: '2023-10-15',
    isPrivate: false
  }
];

// Action Steps data
const sampleActionSteps = [
  {
    id: 'as1',
    schoolId: 'rec1',
    item: 'Complete facility lease review with Building4Good attorney',
    assignee: 'Ashten Sommer',
    status: 'Incomplete',
    dueDate: '2023-12-01'
  },
  {
    id: 'as2',
    schoolId: 'rec1',
    item: 'Finalize enrollment projections for Year 1',
    assignee: 'Gabrielle Tyree',
    status: 'Complete',
    dueDate: '2023-10-15'
  },
  {
    id: 'as3',
    schoolId: 'rec1',
    item: 'Schedule Building4Good consultation for facility modifications',
    assignee: 'Rachel Kelley-Cohen',
    status: 'Incomplete',
    dueDate: '2023-11-30'
  },
  {
    id: 'as4',
    schoolId: 'rec2',
    item: 'Submit annual compliance report to state department',
    assignee: 'Sarah Johnson',
    status: 'Complete',
    dueDate: '2023-09-30'
  },
  {
    id: 'as5',
    schoolId: 'rec2',
    item: 'Develop expansion classroom timeline and budget',
    assignee: 'Sarah Johnson',
    status: 'Incomplete',
    dueDate: '2023-12-15'
  }
];

// Membership fee annual records
const sampleMembershipFeeRecords = [
  {
    id: 'mfr1',
    schoolId: 'rec1',
    schoolYear: '2023-2024',
    initialFee: 5000,
    revisedAmount: 4500,
    amountPaid: 2000,
    amountReceivable: 2500,
    exemptionStatus: 'Non-exempt',
    revenue: 125000,
    nthYear: 1,
    historyStatus: 'Emerging'
  },
  {
    id: 'mfr2',
    schoolId: 'rec1',
    schoolYear: '2024-2025',
    initialFee: 6000,
    revisedAmount: 6000,
    amountPaid: 1500,
    amountReceivable: 4500,
    exemptionStatus: 'Non-exempt',
    revenue: 150000,
    nthYear: 2,
    historyStatus: 'Open'
  }
];

// Membership fee updates
const sampleMembershipFeeUpdates = [
  {
    id: 'mfu1',
    schoolId: 'rec1',
    schoolYear: '2023-2024',
    updateType: 'Payment received',
    date: '2023-09-15',
    amountPaid: 1000,
    explanation: 'First installment payment received'
  },
  {
    id: 'mfu2',
    schoolId: 'rec1',
    schoolYear: '2023-2024',
    updateType: 'Change in fee',
    date: '2023-10-01',
    revisedFeeAmount: 4500,
    explanation: 'Fee reduced due to lower than expected enrollment'
  },
  {
    id: 'mfu3',
    schoolId: 'rec1',
    schoolYear: '2024-2025',
    updateType: 'Payment received',
    date: '2024-08-15',
    amountPaid: 1500,
    explanation: 'First payment for 2024-2025 school year'
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
    discoveryStatus: 'Complete',
    montessoriCertified: true,
    pronouns: 'she/her/hers',
    phone: '(512) 555-0123',
    // Demographics
    raceEthnicity: ['White', 'Hispanic, Latino, or Spanish Origin'],
    gender: 'Female/Woman',
    householdIncome: 'Upper Income',
    lgbtqia: false,
    primaryLanguage: 'English',
    otherLanguages: ['Spanish'],
    // Contact Info
    personalEmail: 'ashten.sommer@gmail.com',
    wildflowerEmail: 'ashten@yellowrosemontessori.org',
    workEmail: null,
    primaryPhone: '(512) 555-0123',
    secondaryPhone: null,
    homeAddress: '1234 Oak Street, Austin, TX 78704'
  },
  {
    id: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    email: 'gabrielle@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    discoveryStatus: 'Complete',
    montessoriCertified: true,
    pronouns: 'they/them',
    phone: '(512) 555-0456',
    // Demographics
    raceEthnicity: ['African-American'],
    gender: 'Non-binary',
    householdIncome: 'Middle Income',
    lgbtqia: true,
    primaryLanguage: 'English',
    otherLanguages: [],
    // Contact Info
    personalEmail: 'gabrielle.tyree@gmail.com',
    wildflowerEmail: 'gabrielle@yellowrosemontessori.org',
    workEmail: null,
    primaryPhone: '(512) 555-0456',
    secondaryPhone: '(512) 555-0789',
    homeAddress: '5678 Elm Avenue, Austin, TX 78745'
  }
];

const sampleCharters = [
  {
    id: 'ch1',
    name: 'Denver Charter Network',
    shortName: 'Denver Charter',
    status: 'Applying',
    initialTargetCommunity: 'Denver Metro'
  }
];

// Educators x Schools relationship data
const sampleEducatorsXSchools = [
  {
    id: 'exs1',
    educatorId: 'ed1',
    schoolId: 'rec1',
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true,
    roles: ['Founder', 'Teacher Leader'],
    educatorName: 'Ashten Sommer'
  },
  {
    id: 'exs2',
    educatorId: 'ed2',
    schoolId: 'rec1',
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true,
    roles: ['Founder'],
    educatorName: 'Gabrielle Tyree'
  }
];

// Locations data
const sampleLocations = [
  {
    id: 'loc1',
    schoolId: 'rec1',
    address: '1234 Oak Street, Austin, TX 78704',
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true,
    locationType: 'School address and mailing address'
  },
  {
    id: 'loc2',
    schoolId: 'rec2',
    address: '567 Commonwealth Ave, Boston, MA 02215',
    startDate: '2018-09-01',
    endDate: null,
    currentlyActive: true,
    locationType: 'School address and mailing address'
  }
];

// Governance documents data
const sampleGovernanceDocs = [
  {
    id: 'gd1',
    schoolId: 'rec1',
    documentType: 'Articles of Incorporation - AOI',
    date: '2023-04-09',
    docLink: 'https://example.com/yellow-rose-aoi.pdf',
    docNotes: 'Filed with Texas Secretary of State'
  },
  {
    id: 'gd2',
    schoolId: 'rec1',
    documentType: 'Bylaws - BYL',
    date: '2023-04-15',
    docLink: 'https://example.com/yellow-rose-bylaws.pdf',
    docNotes: 'Board approved bylaws'
  }
];

// Guide assignments data
const sampleGuideAssignments = [
  {
    id: 'ga1',
    schoolId: 'rec1',
    guideShortName: 'Rachel K-C',
    role: 'Ops Guide',
    startDate: '2023-01-15',
    endDate: null,
    currentlyActive: true
  },
  {
    id: 'ga2',
    schoolId: 'rec1',
    guideShortName: 'Daniela V',
    role: 'Regional Entrepreneur',
    startDate: '2023-02-01',
    endDate: '2023-12-31',
    currentlyActive: false
  }
];

// Grants data
const sampleGrants = [
  {
    id: 'gr1',
    schoolId: 'rec1', // Yellow Rose
    amount: 25000,
    issueDate: '2023-05-15',
    issuedBy: 'Rachel Kelley-Cohen',
    partnerName: 'TWF National',
    status: 'Issued',
    useOfFunds: 'Startup funding for materials and training'
  },
  {
    id: 'gr2',
    schoolId: 'rec1', // Yellow Rose
    amount: 15000,
    issueDate: '2023-08-01',
    issuedBy: 'Daniela Vasan',
    partnerName: 'TWF Walton',
    status: 'Planned',
    useOfFunds: 'Facility preparation and equipment'
  },
  {
    id: 'gr3',
    schoolId: 'rec2', // WF Boston
    amount: 30000,
    issueDate: '2023-01-10',
    issuedBy: 'Sara Hernandez',
    partnerName: 'TWF Cambridge',
    status: 'Issued',
    useOfFunds: 'Expansion funding for additional classroom'
  },
  {
    id: 'gr4',
    schoolId: 'rec2', // WF Boston
    amount: 12000,
    issueDate: '2023-03-22',
    issuedBy: 'Erika McDowell',
    partnerName: 'COVID Relief Fund',
    status: 'Issued',
    useOfFunds: 'COVID-19 safety measures and technology upgrades'
  }
];

// Loans data
const sampleLoans = [
  {
    id: 'ln1',
    schoolId: 'rec1', // Yellow Rose
    amount: 75000,
    issueDate: '2023-09-01',
    maturityDate: '2026-09-01',
    interestRate: 0.03,
    status: 'Interest Only Period',
    useOfProceeds: 'Startup funding for facility and initial operations'
  },
  {
    id: 'ln2',
    schoolId: 'rec2', // WF Boston
    amount: 100000,
    issueDate: '2018-08-15',
    maturityDate: '2023-08-15',
    interestRate: 0.025,
    status: 'Paid Off',
    useOfProceeds: 'Initial school operations and equipment'
  },
  {
    id: 'ln3',
    schoolId: 'rec2', // WF Boston
    amount: 50000,
    issueDate: '2021-06-01',
    maturityDate: '2026-06-01',
    interestRate: 0.035,
    status: 'Principal Repayment',
    useOfProceeds: 'Expansion to second classroom'
  }
];

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Emerging': return 'bg-yellow-100 text-yellow-800';
      case 'Member School': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Applying': return 'bg-orange-100 text-orange-800';
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
          {filteredData.map((item) => (
            <tr 
              key={item.id} 
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

  // Get membership fee records for this school
  const membershipFeeRecords = sampleMembershipFeeRecords.filter(record => record.schoolId === school.id);
  
  // Get the selected record details
  const selectedRecord = selectedSchoolYear ? 
    membershipFeeRecords.find(record => record.schoolYear === selectedSchoolYear) : 
    null;
  
  // Get updates for the selected school year
  const membershipUpdates = selectedSchoolYear ? 
    sampleMembershipFeeUpdates.filter(update => 
      update.schoolId === school.id && update.schoolYear === selectedSchoolYear
    ) : [];

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

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 border-t pt-6">
              <DetailRow label="Short Name" value={school.shortName} />
              <DetailRow label="School Status" value={<StatusBadge status={school.status} />} />
              <DetailRow label="Membership Status" value={school.membershipStatus} />
              <DetailRow label="Membership Agreement date" value={school.membershipAgreementDate} />
              <DetailRow label="Email Domain" value={school.emailDomain} />
              <DetailRow label="School Phone" value={school.phone} />
              <DetailRow label="EIN" value={school.ein} />
              <DetailRow label="Legal Name" value={school.legalName} />
              <DetailRow label="Incorporation Date" value={school.incorporationDate} />
              <DetailRow label="Nonprofit status" value={school.nonprofitStatus} />
              <DetailRow label="Group exemption status" value={school.groupExemptionStatus} />
              <DetailRow label="Date received group exemption" value={school.dateReceivedGroupExemption} />
              <DetailRow label="Founders" value={school.founders?.join(', ')} />
              <DetailRow label="Pod" value={school.pod} />
              <DetailRow label="Active Pod Member" value={school.activePodMember} />
              <DetailRow label="Nondiscrimination Policy on Application" value={school.nondiscriminationOnApplication} />
              <DetailRow label="Nondiscrimination Policy on Website" value={school.nondiscriminationOnWebsite} />
              <DetailRow label="GuideStar Listing Requested?" value={school.guidestarRequested} />
              <DetailRow label="Flexible Tuition Model" value={school.flexibleTuitionModel} />
              <DetailRow label="Current FY end" value={school.currentFYEnd} />
              <DetailRow 
                label="Website" 
                value={school.website ? (
                  <a href={school.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {school.website}
                  </a>
                ) : null}
              />
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
                          onClick={() => onEducatorOpen && onEducatorOpen(relationship.educatorId)}
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

        {activeTab === 'locations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Locations</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
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
                      Currently Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleLocations
                    .filter(location => location.schoolId === school.id)
                    .map(location => (
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
                        {location.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {location.endDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {location.currentlyActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleLocations.filter(location => location.schoolId === school.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No locations added for this school yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Board Members</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </button>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  </tbody>
                </table>
                
                <div className="text-center py-8 text-gray-500">
                  No board members added yet.
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Policies and Documents</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Document
                </button>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleGovernanceDocs
                      .filter(doc => doc.schoolId === school.id)
                      .map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.documentType}
                          </div>
                          {doc.docNotes && (
                            <div className="text-sm text-gray-500 mt-1">
                              {doc.docNotes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => window.open(doc.docLink, '_blank')}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {sampleGovernanceDocs.filter(doc => doc.schoolId === school.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No governance documents added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Guide Assignments</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </button>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guide
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
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
                  {sampleGuideAssignments
                    .filter(assignment => assignment.schoolId === school.id)
                    .map(assignment => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {assignment.guideShortName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.guideShortName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {assignment.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.endDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.currentlyActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => alert(`Open guide assignment ${assignment.id} for editing`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Open
                        </button>
                        <button 
                          onClick={() => alert(`Delete guide assignment ${assignment.id}`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleGuideAssignments.filter(assignment => assignment.schoolId === school.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No guide assignments for this school yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ssj-oss' && (
          <div className="grid grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <DetailRow label="SSJ Stage" value={school.ssjStage} />
              <DetailRow label="SSJ - Target City" value={school.ssjTargetCity} />
              <DetailRow label="SSJ - Board development" value={school.ssjBoardDevelopment} />
              <DetailRow label="SSJ - Has the ETL identified a partner?" value={school.ssjHasETLPartner} />
              <DetailRow label="SSJ - Is the budget at a stage that will allow the ETL(s) to take their next steps?" value={school.ssjBudgetStage} />
              <DetailRow label="SSJ - Is the team on track for their enrollment goals?" value={school.ssjEnrollmentTrack} />
              <DetailRow label="SSJ - What is the next big decision or action this school is working on?" value={school.ssjNextDecision} />
              <DetailRow label="SSJ - Amount raised" value={school.ssjAmountRaised} />
              <DetailRow label="SSJ - Gap in Funding" value={school.ssjGapInFunding} />
              <DetailRow label="SSJ - Is the school planning to apply for internal Wildflower funding?" value={school.ssjInternalFunding} />
              <DetailRow label="SSJ - Loan approved amt" value={school.ssjLoanApprovedAmt} />
              <DetailRow label="SSJ - Loan eligibility" value={school.ssjLoanEligibility} />
              <DetailRow label="SSJ - Total Startup Funding Needed" value={school.ssjTotalStartupFunding} />
              <DetailRow label="SSJ - Does the school have a viable pathway to funding?" value={school.ssjViablePathway} />
              <DetailRow label="SSJ - Fundraising narrative" value={school.ssjFundraisingNarrative} />
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <DetailRow label="SSJ - Original Projected Open Date" value={school.ssjOriginalProjectedOpenDate} />
              <DetailRow label="SSJ - Target State" value={school.ssjTargetState} />
              <DetailRow label="SSJ - Cohort Status" value={school.ssjCohortStatus} />
              <DetailRow label="Cohorts" value={school.cohorts} />
              <DetailRow label="SSJ - Ops Guide Support Track" value={school.ssjOpsGuideTrack} />
              <DetailRow label="SSJ - Readiness to Open Rating" value={school.ssjReadinessRating} />
              <DetailRow label="SSJ - SSJ Tool" value={school.ssjTool} />
              <DetailRow label="Logo designer" value={school.logoDesigner} />
              <DetailRow label="Trademark filed" value={school.trademarkFiled} />
              <DetailRow label="Name Selection Proposal" value={school.nameSelectionProposal} />
              <DetailRow label="SSJ - Name Reserved" value={school.ssjNameReserved} />
              <DetailRow label="SSJ - Facility" value={school.ssjFacility} />
              <DetailRow label="Building4Good Firm & Attorney" value={school.building4GoodFirm} />
              <DetailRow label="SSJ - Building4Good Status" value={school.ssjBuilding4GoodStatus} />
              <DetailRow label="SSJ - Date shared with N4G" value={school.ssjDateSharedN4G} />
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <DetailRow label="SSJ - Proj Open School Year" value={school.ssjProjOpenSchoolYear} />
              <DetailRow label="Risk Factors" value={school.riskFactors} />
              <DetailRow label="Entered Visioning Date" value={school.enteredVisioningDate} />
              <DetailRow label="Visioning album complete" value={school.visioningAlbumComplete} />
              <DetailRow label="Visioning album" value={school.visioningAlbum} />
              <DetailRow label="Entered Planning Date" value={school.enteredPlanningDate} />
              <DetailRow label="Planning album" value={school.planningAlbum} />
              <DetailRow label="Entered Startup Date" value={school.enteredStartupDate} />
            </div>

            {/* Column 4 - SSJ Projected Open & Systems */}
            <div className="space-y-8">
              <div className="space-y-4">
                <DetailRow label="SSJ - Projected Open" value={school.ssjProjectedOpen} />
                <DetailRow label="Watchlist" value={school.watchlist} />
              </div>

              {/* Systems Section */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Systems</h4>
                <div className="space-y-4">
                  <DetailRow label="Google Voice" value={school.googleVoice} />
                  <DetailRow label="Budget Utility" value={school.budgetUtility} />
                  <DetailRow label="Admissions System" value={school.admissionsSystem} />
                  <DetailRow label="Bill.com account" value={school.billComAccount} />
                  <DetailRow label="Bookkeeper / Accountant" value={school.bookkeeper} />
                  <DetailRow label="Business Insurance" value={school.businessInsurance} />
                  <DetailRow label="TC Recordkeeping" value={school.tcRecordkeeping} />
                  <DetailRow label="TC Admissions" value={school.tcAdmissions} />
                  <DetailRow label="QBO" value={school.qbo} />
                  <DetailRow label="TC school ID" value={school.tcSchoolId} />
                  <DetailRow label="Website tool" value={school.websiteTool} />
                  <DetailRow label="Gusto" value={school.gusto} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'membership-fees' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - School Year Selection */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4">School Years</h3>
              <div className="space-y-2">
                {membershipFeeRecords.map(record => (
                  <button
                    key={record.id}
                    onClick={() => setSelectedSchoolYear(record.schoolYear)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedSchoolYear === record.schoolYear
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {record.schoolYear}
                  </button>
                ))}
                {membershipFeeRecords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No membership fee records found
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column - Record Details */}
            <div className="col-span-5">
              {selectedRecord ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Membership Fee Details - {selectedRecord.schoolYear}
                  </h3>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <DetailRow label="School Year" value={selectedRecord.schoolYear} />
                      <DetailRow label="nth Year" value={selectedRecord.nthYear} />
                      
                      <DetailRow label="Initial Fee" value={`${selectedRecord.initialFee?.toLocaleString() || 0}`} />
                      <DetailRow label="Revised Amount" value={`${selectedRecord.revisedAmount?.toLocaleString() || 0}`} />
                      
                      <DetailRow label="Amount Paid" value={`${selectedRecord.amountPaid?.toLocaleString() || 0}`} />
                      <DetailRow label="Amount Receivable" value={`${selectedRecord.amountReceivable?.toLocaleString() || 0}`} />
                      
                      <DetailRow label="Exemption Status" value={selectedRecord.exemptionStatus} />
                      <DetailRow label="History Status" value={selectedRecord.historyStatus} />
                      
                      <DetailRow label="Revenue" value={`${selectedRecord.revenue?.toLocaleString() || 0}`} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <h3 className="text-lg font-semibold mb-2">Select a School Year</h3>
                  <p>Choose a school year from the left to view membership fee details</p>
                </div>
              )}
            </div>

            {/* Right Column - Updates Table */}
            <div className="col-span-4">
              <h3 className="text-lg font-semibold mb-4">Fee Updates</h3>
              {selectedSchoolYear ? (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Update Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {membershipUpdates.map(update => (
                        <tr key={update.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {update.updateType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {update.explanation}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {update.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {update.amountPaid && `${update.amountPaid.toLocaleString()}`}
                            {update.revisedFeeAmount && `${update.revisedFeeAmount.toLocaleString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {membershipUpdates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No updates for this school year
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a school year to view updates
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grants-loans' && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Half - Grants */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Grants</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Grant
                </button>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleGrants
                      .filter(grant => grant.schoolId === school.id)
                      .map(grant => (
                      <tr key={grant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {grant.issueDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${grant.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {grant.issuedBy}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grant.partnerName}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={grant.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert(`Open grant ${grant.id} for editing`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => alert(`Delete grant ${grant.id}`)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {sampleGrants.filter(grant => grant.schoolId === school.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No grants found for this school.
                  </div>
                )}
              </div>
            </div>

            {/* Right Half - Loans */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Loans</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Loan
                </button>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleLoans
                      .filter(loan => loan.schoolId === school.id)
                      .map(loan => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {loan.issueDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${loan.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.interestRate * 100}% interest
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={loan.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert(`Open loan ${loan.id} for editing`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => alert(`Delete loan ${loan.id}`)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {sampleLoans.filter(loan => loan.schoolId === school.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No loans found for this school.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes-actions' && (
          <div className="grid grid-cols-2 gap-8">
            {/* Left Half - School Notes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">School Notes</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>
              
              <div className="space-y-4">
                {sampleSchoolNotes
                  .filter(note => note.schoolId === school.id)
                  .map(note => (
                  <div key={note.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {note.createdBy.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {note.createdBy}
                          </div>
                          <div className="text-sm text-gray-500">
                            {note.createdDate}
                          </div>
                        </div>
                        {note.isPrivate && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Private
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => alert(`Edit note ${note.id}`)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => alert(`Delete note ${note.id}`)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900">
                      {note.noteText}
                    </div>
                  </div>
                ))}
                
                {sampleSchoolNotes.filter(note => note.schoolId === school.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No notes found for this school.
                  </div>
                )}
              </div>
            </div>

            {/* Right Half - Action Steps */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Action Steps</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </button>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleActionSteps
                      .filter(action => action.schoolId === school.id)
                      .map(action => (
                      <tr key={action.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {action.item}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {action.assignee}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={action.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {action.dueDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert(`Edit action ${action.id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => alert(`Delete action ${action.id}`)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {sampleActionSteps.filter(action => action.schoolId === school.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No action steps found for this school.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'summary' && activeTab !== 'tls' && activeTab !== 'locations' && activeTab !== 'governance' && activeTab !== 'guides' && activeTab !== 'ssj-oss' && activeTab !== 'membership-fees' && activeTab !== 'grants-loans' && activeTab !== 'notes-actions' && (
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
    { id: 'contact-info', label: 'Contact Info' },
    { id: 'online-forms', label: 'Online Forms' },
    { id: 'early-cultivation', label: 'Early Cultivation' },
    { id: 'events', label: 'Events' },
    { id: 'guides', label: 'Guides' },
    { id: 'certs', label: 'Certs' },
    { id: 'notes', label: 'Notes' },
    { id: 'linked-emails', label: 'Linked emails/meetings' }
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
                  <div className="text-gray-600">{educator.role}</div>
                  <div className="text-gray-600">{educator.pronouns}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
              <DetailRow label="First Name" value={educator.firstName} />
              <DetailRow label="Last Name" value={educator.lastName} />
              <DetailRow label="Email" value={educator.email} />
              <DetailRow label="Current School" value={educator.currentSchool} />
              <DetailRow label="Role" value={educator.role} />
              <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
              <DetailRow label="Montessori Certified" value={educator.montessoriCertified} />
              <DetailRow label="Pronouns" value={educator.pronouns} />
              <DetailRow label="Phone" value={educator.phone} />
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">School Affiliations</h3>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleEducatorsXSchools
                    .filter(exs => exs.educatorId === educator.id)
                    .map(relationship => (
                    <tr key={relationship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sampleSchools.find(s => s.id === relationship.schoolId)?.name || 'Unknown School'}
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
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleEducatorsXSchools.filter(exs => exs.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No school affiliations found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Demographics</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Race & Ethnicity" value={educator.raceEthnicity} />
                  <DetailRow label="Gender" value={educator.gender} />
                  <DetailRow label="Pronouns" value={educator.pronouns} />
                  <DetailRow label="LGBTQIA+" value={educator.lgbtqia} />
                  <DetailRow label="Household Income" value={educator.householdIncome} />
                  <DetailRow label="Primary Language" value={educator.primaryLanguage} />
                  <DetailRow label="Other Languages" value={educator.otherLanguages} span />
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Personal Email" value={educator.personalEmail} />
                  <DetailRow label="Wildflower Email" value={educator.wildflowerEmail} />
                  <DetailRow label="Work Email" value={educator.workEmail} />
                  <DetailRow label="Primary Phone" value={educator.primaryPhone} />
                  <DetailRow label="Secondary Phone" value={educator.secondaryPhone} />
                  <DetailRow label="Home Address" value={educator.homeAddress} span />
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
    { key: 'initialTargetCommunity', label: 'Target Community' }
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