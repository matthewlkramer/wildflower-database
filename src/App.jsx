const EducatorDetails = ({ educator, onBack }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedSSJForm, setSelectedSSJForm] = useState(null);

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
  const sampleCharters = [
  {
    id: 'ch1',
    name: 'Denver Charter Network',
    shortName: 'Denver Charter',
    status: 'Applying',
    initialTargetCommunity: 'Denver Metro'
  }
];

  // Get SSJ forms for this educator
  const educatorSSJForms = sampleSSJFilloutForms.filter(form => form.educatorId === educator.id);
  
  // Get the selected form details
  const selectedForm = selectedSSJForm ? 
    educatorSSJForms.find(form => form.id === selectedSSJForm) : 
    null;

  const DetailRow = ({ label, value, span = false }) => (
    <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-sm text-gray-900">
        {value === true ? <CheckCircle className="w-4 h-4 text-green-600" /> : 
         value === false ? <XCircle className="w-4 h-4 text-red-600" /> :
         Array.isArray(value) ? value.join(', ') :
         value || '-'}
      </div>
    </div>
  );

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
        
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        {activeTab === 'summary' && (
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
        )}

        {activeTab === 'schools' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">School Affiliations</h3>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role(s)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currently Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleEducatorsXSchools
                    .filter(exs => exs.educatorId === educator.id)
                    .map(relationship => (
                    <tr key={relationship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sampleSchools.find(s => s.id === relationship.schoolId)?.name || 'Unknown School'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {relationship.roles.map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {relationship.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {relationship.endDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {relationship.currentlyActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleEducatorsXSchools.filter(exs => exs.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No school affiliations found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Demographics</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Race & Ethnicity" value={educator.raceEthnicity} />
                  <DetailRow label="Gender" value={educator.gender} />
                  <DetailRow label="Pronouns" value={educator.pronouns} />
                  <DetailRow label="LGBTQIA+" value={educator.lgbtqia} />
                  <DetailRow label="Household Income" value={educator.householdIncome} />
                  <DetailRow label="Primary Language" value={educator.primaryLanguage} />
                  <DetailRow label="Other Languages" value={educator.otherLanguages} span />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact-info' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Personal Email" value={educator.personalEmail} />
                  <DetailRow label="Wildflower Email" value={educator.wildflowerEmail} />
                  <DetailRow label="Work Email" value={educator.workEmail} />
                  <DetailRow label="Primary Phone" value={educator.primaryPhone} />
                  <DetailRow label="Secondary Phone" value={educator.secondaryPhone} />
                  <DetailRow label="Home Address" value={educator.homeAddress} span />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'online-forms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">SSJ Fillout Forms</h3>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {educatorSSJForms.map(form => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.entryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.assignedPartner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={form.oneOnOneStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {educatorSSJForms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No SSJ forms found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'early-cultivation' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Form Selection */}
            <div className="col-span-3">
              <h3 className="text-lg font-semibold mb-4">SSJ Forms</h3>
              <div className="space-y-2">
                {educatorSSJForms.map(form => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedSSJForm(form.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedSSJForm === form.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {form.entryDate}
                  </button>
                ))}
                {educatorSSJForms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No SSJ forms found
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Form Details */}
            <div className="col-span-9">
              {selectedForm ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Form Details - {selectedForm.entryDate}
                  </h3>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <DetailRow label="Entry Date" value={selectedForm.entryDate} />
                      <DetailRow label="Location" value={selectedForm.location} />
                      <DetailRow label="Routed To" value={selectedForm.routedTo} />
                      <DetailRow label="SendGrid Sent Data" value={selectedForm.sendGridSentData} />
                      <DetailRow label="Assigned Partner" value={selectedForm.assignedPartner} />
                      <DetailRow label="Assigned Partner Override" value={selectedForm.assignedPartnerOverride} />
                      <DetailRow label="One on One Status" value={selectedForm.oneOnOneStatus} />
                      <DetailRow label="Person Responsible for Follow Up" value={selectedForm.personResponsibleForFollowUp} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <h3 className="text-lg font-semibold mb-2">Select an SSJ Form</h3>
                  <p>Choose a form from the left to view cultivation details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Event Attendance</h3>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleEventAttendance
                    .filter(event => event.educatorId === educator.id)
                    .map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.eventDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.registrationStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.attendanceStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleEventAttendance.filter(event => event.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No event attendance records found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Guides</h3>
            <p>This section will be implemented later</p>
          </div>
        )}

        {activeTab === 'certs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Montessori Certifications</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </button>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certification Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certifier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleMontessoriCerts
                    .filter(cert => cert.educatorId === educator.id)
                    .map(cert => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cert.certificationLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cert.certifier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cert.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => alert(`Edit certification ${cert.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => alert(`Delete certification ${cert.id}`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sampleMontessoriCerts.filter(cert => cert.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No certifications found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Educator Notes</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
            
            <div className="space-y-4">
              {sampleEducatorNotes
                .filter(note => note.educatorId === educator.id)
                .map(note => (
                <div key={note.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {note.createdBy.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {note.createdBy}
                        </div>
                        <div className="text-sm text-gray-500">
                          {note.createdDate}
                        </div>
                      </div>
                      {note.isPrivate && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Private
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => alert(`Edit note ${note.id}`)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => alert(`Delete note ${note.id}`)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900">
                    {note.noteText}
                  </div>
                </div>
              ))}
              
              {sampleEducatorNotes.filter(note => note.educatorId === educator.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notes found for this educator.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'linked-emails' && (
          <div className="text-center py-8 text-gray-500">
            <h3 className="text-lg font-semibold mb-2">Linked Emails/Meetings</h3>
            <p>This section will be implemented later</p>
          </div>
        )}
      </div>
    </div>
  );const sampleEducators = [
  {
    id: 'ed1',
    firstName: 'Ashten',
    lastName: 'Sommer',
    email: 'ashten@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    discoveryStatus: 'Complete',
    montessoriCertified: true,
    pronouns: 'she/her/hers',
    phone: '(512) 555-0123',
    // Demographics
    raceEthnicity: ['White', 'Hispanic, Latino, or Spanish Origin'],
    gender: 'Female/Woman',
    householdIncome: 'Upper Income',
    lgbtqia: false,
    primaryLanguage: 'English',
    otherLanguages: ['Spanish'],
    // Contact Info
    personalEmail: 'ashten.sommer@gmail.com',
    wildflowerEmail: 'ashten@yellowrosemontessori.org',
    workEmail: null,
    primaryPhone: '(512) 555-0123',
    secondaryPhone: null,
    homeAddress: '1234 Oak Street, Austin, TX 78704'
  },
  {
    id: 'ed2',
    firstName: 'Gabrielle',
    lastName: 'Tyree',
    email: 'gabrielle@yellowrosemontessori.org',
    currentSchool: 'Yellow Rose',
    role: 'Founder',
    discoveryStatus: 'Complete',
    montessoriCertified: true,
    pronouns: 'they/them',
    phone: '(512) 555-0456',
    // Demographics
    raceEthnicity: ['African-American'],
    gender: 'Non-binary',
    householdIncome: 'Middle Income',
    lgbtqia: true,
    primaryLanguage: 'English',
    otherLanguages: [],
    // Contact Info
    personalEmail: 'gabrielle.tyree@gmail.com',
    wildflowerEmail: 'gabrielle@yellowrosemontessori.org',
    workEmail: null,
    primaryPhone: '(512) 555-0456',
    secondaryPhone: '(512) 555-0789',
    homeAddress: '5678 Elm Avenue, Austin, TX 78745'
  },
  {
    id: 'ed3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@wildflowerschools.org',
    currentSchool: 'WF Boston',
    role: 'Teacher Leader',
    discoveryStatus: 'Complete',
    montessoriCertified: true,
    pronouns: 'she/her/hers',
    phone: '(617) 555-0321',
    // Demographics
    raceEthnicity: ['White'],
    gender: 'Female/Woman',
    householdIncome: 'Middle Income',
    lgbtqia: false,
    primaryLanguage: 'English',
    otherLanguages: ['French'],
    // Contact Info
    personalEmail: 'sarah.johnson.personal@gmail.com',
    wildflowerEmail: 'sarah.johnson@wildflowerschools.org',
    workEmail: 'sarah@bostonwildflower.edu',
    primaryPhone: '(617) 555-0321',
    secondaryPhone: null,
    homeAddress: '123 Commonwealth Ave, Boston, MA 02215'
  }
// Grants data
const sampleGrants = [
  {
    id: 'gr1',
    schoolId: 'rec1', // Yellow Rose
    amount: 25000,
    issueDate: '2023-05-15',
    issuedBy: 'Rachel Kelley-Cohen',
    partnerName: 'TWF National',
    status: 'Issued',
    useOfFunds: 'Startup funding for materials and training'
  },
  {
    id: 'gr2',
    schoolId: 'rec1', // Yellow Rose
    amount: 15000,
    issueDate: '2023-08-01',
    issuedBy: 'Daniela Vasan',
    partnerName: 'TWF Walton',
    status: 'Planned',
    useOfFunds: 'Facility preparation and equipment'
  },
  {
    id: 'gr3',
    schoolId: 'rec2', // WF Boston
    amount: 30000,
    issueDate: '2023-01-10',
    issuedBy: 'Sara Hernandez',
    partnerName: 'TWF Cambridge',
    status: 'Issued',
    useOfFunds: 'Expansion funding for additional classroom'
  },
  {
    id: 'gr4',
    schoolId: 'rec2', // WF Boston
    amount: 12000,
    issueDate: '2023-03-22',
    issuedBy: 'Erika McDowell',
    partnerName: 'COVID Relief Fund',
    status: 'Issued',
    useOfFunds: 'COVID-19 safety measures and technology upgrades'
  }
];

// Loans data
const sampleLoans = [
  {
    id: 'ln1',
    schoolId: 'rec1', // Yellow Rose
    amount: 75000,
    issueDate: '2023-09-01',
    maturityDate: '2026-09-01',
    interestRate: 0.03,
    status: 'Interest Only Period',
    useOfProceeds: 'Startup funding for facility and initial operations'
  },
  {
    id: 'ln2',
    schoolId: 'rec2', // WF Boston
    amount: 100000,
    issueDate: '2018-08-15',
    maturityDate: '2023-08-15',
    interestRate: 0.025,
    status: 'Paid Off',
    useOfProceeds: 'Initial school operations and equipment'
  },
  {
    id: 'ln3',
    schoolId: 'rec2', // WF Boston
    amount: 50000,
    issueDate: '2021-06-01',
    maturityDate: '2026-06-01',
    interestRate: 0.035,
    status: 'Principal Repayment',
    useOfProceeds: 'Expansion to second classroom'
  }
];

// School Notes data
const sampleSchoolNotes = [
  {
    id: 'sn1',
    schoolId: 'rec1',
    noteText: 'Initial founder meeting went very well. Strong vision for authentic Montessori implementation with focus on outdoor learning components.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-02-15',
    isPrivate: false
  },
  {
    id: 'sn2',
    schoolId: 'rec1',
    noteText: 'Facility search proving challenging in Austin market. May need to consider alternative locations or modify timeline.',
    createdBy: 'Daniela Vasan',
    createdDate: '2023-07-08',
    isPrivate: false
  },
  {
    id: 'sn3',
    schoolId: 'rec1',
    noteText: 'Confidential: Board concerns about fundraising timeline and potential delays due to permit issues.',
    createdBy: 'Rachel Kelley-Cohen',
    createdDate: '2023-09-12',
    isPrivate: true
  },
  {
    id: 'sn4',
    schoolId: 'rec2',
    noteText: 'Celebrating 5 years of successful operation! School has exceeded enrollment targets and maintains excellent parent satisfaction scores.',
    createdBy: 'Sara Hernandez',
    createdDate: '2023-09-01',
    isPrivate: false
  },
  {
    id: 'sn5',
    schoolId: 'rec2',
    noteText: 'Exploring expansion opportunities. Sarah Johnson has expressed interest in opening a second location in Cambridge.',
    createdBy: 'Sara Hernandez',
    createdDate: '2023-10-15',
    isPrivate: false
  }
];

// Action Steps data
const sampleActionSteps = [
  {
    id: 'as1',
    schoolId: 'rec1',
    item: 'Complete facility lease review with Building4Good attorney',
    assignee: 'Ashten Sommer',
    status: 'Incomplete',
    dueDate: '2023-12-01'
  },
  {
    id: 'as2',
    schoolId: 'rec1',
    item: 'Finalize enrollment projections for Year 1',
    assignee: 'Gabrielle Tyree',
    status: 'Complete',
    dueDate: '2023-10-15'
  },
  {
    id: 'as3',
    schoolId: 'rec1',
    item: 'Schedule Building4Good consultation for facility modifications',
    assignee: 'Rachel Kelley-Cohen',
    status: 'Incomplete',
    dueDate: '2023-11-30'
  },
  {
    id: 'as4',
    schoolId: 'rec2',
    item: 'Submit annual compliance report to state department',
    assignee: 'Sarah Johnson',
    status: 'Complete',
    dueDate: '2023-09-30'
  },
  {
    id: 'as5',
    schoolId: 'rec2',
    item: 'Develop expansion classroom timeline and budget',
    assignee: 'Sarah Johnson',
    status: 'Incomplete',
    dueDate: '2023-12-15'
  }
];