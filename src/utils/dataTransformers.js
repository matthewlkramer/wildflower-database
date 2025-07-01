// src/utils/dataTransformers.js - CORRECTED with actual Airtable field names

// Helper functions
const safeExtract = (field) => {
  if (Array.isArray(field)) {
    return field.length > 0 ? field[0] : null;
  }
  return field || null;
};

const safeNumber = (field) => {
  if (field === null || field === undefined || field === '') return null;
  const num = parseFloat(field);
  return isNaN(num) ? null : num;
};

const safeInterestRate = (field) => {
  if (field === null || field === undefined || field === '') return null;
  let rate = parseFloat(field);
  if (isNaN(rate)) return null;
  return rate; // Airtable percent fields are already decimals
};


// CORRECTED: Transform grant data with actual Airtable field names
export const transformGrantData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    amount: safeNumber(airtableRecord['Amount']), // Currency field
    issueDate: airtableRecord['Issue Date'] || null, // Date field
    issuedBy: safeExtract(airtableRecord['Issued by Name']) || // Lookup from Partners
              safeExtract(airtableRecord['Issued by']) || 
              'Unknown',
    partnerName: airtableRecord['Funding Source'] || '', // Single select
    status: airtableRecord['Grant Status'] || 'Unknown', // Single select
    useOfFunds: airtableRecord['Notes'] || '', // Multiline text
    grantType: airtableRecord['Label'] || '', // Single select
    fundingSource: airtableRecord['Funding Source'] || '', // Single select
    grantKey: airtableRecord['Grant Key'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform loan data with actual Airtable field names
export const transformLoanData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    amount: safeNumber(airtableRecord['Amount Issued']), // Currency field
    issueDate: airtableRecord['Effective Issue Date'] || null, // Date field
    maturityDate: airtableRecord['Maturity'] || null, // Date field
    interestRate: safeInterestRate(airtableRecord['Interest Rate']), // Percent field
    status: airtableRecord['Loan Status'] || 'Active', // Single select
    useOfProceeds: airtableRecord['Use of Proceeds'] || '', // Single select
    issueMethod: airtableRecord['Issue Method'] || '', // Single select
    approximateOutstanding: safeNumber(airtableRecord['Approximate Outstanding Amount']),
    notes: airtableRecord['Notes'] || '', // Multiline text
    loanKey: airtableRecord['Loan Key'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform guide assignment data with actual Airtable field names
export const transformGuideAssignmentData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    guideId: safeExtract(airtableRecord['guide_id']), // Use the formula field
    guideName: safeExtract(airtableRecord['Guide short name']) || 'Unknown Guide', // Lookup
    guideShortName: safeExtract(airtableRecord['Guide short name']) || 'Unknown', // Lookup
    role: airtableRecord['Type'] || 'Guide', // Single select (Type field)
    startDate: airtableRecord['Start date'] || null, // Date field
    endDate: airtableRecord['End date'] || null, // Date field
    currentlyActive: airtableRecord['Currently active'] === true, // Checkbox field
    guideAssignmentKey: airtableRecord['Guide Assignment key'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform location data with actual Airtable field names
export const transformLocationData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    address: airtableRecord['Address'] || '', // Rich text field
    startDate: airtableRecord['Start of time at location'] || '', // Date field
    endDate: airtableRecord['End of time at location'] || null, // Date field
    currentlyActive: !airtableRecord['End of time at location'], // No end date = currently active
    locationType: airtableRecord['Location type'] || '', // Single select
    currentMailingAddress: airtableRecord['Current mailing address?'] === true, // Checkbox
    currentPhysicalAddress: airtableRecord['Current physical address?'] === true, // Checkbox
    
    // Additional location fields
    squareFeet: safeNumber(airtableRecord['Square feet']), // Number field
    maxStudentsLicensedFor: safeNumber(airtableRecord['Max Students Licensed For']), // Number
    neighborhood: airtableRecord['Neighborhood'] || '', // Single line text
    coLocationType: airtableRecord['Co-Location Type'] || '', // Single select
    coLocationPartner: airtableRecord['Co-Location Partner '] || '', // Single line text (note space)
    leaseEndDate: airtableRecord['Lease End Date'] || null, // Date field
    lease: airtableRecord['Lease'] || '', // Attachments field
    timeZone: airtableRecord['Time Zone'] || '', // Single select
    city: airtableRecord['City'] || '', // Single line text
    state: airtableRecord['State'] || '', // Single line text
    locationKey: airtableRecord['Location Key'] || '', // Formula field
    
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform action step data with actual Airtable field names
export const transformActionStepData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    item: airtableRecord['Item'] || '', // Multiline text
    assignee: safeExtract(airtableRecord['Assignee']) || '', // Links to Partners table
    status: airtableRecord['Status'] || 'Not Started', // Single select
    dueDate: airtableRecord['Due date'] || null, // Date field
    assignedDate: airtableRecord['Assigned date'] || null, // Date field
    completedDate: airtableRecord['Completed date'] || null, // Date field
    actionStepKey: airtableRecord['action_step_id'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform school note data with actual Airtable field names
export const transformSchoolNoteData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    noteText: airtableRecord['Notes'] || '', // Multiline text
    createdBy: safeExtract(airtableRecord['Created by']) || 'Unknown', // Links to Partners
    createdDate: airtableRecord['Date created'] || '', // Date field
    isPrivate: airtableRecord['Private'] === true, // Checkbox field
    schoolNoteKey: airtableRecord['School Note Key'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform governance doc data with actual Airtable field names
export const transformGovernanceDocData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    schoolId: airtableRecord['school_id'], // Use the formula field, not the relationship
    documentType: airtableRecord['Document type'] || '', // Single select
    date: airtableRecord['Date'] || '', // Date field
    docLink: airtableRecord['Doc Link'] || // Multiline text
             (airtableRecord['Document PDF'] && 
              Array.isArray(airtableRecord['Document PDF']) && 
              airtableRecord['Document PDF'].length > 0 ? 
                airtableRecord['Document PDF'][0].url : ''), // Attachment field
    docNotes: airtableRecord['Doc notes'] || '', // Rich text
    publicationLink: airtableRecord['Publication link'] || '', // Multiline text
    docKey: airtableRecord['Doc Key'] || '', // Formula field
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform educator x school relationship with actual field names
export const transformEducatorXSchoolData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    // Handle both direct fields and array references
    educatorId: airtableRecord.educatorId || safeExtract(airtableRecord['Educator']),
    schoolId: airtableRecord.schoolId || safeExtract(airtableRecord['School']),
    startDate: airtableRecord.startDate || airtableRecord['Start Date'] || '',
    endDate: airtableRecord.endDate || airtableRecord['End Date'] || null,
    currentlyActive: airtableRecord['Currently Active'] === true,
    roles: airtableRecord.role ? [airtableRecord.role] : (airtableRecord['Roles'] || airtableRecord['Role'] || []),
    // These are lookup fields that might not exist
    educatorName: airtableRecord['Educator Full Name'] || 
                 airtableRecord['Educator Name'] || 
                 safeExtract(airtableRecord['Educator Full Name']) || 
                 'Unknown',
    schoolName: airtableRecord['School Name'] || 
               airtableRecord['School Short Name'] ||
               safeExtract(airtableRecord['School Name']) || 
               'Unknown',
    createdTime: airtableRecord.createdTime
  };
};

// CORRECTED: Transform school data with actual Airtable field names
export const transformSchoolData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    name: airtableRecord['Name'] || '',
    shortName: airtableRecord['Short Name'] || airtableRecord['Name'] || '',
    status: airtableRecord['School Status'] || '', // Single select
    governanceModel: airtableRecord['Governance Model'] || '', // Single select
    agesServed: airtableRecord['Ages served'] || [], // Multiple selects

    // Location data from lookups
    location: safeExtract(airtableRecord['Current Physical Address']) || '',
    activeLocationCity: safeExtract(airtableRecord['Current Physical Address - City']),
    activeLocationState: safeExtract(airtableRecord['Current Physical Address - State']),
    targetCity: airtableRecord['SSJ - Target City'] || null,
    targetState: airtableRecord['SSJ - Target State'] || null,

    membershipStatus: airtableRecord['Membership Status'] || '', // Single select
    founders: airtableRecord['Founders'] || [], // Rollup from relationships
    phone: airtableRecord['School Phone'] || null, // Phone number field
    website: airtableRecord['Website'] || '', // URL field
    emailDomain: airtableRecord['Email Domain'] || '', // Single line text
    pod: airtableRecord['Pod'] || '', // Single select
    ein: airtableRecord['EIN'] || '', // Single line text
    legalName: airtableRecord['Legal Name'] || '', // Single line text
    incorporationDate: airtableRecord['Incorporation Date'] || '', // Date field
    nonprofitStatus: airtableRecord['Nonprofit status'] || '', // Single select
    groupExemptionStatus: airtableRecord['Group exemption status'] || '', // Single select
    dateReceivedGroupExemption: airtableRecord['Date received group exemption'] || '', // Date
    currentFYEnd: airtableRecord['Current FY end'] || '', // Single select
    membershipAgreementDate: airtableRecord['Membership Agreement date'] || '', // Date
    
    // SSJ/OSS Data - all actual field names from the metadata
    ssjStage: airtableRecord['SSJ Stage'] || '', // Single select
    ssjTargetCity: airtableRecord['SSJ - Target City'] || '', // Single line text
    ssjTargetState: airtableRecord['SSJ - Target State'] || '', // Single line text
    ssjOriginalProjectedOpenDate: airtableRecord['SSJ - Original Projected Open Date'] || '', // Date
    ssjProjOpenSchoolYear: airtableRecord['SSJ - Proj Open School Year'] || '', // Formula
    ssjProjectedOpen: airtableRecord['SSJ - Projected Open'] || '', // Date
    riskFactors: airtableRecord['Risk Factors'] || [], // Multiple selects
    watchlist: airtableRecord['Watchlist'] || [], // Multiple selects
    ssjBoardDevelopment: airtableRecord['SSJ - Board development'] || '', // Single select
    enteredVisioningDate: airtableRecord['Entered Visioning Date'] || '', // Date
    enteredPlanningDate: airtableRecord['Entered Planning Date'] || '', // Date
    enteredStartupDate: airtableRecord['Entered Startup Date'] || '', // Date
    ssjHasETLPartner: airtableRecord['SSJ - Has the ETL identified a partner?'] || '', // Single select
    ssjOpsGuideTrack: airtableRecord['SSJ - Ops Guide Support Track'] || [], // Multiple selects
    ssjReadinessRating: airtableRecord['SSJ - Readiness to Open Rating'] || '', // Single select
    ssjFacility: airtableRecord['SSJ - Facility'] || '', // Single select
    building4GoodFirm: airtableRecord['Building4Good Firm & Attorney'] || '', // Single line text
    ssjTotalStartupFunding: airtableRecord['SSJ - Total Startup Funding Needed'] || '', // Single line text
    ssjFundraisingNarrative: airtableRecord['SSJ - Fundraising narrative'] || '', // Multiline text
    
    // Systems - all actual field names
    googleVoice: airtableRecord['Google Voice'] || '', // Single select
    budgetUtility: airtableRecord['Budget Utility'] || '', // Single select
    admissionsSystem: airtableRecord['Admissions System'] || '', // Single select
    qbo: airtableRecord['QBO'] || '', // Single select
    websiteTool: airtableRecord['Website tool'] || '', // Single select
    
    // Additional fields
    currentTLs: airtableRecord['Current TLs'] || [], // Rollup
    schoolOpenDate: airtableRecord['Opened'] || null, // Date field
    programFocus: airtableRecord['Program Focus'] || [], // Multiple selects
    maxCapacityEnrollments: safeNumber(airtableRecord['Enrollment at Full Capacity']), // Number
    numberOfClassrooms: safeNumber(airtableRecord['Number of classrooms']), // Number
    schoolCalendar: airtableRecord['School calendar'] || '', // Single select
    schoolSchedule: airtableRecord['School schedule'] || [], // Multiple selects
    flexibleTuitionModel: airtableRecord['Flexible Tuition Model'] === true, // Checkbox
    
    // Contact info
    schoolEmail: airtableRecord['School Email'] || '', // Email field
    facebook: airtableRecord['Facebook'] || '', // Single line text
    instagram: airtableRecord['Instagram'] || '', // Single line text
    
    // Logo - check for attachment field
    logo: (airtableRecord['Logo'] && 
           Array.isArray(airtableRecord['Logo']) && 
           airtableRecord['Logo'].length > 0) ? 
             airtableRecord['Logo'][0].url : null, // Attachment field
    logoThumbnail: (airtableRecord['Logo'] && 
                    Array.isArray(airtableRecord['Logo']) && 
                    airtableRecord['Logo'].length > 0 &&
                    airtableRecord['Logo'][0].thumbnails) ? 
                      airtableRecord['Logo'][0].thumbnails.large?.url || 
                      airtableRecord['Logo'][0].thumbnails.small?.url || 
                      airtableRecord['Logo'][0].url : null
    
    // Legal entity
    legalStructure: airtableRecord['Legal structure'] || '', // Single select
    institutionalPartner: airtableRecord['Institutional partner'] || null, // Single line text
    dateWithdrawnFromGroupExemption: airtableRecord['Date withdrawn from Group Exemption'] || null, // Date
    
    // Closed school fields
    leftNetworkDate: airtableRecord['Left Network Date'] || null, // Date
    leftNetworkReason: airtableRecord['Left Network Reason'] || [], // Multiple selects
    
    createdTime: airtableRecord.createdTime
  };
};

// Transform educator data (keeping existing structure as it looked correct)
export const transformEducatorData = (airtableRecord) => {
  if (!airtableRecord) return null;

  return {
    id: airtableRecord.id,
    fullName: airtableRecord['Full Name'] || '',
    firstName: airtableRecord['First Name'] || '',
    lastName: airtableRecord['Last Name'] || '',
    middleName: airtableRecord['Middle Name'] || '',
    nickname: airtableRecord['Nickname'] || '',
    email: airtableRecord['Contact Email'] || '', // Formula field for current email
    emailAddresses: airtableRecord['Email Addresses'] || [],
    currentSchool: safeExtract(airtableRecord['Currently Active School']) || '',
    role: safeExtract(airtableRecord['Current Role']) || '',
    discoveryStatus: airtableRecord['Discovery status'] || '',
    individualType: airtableRecord['Individual Type'] || '',
    montessoriCertified: airtableRecord['Montessori Certified'] === true,
    montessoriLeadGuideTraining: airtableRecord['Montessori Lead Guide Training'] || '',
    startupStageForActiveSchool: airtableRecord['Startup Stage for Active School'] || '',
    pronouns: airtableRecord['Pronouns'] || '',
    pronounsOther: airtableRecord['Pronouns - Other'] || '',
    
    // Demographics
    raceEthnicity: airtableRecord['Race & Ethnicity'] || [],
    raceEthnicityOther: airtableRecord['Race & Ethnicity - Other'] || '',
    gender: airtableRecord['Gender'] || '',
    genderOther: airtableRecord['Gender - Other'] || '',
    householdIncome: airtableRecord['Household Income'] || '',
    incomeBackground: airtableRecord['Income Background'] || '',
    educationalAttainment: airtableRecord['Educational Attainment'] || '',
    lgbtqia: airtableRecord['LGBTQIA'] === 'TRUE',
    primaryLanguage: safeExtract(airtableRecord['Primary Language']) || '',
    otherLanguages: airtableRecord['Other languages'] || [],
    languages: airtableRecord['Languages'] || '',
    
    // Contact Info
    phone: airtableRecord['Primary phone'] || '',
    primaryPhone: airtableRecord['Primary phone'] || '',
    secondaryPhone: airtableRecord['Secondary phone'] || null,
    homeAddress: airtableRecord['Home Address'] || '',
    wildflowerEmail: airtableRecord['Wildflower Email'] || '',
    
    // Target location
    targetGeo: airtableRecord['Target geo combined'] || '',
    targetGeography: airtableRecord['Target Geography'] || '',
    targetCity: airtableRecord['Target city'] || '',
    targetState: airtableRecord['Target state'] || '',
    targetStartDate: airtableRecord['Target Start Date'] || '',
    
    // Tags
    tags: airtableRecord['Tags'] || [],
    
    createdTime: airtableRecord.createdTime
  };
};

// Batch transform functions
export const transformSchoolsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformSchoolData).filter(Boolean);
};

export const transformEducatorsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformEducatorData).filter(Boolean);
};

export const transformEducatorsXSchoolsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformEducatorXSchoolData).filter(Boolean);
};

export const transformLocationsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformLocationData).filter(Boolean);
};

export const transformGrantsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformGrantData).filter(Boolean);
};

export const transformLoansData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformLoanData).filter(Boolean);
};

export const transformGuideAssignmentsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformGuideAssignmentData).filter(Boolean);
};

export const transformActionStepsData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformActionStepData).filter(Boolean);
};

// Charter data transformer (keeping minimal structure)
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

export const transformChartersData = (airtableRecords) => {
  if (!Array.isArray(airtableRecords)) {
    return [];
  }
  return airtableRecords.map(transformCharterData).filter(Boolean);
};