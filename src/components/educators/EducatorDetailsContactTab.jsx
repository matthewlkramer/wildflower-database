const renderContactInfoTab = () => {
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editedContact, setEditedContact] = useState(educator);
    
    // Get email addresses data
    const { data: emailAddresses = [] } = useEmailAddresses(educator.id);
    
    const handleContactInputChange = (field, value) => {
      setEditedContact(prev => ({ ...prev, [field]: value }));
    };
    
    const handleContactSave = async () => {
      try {
        await updateRecord('Educators', educator.id, {
          'Primary phone': editedContact.primaryPhone,
          'Secondary phone': editedContact.secondaryPhone,
          'Home Address': editedContact.homeAddress
        });
        setIsEditingContact(false);
      } catch (error) {
        console.error('Error updating contact info:', error);
        alert('Failed to update contact information. Please try again.');
      }
    };
    
    const handleContactCancel = () => {
      setEditedContact(educator);
      setIsEditingContact(false);
    };
    
    return (
      <div className="space-y-8">
        {/* Edit Button */}
        <div className="flex justify-end">
          {!isEditingContact ? (
            <button
              onClick={() => setIsEditingContact(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleContactSave}
                disabled={mutationLoading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm disabled:bg-teal-300"
              >
                {mutationLoading ? 'Saving...' : 'Update'}
              </button>
              <button
                onClick={handleContactCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Phone Numbers and Address Row */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2">
            {isEditingContact ? (
              <>
                <EditableDetailRow 
                  label="Primary Phone" 
                  field="primaryPhone" 
                  value={editedContact.primaryPhone}
                  onChange={handleContactInputChange}
                  type="phone"
                />
                <EditableDetailRow 
                  label="Secondary Phone" 
                  field="secondaryPhone" 
                  value={editedContact.secondaryPhone}
                  onChange={handleContactInputChange}
                  type="phone"
                />
                <EditableDetailRow 
                  label="Home Address" 
                  field="homeAddress" 
                  value={editedContact.homeAddress}
                  onChange={handleContactInputChange}
                />
              </>
            ) : (
              <>
                <DetailRow label="Primary Phone" value={educator.primaryPhone} type="phone" />
                <DetailRow label="Secondary Phone" value={educator.secondaryPhone} type="phone" />
                <DetailRow label="Home Address" value={educator.homeAddress} />
              </>
            )}
          </div>
        </div>

        {/* Email Addresses Table */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Email Addresses</h3>
            <button 
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm"
              style={{ backgroundColor: '#0d9488', color: 'white' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </button>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailAddresses.map(email => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-teal-600 hover:underline cursor-pointer">
                        {email.emailAddress || email['Email Address'] || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {email.emailType || email['Email Type'] || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(email.isPrimary || email['Is Primary Email']) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {email.notes || email['Notes'] || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-teal-600 hover:text-teal-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emailAddresses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No email addresses found.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };