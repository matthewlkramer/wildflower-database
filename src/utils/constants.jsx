// src/utils/constants.jsx

export const TABS = {
  SCHOOLS: 'schools',
  EDUCATORS: 'educators',
  CHARTERS: 'charters'
};

export const SCHOOL_TABS = {
  SUMMARY: 'summary',
  TLS: 'tls',
  LOCATIONS: 'locations',
  GOVERNANCE: 'governance',
  GUIDES: 'guides',
  SSJ_OSS: 'ssj-oss',
  MEMBERSHIP_FEES: 'membership-fees',
  GRANTS_LOANS: 'grants-loans',
  LINKED_MTGS: 'linked-mtgs',
  NOTES_ACTIONS: 'notes-actions'
};

export const EDUCATOR_TABS = {
  SUMMARY: 'summary',
  SCHOOLS: 'schools',
  DEMOGRAPHICS: 'demographics',
  CONTACT_INFO: 'contact-info',
  ONLINE_FORMS: 'online-forms',
  EARLY_CULTIVATION: 'early-cultivation',
  EVENTS: 'events',
  GUIDES: 'guides',
  CERTS: 'certs',
  NOTES: 'notes',
  LINKED_EMAILS: 'linked-emails'
};

export const SCHOOL_STATUSES = {
  OPEN: 'Open',
  EMERGING: 'Emerging',
  PERMANENTLY_CLOSED: 'Permanently Closed',
  DISAFFILIATED: 'Disaffiliated',
  DISAFFILIATING: 'Disaffiliating'
};

export const MEMBERSHIP_STATUSES = {
  MEMBER_SCHOOL: 'Member School',
  PENDING: 'Pending',
  FORMER_MEMBER: 'Former Member'
};

export const GOVERNANCE_MODELS = {
  INDEPENDENT: 'Independent',
  CHARTER: 'Charter',
  DISTRICT: 'District'
};

export const DISCOVERY_STATUSES = {
  COMPLETE: 'Complete',
  IN_PROGRESS: 'In Progress',
  NOT_STARTED: 'Not Started'
};

export const NONPROFIT_STATUSES = {
  FIVE_OH_ONE_C_THREE: '501(c)(3)',
  GROUP_EXEMPTION: 'group exemption',
  PENDING: 'pending',
  FOR_PROFIT: 'for-profit'
};

export const GROUP_EXEMPTION_STATUSES = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  WITHDRAWN: 'Withdrawn',
  NOT_APPLICABLE: 'Not Applicable'
};

export const BUTTON_STYLES = {
  PRIMARY: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm",
  SECONDARY: "bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm",
  SUCCESS: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm",
  DANGER: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center text-sm",
  WARNING: "bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center text-sm"
};

export const TABLE_COLUMNS = {
  SCHOOLS: [
    { key: 'shortName', label: 'Short Name' },
    { key: 'status', label: 'Status' },
    { key: 'governanceModel', label: 'Governance' },
    { key: 'agesServed', label: 'Ages Served' },
    { key: 'location', label: 'Location' },
    { key: 'membershipStatus', label: 'Membership' }
  ],
  EDUCATORS: [
    { key: 'fullName', label: 'Full Name' },
    { key: 'currentSchool', label: 'Current School' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'raceEthnicity', label: 'Race & Ethnicity' },
    { key: 'discoveryStatus', label: 'Discovery Status' }
  ],
  CHARTERS: [
    { key: 'name', label: 'Charter Name' },
    { key: 'status', label: 'Status' },
    { key: 'initialTargetCommunity', label: 'Target Community' }
  ]
};

export const MULTI_SELECT_COLUMNS = {
  status: true,
  agesServed: true,
  governanceModel: true,
  membershipStatus: true,
  raceEthnicity: true
};

export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  URL: 'url',
  DATE: 'date',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  ARRAY: 'array'
};