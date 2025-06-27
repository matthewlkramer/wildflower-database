// src/components/schools/SchoolDetails.jsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TabContainer from '../shared/TabContainer';
import SchoolSummary from './SchoolSummary';
import SchoolTLs from './SchoolTLs';
import SchoolLocations from './SchoolLocations';
// Import other school tab components...

const SchoolDetails = ({ school, onBack, onEducatorOpen }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'tls', label: 'TLs' },
    { id: 'locations', label: 'Locations' },
    { id: 'governance', label: 'Governance' },
    { id: 'guides', label: 'Guides' },
    { id: 'ssj-oss', label: 'SSJ / OSS' },
    { id: 'membership-fees', label: 'Membership fees' },
    { id: 'grants-loans', label: 'Grants and Loans' },
    { id: 'linked-mtgs', label: 'Linked mtgs/emails' },
    { id: 'notes-actions', label: 'Notes/Action steps' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SchoolSummary school={school} />;
      case 'tls':
        return <SchoolTLs school={school} onEducatorOpen={onEducatorOpen} />;
      case 'locations':
        return <SchoolLocations school={school} />;
      // Add other cases...
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} content would go here
          </div>
        );
    }
  };

  return (
    <TabContainer
      title={school.name}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {renderTabContent()}
    </TabContainer>
  );
};

export default SchoolDetails;