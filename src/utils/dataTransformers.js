// utils/dataTransformers.js

// Transform Airtable school record to match your React app format
export const transformSchoolData = (airtableRecord, relatedData = {}) => {
  if (!airtableRecord) return null;

  // Debug location fields
  console.log('🔍 Location field debug for:', airtableRecord['Name']);
  console.log('  Current Physical Address - City:', airtableRecord['Current Physical Address - City']);
  console.log('  Current Physical Address - State:', airtableRecord['Current Physical Address - State']);
  console.log('  SSJ - Target City:', airtableRecord['SSJ - Target City']);
  console.log('  SSJ - Target State:', airtableRecord['SSJ - Target State']);

  return {
    id: airtableRecord.id,
    name: airtableRecord['Name'] || '',
    shortName: airtableRecord['Short Name'] || airtableRecord['Name'] || '',
    status: airtableRecord['School Status'] || '',
    governanceModel: airtableRecord['Governance Model'] || '',
    agesServed: airtableRecord['Ages served'] || [],

    location: airtableRecord['Current Physical Address'] ? 
      (Array.isArray(airtableRecord['Current Physical Address']) ? 
        airtableRecord['Current Physical Address'][0] : 
        airtableRecord['Current Physical Address']) : '',

    // Location fields with debugging
    activeLocationCity: airtableRecord['Current Physical Address - City'] ? 
      (Array.isArray(airtableRecord['Current Physical Address - City']) ? 
        airtableRecord['Current Physical Address - City'][0] : 
        airtableRecord['Current Physical Address - City']) : null,
    activeLocationState: airtableRecord['Current Physical Address - State'] ? 
      (Array.isArray(airtableRecord['Current Physical Address - State']) ? 
        airtableRecord['Current Physical Address - State'][0] : 
        airtableRecord['Current Physical Address - State']) : null,
    targetCity: airtableRecord['SSJ - Target City'] || null,
    targetState: airtableRecord['SSJ - Target State'] || null,

    membershipStatus: airtableRecord['Membership Status'] || '',
    founders: airtableRecord['Founders'] || [],
    phone: airtableRecord['School Phone'] || null,
    website: airtableRecord['Website'] || '',
    emailDomain: airtableRecord['Email Domain'] || '',
    pod: airtableRecord['Pod'] || '',
    ein: airtableRecord['EIN'] || '',
    legalName: airtableRecord['Legal Name'] || '',
    incorporationDate: airtableRecord['Incorporation Date'] || '',
    nonprofitStatus: airtableRecord['Nonprofit status'] || '',
    groupExemptionStatus: airtableRecord['Group exemption status'] || '',
    dateReceivedGroupExemption: airtableRecord['Date received group exemption'] || '',
    currentFYEnd: airtableRecord['Current FY end'] || '',
    nondiscriminationOnApplication: airtableRecord['Nondiscrimination Policy on Application'] || false,
    nondiscriminationOnWebsite: airtableRecord['Nondiscrimination Policy on Website'] || false,
    guidestarRequested: airtableRecord['GuideStar Listing Requested?'] || false,
    flexibleTuitionModel: airtableRecord['Flexible Tuition Model'] || false,
    activePodMember: airtableRecord['Active Pod Member'] || '',
    membershipAgreementDate: airtableRecord['Membership Agreement date'] || '',
    
    // SSJ/OSS Data
    ssjStage: airtableRecord['SSJ Stage'] || '',
    ssjTargetCity: airtableRecord['SSJ - Target City'] || '',
    ssjTargetState: airtableRecord['SSJ - Target State'] || '',
    ssjOriginalProjectedOpenDate: airtableRecord['SSJ - Original Projected Open Date'] || '',
    ssjProjOpenSchoolYear: airtableRecord['SSJ - Proj Open School Year'] || '',
    ssjProjectedOpen: airtableRecord['SSJ - Projected Open'] || '',
    riskFactors: airtableRecord['Risk Factors'] ? 
      (Array.isArray(airtableRecord['Risk Factors']) ? 
        airtableRecord['Risk Factors'].join(', ') : 
        airtableRecord['Risk Factors']) : '-',
    watchlist: airtableRecord['Watchlist'] ? 
      (Array.isArray(airtableRecord['Watchlist']) ? 
        airtableRecord['Watchlist'].join(', ') : 
        airtableRecord['Watchlist']) : '-',
    ssjBoardDevelopment: airtableRecord['SSJ - Board development'] || '',
    ssjCohortStatus: airtableRecord['SSJ - Cohort Status'] || '-',
    enteredVisioningDate: airtableRecord['Entered Visioning Date'] || '',
    cohorts: airtableRecord['Cohorts'] ? 
      (Array.isArray(airtableRecord['Cohorts']) ? 
        airtableRecord['Cohorts'].join(', ') : 
        airtableRecord['Cohorts']) : '-',
    visioningAlbumComplete: airtableRecord['Visioning album complete'] || false,
    ssjHasETLPartner: airtableRecord['SSJ - Has the ETL identified a partner?'] || '',
    ssjOpsGuideTrack: airtableRecord['SSJ - Ops Guide Support Track'] ? 
      (Array.isArray(airtableRecord['SSJ - Ops Guide Support Track']) ? 
        airtableRecord['SSJ - Ops Guide Support Track'].join(', ') : 
        airtableRecord['SSJ - Ops Guide Support Track']) : '',
    enteredPlanningDate: airtableRecord['Entered Planning Date'] || '',
    planningAlbum: airtableRecord['Planning album'] || '-',
    ssjReadinessRating: airtableRecord['SSJ - Readiness to Open Rating'] || '',
    ssjTool: airtableRecord['SSJ - SSJ Tool'] || '',
    enteredStartupDate: airtableRecord['Entered Startup Date'] || '',
    logoDesigner: airtableRecord['Logo designer'] || '',
    trademarkFiled: airtableRecord['Trademark filed'] || '-',
    nameSelectionProposal: airtableRecord['Name Selection Proposal'] || '-',
    ssjNameReserved: airtableRecord['SSJ - Name Reserved'] || '',
    ssjFacility: airtableRecord['SSJ - Facility'] || '',
    building4GoodFirm: airtableRecord['Building4Good Firm & Attorney'] || '-',
    ssjBuilding4GoodStatus: airtableRecord['SSJ - Building4Good Status'] || '-',
    ssjDateSharedN4G: airtableRecord['SSJ - Date shared with N4G'] || '-',
    ssjAmountRaised: airtableRecord['SSJ - Amount raised'] || '-',
    ssjGapInFunding: airtableRecord['SSJ - Gap in Funding'] || '-',
    ssjLoanApprovedAmt: airtableRecord['SSJ - Loan approved amt'] || '-',
    ssjLoanEligibility: airtableRecord['SSJ - Loan eligibility'] || '-',
    ssjTotalStartupFunding: airtableRecord['SSJ - Total Startup Funding Needed'] || '',
    ssjViablePathway: airtableRecord['SSJ - Does the school have a viable pathway to funding?'] || '',
    ssjFundraisingNarrative: airtableRecord['SSJ - Fundraising narrative'] || '',
    ssjInternalFunding: airtableRecord['SSJ - Is the school planning to apply for internal Wildflower funding?'] || '',
    ssjBudgetStage: airtableRecord['SSJ - Is the budget at a stage that will allow the ETL(s) to take their next steps?'] || '-',
    ssjEnrollmentTrack: airtableRecord['SSJ - Is the team on track for their enrollment goals?'] || '-',
    ssjNextDecision: airtableRecord['SSJ - What is the next big decision or action this school is working on?'] || '',
    
    // Systems
    googleVoice: airtableRecord['Google Voice'] || '-',
    budgetUtility: airtableRecord['Budget Utility'] || '-',
    admissionsSystem: airtableRecord['Admissions System'] || '',
    billComAccount: airtableRecord['Bill.com account'] || '-',
    bookkeeper: airtableRecord['Bookkeeper / Accountant'] || '-',
    businessInsurance: airtableRecord['Business Insurance'] || '-',
    tcRecordkeeping: airtableRecord['TC Recordkeeping'] || '-',
    tcAdmissions: airtableRecord['TC Admissions'] || '-',
    qbo: airtableRecord['QBO'] || '',
    tcSchoolId: airtableRecord['TC school ID'] || '-',
    websiteTool: airtableRecord['Website tool'] || '',
    
    // Additional fields
    currentTLs: airtableRecord['Current TLs'] || [],
    schoolOpenDate: airtableRecord['Opened'] || null,
    programFocus: airtableRecord['Program Focus'] ? 
      (Array.isArray(airtableRecord['Program Focus']) ? 
        airtableRecord['Program Focus'].join(', ') : 
        airtableRecord['Program Focus']) : '',
    maxCapacityEnrollments: airtableRecord['Enrollment at Full Capacity'] || null,
    numberOfClassrooms: airtableRecord['Number of classrooms'] || null,
    publicFunding: false, // This would need to be derived from related public funding records
    schoolCalendar: airtableRecord['School calendar'] || '',
    schoolSchedule: airtableRecord['School schedule'] ? 
      (Array.isArray(airtableRecord['School schedule']) ? 
        airtableRecord['School schedule'].join(', ') : 
        airtableRecord['School schedule']) : '',
    
    // Membership fields
    signedMembershipAgreementDate: airtableRecord['Membership Agreement date'] || '',
    signedMembershipAgreement: airtableRecord['Signed Membership Agreement'] ? 
      (Array.isArray(airtableRecord['Signed Membership Agreement']) && 
       airtableRecord['Signed Membership Agreement'].length > 0 ? 
        airtableRecord['Signed Membership Agreement'][0].url : '') : '',
    agreementVersion: airtableRecord['Agreement Version '] || '',
    
    // Contact info
    schoolEmail: airtableRecord['School Email'] || '',
    facebook: airtableRecord['Facebook'] || '',
    instagram: airtableRecord['Instagram'] || '',
    
    // Legal entity
    legalStructure: airtableRecord['Legal structure'] || '',
    institutionalPartner: airtableRecord['Institutional partner'] || null,
    dateWithdrawnFromGroupExemption: airtableRecord['Date withdrawn from Group Exemption'] || null,
    loanReportName: airtableRecord['Loan Report Name'] || '',
    
    // Closed school fields
    leftNetworkDate: airtableRecord['Left Network Date'] || null,
    leftNetworkReason: airtableRecord['Left Network Reason'] ? 
      (Array.isArray(airtableRecord['Left Network Reason']) ? 
        airtableRecord['Left Network Reason'].join(', ') : 
        airtableRecord['Left Network Reason']) : null,
    membershipTerminationLetter: airtableRecord['Membership termination letter'] ? 
      (Array.isArray(airtableRecord['Membership termination letter']) && 
       airtableRecord['Membership termination letter'].length > 0 ? 
        airtableRecord['Membership termination letter'][0].url : '') : null
  };
};

// Transform Airtable educator record to match your React app format
export const transformEducatorData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    fullName: airtableRecord['Full Name'] || '',
    firstName: airtableRecord['First Name'] || '',
    lastName: airtableRecord['Last Name'] || '',
    email: airtableRecord['Current Primary Email Address'] || '',
    currentSchool: airtableRecord['Currently Active School'] ? 
      (Array.isArray(airtableRecord['Currently Active School']) ? 
        airtableRecord['Currently Active School'][0] : 
        airtableRecord['Currently Active School']) : '',
    role: airtableRecord['Current Role'] ? 
      (Array.isArray(airtableRecord['Current Role']) ? 
        airtableRecord['Current Role'][0] : 
        airtableRecord['Current Role']) : '',
    discoveryStatus: airtableRecord['Discovery status'] || '',
    montessoriCertified: airtableRecord['Montessori Certified'] || false,
    pronouns: airtableRecord['Pronouns'] || '',
    phone: airtableRecord['Primary phone'] || '',
    
    // Demographics
    raceEthnicity: airtableRecord['Race & Ethnicity'] || [],
    gender: airtableRecord['Gender'] || '',
    householdIncome: airtableRecord['Household Income'] || '',
    lgbtqia: airtableRecord['LGBTQIA'] === 'TRUE',
    primaryLanguage: airtableRecord['Primary Language'] ? 
      (Array.isArray(airtableRecord['Primary Language']) ? 
        airtableRecord['Primary Language'][0] : 
        airtableRecord['Primary Language']) : '',
    otherLanguages: airtableRecord['Other languages'] || [],
    
    // Contact Info
    primaryPhone: airtableRecord['Primary phone'] || '',
    secondaryPhone: airtableRecord['Secondary phone'] || null,
    homeAddress: airtableRecord['Home Address'] || ''
  };
};

// Transform Airtable charter record to match your React app format
export const transformCharterData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    name: airtableRecord['Full name'] || airtableRecord['Charter key'] || '',
    shortName: airtableRecord['Short Name'] || '',
    status: airtableRecord['Status'] || '',
    initialTargetCommunity: airtableRecord['Initial target community'] || ''
  };
};

// Transform Airtable educator x school relationship
export const transformEducatorXSchoolData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    educatorId: Array.isArray(airtableRecord['Educator']) ? 
      airtableRecord['Educator'][0] : 
      airtableRecord['Educator'],
    schoolId: Array.isArray(airtableRecord['School']) ? 
      airtableRecord['School'][0] : 
      airtableRecord['School'],
    startDate: airtableRecord['Start Date'] || '',
    endDate: airtableRecord['End Date'] || null,
    currentlyActive: airtableRecord['Currently Active'] || false,
    roles: airtableRecord['Roles'] || [],
    educatorName: Array.isArray(airtableRecord['Educator Full Name']) ? 
      airtableRecord['Educator Full Name'][0] : 
      airtableRecord['Educator Full Name'] || ''
  };
};

// Transform other related data types
export const transformSchoolNoteData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: Array.isArray(airtableRecord['School']) ? 
      airtableRecord['School'][0] : 
      airtableRecord['School'],
    noteText: airtableRecord['Notes'] || '',
    createdBy: Array.isArray(airtableRecord['Created by']) ? 
      airtableRecord['Created by'][0] : 
      airtableRecord['Created by'] || '',
    createdDate: airtableRecord['Date created'] || '',
    isPrivate: airtableRecord['Private'] || false
  };
};

export const transformEducatorNoteData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    educatorId: Array.isArray(airtableRecord['Educator']) ? 
      airtableRecord['Educator'][0] : 
      airtableRecord['Educator'],
    noteText: airtableRecord['Notes'] || '',
    createdBy: Array.isArray(airtableRecord['Created by']) ? 
      airtableRecord['Created by'][0] : 
      airtableRecord['Created by'] || '',
    createdDate: airtableRecord['Date'] || '',
    isPrivate: airtableRecord['Private'] || false
  };
};

export const transformGrantData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: Array.isArray(airtableRecord['School']) ? 
      airtableRecord['School'][0] : 
      airtableRecord['School'],
    amount: airtableRecord['Amount'] || 0,
    issueDate: airtableRecord['Issue Date'] || '',
    issuedBy: airtableRecord['Funding Source'] || '',
    partnerName: airtableRecord['Funding Source'] || '',
    status: airtableRecord['Grant Status'] || '',
    useOfFunds: airtableRecord['Notes'] || ''
  };
};

export const transformLoanData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: Array.isArray(airtableRecord['School']) ? 
      airtableRecord['School'][0] : 
      airtableRecord['School'],
    amount: airtableRecord['Amount Issued'] || 0,
    issueDate: airtableRecord['Effective Issue Date'] || '',
    maturityDate: airtableRecord['Maturity'] || '',
    interestRate: airtableRecord['Interest Rate'] || 0,
    status: 'Active', // You may need to derive this from other fields
    useOfProceeds: airtableRecord['Use of Proceeds'] || ''
  };
};

export const transformActionStepData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: Array.isArray(airtableRecord['Schools']) ? 
      airtableRecord['Schools'][0] : 
      airtableRecord['Schools'],
    item: airtableRecord['Item'] || '',
    assignee: Array.isArray(airtableRecord['Assignee']) ? 
      airtableRecord['Assignee'][0] : 
      airtableRecord['Assignee'] || '',
    status: airtableRecord['Status'] || '',
    dueDate: airtableRecord['Due date'] || ''
  };
};

export const transformLocationData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: Array.isArray(airtableRecord['School']) ? 
      airtableRecord['School'][0] : 
      airtableRecord['School'],
    address: airtableRecord['Address'] || '',
    startDate: airtableRecord['Start Date'] || '',
    endDate: airtableRecord['End Date'] || null,
    currentlyActive: airtableRecord['Currently Active'] || true,
    locationType: airtableRecord['Location Type'] || '',
    currentMailingAddress: airtableRecord['Current Mailing Address'] || false,
    currentPhysicalAddress: airtableRecord['Current Physical Address'] || false
  };
};

export const transformLocationsData = (airtableRecords) => {
  return airtableRecords.map(transformLocationData).filter(Boolean);
};

// Batch transform functions
export const transformSchoolsData = (airtableRecords) => {
  return airtableRecords.map(transformSchoolData).filter(Boolean);
};

export const transformEducatorsData = (airtableRecords) => {
  return airtableRecords.map(transformEducatorData).filter(Boolean);
};

export const transformChartersData = (airtableRecords) => {
  return airtableRecords.map(transformCharterData).filter(Boolean);
};

export const transformEducatorsXSchoolsData = (airtableRecords) => {
  return airtableRecords.map(transformEducatorXSchoolData).filter(Boolean);
};