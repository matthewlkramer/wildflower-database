// src/airtableService.jsx - Updated with correct field names from metadata

import { AIRTABLE_CONFIG, TABLES } from './airtableConfig.js';
import { rateLimiter } from './utils/rateLimiter.js';


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
                maxRecords = 10000, // Get all records by default
                pageSize = 100,
                sort,
                filterByFormula,
                fields
            } = options;

            // Debug logging for locations table specifically
            if (tableName === TABLES.LOCATIONS) {
            }

            let allRecords = [];
            let offset = null;
            let pageCount = 0;

            do {
                const params = new URLSearchParams();
                if (view) params.append('view', view);
                if (pageSize) params.append('pageSize', pageSize);
                if (sort) params.append('sort[0][field]', sort.field);
                if (sort) params.append('sort[0][direction]', sort.direction || 'asc');
                if (filterByFormula) params.append('filterByFormula', filterByFormula);
                if (fields) fields.forEach(field => params.append('fields[]', field));
                if (offset) params.append('offset', offset);

                const url = `${this.baseUrl}/${encodeURIComponent(tableName)}?${params}`;
                
                // Debug URL commented out


                const response = await rateLimiter.throttle(() => 
                    fetch(url, { 
                        headers: this.headers,
                        mode: 'cors'
                    })
                );


                if (!response.ok) {
                    const errorText = await response.text();
                    // Airtable API Error
                    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                const recordsInThisPage = data.records || [];

                allRecords = allRecords.concat(recordsInThisPage);
                offset = data.offset;
                pageCount++;


                // Stop if no more pages or we've reached maxRecords
                if (!offset || allRecords.length >= maxRecords) {
                    break;
                }

                // Safety check to prevent infinite loops
                if (pageCount > 100) {
                    // Stopping after 100 pages to prevent infinite loop
                    break;
                }

            } while (offset);

            // Trim to maxRecords if we got too many
            if (allRecords.length > maxRecords) {
                allRecords = allRecords.slice(0, maxRecords);
            }
            return this.transformRecords(allRecords);
        } catch (error) {
            throw error;
        }
    }

    // Transform Airtable records to a more usable format
    transformRecords(records) {
        const transformed = records.map(record => ({
            id: record.id,
            ...record.fields,
            createdTime: record.createdTime
        }));
        return transformed;
    }

    // Create a new record
    async createRecord(tableName, fields) {
        try {
            const url = `${this.baseUrl}/${encodeURIComponent(tableName)}`;
            const response = await rateLimiter.throttle(() =>
                fetch(url, {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify({ fields })
                })
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.transformRecords([data])[0];
        } catch (error) {
            throw error;
        }
    }

    // Update a record
    async updateRecord(tableName, recordId, fields) {
        try {
            const url = `${this.baseUrl}/${encodeURIComponent(tableName)}/${recordId}`;
            const response = await rateLimiter.throttle(() =>
                fetch(url, {
                    method: 'PATCH',
                    headers: this.headers,
                    body: JSON.stringify({ fields })
                })
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.transformRecords([data])[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete a record
    async deleteRecord(tableName, recordId) {
        try {
            const url = `${this.baseUrl}/${encodeURIComponent(tableName)}/${recordId}`;
            const response = await rateLimiter.throttle(() =>
                fetch(url, {
                    method: 'DELETE',
                    headers: this.headers
                })
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Get table schema/fields
    async getTableFields(tableName) {
        try {
            // Fetch just one record to inspect fields
            const options = { maxRecords: 1 };
            const records = await this.fetchRecords(tableName, options);
            
            if (records.length > 0) {
                const fields = Object.keys(records[0]).filter(key => key !== 'id' && key !== 'createdTime');
                return fields;
            }
            
            return [];
        } catch (error) {
            return [];
        }
    }

    // Fetch schools - CORRECTED field names
    async fetchSchools(includeInactive = false) {
        const options = {
            sort: { field: 'Name', direction: 'asc' },
        };

        // Add filter for active schools only (default behavior)
        // Using correct field name: 'School Status'
        if (!includeInactive) {
            options.filterByFormula = "OR({School Status} = 'Open', {School Status} = 'Emerging')";
        }

        const schools = await this.fetchRecords(TABLES.SCHOOLS, options);
        
        
        return schools;
    }

    // Fetch educators - CORRECTED field names
    async fetchEducators(includeInactive = false) {
        const options = {
            sort: { field: 'Last Name', direction: 'asc' },
        };

        const result = await this.fetchRecords(TABLES.EDUCATORS, options);


        return result;
    }

    // Fetch charters
    async fetchCharters() {
        return this.fetchRecords(TABLES.CHARTERS, {
            sort: { field: 'Initial target community', direction: 'asc' }
        });
    }

    // Fetch relationships between educators and schools
    async fetchEducatorsXSchools() {
        const result = await this.fetchRecords(TABLES.EDUCATORS_X_SCHOOLS, {
            sort: { field: 'Start Date', direction: 'desc' }
        });
        
        
        return result;
    }

    // Add a generic method to fetch all records from any table (for your hooks)
    async getAllRecords(tableName, options = {}) {
        return this.fetchRecords(tableName, {
            maxRecords: 10000, // Allow up to 10,000 records
            ...options
        });
    }

    // CORRECTED: Generic method for fetching records by school_id
    // Using the formula field 'school_id' that exists in related tables
    async fetchBySchoolId(tableName, schoolId, sortField = null, sortDirection = 'desc') {
        
        // First, let's fetch ALL records to see what we're working with
        const allRecords = await this.fetchRecords(tableName, { maxRecords: 10000 });
        if (allRecords.length > 0) {
            // Check what the School field contains
            const firstRecord = allRecords[0];
        }
        
        // For tables that link to Schools, we need to use the correct linking approach
        // Most tables have a 'School' field that links to the Schools table
        let filterByFormula;
        
        // First, let's try without any filter to see if we get data
        if (tableName === TABLES.LOCATIONS && schoolId === 'TEST_NO_FILTER') {
            filterByFormula = null; // No filter, get all locations
        } else if (allRecords.length > 0 && allRecords[0].school_id) {
            // If records have a school_id field, use that
            filterByFormula = `{school_id} = "${schoolId}"`;
        } else if (allRecords.length > 0 && allRecords[0].School) {
            // If School field exists and is an array, we need special handling
            const firstSchool = allRecords[0].School;
            if (Array.isArray(firstSchool)) {
                // School is a linked record field (array of IDs)
                filterByFormula = `FIND("${schoolId}", ARRAYJOIN({School}, ","))`;
            } else {
                // School is a simple field
                filterByFormula = `{School} = "${schoolId}"`;
            }
        } else {
            // Fallback
            filterByFormula = `FIND("${schoolId}", ARRAYJOIN({School}, ","))`;
        }

        const options = {
            filterByFormula,
        };
        
        if (sortField) {
            options.sort = { field: sortField, direction: sortDirection };
        }

        
        const result = await this.fetchRecords(tableName, options);
        return result;
    }

    // CORRECTED: School-specific data methods with proper field names

    // Locations - using 'Start of time at location' field
    async fetchSchoolLocations(schoolId) {
        return this.fetchBySchoolId(TABLES.LOCATIONS, schoolId, 'Start of time at location', 'desc');
    }

    // School Notes - using 'Date created' field
    async fetchSchoolNotes(schoolId) {
        return this.fetchBySchoolId(TABLES.SCHOOL_NOTES, schoolId, 'Date created', 'desc');
    }

    // Action Steps - using 'Due date' field, table name is 'Schools' (plural)
    async fetchSchoolActionSteps(schoolId) {
        return this.fetchBySchoolId(TABLES.ACTION_STEPS, schoolId, 'Due date', 'asc');
    }

    // Governance Documents - using 'Date' field
    async fetchSchoolGovernanceDocs(schoolId) {
        return this.fetchBySchoolId(TABLES.GOVERNANCE_DOCS, schoolId, 'Date', 'desc');
    }

    // Guide Assignments - using 'Start date' field
    async fetchSchoolGuideAssignments(schoolId) {
        return this.fetchBySchoolId(TABLES.GUIDES_ASSIGNMENTS, schoolId, 'Start date', 'desc');
    }

    // Grants - using 'Issue Date' field
    async fetchSchoolGrants(schoolId) {
        return this.fetchBySchoolId(TABLES.GRANTS, schoolId, 'Issue Date', 'desc');
    }

    // Loans - using 'Effective Issue Date' field
    async fetchSchoolLoans(schoolId) {
        return this.fetchBySchoolId(TABLES.LOANS, schoolId, 'Effective Issue Date', 'desc');
    }

    // Family Surveys
    async fetchFamilySurveys(schoolId) {
        return this.fetchBySchoolId(TABLES.FAMILY_SURVEYS, schoolId, 'School year', 'desc');
    }

    // Membership Fee Overview
    async fetchSchoolMembershipFees(schoolId) {
        return this.fetchBySchoolId(TABLES.MEMBERSHIP_FEE_OVERVIEW, schoolId, 'School year', 'desc');
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
}

export const airtableService = new AirtableService();