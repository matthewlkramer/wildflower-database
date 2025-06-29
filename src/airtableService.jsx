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
                maxRecords = 10000,
                pageSize = 100,
                sort,
                filterByFormula,
                fields
            } = options;

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
                console.log(`📄 Fetching page ${pageCount + 1} from ${tableName}...`);

                console.log('🔗 Making Airtable request:', {
                    tableName: tableName,
                    pageCount: pageCount + 1,
                    hasApiKey: !!this.headers.Authorization,
                    baseId: AIRTABLE_CONFIG.BASE_ID,
                    urlLength: url.length
                });

                const response = await fetch(url, { headers: this.headers });

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

    // Fetch schools
    async fetchSchools(includeInactive = false) {
        const options = {
            sort: { field: 'Name', direction: 'asc' },
        };

        // Add filter for active schools only (default behavior)
        if (!includeInactive) {
            options.filterByFormula = "OR({School Status} = 'Open', {School Status} = 'Emerging')";
        }

        console.log('🔄 Fetching schools with options:', options);
        return this.fetchRecords(TABLES.SCHOOLS, options);
    }

    // Fetch educators
    async fetchEducators(includeInactive = false) {
        console.log('🔄 Fetching educators with includeInactive:', includeInactive);

        const options = {
            sort: { field: 'Last Name', direction: 'asc' },
            // Remove the filterByFormula - always get ALL educators
            // Let React handle the filtering
        };

        console.log('🔄 Fetching ALL educators (no server-side filtering)');
        return this.fetchRecords(TABLES.EDUCATORS, options);
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

    // Add a generic method to fetch all records from any table (for your hooks)
    async getAllRecords(tableName, options = {}) {
        console.log(`🔄 Getting ALL records from ${tableName}...`);
        return this.fetchRecords(tableName, {
            maxRecords: 10000, // Allow up to 10,000 records
            ...options
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

    // Fetch 990s for a specific school
    async fetchNineNineties(schoolId) {
        return this.fetchRecords(TABLES.NINE_NINETIES, {
            filterByFormula: `FIND("${schoolId}", {School})`,
            sort: { field: '990 Reporting Year', direction: 'desc' }
        });
    }

    // Fetch family surveys for a specific school
    async fetchFamilySurveys(schoolId) {
        return this.fetchRecords(TABLES.FAMILY_SURVEYS, {
            filterByFormula: `FIND("${schoolId}", {School})`,
            sort: { field: 'Survey Year', direction: 'desc' }
        });
    }

    // Fetch assessment data for a specific school
    async fetchAssessmentData(schoolId) {
        return this.fetchRecords(TABLES.ASSESSMENT_DATA, {
            filterByFormula: `FIND("${schoolId}", {School})`,
            sort: { field: 'Year', direction: 'desc' }
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