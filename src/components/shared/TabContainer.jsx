import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TabContainer = ({ title, tabs, activeTab, onTabChange, onBack, children }) => {
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
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                </div>

                <div className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
                {children}
            </div>
        </div>
    );
};

export default TabContainer;