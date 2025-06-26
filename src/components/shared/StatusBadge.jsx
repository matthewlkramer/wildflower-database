// src/components/shared/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Emerging': return 'bg-yellow-100 text-yellow-800';
      case 'Member School': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Applying': return 'bg-orange-100 text-orange-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Attended': return 'bg-green-100 text-green-800';
      case 'Registered': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'No Show': return 'bg-red-100 text-red-800';
      case 'Incomplete': return 'bg-yellow-100 text-yellow-800';
      case 'Issued': return 'bg-green-100 text-green-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      case 'Paid Off': return 'bg-green-100 text-green-800';
      case 'Interest Only Period': return 'bg-yellow-100 text-yellow-800';
      case 'Principal Repayment': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Permanently Closed': return 'bg-red-100 text-red-800';
      case 'Disaffiliated': return 'bg-red-100 text-red-800';
      case 'Disaffiliating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;