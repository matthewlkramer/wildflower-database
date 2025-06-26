import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LocationEditModal = ({ isOpen, onClose, onSubmit, location }) => {
  const [formData, setFormData] = useState({
    address: '',
    startDate: '',
    endDate: '',
    locationType: '',
    currentMailingAddress: false,
    currentPhysicalAddress: false,
    currentlyActive: true
  });

  const locationTypeOptions = [
    'School address and mailing address',
    'School address only',
    'Mailing address only',
    'Former school address',
    'Former mailing address',
    'Temporary location'
  ];

  useEffect(() => {
    if (location && isOpen) {
      setFormData({
        address: location.address || '',
        startDate: location.startDate || '',
        endDate: location.endDate || '',
        locationType: location.locationType || '',
        currentMailingAddress: location.currentMailingAddress || false,
        currentPhysicalAddress: location.currentPhysicalAddress || false,
        currentlyActive: location.currentlyActive || true
      });
    }
  }, [location, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.startDate || !formData.locationType) {
      return;
    }

    const updatedLocation = {
      ...location,
      ...formData
    };

    onSubmit(updatedLocation);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      address: '',
      startDate: '',
      endDate: '',
      locationType: '',
      currentMailingAddress: false,
      currentPhysicalAddress: false,
      currentlyActive: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Location</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Enter full address..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Type *
            </label>
            <select
              value={formData.locationType}
              onChange={(e) => handleInputChange('locationType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select location type...</option>
              {locationTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.currentlyActive}
                onChange={(e) => handleInputChange('currentlyActive', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Currently Active</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.currentMailingAddress}
                onChange={(e) => handleInputChange('currentMailingAddress', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Current Mailing Address</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.currentPhysicalAddress}
                onChange={(e) => handleInputChange('currentPhysicalAddress', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Current Physical Address</span>
            </label>
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
              disabled={!formData.address || !formData.startDate || !formData.locationType}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Update Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEditModal;