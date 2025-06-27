import React from 'react';
import { ArrowLeft } from 'lucide-react';

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
                    <h1 className="text-2xl font-bold text-gray-900">{charter.name}</h1>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <p>Charter details coming soon...</p>
            </div>
        </div>
    );
};

export default CharterDetails;