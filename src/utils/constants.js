// Application tab constants
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
    LINKED_MTGS_EMAILS: 'linked-mtgs-emails',
    NOTES_ACTIONS: 'notes-actions'
};

export const EDUCATOR_TABS = {
    SUMMARY: 'summary',
    DEMOGRAPHICS: 'demographics',
    CONTACT_INFO: 'contact-info',
    SCHOOLS: 'schools',
    ONLINE_FORMS: 'online-forms',
    EARLY_CULTIVATION: 'early-cultivation',
    GUIDES: 'guides',
    CERTS: 'certs',
    NOTES: 'notes',
    EVENTS: 'events',
    LINKED_MTGS_EMAILS: 'linked-mtgs-emails'
};

// Status constants
export const SCHOOL_STATUSES = {
    OPEN: 'Open',
    EMERGING: 'Emerging',
    PERMANENTLY_CLOSED: 'Permanently Closed',
    DISAFFILIATED: 'Disaffiliated',
    DISAFFILIATING: 'Disaffiliating',
    PAUSED: 'Paused',
    PLACEHOLDER: 'Placeholder'
};

export const MEMBERSHIP_STATUSES = {
    MEMBER_SCHOOL: 'Member School',
    PENDING: 'Pending',
    NON_MEMBER_SPECIAL: 'Non-Member - Special Situation',
    FORMER_MEMBER: 'Former Member'
};

export const GOVERNANCE_MODELS = {
    INDEPENDENT: 'Independent',
    CHARTER: 'Charter'
};

export const DISCOVERY_STATUSES = {
    COMPLETE: 'Complete',
    IN_PROGRESS: 'In Progress',
    NOT_STARTED: 'Not Started',
    PAUSED: 'Paused'
};

export const INDIVIDUAL_TYPES = {
    EDUCATOR: 'Educator',
    COMMUNITY_MEMBER: 'Community Member'
};

// Role constants
export const EDUCATOR_ROLES = [
    'Founder',
    'Teacher Leader',
    'Head of School',
    'Assistant Teacher',
    'Support Staff',
    'Board Member'
];

export const GUIDE_ROLES = [
    'Ops Guide',
    'Regional Entrepreneur'
];

// Time zones
export const TIME_ZONES = [
    'Eastern Time (ET)',
    'Central Time (CT)',
    'Mountain Time (MT)',
    'Pacific Time (PT)',
    'Alaska Time (AKT)',
    'Hawaii-Aleutian Time (HAT)'
];

// Location types
export const LOCATION_TYPES = [
    'School address and mailing address',
    'School address only',
    'Mailing address only',
    'Former school address',
    'Former mailing address',
    'Temporary location'
];

export const CO_LOCATION_TYPES = [
    'None',
    'Shared facility',
    'Sublease',
    'Partnership',
    'Community center',
    'Other'
];

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    AIRTABLE_ERROR: 'Error connecting to database. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested item was not found.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
    RECORD_CREATED: 'Record created successfully',
    RECORD_UPDATED: 'Record updated successfully',
    RECORD_DELETED: 'Record deleted successfully',
    STINT_ADDED: 'Educator stint added successfully',
    STINT_ENDED: 'Stint ended successfully'
};