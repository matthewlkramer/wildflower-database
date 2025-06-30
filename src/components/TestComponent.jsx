import React, { useState } from 'react';

const TestComponent = () => {
    const [activeTab, setActiveTab] = useState('schools');
    
    console.log('TestComponent rendered, activeTab:', activeTab);
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Test Component</h1>
            <div>
                <button 
                    onClick={() => {
                        console.log('Schools clicked');
                        setActiveTab('schools');
                    }}
                    style={{ margin: '5px', padding: '10px', backgroundColor: activeTab === 'schools' ? 'blue' : 'gray', color: 'white' }}
                >
                    Schools
                </button>
                <button 
                    onClick={() => {
                        console.log('Educators clicked');
                        setActiveTab('educators');
                    }}
                    style={{ margin: '5px', padding: '10px', backgroundColor: activeTab === 'educators' ? 'blue' : 'gray', color: 'white' }}
                >
                    Educators
                </button>
            </div>
            <div style={{ marginTop: '20px' }}>
                Active tab: {activeTab}
            </div>
        </div>
    );
};

export default TestComponent;