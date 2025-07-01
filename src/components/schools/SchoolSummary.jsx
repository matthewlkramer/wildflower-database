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
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center text-sm"
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