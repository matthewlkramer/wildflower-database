import { useSchools, useEducators } from './hooks/useAirtableData';
import { transformSchoolsData } from './utils/dataTransformers';
import React, { useState, useMemo, useEffect } from 'react';
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
    // Additional fields for summary
    currentTLs: ['Ashten Sommer', 'Gabrielle Tyree'],
    schoolOpenDate: null,
    programFocus: 'Nature-based Montessori',
    maxCapacityEnrollments: 60,
    numberOfClassrooms: 3,
    publicFunding: false,
    schoolCalendar: 'Year-round',
    schoolSchedule: 'Extended Day (7:30 AM - 6:00 PM)',
    // Membership fields
    signedMembershipAgreementDate: '5/28/2024',
    signedMembershipAgreement: 'https://example.com/yellow-rose-agreement.pdf',
    agreementVersion: 'v3.0',
    // Contact info
    schoolEmail: 'info@yellowrosemontessori.org',
    facebook: 'https://facebook.com/yellowrosemontessori',
    instagram: '@yellowrosemontessori',
    // Legal entity
    legalStructure: '501(c)(3) Nonprofit Corporation',
    institutionalPartner: null,
    dateWithdrawnFromGroupExemption: null,
    loanReportName: 'Yellow Rose Montessori Inc.',
    // Closed school fields (not applicable for Yellow Rose)
    leftNetworkDate: null,
    leftNetworkReason: null,
    membershipTerminationLetter: null
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
    opened: null,
    founders: ['Sarah Johnson'],
    // Additional fields for summary
    currentTLs: ['Sarah Johnson'],
    programFocus: 'Traditional Montessori',
    maxCapacityEnrollments: 120,
    numberOfClassrooms: 6,
    publicFunding: false,
    flexibleTuition: true,
    schoolCalendar: 'Traditional School Year',
    schoolSchedule: 'Full Day (8:30 AM - 3:30 PM)',
    // Membership fields
    signedMembershipAgreementDate: '2018-06-15',
    signedMembershipAgreement: 'https://example.com/wf-boston-agreement.pdf',
    agreementVersion: 'v2.1',
    // Contact info
    schoolEmail: 'info@bostonwildflower.org',
    facebook: 'https://facebook.com/wildflowerboston',
    instagram: '@wildflowerboston',
    // Legal entity
    legalStructure: '501(c)(3) Nonprofit Corporation',
    institutionalPartner: null,
    dateWithdrawnFromGroupExemption: null,
    loanReportName: 'Wildflower Montessori School Boston Inc.'
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
    location: 'Austin, TX',
    routedTo: 'daniela.vasan@wildflowerschools.org',
    sendGridSentData: '2022-11-15 10:30 AM',
    assignedPartner: 'Daniela Vasan',
    assignedPartnerOverride: null,
    oneOnOneStatus: 'Completed',
    personResponsibleForFollowUp: 'Rachel Kelley-Cohen'
  },
  {
    id: 'ssj2',
    educatorId: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    entryDate: '2022-12-03',
    location: 'Austin, TX',
    routedTo: 'daniela.vasan@wildflowerschools.org',
    sendGridSentData: '2022-12-03 2:15 PM',
    assignedPartner: 'Daniela Vasan',
    assignedPartnerOverride: null,
    oneOnOneStatus: 'Scheduled',
    personResponsibleForFollowUp: 'Daniela Vasan'
  }
];

// Event Attendance data
const sampleEventAttendance = [
  {
    id: 'ea1',
    educatorId: 'ed1',
    eventName: 'Wildflower Summer Institute 2023',
    eventDate: '2023-07-15',
    registrationStatus: 'Registered',
    attendanceStatus: 'Attended',
    location: 'Austin, TX'
  },
  {
    id: 'ea2',
    educatorId: 'ed1',
    eventName: 'Regional Gathering - Texas',
    eventDate: '2023-10-08',
    registrationStatus: 'Registered',
    attendanceStatus: 'Attended',
    location: 'Dallas, TX'
  },
  {
    id: 'ea3',
    educatorId: 'ed2',
    eventName: 'Wildflower Summer Institute 2023',
    eventDate: '2023-07-15',
    registrationStatus: 'Registered',
    attendanceStatus: 'No Show',
    location: 'Austin, TX'
  }
];

// Montessori Certifications data
const sampleMontessoriCerts = [
  {
    id: 'mc1',
    educatorId: 'ed1',
    certificationLevel: 'Primary (3-6)',
    certifier: 'AMI',
    year: 2020,
    status: 'Active'
  },
  {
    id: 'mc2',
    educatorId: 'ed2',
    certificationLevel: 'Primary (3-6)',
    certifier: 'AMS',
    year: 2019,
    status: 'Active'
  }
];

// Educator Notes data
const sampleEducatorNotes = [
  {
    id: 'en1',
    educatorId: 'ed1',
    noteText: 'Ashten has shown exceptional leadership during the school startup process. Strong vision for authentic Montessori implementation.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-06-15',
    isPrivate: false
  },
  {
    id: 'en2',
    educatorId: 'ed1',
    noteText: 'Confidential: Expressed concerns about funding timeline and facility search challenges.',
    createdBy: 'Daniela Vasan',
    createdDate: '2023-08-22',
    isPrivate: true
  },
  {
    id: 'en3',
    educatorId: 'ed2',
    noteText: 'Gabrielle brings valuable equity perspective to leadership team. Excellent at community outreach.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-06-15',
    isPrivate: false
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
    locationType: 'School address and mailing address',
    currentMailingAddress: true,
    currentPhysicalAddress: true
  },
  {
    id: 'loc2',
    schoolId: 'rec2',
    address: '567 Commonwealth Ave, Boston, MA 02215',
    startDate: '2018-09-01',
    endDate: null,
    currentlyActive: true,
    locationType: 'School address and mailing address',
    currentMailingAddress: true,
    currentPhysicalAddress: true
  },
  {
    id: 'loc3',
    schoolId: 'rec2',
    address: '123 Harvard St, Cambridge, MA 02138',
    startDate: '2018-09-01',
    endDate: '2020-06-30',
    currentlyActive: false,
    locationType: 'Former mailing address',
    currentMailingAddress: false,
    currentPhysicalAddress: false
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

const DataTable = ({ data, columns, onRowClick, searchTerm, showFilters, columnFilters, onColumnFilterChange }) => {
  // Apply both search and column filters
  const filteredData = useMemo(() => {
    let result = data;
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue && filterValue.trim()) {
        result = result.filter(item => {
          const itemValue = item[columnKey];
          if (itemValue == null) return false;
          return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });
    
    return result;
  }, [data, searchTerm, columnFilters]);

  const handleColumnFilterChange = (columnKey, value) => {
    if (onColumnFilterChange) {
      onColumnFilterChange(columnKey, value);
    }
  };

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
          
          {/* Filter Row */}
          {showFilters && (
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th key={`filter-${col.key}`} className="px-6 py-2">
                  <input
                    type="text"
                    placeholder={`Filter ${col.label}...`}
                    value={columnFilters[col.key] || ''}
                    onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </th>
              ))}
            </tr>
          )}
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchool, setEditedSchool] = useState(school);

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

  const handleEditSave = () => {
    // Here you would typically save to your backend/database
    console.log('Saving school data:', editedSchool);
    // For now, we'll just exit edit mode
    setIsEditing(false);
    // You could also update the parent component's school data here
  };

  const handleEditCancel = () => {
    // Reset to original data and exit edit mode
    setEditedSchool(school);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedSchool(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const EditableField = ({ label, field, value, type = 'text', options = null }) => {
    if (type === 'boolean') {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">{value ? 'Yes' : 'No'}</span>
          </label>
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Select...</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'array') {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : (value || '')}
            onChange={(e) => handleInputChange(field, e.target.value.split(', ').filter(v => v.trim()))}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Separate multiple values with commas"
          />
        </div>
      );
    }

    // Handle URL, email, tel, date, number, and text inputs
    return (
      <div className="py-2">
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
        <input
          type={type === 'url' ? 'text' : type}
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
          placeholder={type === 'url' ? 'https://...' : ''}
        />
      </div>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
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

            {/* Header Section with Logo and Key Info in 4-column grid */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-2">
              {/* School Logo - spans 3 rows in first column */}
              <div className="row-span-3 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              
              {/* First row - columns 2, 3, 4 */}
              {isEditing ? (
                <>
                  <EditableField label="School Name" field="name" value={editedSchool.name} />
                  <EditableField label="Short Name" field="shortName" value={editedSchool.shortName} />
                  <EditableField label="Ages Served" field="agesServed" value={editedSchool.agesServed} type="array" />
                </>
              ) : (
                <>
                  {editedSchool.status === 'Permanently Closed' || editedSchool.status === 'Disaffiliated' || editedSchool.status === 'Disaffiliating' ? (
                    <>
                      <DetailRow label="School Name" value={editedSchool.name} />
                      <DetailRow label="Short Name" value={editedSchool.shortName} />
                      <DetailRow label="Left Network Date" value={editedSchool.leftNetworkDate} />
                    </>
                  ) : (
                    <>
                      <DetailRow label="School Name" value={editedSchool.name} />
                      <DetailRow label="Short Name" value={editedSchool.shortName} />
                      <DetailRow label="Ages Served" value={editedSchool.agesServed?.join(', ')} />
                    </>
                  )}
                </>
              )}
              
              {/* Second row - columns 2, 3, 4 */}
              {isEditing ? (
                <>
                  <EditableField 
                    label="Governance Model" 
                    field="governanceModel" 
                    value={editedSchool.governanceModel} 
                    type="select"
                    options={['Independent', 'Charter', 'District']}
                  />
                  <EditableField label="Founders" field="founders" value={editedSchool.founders} type="array" />
                  <EditableField label="Current TLs" field="currentTLs" value={editedSchool.currentTLs} type="array" />
                </>
              ) : (
                <>
                  {editedSchool.status === 'Permanently Closed' || editedSchool.status === 'Disaffiliated' || editedSchool.status === 'Disaffiliating' ? (
                    <>
                      <DetailRow label="Left Network Reason" value={editedSchool.leftNetworkReason} />
                      <DetailRow label="Membership Termination Letter" value={editedSchool.membershipTerminationLetter} />
                      <div></div> {/* Empty cell */}
                    </>
                  ) : (
                    <>
                      <DetailRow label="Governance Model" value={editedSchool.governanceModel} />
                      <DetailRow label="Founders" value={editedSchool.founders?.join(', ')} />
                      <DetailRow label="Current TLs" value={editedSchool.currentTLs?.join(', ')} />
                    </>
                  )}
                </>
              )}
              
              {/* Third row - columns 2, 3, 4 */}
              {isEditing ? (
                <>
                  <EditableField label="School Open Date" field="schoolOpenDate" value={editedSchool.schoolOpenDate || editedSchool.opened} type="date" />
                  <EditableField 
                    label="School Status" 
                    field="status" 
                    value={editedSchool.status} 
                    type="select"
                    options={['Emerging', 'Open', 'Permanently Closed', 'Disaffiliated', 'Disaffiliating']}
                  />
                  <EditableField 
                    label="Membership Status" 
                    field="membershipStatus" 
                    value={editedSchool.membershipStatus}
                    type="select"
                    options={['Member School', 'Pending', 'Former Member']}
                  />
                </>
              ) : (
                <>
                  {!(editedSchool.status === 'Permanently Closed' || editedSchool.status === 'Disaffiliated' || editedSchool.status === 'Disaffiliating') && (
                    <>
                      <DetailRow label="School Open Date" value={editedSchool.schoolOpenDate || editedSchool.opened} />
                      <DetailRow label="School Status" value={<StatusBadge status={editedSchool.status} />} />
                      <DetailRow label="Membership Status" value={<StatusBadge status={editedSchool.membershipStatus} />} />
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Continue with 4 columns for remaining fields */}
            {!(editedSchool.status === 'Permanently Closed' || editedSchool.status === 'Disaffiliated' || editedSchool.status === 'Disaffiliating') && (
              <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                {isEditing ? (
                  <>
                    <EditableField label="Program Focus" field="programFocus" value={editedSchool.programFocus} />
                    <EditableField label="Max Capacity Enrollments" field="maxCapacityEnrollments" value={editedSchool.maxCapacityEnrollments} type="number" />
                    <EditableField label="Number of Classrooms" field="numberOfClassrooms" value={editedSchool.numberOfClassrooms} type="number" />
                    <EditableField label="Public Funding" field="publicFunding" value={editedSchool.publicFunding} type="boolean" />
                    <EditableField label="Flexible Tuition" field="flexibleTuition" value={editedSchool.flexibleTuition} type="boolean" />
                    <EditableField label="School Calendar" field="schoolCalendar" value={editedSchool.schoolCalendar} />
                    <EditableField label="School Schedule" field="schoolSchedule" value={editedSchool.schoolSchedule} />
                    <div></div> {/* Empty cell to complete the row */}
                  </>
                ) : (
                  <>
                    <DetailRow label="Program Focus" value={editedSchool.programFocus} />
                    <DetailRow label="Max Capacity Enrollments" value={editedSchool.maxCapacityEnrollments} />
                    <DetailRow label="Number of Classrooms" value={editedSchool.numberOfClassrooms} />
                    <DetailRow label="Public Funding" value={editedSchool.publicFunding} />
                    <DetailRow label="Flexible Tuition" value={editedSchool.flexibleTuition} />
                    <DetailRow label="School Calendar" value={editedSchool.schoolCalendar} />
                    <DetailRow label="School Schedule" value={editedSchool.schoolSchedule} />
                    <div></div> {/* Empty cell to complete the row */}
                  </>
                )}
              </div>
            )}
            
            {/* Collapsible sections - always shown, but content changes based on edit mode */}
            <>
              {/* Divider line */}
              <hr className="border-gray-200" />
              
              {/* Closed school collapsible section */}
              {(editedSchool.status === 'Permanently Closed' || editedSchool.status === 'Disaffiliated' || editedSchool.status === 'Disaffiliating') && (
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <h3 className="text-lg font-semibold">School Information</h3>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 p-4 bg-white border rounded-lg">
                    <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                      {isEditing ? (
                        <>
                          <EditableField label="Ages Served" field="agesServed" value={editedSchool.agesServed} type="array" />
                          <EditableField 
                            label="Governance Model" 
                            field="governanceModel" 
                            value={editedSchool.governanceModel}
                            type="select"
                            options={['Independent', 'Charter', 'District']}
                          />
                          <EditableField label="Founders" field="founders" value={editedSchool.founders} type="array" />
                          <EditableField label="Program Focus" field="programFocus" value={editedSchool.programFocus} />
                          <EditableField label="Max Capacity Enrollments" field="maxCapacityEnrollments" value={editedSchool.maxCapacityEnrollments} type="number" />
                          <EditableField label="Number of Classrooms" field="numberOfClassrooms" value={editedSchool.numberOfClassrooms} type="number" />
                          <EditableField label="Public Funding" field="publicFunding" value={editedSchool.publicFunding} type="boolean" />
                          <EditableField label="Flexible Tuition" field="flexibleTuition" value={editedSchool.flexibleTuition} type="boolean" />
                        </>
                      ) : (
                        <>
                          <DetailRow label="Ages Served" value={editedSchool.agesServed?.join(', ')} />
                          <DetailRow label="Governance Model" value={editedSchool.governanceModel} />
                          <DetailRow label="Founders" value={editedSchool.founders?.join(', ')} />
                          <DetailRow label="Program Focus" value={editedSchool.programFocus} />
                          <DetailRow label="Max Capacity Enrollments" value={editedSchool.maxCapacityEnrollments} />
                          <DetailRow label="Number of Classrooms" value={editedSchool.numberOfClassrooms} />
                          <DetailRow label="Public Funding" value={editedSchool.publicFunding} />
                          <DetailRow label="Flexible Tuition" value={editedSchool.flexibleTuition} />
                        </>
                      )}
                    </div>
                  </div>
                </details>
              )}
              
              {/* Membership Section */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <h3 className="text-lg font-semibold">Membership</h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 p-4 bg-white border rounded-lg">
                  <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                    {isEditing ? (
                      <>
                        <EditableField 
                          label="Membership Status" 
                          field="membershipStatus" 
                          value={editedSchool.membershipStatus}
                          type="select"
                          options={['Member School', 'Pending', 'Former Member']}
                        />
                        <EditableField label="Signed Membership Agreement Date" field="signedMembershipAgreementDate" value={editedSchool.signedMembershipAgreementDate} type="date" />
                        <EditableField label="Signed Membership Agreement" field="signedMembershipAgreement" value={editedSchool.signedMembershipAgreement} type="url" />
                        <EditableField label="Agreement Version" field="agreementVersion" value={editedSchool.agreementVersion} />
                      </>
                    ) : (
                      <>
                        <DetailRow label="Membership Status" value={<StatusBadge status={editedSchool.membershipStatus} />} />
                        <DetailRow label="Signed Membership Agreement Date" value={editedSchool.signedMembershipAgreementDate} />
                        <DetailRow 
                          label="Signed Membership Agreement" 
                          value={editedSchool.signedMembershipAgreement ? (
                            <a href={editedSchool.signedMembershipAgreement} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              View Agreement
                            </a>
                          ) : null}
                        />
                        <DetailRow label="Agreement Version" value={editedSchool.agreementVersion} />
                      </>
                    )}
                  </div>
                </div>
              </details>
              
              {/* Contact Information and Communications */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <h3 className="text-lg font-semibold">Contact Information and Communications</h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 p-4 bg-white border rounded-lg">
                  <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                    {isEditing ? (
                      <>
                        <EditableField label="School Email" field="schoolEmail" value={editedSchool.schoolEmail} type="email" />
                        <EditableField label="School Phone" field="phone" value={editedSchool.phone} type="tel" />
                        <EditableField label="Email Domain" field="emailDomain" value={editedSchool.emailDomain} />
                        <EditableField label="Website" field="website" value={editedSchool.website} type="url" />
                        <EditableField label="Facebook" field="facebook" value={editedSchool.facebook} type="url" />
                        <EditableField label="Instagram" field="instagram" value={editedSchool.instagram} />
                      </>
                    ) : (
                      <>
                        <DetailRow label="School Email" value={editedSchool.schoolEmail} />
                        <DetailRow label="School Phone" value={editedSchool.phone} />
                        <DetailRow label="Email Domain" value={editedSchool.emailDomain} />
                        <DetailRow 
                          label="Website" 
                          value={editedSchool.website ? (
                            <a href={editedSchool.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              {editedSchool.website}
                            </a>
                          ) : null}
                        />
                        <DetailRow 
                          label="Facebook" 
                          value={editedSchool.facebook ? (
                            <a href={editedSchool.facebook} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              {editedSchool.facebook}
                            </a>
                          ) : null}
                        />
                        <DetailRow 
                          label="Instagram" 
                          value={editedSchool.instagram ? (
                            <a href={`https://instagram.com/${editedSchool.instagram.replace('@', '')}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              {editedSchool.instagram}
                            </a>
                          ) : null}
                        />
                      </>
                    )}
                  </div>
                </div>
              </details>
              
              {/* Legal Entity */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <h3 className="text-lg font-semibold">Legal Entity</h3>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 p-4 bg-white border rounded-lg">
                  <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                    {isEditing ? (
                      <>
                        <EditableField label="EIN" field="ein" value={editedSchool.ein} />
                        <EditableField 
                          label="Nonprofit Status" 
                          field="nonprofitStatus" 
                          value={editedSchool.nonprofitStatus}
                          type="select"
                          options={['501(c)(3)', 'group exemption', 'pending', 'for-profit']}
                        />
                        <EditableField 
                          label="Group Exemption Status" 
                          field="groupExemptionStatus" 
                          value={editedSchool.groupExemptionStatus}
                          type="select"
                          options={['Active', 'Pending', 'Withdrawn', 'Not Applicable']}
                        />
                        <EditableField label="Date Received Group Exemption" field="dateReceivedGroupExemption" value={editedSchool.dateReceivedGroupExemption} type="date" />
                        <EditableField label="Date Withdrawn from Group Exemption" field="dateWithdrawnFromGroupExemption" value={editedSchool.dateWithdrawnFromGroupExemption} type="date" />
                        <EditableField label="Legal Structure" field="legalStructure" value={editedSchool.legalStructure} />
                        <EditableField label="Institutional Partner" field="institutionalPartner" value={editedSchool.institutionalPartner} />
                        <EditableField label="Incorporation Date" field="incorporationDate" value={editedSchool.incorporationDate} type="date" />
                        <EditableField label="Current End of Fiscal Year" field="currentFYEnd" value={editedSchool.currentFYEnd} />
                        <EditableField label="Legal Name" field="legalName" value={editedSchool.legalName} />
                        <EditableField label="Loan Report Name" field="loanReportName" value={editedSchool.loanReportName} />
                        <div></div> {/* Empty cell to complete the row */}
                      </>
                    ) : (
                      <>
                        <DetailRow label="EIN" value={editedSchool.ein} />
                        <DetailRow label="Nonprofit Status" value={editedSchool.nonprofitStatus} />
                        <DetailRow label="Group Exemption Status" value={editedSchool.groupExemptionStatus} />
                        <DetailRow label="Date Received Group Exemption" value={editedSchool.dateReceivedGroupExemption} />
                        <DetailRow label="Date Withdrawn from Group Exemption" value={editedSchool.dateWithdrawnFromGroupExemption} />
                        <DetailRow label="Legal Structure" value={editedSchool.legalStructure} />
                        <DetailRow label="Institutional Partner" value={editedSchool.institutionalPartner} />
                        <DetailRow label="Incorporation Date" value={editedSchool.incorporationDate} />
                        <DetailRow label="Current End of Fiscal Year" value={editedSchool.currentFYEnd} />
                        <DetailRow label="Legal Name" value={editedSchool.legalName} />
                        <DetailRow label="Loan Report Name" value={editedSchool.loanReportName} />
                        <div></div> {/* Empty cell to complete the row */}
                      </>
                    )}
                  </div>
                </div>
              </details>
            </>
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
  const [selectedSSJForm, setSelectedSSJForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEducator, setEditedEducator] = useState(educator);

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

  const handleEditSave = () => {
    // Here you would typically save to your backend/database
    console.log('Saving educator data:', editedEducator);
    // For now, we'll just exit edit mode
    setIsEditing(false);
    // You could also update the parent component's educator data here
  };

  const handleEditCancel = () => {
    // Reset to original data and exit edit mode
    setEditedEducator(educator);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedEducator(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const EditableField = ({ label, field, value, type = 'text', options = null }) => {
    if (type === 'boolean') {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">{value ? 'Yes' : 'No'}</span>
          </label>
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Select...</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'array') {
      return (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : (value || '')}
            onChange={(e) => handleInputChange(field, e.target.value.split(', ').filter(v => v.trim()))}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Separate multiple values with commas"
          />
        </div>
      );
    }

    return (
      <div className="py-2">
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    );
  };

  // Get SSJ forms for this educator
  const educatorSSJForms = sampleSSJFilloutForms.filter(form => form.educatorId === educator.id);
  
  // Get the selected form details
  const selectedForm = selectedSSJForm ? 
    educatorSSJForms.find(form => form.id === selectedSSJForm) : 
    null;

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
          <h1 className="text-2xl font-bold text-gray-900">{educator.firstName} {educator.lastName}</h1>
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

            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">
                  {editedEducator.firstName[0]}{editedEducator.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{editedEducator.firstName} {editedEducator.lastName}</h2>
                <div className="mt-1 space-y-1">
                  <div className="text-blue-600">{editedEducator.email}</div>
                  <div className="text-gray-600">{editedEducator.role}</div>
                  <div className="text-gray-600">{editedEducator.pronouns}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
              {isEditing ? (
                <>
                  <EditableField label="First Name" field="firstName" value={editedEducator.firstName} />
                  <EditableField label="Last Name" field="lastName" value={editedEducator.lastName} />
                  <EditableField label="Email" field="email" value={editedEducator.email} type="email" />
                  <EditableField label="Current School" field="currentSchool" value={editedEducator.currentSchool} />
                  <EditableField label="Role" field="role" value={editedEducator.role} />
                  <EditableField 
                    label="Discovery Status" 
                    field="discoveryStatus" 
                    value={editedEducator.discoveryStatus}
                    type="select"
                    options={['Complete', 'In Progress', 'Not Started']}
                  />
                  <EditableField label="Montessori Certified" field="montessoriCertified" value={editedEducator.montessoriCertified} type="boolean" />
                  <EditableField label="Pronouns" field="pronouns" value={editedEducator.pronouns} />
                  <EditableField label="Phone" field="phone" value={editedEducator.phone} type="tel" />
                </>
              ) : (
                <>
                  <DetailRow label="First Name" value={editedEducator.firstName} />
                  <DetailRow label="Last Name" value={editedEducator.lastName} />
                  <DetailRow label="Email" value={editedEducator.email} />
                  <DetailRow label="Current School" value={editedEducator.currentSchool} />
                  <DetailRow label="Role" value={editedEducator.role} />
                  <DetailRow label="Discovery Status" value={<StatusBadge status={editedEducator.discoveryStatus} />} />
                  <DetailRow label="Montessori Certified" value={editedEducator.montessoriCertified} />
                  <DetailRow label="Pronouns" value={editedEducator.pronouns} />
                  <DetailRow label="Phone" value={editedEducator.phone} />
                </>
              )}
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

        {activeTab === 'online-forms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">SSJ Fillout Forms</h3>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {educatorSSJForms.map(form => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.entryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.assignedPartner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={form.oneOnOneStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {educatorSSJForms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No SSJ forms found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'early-cultivation' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Form Selection */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4">SSJ Forms</h3>
              <div className="space-y-2">
                {educatorSSJForms.map(form => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedSSJForm(form.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedSSJForm === form.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {form.entryDate}
                  </button>
                ))}
                {educatorSSJForms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No SSJ forms found
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Form Details */}
            <div className="col-span-9">
              {selectedForm ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Form Details - {selectedForm.entryDate}
                  </h3>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <DetailRow label="Entry Date" value={selectedForm.entryDate} />
                      <DetailRow label="Location" value={selectedForm.location} />
                      <DetailRow label="Routed To" value={selectedForm.routedTo} />
                      <DetailRow label="SendGrid Sent Data" value={selectedForm.sendGridSentData} />
                      <DetailRow label="Assigned Partner" value={selectedForm.assignedPartner} />
                      <DetailRow label="Assigned Partner Override" value={selectedForm.assignedPartnerOverride} />
                      <DetailRow label="One on One Status" value={selectedForm.oneOnOneStatus} />
                      <DetailRow label="Person Responsible for Follow Up" value={selectedForm.personResponsibleForFollowUp} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <h3 className="text-lg font-semibold mb-2">Select an SSJ Form</h3>
                  <p>Choose a form from the left to view cultivation details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Event Attendance</h3>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleEventAttendance
                    .filter(event => event.educatorId === educator.id)
                    .map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.eventDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.registrationStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.attendanceStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleEventAttendance.filter(event => event.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No event attendance records found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Guides</h3>
            <p>This section will be implemented later</p>
          </div>
        )}

        {activeTab === 'certs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Montessori Certifications</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </button>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certification Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certifier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleMontessoriCerts
                    .filter(cert => cert.educatorId === educator.id)
                    .map(cert => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cert.certificationLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cert.certifier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cert.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => alert(`Edit certification ${cert.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => alert(`Delete certification ${cert.id}`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleMontessoriCerts.filter(cert => cert.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No certifications found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Educator Notes</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
            
            <div className="space-y-4">
              {sampleEducatorNotes
                .filter(note => note.educatorId === educator.id)
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
              
              {sampleEducatorNotes.filter(note => note.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notes found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'linked-emails' && (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Linked Emails/Meetings</h3>
            <p>This section will be implemented later</p>
          </div>
        )}

        {activeTab !== 'summary' && activeTab !== 'schools' && activeTab !== 'demographics' && activeTab !== 'contact-info' && activeTab !== 'online-forms' && activeTab !== 'early-cultivation' && activeTab !== 'events' && activeTab !== 'guides' && activeTab !== 'certs' && activeTab !== 'notes' && activeTab !== 'linked-emails' && (
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
          <h1 className="text-2xl font-bold text-gray-900">{charter.name}</h1>
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
  const [includeInactiveSchools, setIncludeInactiveSchools] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
const schoolsHookResult = useSchools(includeInactiveSchools);
console.log('🔍 Full hook result:', schoolsHookResult);

// Extract data safely
const rawSchoolsData = schoolsHookResult?.schools || schoolsHookResult?.data || schoolsHookResult || [];
const schoolsLoading = schoolsHookResult?.loading || false;
const schoolsError = schoolsHookResult?.error || null;

const schoolsData = useMemo(() => {
  console.log('Raw schools data type:', typeof rawSchoolsData);
  console.log('Raw schools data is array:', Array.isArray(rawSchoolsData));
  console.log('Raw schools data:', rawSchoolsData);

  // Only transform if we have data
  if (!rawSchoolsData || !Array.isArray(rawSchoolsData)) {
    return [];
  }
  return transformSchoolsData(rawSchoolsData);
}, [rawSchoolsData]);

  const mainTabs = [
    { 
      id: 'schools', 
      label: 'Schools', 
      count: schoolsLoading ? '...' : `${schoolsData.length}${includeInactiveSchools ? '' : ' active'}` 
    },
    { id: 'educators', label: 'Educators', count: sampleEducators.length },
    { id: 'charters', label: 'Charters', count: sampleCharters.length }
  ];

const schoolColumns = [
  { key: 'shortName', label: 'Short Name' },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  { key: 'governanceModel', label: 'Governance' },
  { key: 'agesServed', label: 'Ages Served', render: (value) => Array.isArray(value) ? value.join(', ') : value },
  { 
    key: 'location', 
    label: 'Location',
    render: (value, item) => {
      // Debug log
      console.log('🔍 Location render for:', item.name, {
        activeLocationCity: item.activeLocationCity,
        activeLocationState: item.activeLocationState,
        targetCity: item.targetCity,
        targetState: item.targetState
      });

      // Priority 1: Active location (city, state)
      if (item.activeLocationCity && item.activeLocationState) {
        return `${item.activeLocationCity}, ${item.activeLocationState}`;
      }
      // Priority 2: Target geo combined
      if (item.targetCity && item.targetState) {
        return `${item.targetCity}, ${item.targetState}`;
      }
      // Priority 3: Just target city if available
      if (item.targetCity) {
        return item.targetCity;
      }
      // Priority 4: Blank
      return '-';
    }
  },
  { key: 'membershipStatus', label: 'Membership', render: (value) => <StatusBadge status={value} /> }
];

  const educatorColumns = [
    { key: 'fullName', label: 'Full Name', render: (value, item) => `${item.firstName} ${item.lastName}` },
    { key: 'currentSchool', label: 'Current School' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'raceEthnicity', label: 'Race & Ethnicity', render: (value) => Array.isArray(value) ? value.join(', ') : value || '-' },
    { key: 'discoveryStatus', label: 'Discovery Status', render: (value) => <StatusBadge status={value} /> }
  ];

  const charterColumns = [
    { key: 'name', label: 'Charter Name' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'initialTargetCommunity', label: 'Target Community' }
  ];

const getCurrentData = () => {
  switch (mainTab) {
    case 'schools': 
      // Use real data if available, otherwise fallback to sample
      if (!schoolsLoading && !schoolsError && Array.isArray(schoolsData) && schoolsData.length > 0) {
        console.log('✅ Using real schools data:', schoolsData.length, 'schools');
        return schoolsData;
      } else {
        console.log('⚠️ Using sample schools data - Real data not ready');
        console.log('  Loading:', schoolsLoading, 'Error:', schoolsError, 'Data length:', schoolsData?.length);
        return sampleSchools;
      }
    case 'educators': 
      return sampleEducators;
    case 'charters': 
      return sampleCharters;
    default: 
      return [];
  }
};

const getCurrentColumns = () => {
  switch (mainTab) {
    case 'schools': return schoolColumns;    // ← FIXED!
    case 'educators': return educatorColumns;
    case 'charters': return charterColumns;
    default: return [];
  }
};

const handleColumnFilterChange = (columnKey, value) => {
  setColumnFilters(prev => ({
    ...prev,
    [columnKey]: value
  }));
};

const clearAllFilters = () => {
  setColumnFilters({});
  setSearchTerm('');
};

  const getCurrentError = () => {
    switch (mainTab) {
      case 'schools': return schoolsError; // ← Add this
      case 'educators': return null;
      case 'charters': return null;
      default: return null;
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
          
          {/* Move tabs to the right side of header */}
          <div className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  mainTab === tab.id
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

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
                      <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div></div>
<div className="flex items-center space-x-4">
  {/* Status Filter Toggle - only show for schools tab */}
  {mainTab === 'schools' && (
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
  
<div className="flex items-center space-x-2">
  <button 
    onClick={() => setShowFilters(!showFilters)}
    className={`p-2 transition-colors ${
      showFilters 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Filter className="w-4 h-4" />
  </button>
  
  {(showFilters && Object.keys(columnFilters).some(key => columnFilters[key])) && (
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
            
           <div className="flex-1 overflow-auto">
<DataTable 
  data={getCurrentData()}
  columns={getCurrentColumns()}
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