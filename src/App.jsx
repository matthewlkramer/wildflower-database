import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ExternalLink, ArrowLeft, CheckCircle, XCircle, FileText } from 'lucide-react';
import './App.css';

// Sample data
const sampleSchools = [
  {
    id: 'rec1',
    name: 'Yellow Rose Montessori',
    shortName: 'Yellow Rose',
    status: 'Emerging',
    governanceModel: 'Independent',
    agesServed: ['Primary'],
    location: 'Austin, TX',
    membershipStatus: 'Member School',
    founders: ['Ashten Sommer', 'Gabrielle Tyree']
  },
  {
    id: 'rec2',
    name: 'Wildflower Montessori School Boston',
    shortName: 'WF Boston',
    status: 'Open',
    governanceModel: 'Independent',
    agesServed: ['Primary', 'Lower Elementary'],
    location: 'Boston, MA',
    membershipStatus: 'Member School'
  }
];

const sampleEducators = [
  {
    id: 'ed1',
    firstName: 'Ashten',
    lastName: 'Sommer',
    email: 'ashten@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    discoveryStatus: 'Complete'
  },
  {
    id: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    email: 'gabrielle@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    discoveryStatus: 'Complete'
  }
];

const sampleCharters = [
  {
    id: 'ch1',
    name: 'Denver Charter Network',
    shortName: 'Denver Charter',
    status: 'Applying',
    initialTargetCommunity: 'Denver Metro'
  }
];

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Emerging': return 'bg-yellow-100 text-yellow-800';
      case 'Member School': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Applying': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const DataTable = ({ data, columns, onRowClick, searchTerm }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((item) => (
            <tr 
              key={item.id} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SchoolDetails = ({ school, onBack }) => {
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
          <h1 className="text-2xl font-bold text-gray-900">School details</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{school.name}</h2>
              <div className="mt-1 space-y-1">
                <div className="text-blue-600">{school.agesServed?.join(', ')}</div>
                <div className="text-blue-600">{school.governanceModel}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Short Name</div>
              <div className="text-sm text-gray-900">{school.shortName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
              <StatusBadge status={school.status} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Location</div>
              <div className="text-sm text-gray-900">{school.location}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Governance Model</div>
              <div className="text-sm text-gray-900">{school.governanceModel}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Founders</div>
              <div className="text-sm text-gray-900">{school.founders?.join(', ')}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Membership Status</div>
              <StatusBadge status={school.membershipStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducatorDetails = ({ educator, onBack }) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Educator details</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">First Name</div>
              <div className="text-sm text-gray-900">{educator.firstName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Last Name</div>
              <div className="text-sm text-gray-900">{educator.lastName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Email</div>
              <div className="text-sm text-gray-900">{educator.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Current School</div>
              <div className="text-sm text-gray-900">{educator.currentSchool}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Role</div>
              <div className="text-sm text-gray-900">{educator.role}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Discovery Status</div>
              <StatusBadge status={educator.discoveryStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <h1 className="text-2xl font-bold text-gray-900">Charter details</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold">{charter.name}</h2>
        <p className="text-gray-600">{charter.initialTargetCommunity}</p>
      </div>
    </div>
  );
};

const WildflowerDatabase = () => {
  const [mainTab, setMainTab] = useState('schools');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const mainTabs = [
    { id: 'schools', label: 'Schools', count: sampleSchools.length },
    { id: 'educators', label: 'Educators', count: sampleEducators.length },
    { id: 'charters', label: 'Charters', count: sampleCharters.length }
  ];

  const schoolColumns = [
    { key: 'name', label: 'School Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'governanceModel', label: 'Governance' },
    { key: 'location', label: 'Location' },
    { key: 'membershipStatus', label: 'Membership', render: (value) => <StatusBadge status={value} /> }
  ];

  const educatorColumns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'currentSchool', label: 'Current School' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'discoveryStatus', label: 'Discovery Status', render: (value) => <StatusBadge status={value} /> }
  ];

  const charterColumns = [
    { key: 'name', label: 'Charter Name' },
    { key: 'shortName', label: 'Short Name' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'initialTargetCommunity', label: 'Target Community' }
  ];

  const getCurrentData = () => {
    switch (mainTab) {
      case 'schools': return sampleSchools;
      case 'educators': return sampleEducators;
      case 'charters': return sampleCharters;
      default: return [];
    }
  };

  const getCurrentColumns = () => {
    switch (mainTab) {
      case 'schools': return schoolColumns;
      case 'educators': return educatorColumns;
      case 'charters': return charterColumns;
      default: return [];
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem({ type: mainTab, data: item });
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    switch (selectedItem.type) {
      case 'schools':
        return <SchoolDetails school={selectedItem.data} onBack={handleBack} />;
      case 'educators':
        return <EducatorDetails educator={selectedItem.data} onBack={handleBack} />;
      case 'charters':
        return <CharterDetails charter={selectedItem.data} onBack={handleBack} />;
      default:
        return null;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wildflower Schools Database</h1>
              <p className="text-gray-600">Manage schools, educators, and network data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  mainTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{mainTab}</h2>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <DataTable 
                data={getCurrentData()}
                columns={getCurrentColumns()}
                onRowClick={handleRowClick}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildflowerDatabase;