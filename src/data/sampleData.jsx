// src/data/sampleData.jsx

export const sampleSchools = [
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

export const sampleEducators = [
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

export const sampleCharters = [
  {
    id: 'ch1',
    name: 'Denver Charter Network',
    shortName: 'Denver Charter',
    status: 'Applying',
    initialTargetCommunity: 'Denver Metro'
  }
];

export const sampleSSJFilloutForms = [
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

export const sampleEventAttendance = [
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

export const sampleMontessoriCerts = [
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

export const sampleEducatorNotes = [
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

export const sampleSchoolNotes = [
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

export const sampleActionSteps = [
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

export const sampleMembershipFeeRecords = [
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

export const sampleMembershipFeeUpdates = [
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

export const sampleEducatorsXSchools = [
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

export const sampleLocations = [
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

export const sampleGovernanceDocs = [
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

export const sampleGuideAssignments = [
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

export const sampleGrants = [
  {
    id: 'gr1',
    schoolId: 'rec1',
    amount: 25000,
    issueDate: '2023-05-15',
    issuedBy: 'Rachel Kelley-Cohen',
    partnerName: 'TWF National',
    status: 'Issued',
    useOfFunds: 'Startup funding for materials and training'
  },
  {
    id: 'gr2',
    schoolId: 'rec1',
    amount: 15000,
    issueDate: '2023-08-01',
    issuedBy: 'Daniela Vasan',
    partnerName: 'TWF Walton',
    status: 'Planned',
    useOfFunds: 'Facility preparation and equipment'
  },
  {
    id: 'gr3',
    schoolId: 'rec2',
    amount: 30000,
    issueDate: '2023-01-10',
    issuedBy: 'Sara Hernandez',
    partnerName: 'TWF Cambridge',
    status: 'Issued',
    useOfFunds: 'Expansion funding for additional classroom'
  },
  {
    id: 'gr4',
    schoolId: 'rec2',
    amount: 12000,
    issueDate: '2023-03-22',
    issuedBy: 'Erika McDowell',
    partnerName: 'COVID Relief Fund',
    status: 'Issued',
    useOfFunds: 'COVID-19 safety measures and technology upgrades'
  }
];

export const sampleLoans = [
  {
    id: 'ln1',
    schoolId: 'rec1',
    amount: 75000,
    issueDate: '2023-09-01',
    maturityDate: '2026-09-01',
    interestRate: 0.03,
    status: 'Interest Only Period',
    useOfProceeds: 'Startup funding for facility and initial operations'
  },
  {
    id: 'ln2',
    schoolId: 'rec2',
    amount: 100000,
    issueDate: '2018-08-15',
    maturityDate: '2023-08-15',
    interestRate: 0.025,
    status: 'Paid Off',
    useOfProceeds: 'Initial school operations and equipment'
  },
  {
    id: 'ln3',
    schoolId: 'rec2',
    amount: 50000,
    issueDate: '2021-06-01',
    maturityDate: '2026-06-01',
    interestRate: 0.035,
    status: 'Principal Repayment',
    useOfProceeds: 'Expansion to second classroom'
  }
];