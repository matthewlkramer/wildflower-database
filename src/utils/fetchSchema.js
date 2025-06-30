// Utility to fetch schema information from Airtable
import { airtableService } from '../airtableService';

export const fetchTableSchema = async (tableName) => {
  try {
    // Fetch just one record to see the field structure
    const records = await airtableService.fetchRecords(tableName, { maxRecords: 1 });
    
    if (records && records.length > 0) {
      const sampleRecord = records[0];
      const fields = Object.keys(sampleRecord).filter(key => key !== 'id' && key !== 'createdTime');
      
      console.log(`\n=== ${tableName} Schema ===`);
      console.log('Fields:', fields);
      console.log('Sample record:', sampleRecord);
      
      return {
        tableName,
        fields,
        sampleRecord
      };
    }
    
    return {
      tableName,
      fields: [],
      sampleRecord: null
    };
  } catch (error) {
    console.error(`Error fetching schema for ${tableName}:`, error);
    return null;
  }
};

export const fetchAllSchemas = async () => {
  const tables = [
    'Governance docs',
    'Guides assignments', 
    'Grants',
    'Loans',
    'Action steps',
    'School notes'
  ];
  
  const schemas = {};
  
  for (const table of tables) {
    const schema = await fetchTableSchema(table);
    if (schema) {
      schemas[table] = schema;
    }
  }
  
  return schemas;
};