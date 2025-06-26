import { AIRTABLE_CONFIG, TABLES } from './airtableConfig.jsx';

// airtableService.js
class AirtableService {
  constructor() {
    this.baseUrl = `${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}`;
    this.headers = {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  // Generic method to fetch records from any table
  async fetchRecords(tableName, options = {}) {
    try {
      const { 
        view, 
        maxRecords = 100, 
        pageSize = 100,
        sort,
        filterByFormula,
        fields
      } = options;
      
      const params = new URLSearchParams();
      if (view) params.append('view', view);
      if (maxRecords) params.append('maxRecords', maxRecords);
      if (pageSize) params.append('pageSize', pageSize);
      if (sort) params.append('sort[0][field]', sort.field);
      if (sort) params.append('sort[0][direction]', sort.direction || 'asc');
      if (filterByFormula) params.append('filterByFormula', filterByFormula);
      if (fields) fields.forEach(field => params.append('fields[]', field));

      const url = `${this.baseUrl}/${encodeURIComponent(tableName)}?${params}`;
      const response = await fetch(url, { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformRecords(data.records);
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      throw error;
    }
  }

  // Transform Airtable records to a more usable format
  transformRecords(records) {
    return records.map(record => ({
      id: record.id,
      ...record.fields,
      createdTime: record.createdTime
    }));
  }

  // Create a new record
  async createRecord(tableName, fields) {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(tableName)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ fields })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformRecords([data])[0];
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      throw error;
    }
  }

  // Update a record
  async updateRecord(tableName, recordId, fields) {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(tableName)}/${recordId}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ fields })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformRecords([data])[0];
    } catch (error) {
      console.error(`Error updating record ${recordId} in ${tableName}:`, error);
      throw error;
    }
  }

  // Delete a record
  async deleteRecord(tableName, recordId) {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(tableName)}/${recordId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting record ${recordId} from ${tableName}:`, error);
      throw error;
    }
  }

  // Fetch schools with related data

  async fetchSchools(includeInactive = false) {
    const options = {
      sort: { field: 'Name', direction: 'asc' },
      maxRecords: 200  // ← Add this line	
    };
  
    // Add filter for active schools only (default behavior)
    if (!includeInactive) {
      options.filterByFormula = "OR({School Status} = 'Open', {School Status} = 'Emerging')";
    }
  
    console.log('🔄 Fetching schools with options:', options);
    return this.fetchRecords(TABLES.SCHOOLS, options);
  }

  // Fetch educators with related data
  async fetchEducators() {
    return this.fetchRecords(TABLES.EDUCATORS, {
      sort: { field: 'Last Name', direction: 'asc' }
    });
  }

  // Fetch charters
  async fetchCharters() {
    return this.fetchRecords(TABLES.CHARTERS, {
      sort: { field: 'Initial target community', direction: 'asc' }
    });
  }

  // Fetch relationships between educators and schools
  async fetchEducatorsXSchools() {
    return this.fetchRecords(TABLES.EDUCATORS_X_SCHOOLS, {
      sort: { field: 'Start Date', direction: 'desc' }
    });
  }

  // Fetch school notes for a specific school
  async fetchSchoolNotes(schoolId) {
    return this.fetchRecords(TABLES.SCHOOL_NOTES, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Date created', direction: 'desc' }
    });
  }

  // Fetch educator notes for a specific educator
  async fetchEducatorNotes(educatorId) {
    return this.fetchRecords(TABLES.EDUCATOR_NOTES, {
      filterByFormula: `FIND("${educatorId}", {Educator})`,
      sort: { field: 'Date', direction: 'desc' }
    });
  }

  // Fetch grants for a specific school
  async fetchSchoolGrants(schoolId) {
    return this.fetchRecords(TABLES.GRANTS, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Issue Date', direction: 'desc' }
    });
  }

  // Fetch loans for a specific school
  async fetchSchoolLoans(schoolId) {
    return this.fetchRecords(TABLES.LOANS, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Effective Issue Date', direction: 'desc' }
    });
  }

  // Fetch action steps for a specific school
  async fetchSchoolActionSteps(schoolId) {
    return this.fetchRecords(TABLES.ACTION_STEPS, {
      filterByFormula: `FIND("${schoolId}", {Schools})`,
      sort: { field: 'Due date', direction: 'asc' }
    });
  }

  // Fetch locations for a specific school
  async fetchSchoolLocations(schoolId) {
    return this.fetchRecords(TABLES.LOCATIONS, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Start of time at location', direction: 'desc' }
    });
  }

  // Fetch membership fee records for a specific school
  async fetchSchoolMembershipFees(schoolId) {
    return this.fetchRecords(TABLES.MEMBERSHIP_FEE_OVERVIEW, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'School year', direction: 'desc' }
    });
  }

  // Fetch SSJ forms for a specific educator
  async fetchEducatorSSJForms(educatorId) {
    return this.fetchRecords(TABLES.SSJ_FILLOUT_FORMS, {
      filterByFormula: `FIND("${educatorId}", {Educator})`,
      sort: { field: 'Entry Date', direction: 'desc' }
    });
  }

  // Fetch event attendance for a specific educator
  async fetchEducatorEventAttendance(educatorId) {
    return this.fetchRecords(TABLES.EVENT_ATTENDANCE, {
      filterByFormula: `FIND("${educatorId}", {Event Participant})`,
      sort: { field: 'Registration Date', direction: 'desc' }
    });
  }

  // Fetch Montessori certifications for a specific educator
  async fetchEducatorMontessoriCerts(educatorId) {
    return this.fetchRecords(TABLES.MONTESSORI_CERTS, {
      filterByFormula: `FIND("${educatorId}", {Educator})`,
      sort: { field: 'Year Certified', direction: 'desc' }
    });
  }

  // Fetch guide assignments for a specific school
  async fetchSchoolGuideAssignments(schoolId) {
    return this.fetchRecords(TABLES.GUIDES_ASSIGNMENTS, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Start date', direction: 'desc' }
    });
  }

  // Fetch governance documents for a specific school
  async fetchSchoolGovernanceDocs(schoolId) {
    return this.fetchRecords(TABLES.GOVERNANCE_DOCS, {
      filterByFormula: `FIND("${schoolId}", {School})`,
      sort: { field: 'Date', direction: 'desc' }
    });
  }
}

export const airtableService = new AirtableService();