// Centralized tabs configuration for all entity types
import { 
  SCHOOL_TABS, 
  EDUCATOR_TABS
} from './constants';

export const ENTITY_TABS = {
  schools: {
    [SCHOOL_TABS.SUMMARY]: {
      label: 'Summary',
      key: SCHOOL_TABS.SUMMARY,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: null
    },
    [SCHOOL_TABS.TLS]: {
      label: 'TLs',
      key: SCHOOL_TABS.TLS,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'No teacher leaders found.'
    },
    [SCHOOL_TABS.LOCATIONS]: {
      label: 'Locations',
      key: SCHOOL_TABS.LOCATIONS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Location',
      emptyMessage: 'No locations found.'
    },
    [SCHOOL_TABS.GOVERNANCE]: {
      label: 'Governance',
      key: SCHOOL_TABS.GOVERNANCE,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Document',
      emptyMessage: 'No governance documents found.'
    },
    [SCHOOL_TABS.GUIDES]: {
      label: 'Guides',
      key: SCHOOL_TABS.GUIDES,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Guide',
      emptyMessage: 'No guide assignments found.'
    },
    [SCHOOL_TABS.SSJ_OSS]: {
      label: 'SSJ/OSS',
      key: SCHOOL_TABS.SSJ_OSS,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'SSJ/OSS data not available.'
    },
    [SCHOOL_TABS.MEMBERSHIP_FEES]: {
      label: 'Membership Fees',
      key: SCHOOL_TABS.MEMBERSHIP_FEES,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'Membership fee data not available.'
    },
    [SCHOOL_TABS.GRANTS_LOANS]: {
      label: 'Grants & Loans',
      key: SCHOOL_TABS.GRANTS_LOANS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Funding',
      emptyMessage: 'No funding records found.'
    },
    [SCHOOL_TABS.LINKED_MTGS_EMAILS]: {
      label: 'Linked mtgs/emails',
      key: SCHOOL_TABS.LINKED_MTGS_EMAILS,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'This section will be implemented later.'
    },
    [SCHOOL_TABS.NOTES_ACTIONS]: {
      label: 'Notes & Actions',
      key: SCHOOL_TABS.NOTES_ACTIONS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Note',
      emptyMessage: 'No notes found.'
    }
  },
  
  educators: {
    [EDUCATOR_TABS.SUMMARY]: {
      label: 'Summary',
      key: EDUCATOR_TABS.SUMMARY,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: null
    },
    [EDUCATOR_TABS.DEMOGRAPHICS]: {
      label: 'Demographics',
      key: EDUCATOR_TABS.DEMOGRAPHICS,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: null
    },
    [EDUCATOR_TABS.CONTACT_INFO]: {
      label: 'Contact Info',
      key: EDUCATOR_TABS.CONTACT_INFO,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Email',
      emptyMessage: 'No contact information found.'
    },
    [EDUCATOR_TABS.SCHOOLS]: {
      label: 'Schools',
      key: EDUCATOR_TABS.SCHOOLS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add School Stint',
      emptyMessage: 'No school affiliations found.'
    },
    [EDUCATOR_TABS.ONLINE_FORMS]: {
      label: 'Online Forms',
      key: EDUCATOR_TABS.ONLINE_FORMS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Form',
      emptyMessage: 'No SSJ fillout forms found.'
    },
    [EDUCATOR_TABS.EARLY_CULTIVATION]: {
      label: 'Early Cultivation',
      key: EDUCATOR_TABS.EARLY_CULTIVATION,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'No early cultivation data available yet.'
    },
    [EDUCATOR_TABS.CERTS]: {
      label: 'Certs',
      key: EDUCATOR_TABS.CERTS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Certification',
      emptyMessage: 'No Montessori certifications found.'
    },
    [EDUCATOR_TABS.NOTES]: {
      label: 'Notes',
      key: EDUCATOR_TABS.NOTES,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Note',
      emptyMessage: 'No notes found.'
    },
    [EDUCATOR_TABS.EVENTS]: {
      label: 'Events',
      key: EDUCATOR_TABS.EVENTS,
      icon: null,
      hasAddButton: true,
      addButtonText: 'Add Event',
      emptyMessage: 'No event attendance records found.'
    },
    [EDUCATOR_TABS.LINKED_MTGS_EMAILS]: {
      label: 'Linked mtgs/emails',
      key: EDUCATOR_TABS.LINKED_MTGS_EMAILS,
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: 'This section will be implemented later.'
    }
  },
  
  charters: {
    summary: {
      label: 'Summary',
      key: 'summary',
      icon: null,
      hasAddButton: false,
      addButtonText: null,
      emptyMessage: null
    }
  }
};

// Table configurations for different tab types
export const TAB_TABLE_CONFIGS = {
  // School tables
  guides: {
    columns: [
      { key: 'guideName', label: 'Guide Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'currentlyActive', label: 'Currently Active', type: 'boolean' }
    ],
    actions: ['edit', 'delete']
  },
  
  locations: {
    columns: [
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'locationType', label: 'Type', type: 'text' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'currentlyActive', label: 'Currently Active', type: 'boolean' },
      { key: 'squareFeet', label: 'Square Feet', type: 'number' }
    ],
    actions: ['view', 'edit', 'delete']
  },
  
  'grants-loans': {
    sections: ['grants', 'loans'],
    grants: {
      columns: [
        { key: 'issuedBy', label: 'Issued By', type: 'text' },
        { key: 'amount', label: 'Amount', type: 'currency' },
        { key: 'issueDate', label: 'Issue Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'grantType', label: 'Type', type: 'text' }
      ],
      actions: ['edit', 'delete']
    },
    loans: {
      columns: [
        { key: 'amount', label: 'Amount', type: 'currency' },
        { key: 'issueDate', label: 'Issue Date', type: 'date' },
        { key: 'maturityDate', label: 'Maturity Date', type: 'date' },
        { key: 'interestRate', label: 'Interest Rate', type: 'percent' },
        { key: 'status', label: 'Status', type: 'status' }
      ],
      actions: ['edit', 'delete']
    }
  },
  
  governance: {
    columns: [
      { key: 'documentType', label: 'Document Type', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'docLink', label: 'Link', type: 'link' },
      { key: 'docNotes', label: 'Notes', type: 'text' }
    ],
    actions: ['view', 'edit', 'delete']
  },
  
  'notes-actions': {
    sections: ['notes', 'actionSteps'],
    notes: {
      columns: [
        { key: 'noteText', label: 'Note', type: 'text', expandable: true },
        { key: 'createdBy', label: 'Created By', type: 'text' },
        { key: 'createdDate', label: 'Date', type: 'date' },
        { key: 'isPrivate', label: 'Private', type: 'boolean' }
      ],
      actions: ['edit', 'delete']
    },
    actionSteps: {
      columns: [
        { key: 'item', label: 'Action Item', type: 'text', expandable: true },
        { key: 'assignee', label: 'Assignee', type: 'text' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
        { key: 'completedDate', label: 'Completed Date', type: 'date' }
      ],
      actions: ['edit', 'delete']
    }
  },
  
  // Educator tables
  schools: {
    columns: [
      { key: 'schoolName', label: 'School', type: 'text' },
      { key: 'roles', label: 'Role(s)', type: 'array' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'currentlyActive', label: 'Currently Active', type: 'boolean' }
    ],
    actions: ['open', 'editStint', 'endStint', 'deleteStint']
  },
  
  'contact-info': {
    columns: [
      { key: 'emailAddress', label: 'Email Address', type: 'email' },
      { key: 'emailType', label: 'Type', type: 'text' },
      { key: 'isPrimary', label: 'Primary', type: 'boolean' },
      { key: 'notes', label: 'Notes', type: 'text' }
    ],
    actions: ['edit', 'delete']
  },
  
  'online-forms': {
    columns: [
      { key: 'formName', label: 'Form Name', type: 'text' },
      { key: 'formType', label: 'Type', type: 'text' },
      { key: 'submissionDate', label: 'Submission Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'link', label: 'Link', type: 'link' }
    ],
    actions: ['edit', 'delete']
  },
  
  certifications: {
    columns: [
      { key: 'certificationName', label: 'Certification', type: 'text' },
      { key: 'certificationLevel', label: 'Level', type: 'text' },
      { key: 'trainingCenter', label: 'Training Center', type: 'text' },
      { key: 'completionDate', label: 'Completion Date', type: 'date' },
      { key: 'expirationDate', label: 'Expiration Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' }
    ],
    actions: ['edit', 'delete']
  },
  
  notes: {
    columns: [
      { key: 'noteText', label: 'Note', type: 'text', expandable: true },
      { key: 'noteType', label: 'Type', type: 'text' },
      { key: 'createdBy', label: 'Created By', type: 'text' },
      { key: 'createdDate', label: 'Date', type: 'date' },
      { key: 'priority', label: 'Priority', type: 'text' }
    ],
    actions: ['edit', 'delete']
  },
  
  events: {
    columns: [
      { key: 'eventName', label: 'Event Name', type: 'text' },
      { key: 'eventDate', label: 'Date', type: 'date' },
      { key: 'eventType', label: 'Type', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'attendanceStatus', label: 'Attendance Status', type: 'status' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'registrationDate', label: 'Registration Date', type: 'date' }
    ],
    actions: ['edit', 'delete']
  },
  
  actionSteps: {
    columns: [
      { key: 'item', label: 'Action Item', type: 'text', expandable: true },
      { key: 'assignee', label: 'Assignee', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'completedDate', label: 'Completed Date', type: 'date' }
    ],
    actions: ['edit', 'delete']
  }
};

// Helper function to get tabs for an entity type
export const getEntityTabs = (entityType) => {
  const tabs = ENTITY_TABS[entityType] || {};
  return Object.values(tabs).map(tab => ({
    id: tab.key,
    label: tab.label
  }));
};

// Helper function to get tab configuration
export const getTabConfig = (entityType, tabKey) => {
  return ENTITY_TABS[entityType]?.[tabKey] || null;
};

// Helper function to get table configuration for a tab
export const getTableConfig = (tabType) => {
  return TAB_TABLE_CONFIGS[tabType] || null;
};