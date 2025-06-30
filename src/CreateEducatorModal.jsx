import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EDUCATOR_ROLES } from './utils/constants.js';

const CreateEducatorModal = ({ isOpen, onClose, onSubmit, schoolId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    discoveryStatus: 'Not Started',
    montessoriCertified: false,
    pronouns: '',
    phone: '',
    currentSchool: ''
  });

  const [schoolAssignment, setSchoolAssignment] = useState({
    roles: [],
    startDate: new Date().toISOString().split('T')[0],
    currentlyActive: true
  });

  const roleOptions = EDUCATOR_ROLES;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchoolAssignmentChange = (field, value) => {
    setSchoolAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleRole = (role) => {
    setSchoolAssignment(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || schoolAssignment.roles.length === 0) {
      return;
    }

    const newEducatorId = `ed_${Date.now()}`;
    
    const newEducator = {
      id: newEducatorId,
      ...formData
    };

    const schoolStint = {
      educatorId: newEducatorId,
      schoolId: schoolId,
      startDate: schoolAssignment.startDate,
      endDate: null,
      currentlyActive: schoolAssignment.currentlyActive,
      roles: schoolAssignment.roles,
      educatorName: `${formData.firstName} ${formData.lastName}`
    };

    onSubmit({ educator: newEducator, stint: schoolStint });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      discoveryStatus: 'Not Started',
      montessoriCertified: false,
      pronouns: '',
      phone: '',
      currentSchool: ''
    });
    setSchoolAssignment({
      roles: [],
      startDate: new Date().toISOString().split('T')[0],
      currentlyActive: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Educator</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pronouns
                </label>
                <input
                  type="text"
                  value={formData.pronouns}
                  onChange={(e) => handleInputChange('pronouns', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., she/her, they/them"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discovery Status
                </label>
                <select
                  value={formData.discoveryStatus}
                  onChange={(e) => handleInputChange('discoveryStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.montessoriCertified}
                  onChange={(e) => handleInputChange('montessoriCertified', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Montessori Certified</span>
              </label>
            </div>
          </div>

          {/* School Assignment */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">School Assignment</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={schoolAssignment.startDate}
                  onChange={(e) => handleSchoolAssignmentChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={schoolAssignment.currentlyActive}
                    onChange={(e) => handleSchoolAssignmentChange('currentlyActive', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Currently Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles (select at least one) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schoolAssignment.roles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.firstName || !formData.lastName || !formData.email || schoolAssignment.roles.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Educator & Add to School
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEducatorModal;