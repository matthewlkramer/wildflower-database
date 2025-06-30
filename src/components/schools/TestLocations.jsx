import React, { useEffect, useState } from 'react';
import { airtableService } from '../../airtableService';

const TestLocations = ({ schoolId }) => {
    const [allLocations, setAllLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ALL locations without any filter
                const all = await airtableService.fetchRecords('Locations', { maxRecords: 10000 });
                console.log('🌍 ALL Locations:', all);
                console.log('🌍 Total locations count:', all.length);
                
                if (all.length > 0) {
                    console.log('🌍 First location:', all[0]);
                    console.log('🌍 Location fields:', Object.keys(all[0]));
                    
                    // Check School field structure
                    const schoolFields = all.map(loc => ({
                        id: loc.id,
                        School: loc.School,
                        school_id: loc.school_id,
                        'School ID': loc['School ID'],
                        Schools: loc.Schools,
                        school: loc.school,
                        allFields: Object.keys(loc)
                    }));
                    console.log('🌍 School fields in locations:', schoolFields.slice(0, 5));
                }
                
                setAllLocations(all);
                
                // Try manual filtering - prioritize school_id as it works better
                const filtered = all.filter(loc => {
                    console.log(`Checking location ${loc.id} - Address: ${loc.Address}, school_id: ${loc.school_id}, School field:`, loc.School, 'Looking for:', schoolId);
                    
                    // PRIORITIZE school_id field
                    if (loc.school_id === schoolId) {
                        console.log('✅ MATCH! Location has school_id match');
                        return true;
                    }
                    
                    // Check school_ids array
                    if (Array.isArray(loc.school_ids) && loc.school_ids.includes(schoolId)) {
                        console.log('✅ MATCH! Location has school in school_ids array');
                        return true;
                    }
                    
                    // Last resort - check School linked field
                    const schoolField = loc.School;
                    if (Array.isArray(schoolField) && schoolField.includes(schoolId)) {
                        console.log('✅ MATCH! Location has school in School array');
                        return true;
                    }
                    
                    if (schoolField === schoolId) {
                        console.log('✅ MATCH! Location has school as direct value');
                        return true;
                    }
                    
                    return false;
                });
                
                console.log(`🎯 Filtered ${filtered.length} locations for school ${schoolId}`);
                console.log('🎯 Filtered locations:', filtered);
                setFilteredLocations(filtered);
                
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [schoolId]);
    
    if (loading) return <div>Loading test data...</div>;
    
    return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-bold mb-2">Debug: Location Test</h3>
            <p>School ID: {schoolId}</p>
            <p>Total locations in database: {allLocations.length}</p>
            <p>Locations for this school: {filteredLocations.length}</p>
            {filteredLocations.length > 0 && (
                <div className="mt-2">
                    <p className="font-semibold">Found locations:</p>
                    {filteredLocations.map(loc => (
                        <div key={loc.id} className="text-sm">
                            {loc.Address || loc.address || 'No address'} 
                            (School field: {JSON.stringify(loc.School)})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestLocations;