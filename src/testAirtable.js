// Test file to debug Airtable connection
import { airtableService } from './airtableService.jsx';

async function testAirtableConnection() {
    console.log('🧪 Testing Airtable connection...');
    
    try {
        // Test fetching educators
        console.log('📚 Fetching educators...');
        const educators = await airtableService.fetchEducators(true);
        console.log('✅ Educators fetched:', {
            count: educators.length,
            first: educators[0],
            fields: educators[0] ? Object.keys(educators[0]) : 'No educators found'
        });
        
        // Test fetching schools
        console.log('🏫 Fetching schools...');
        const schools = await airtableService.fetchSchools(true);
        console.log('✅ Schools fetched:', {
            count: schools.length,
            first: schools[0],
            fields: schools[0] ? Object.keys(schools[0]) : 'No schools found'
        });
        
    } catch (error) {
        console.error('❌ Error testing Airtable:', error);
    }
}

// Run the test
testAirtableConnection();