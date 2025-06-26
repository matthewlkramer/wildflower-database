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

// src/components/educators/EducatorDetails.jsx
import React, { useState } from 'react';
import TabContainer from '../shared/TabContainer';
import EducatorSummary from './EducatorSummary';
// Import other educator tab components...

const EducatorDetails = ({ educator, onBack }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'schools', label: 'Schools' },
    { id: 'demographics', label: 'Demographics' },
    { id: 'contact-info', label: 'Contact Info' },
    { id: 'online-forms', label: 'Online Forms' },
    { id: 'early-cultivation', label: 'Early Cultivation' },
    { id: 'events', label: 'Events' },
    { id: 'guides', label: 'Guides' },
    { id: 'certs', label: 'Certs' },
    { id: 'notes', label: 'Notes' },
    { id: 'linked-emails', label: 'Linked emails/meetings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <EducatorSummary educator={educator} />;
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
      title={`${educator.firstName} ${educator.lastName}`}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={onBack}
    >
      {renderTabContent()}
    </TabContainer>
  );
};

export default EducatorDetails;

// src/components/charters/CharterDetails.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CharterDetails = ({ charter, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{charter.name}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold">{charter.name}</h2>
        <p className="text-gray-600">{charter.initialTargetCommunity}</p>
      </div>
    </div>
  );
};

export default CharterDetails;

// src/components/shared/TabContainer.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TabContainer = ({ title, tabs, activeTab, onTabChange, onBack, children }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default TabContainer;

// src/components/shared/DetailRow.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const DetailRow = ({ label, value, span = false }) => (
  <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
    <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
    <div className="text-sm text-gray-900">
      {value === true ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
       value === false ? <XCircle className="w-4 h-4 text-red-600" /> :
       typeof value === 'number' ? value.toLocaleString() :
       Array.isArray(value) ? value.join(', ') :
       value || '-'}
    </div>
  </div>
);

export default DetailRow;

// src/components/schools/SchoolSummary.jsx
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import DetailRow from '../shared/DetailRow';
import StatusBadge from '../shared/StatusBadge';

const SchoolSummary = ({ school }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Add edit functionality here...

  return (
    <div className="space-y-8">
      {/* Edit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
        {/* School Logo */}
        <div className="row-span-3 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        
        {/* Basic Info */}
        <DetailRow label="School Name" value={school.name} />
        <DetailRow label="Short Name" value={school.shortName} />
        <DetailRow label="Ages Served" value={school.agesServed?.join(', ')} />
        
        <DetailRow label="Governance Model" value={school.governanceModel} />
        <DetailRow label="Founders" value={school.founders?.join(', ')} />
        <DetailRow label="Current TLs" value={school.currentTLs?.join(', ')} />
        
        <DetailRow label="School Open Date" value={school.schoolOpenDate || school.opened} />
        <DetailRow label="School Status" value={<StatusBadge status={school.status} />} />
        <DetailRow label="Membership Status" value={<StatusBadge status={school.membershipStatus} />} />
      </div>
      
      {/* Additional Info */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-2">
        <DetailRow label="Program Focus" value={school.programFocus} />
        <DetailRow label="Max Capacity Enrollments" value={school.maxCapacityEnrollments} />
        <DetailRow label="Number of Classrooms" value={school.numberOfClassrooms} />
        <DetailRow label="Public Funding" value={school.publicFunding} />
        <DetailRow label="Flexible Tuition" value={school.flexibleTuition} />
        <DetailRow label="School Calendar" value={school.schoolCalendar} />
        <DetailRow label="School Schedule" value={school.schoolSchedule} />
      </div>
    </div>
  );
};

export default SchoolSummary;

// src/components/educators/EducatorSummary.jsx
import React, { useState } from 'react';
import DetailRow from '../shared/DetailRow';
import StatusBadge from '../shared/StatusBadge';

const EducatorSummary = ({ educator }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8">
      {/* Edit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-medium text-gray-600">
            {educator.firstName[0]}{educator.lastName[0]}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{educator.firstName} {educator.lastName}</h2>
          <div className="mt-1 space-y-1">
            <div className="text-blue-600">{educator.email}</div>
            <div className="text-gray-600">{educator.role}</div>
            <div className="text-gray-600">{educator.pronouns}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
        <DetailRow label="First Name" value={educator.firstName} />
        <DetailRow label="Last Name" value={educator.lastName} />
        <DetailRow label="Email" value={educator.email} />
        <DetailRow label="Current School" value={educator.currentSchool} />
        <DetailRow label="Role" value={educator.role} />
        <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
        <DetailRow label="Montessori Certified" value={educator.montessoriCertified} />
        <DetailRow label="Pronouns" value={educator.pronouns} />
        <DetailRow label="Phone" value={educator.phone} />
      </div>
    </div>
  );
};

export default EducatorSummary;