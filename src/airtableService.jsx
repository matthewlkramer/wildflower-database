// src/airtableService.jsx - Updated with correct field names from metadata

import { AIRTABLE_CONFIG, TABLES } from './airtableConfig.js';


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
                maxRecords = 100, // set to 100 for development, increase to 10,000 later
                pageSize = 100,
                sort,
                filterByFormula,
                fields
            } = options;

            // Debug logging for locations table specifically
            if (tableName === TABLES.LOCATIONS) {
                console.log('🔍 fetchRecords for LOCATIONS table:', {
                    tableName,
                    filterByFormula,
                    sort,
                    maxRecords,
                    pageSize
                });
            }

            let allRecords = [];
            let offset = null;
            let pageCount = 0;

            console.log(`🔄 Starting to fetch records from ${tableName}...`);

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
                
                // Debug the URL for locations specifically
                if (tableName === TABLES.LOCATIONS) {
                    console.log('🔗 Locations API URL:', url);
                }
                
                console.log(`📄 Fetching page ${pageCount + 1} from ${tableName}...`);

                console.log('🔗 Making Airtable request:', {
                    tableName: tableName,
                    pageCount: pageCount + 1,
                    hasApiKey: !!this.headers.Authorization,
                    baseId: AIRTABLE_CONFIG.BASE_ID,
                    urlLength: url.length
                });

                const response = await fetch(url, { 
                    headers: this.headers,
                    mode: 'cors'
                });

                console.log('📡 Airtable response:', {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    tableName: tableName,
                    pageCount: pageCount + 1
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Airtable API Error:', {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorText,
                        tableName: tableName,
                        url: url.substring(0, 100) + '...'
                    });
                    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                const recordsInThisPage = data.records || [];

                allRecords = allRecords.concat(recordsInThisPage);
                offset = data.offset;
                pageCount++;

                console.log(`📄 Page ${pageCount}: Fetched ${recordsInThisPage.length} records, total so far: ${allRecords.length}`);

                // Stop if no more pages or we've reached maxRecords
                if (!offset || allRecords.length >= maxRecords) {
                    if (!offset) {
                        console.log('✅ No more pages available');
                    }
                    if (allRecords.length >= maxRecords) {
                        console.log(`✅ Reached maxRecords limit: ${maxRecords}`);
                    }
                    break;
                }

                // Safety check to prevent infinite loops
                if (pageCount > 100) {
                    console.warn('⚠️ Stopping after 100 pages to prevent infinite loop');
                    break;
                }

            } while (offset);

            // Trim to maxRecords if we got too many
            if (allRecords.length > maxRecords) {
                console.log(`✂️ Trimming results from ${allRecords.length} to ${maxRecords}`);
                allRecords = allRecords.slice(0, maxRecords);
            }

            console.log(`✅ Final result for ${tableName}: ${allRecords.length} records from ${pageCount} pages`);
            return this.transformRecords(allRecords);
        } catch (error) {
            console.error(`❌ Error fetching records from ${tableName}:`, error);
            throw error;
        }
    }

    // Transform Airtable records to a more usable format
    transformRecords(records) {
        console.log('🔄 Transforming records, first raw record:', records[0]);
        const transformed = records.map(record => ({
            id: record.id,
            ...record.fields,
            createdTime: record.createdTime
        }));
        console.log('✅ First transformed record:', transformed[0]);
        return transformed;
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

    // Get table schema/fields
    async getTableFields(tableName) {
        try {
            // Fetch just one record to inspect fields
            const options = { maxRecords: 1 };
            const records = await this.fetchRecords(tableName, options);
            
            if (records.length > 0) {
                const fields = Object.keys(records[0]).filter(key => key !== 'id' && key !== 'createdTime');
                console.log(`📋 ${tableName} fields:`, fields);
                return fields;
            }
            
            return [];
        } catch (error) {
            console.error(`Error getting fields for ${tableName}:`, error);
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

        console.log('🔄 Fetching schools with options:', options);
        return this.fetchRecords(TABLES.SCHOOLS, options);
    }

    // Fetch educators - CORRECTED field names
    async fetchEducators(includeInactive = false) {
        console.log('🚨 DEBUG: fetchEducators called with includeInactive:', includeInactive);

        const options = {
            sort: { field: 'Last Name', direction: 'asc' },
        };

        console.log('🚨 DEBUG: Calling fetchRecords with options:', options);
        console.log('🚨 DEBUG: Should get ALL educators from Airtable');

        const result = await this.fetchRecords(TABLES.EDUCATORS, options);

        console.log('🚨 DEBUG: fetchEducators result length:', result.length);
        
        // Log first educator to see field names
        if (result.length > 0) {
            console.log('📋 EDUCATOR FIELD NAMES:', Object.keys(result[0]));
            console.log('📋 FIRST EDUCATOR DATA:', result[0]);
        }

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
        
        // Log first record to see field structure
        if (result.length > 0) {
            console.log('🔗 EDUCATORS X SCHOOLS FIELDS:', Object.keys(result[0]));
            console.log('🔗 First relationship:', result[0]);
        }
        
        return result;
    }

    // Add a generic method to fetch all records from any table (for your hooks)
    async getAllRecords(tableName, options = {}) {
        console.log(`🔄 Getting ALL records from ${tableName}...`);
        return this.fetchRecords(tableName, {
            maxRecords: 10000, // Allow up to 10,000 records
            ...options
        });
    }

    // CORRECTED: Generic method for fetching records by school_id
    // Using the formula field 'school_id' that exists in related tables
    async fetchBySchoolId(tableName, schoolId, sortField = null, sortDirection = 'desc') {
        console.log(`🔍 fetchBySchoolId called for ${tableName} with schoolId: ${schoolId}`);
        
        // For tables that link to Schools, we need to use the correct linking approach
        // Most tables have a 'School' field that links to the Schools table
        let filterByFormula;
        
        if (tableName === TABLES.LOCATIONS) {
            // Locations table has a 'School' field that links to Schools table
            filterByFormula = `{School} = "${schoolId}"`;
        } else if (tableName === TABLES.GRANTS) {
            // Grants table has a 'School' field that links to Schools table  
            filterByFormula = `{School} = "${schoolId}"`;
        } else if (tableName === TABLES.LOANS) {
            // Loans table has a 'School' field that links to Schools table
            filterByFormula = `{School} = "${schoolId}"`;
        } else if (tableName === TABLES.GUIDES_ASSIGNMENTS) {
            // Guide Assignments table has a 'School' field that links to Schools table
            filterByFormula = `{School} = "${schoolId}"`;
        } else if (tableName === TABLES.ACTION_STEPS) {
            // Action steps table has a 'Schools' field (plural) that links to Schools table
            filterByFormula = `{Schools} = "${schoolId}"`;
        } else if (tableName === TABLES.SCHOOL_NOTES) {
            // School notes table has a 'School' field that links to Schools table
            filterByFormula = `{School} = "${schoolId}"`;
        } else if (tableName === TABLES.GOVERNANCE_DOCS) {
            // Governance docs table has a 'School' field that links to Schools table
            filterByFormula = `{School} = "${schoolId}"`;
        } else {
            // Fallback to school_id formula field if it exists
            filterByFormula = `{school_id} = "${schoolId}"`;
        }

        const options = {
            filterByFormula,
        };
        
        if (sortField) {
            options.sort = { field: sortField, direction: sortDirection };
        }

        console.log(`🔍 Using filter formula: ${filterByFormula}`);
        
        const result = await this.fetchRecords(tableName, options);
        
        console.log(`✅ fetchBySchoolId result for ${tableName}:`, result.length, 'records');
        
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