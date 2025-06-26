const LocationEditModal = ({ isOpen, onClose, onSubmit, location, isCreating = false }) => {
  const [formData, setFormData] = useState({
    address: '',
    startDate: '',
    endDate: '',
    locationType: '',
    currentMailingAddress: false,
    currentPhysicalAddress: false,
    currentlyActive: true,
    squareFeet: '',
    maxStudentsLicensedFor: '',
    neighborhood: '',
    coLocationType: '',
    coLocationPartner: '',
    leaseEndDate: '',
    lease: '',
    timeZone: ''
  });

  const locationTypeOptions = [
    'School address and mailing address',
    'School address only',
    'Mailing address only',
    'Former school address',
    'Former mailing address',
    'Temporary location'
  ];

  const coLocationTypeOptions = [
    'None',
    'Shared facility',
    'Sublease',
    'Partnership',
    'Community center',
    'Other'
  ];

  const timeZoneOptions = [
    'Eastern Time (ET)',
    'Central Time (CT)',
    'Mountain Time (MT)',
    'Pacific Time (PT)',
    'Alaska Time (AKT)',
    'Hawaii-Aleutian Time (HAT)'
  ];

  useEffect(() => {
    if (location && isOpen && !isCreating) {
      setFormData({
        address: location.address || '',
        startDate: location.startDate || '',
        endDate: location.endDate || '',
        locationType: location.locationType || '',
        currentMailingAddress: location.currentMailingAddress || false,
        currentPhysicalAddress: location.currentPhysicalAddress || false,
        currentlyActive: location.currentlyActive || true,
        squareFeet: location.squareFeet || '',
        maxStudentsLicensedFor: location.maxStudentsLicensedFor || '',
        neighborhood: location.neighborhood || '',
        coLocationType: location.coLocationType || '',
        coLocationPartner: location.coLocationPartner || '',
        leaseEndDate: location.leaseEndDate || '',
        lease: location.lease || '',
        timeZone: location.timeZone || ''
      });
    } else if (isCreating) {
      // Reset form for creating new location
      setFormData({
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        locationType: '',
        currentMailingAddress: false,
        currentPhysicalAddress: false,
        currentlyActive: true,
        squareFeet: '',
        maxStudentsLicensedFor: '',
        neighborhood: '',
        coLocationType: '',
        coLocationPartner: '',
        leaseEndDate: '',
        lease: '',
        timeZone: ''
      });
    }
  }, [location, isOpen, isCreating]);

const AddGuideAssignmentModal = ({ isOpen, onClose, onSubmit, schoolId, allGuides }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [currentlyActive, setCurrentlyActive] = useState(true);
  const [role, setRole] = useState('');

  const roleOptions = [
    'Ops Guide',
    'Regional Entrepreneur',
    'Startup Guide',
    'Partnership Lead',
    'Mentor'
  ];

  const filteredGuides = useMemo(() => {
    return (allGuides || []).filter(guide =>
      `${guide.firstName} ${guide.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allGuides, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGuide || !role) return;

    const newAssignment = {
      guideId: selectedGuide.id,
      schoolId: schoolId,
      startDate: startDate,
      endDate: endDate || null,
      currentlyActive: currentlyActive,
      role: role,
      guideName: `${selectedGuide.firstName} ${selectedGuide.lastName}`
    };

    onSubmit(newAssignment);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedGuide(null);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setCurrentlyActive(true);
    setRole('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Guide Assignment</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Guide
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {searchTerm && (
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredGuides.map(guide => (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => {
                      setSelectedGuide(guide);
                      setSearchTerm(`${guide.firstName} ${guide.lastName}`);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                      selectedGuide?.id === guide.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium">{guide.firstName} {guide.lastName}</div>
                    <div className="text-sm text-gray-500">{guide.email}</div>
                  </button>
                ))}
                {filteredGuides.length === 0 && (
                  <div className="px-3 py-2 text-gray-500">No guides found</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select role...</option>
              {roleOptions.map(roleOption => (
                <option key={roleOption} value={roleOption}>{roleOption}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentlyActive}
                onChange={(e) => setCurrentlyActive(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Currently Active</span>
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
              disabled={!selectedGuide || !role}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateGuideModal = ({ isOpen, onClose, onSubmit, schoolId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    expertise: ''
  });

  const [assignment, setAssignment] = useState({
    role: '',
    startDate: new Date().toISOString().split('T')[0],
    currentlyActive: true
  });

  const roleOptions = [
    'Ops Guide',
    'Regional Entrepreneur', 
    'Startup Guide',
    'Partnership Lead',
    'Mentor'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssignmentChange = (field, value) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !assignment.role) {
      return;
    }

    const newGuideId = `guide_${Date.now()}`;
    
    const newGuide = {
      id: newGuideId,
      ...formData
    };

    const guideAssignment = {
      guideId: newGuideId,
      schoolId: schoolId,
      startDate: assignment.startDate,
      endDate: null,
      currentlyActive: assignment.currentlyActive,
      role: assignment.role,
      guideName: `${formData.firstName} ${formData.lastName}`
    };

    onSubmit({ guide: newGuide, assignment: guideAssignment });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      expertise: ''
    });
    setAssignment({
      role: '',
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
          <h3 className="text-lg font-semibold">Create New Guide</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Guide Information</h4>
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
                  Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Finance, Operations, Legal"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Assignment to School</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={assignment.role}
                  onChange={(e) => handleAssignmentChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select role...</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={assignment.startDate}
                  onChange={(e) => handleAssignmentChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={assignment.currentlyActive}
                  onChange={(e) => handleAssignmentChange('currentlyActive', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Currently Active</span>
              </label>
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
              disabled={!formData.firstName || !formData.lastName || !formData.email || !assignment.role}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Guide & Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

    const locationData = isCreating ? formData : {
      ...location,
      ...formData
    };

    onSubmit(locationData);
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
      currentlyActive: true,
      squareFeet: '',
      maxStudentsLicensedFor: '',
      neighborhood: '',
      coLocationType: '',
      coLocationPartner: '',
      leaseEndDate: '',
      lease: '',
      timeZone: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isCreating ? 'Add New Location' : 'Edit Location'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
                  Neighborhood
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Zone
                </label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => handleInputChange('timeZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select time zone...</option>
                  {timeZoneOptions.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Feet
                </label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Students Licensed For
                </label>
                <input
                  type="number"
                  value={formData.maxStudentsLicensedFor}
                  onChange={(e) => handleInputChange('maxStudentsLicensedFor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Location Details</h4>
            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Co-Location Type
                </label>
                <select
                  value={formData.coLocationType}
                  onChange={(e) => handleInputChange('coLocationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select co-location type...</option>
                  {coLocationTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Co-Location Partner
                </label>
                <input
                  type="text"
                  value={formData.coLocationPartner}
                  onChange={(e) => handleInputChange('coLocationPartner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease
                </label>
                <input
                  type="text"
                  value={formData.lease}
                  onChange={(e) => handleInputChange('lease', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lease details..."
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Dates</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start of time at location *
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
                  End of time at location
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lease End Date
                </label>
                <input
                  type="date"
                  value={formData.leaseEndDate}
                  onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Status</h4>
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
              disabled={!formData.address || !formData.startDate || !formData.locationType}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Add Location' : 'Update Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEditModal;