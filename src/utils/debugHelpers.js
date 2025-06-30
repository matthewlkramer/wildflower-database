// Helper to display all fields from a record for debugging
export const displayRecordFields = (record, label) => {
  if (!record || typeof record !== 'object') return null;
  
  console.log(`${label} fields:`, Object.keys(record));
  console.log(`${label} sample:`, record);
  
  // Create a simple display of all fields
  return (
    <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
      <strong>Debug - Available fields:</strong>
      <div style={{ marginTop: '4px' }}>
        {Object.entries(record).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>
    </div>
  );
};