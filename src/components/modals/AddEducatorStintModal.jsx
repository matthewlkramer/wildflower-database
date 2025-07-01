import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { EDUCATOR_ROLES } from '../../utils/constants.js';

const AddEducatorStintModal = ({ isOpen, onClose, onSubmit, schoolId, allEducators }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEducator, setSelectedEducator] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentlyActive, setCurrentlyActive] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState([]);

    const roleOptions = EDUCATOR_ROLES;

  const filteredEducators = useMemo(() => {
    return allEducators.filter(educator =>
      `${educator.firstName} ${educator.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educator.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEducators, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEducator || selectedRoles.length === 0) return;

    const newStint = {
      educatorId: selectedEducator.id,
      schoolId: schoolId,
      startDate: startDate,
      endDate: null,
      currentlyActive: currentlyActive,
      roles: selectedRoles,
      educatorName: `${selectedEducator.firstName} ${selectedEducator.lastName}`
    };

    onSubmit(newStint);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedEducator(null);
    setStartDate(new Date().toISOString().split('T')[0]);
    setCurrentlyActive(true);
    setSelectedRoles([]);
    onClose();
  };

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Educator Stint</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Educator Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Educator
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search educators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {searchTerm && (
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredEducators.map(educator => (
                  <button
                    key={educator.id}
                    type="button"
                    onClick={() => {
                      setSelectedEducator(educator);
                      setSearchTerm(`${educator.firstName} ${educator.lastName}`);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                      selectedEducator?.id === educator.id ? 'bg-cyan-50' : ''
                    }`}
                  >
                    <div className="font-medium">{educator.firstName} {educator.lastName}</div>
                    <div className="text-sm text-gray-500">{educator.email}</div>
                  </button>
                ))}
                {filteredEducators.length === 0 && (
                  <div className="px-3 py-2 text-gray-500">No educators found</div>
                )}
              </div>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Currently Active */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentlyActive}
                onChange={(e) => setCurrentlyActive(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-gray-700">Currently Active</span>
            </label>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles (select at least one)
            </label>
            <div className="space-y-2">
              {roleOptions.map(role => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="mr-2 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedEducator || selectedRoles.length === 0}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Stint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducatorStintModal;