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
                        {educator.fullName ? educator.fullName[0] : ''}
                    </span>
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{educator.fullName}</h2>
                    <div className="mt-1 space-y-1">
                        <div className="text-blue-600">{educator.email || 'No email address'}</div>
                        <div className="text-gray-600">{educator.role || 'No current role'}</div>
                        <div className="text-gray-600">{educator.pronouns}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6">
                <DetailRow label="Full Name" value={educator.fullName} />
                <DetailRow label="First Name" value={educator.firstName} />
                <DetailRow label="Last Name" value={educator.lastName} />
                <DetailRow label="Middle Name" value={educator.middleName} />
                <DetailRow label="Nickname" value={educator.nickname} />
                <DetailRow label="Pronouns" value={educator.pronouns} />
                <DetailRow label="Email" value={educator.email} type="email" />
                <DetailRow label="Phone" value={educator.phone} type="phone" />
                <DetailRow label="Current School" value={educator.currentSchool} />
                <DetailRow label="Role" value={educator.role} />
                <DetailRow label="Individual Type" value={educator.individualType} />
                <DetailRow label="Discovery Status" value={<StatusBadge status={educator.discoveryStatus} />} />
                <DetailRow label="Montessori Lead Guide Training" value={educator.montessoriLeadGuideTraining} />
                <DetailRow label="Montessori Certified" value={educator.montessoriCertified} type="boolean" />
                <DetailRow label="Startup Stage for Active School" value={educator.startupStageForActiveSchool} />
                <DetailRow label="Target Location" value={educator.targetGeo} />
                <DetailRow label="Tags" value={educator.tags?.join(', ')} />
            </div>
        </div>
    );
};

export default EducatorSummary;
