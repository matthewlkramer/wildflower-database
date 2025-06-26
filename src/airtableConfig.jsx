export const AIRTABLE_CONFIG = {
  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID,
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY,
  BASE_URL: 'https://api.airtable.com/v0'
};

// Table names mapping from your Airtable (these must match exactly)
export const TABLES = {
  SCHOOLS: 'Schools',
  EDUCATORS: 'Educators', 
  CHARTERS: 'Charters',
  EDUCATORS_X_SCHOOLS: 'Educators x Schools',
  LOCATIONS: 'Locations',
  SCHOOL_NOTES: 'School notes',
  EDUCATOR_NOTES: 'Educator notes',
  GRANTS: 'Grants',
  LOANS: 'Loans',
  ACTION_STEPS: 'Action steps',
  MEMBERSHIP_FEE_OVERVIEW: 'Membership fee overview',
  MEMBERSHIP_FEE_UPDATES: 'Membership fee change log',
  SSJ_FILLOUT_FORMS: 'SSJ Fillout Forms',
  EVENT_ATTENDANCE: 'Event attendance',
  MONTESSORI_CERTS: 'Montessori Certs',
  GUIDES_ASSIGNMENTS: 'Guides Assignments',
  GOVERNANCE_DOCS: 'Governance docs'
};