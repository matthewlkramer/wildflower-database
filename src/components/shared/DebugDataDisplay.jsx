import React from 'react';

const DebugDataDisplay = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
        <h3 className="font-bold text-yellow-800">{title} - No Data</h3>
      </div>
    );
  }

  const firstRecord = data[0];
  const fields = Object.keys(firstRecord).sort();

  return (
    <div className="bg-cyan-50 border border-cyan-200 rounded p-4 my-4">
      <h3 className="font-bold text-cyan-800 mb-2">{title} - Debug Info</h3>
      <div className="text-xs">
        <p className="mb-2">Total records: {data.length}</p>
        <h4 className="font-semibold mb-1">Available fields:</h4>
        <div className="bg-white p-2 rounded border border-cyan-100 mb-2">
          {fields.map(field => (
            <div key={field} className="py-0.5">
              <span className="font-mono">{field}</span>: 
              <span className="ml-2 text-gray-600">
                {typeof firstRecord[field] === 'object' 
                  ? JSON.stringify(firstRecord[field]) 
                  : String(firstRecord[field])}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugDataDisplay;