import React from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const DetailRow = ({ label, value, span = false, type = 'text' }) => {
    const renderValue = () => {
        // Handle null/undefined values
        if (value === null || value === undefined || value === '') {
            return <span className="text-gray-400">-</span>;
        }

        // Handle boolean values
        if (typeof value === 'boolean') {
            return value ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
                <XCircle className="w-4 h-4 text-red-600" />
            );
        }

        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return <span className="text-gray-400">-</span>;
            }
            return value.join(', ');
        }

        // Handle numbers
        if (typeof value === 'number') {
            return value.toLocaleString();
        }

        // Handle different types of content
        switch (type) {
            case 'url':
            case 'link':
                return (
                    <a
                        href={value}
                        className="text-cyan-600 hover:text-cyan-800 hover:underline flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {value}
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                );

            case 'email':
                return (
                    <a
                        href={`mailto:${value}`}
                        className="text-cyan-600 hover:text-cyan-800 hover:underline"
                    >
                        {value}
                    </a>
                );

            case 'phone':
                return (
                    <a
                        href={`tel:${value}`}
                        className="text-cyan-600 hover:text-cyan-800 hover:underline"
                    >
                        {value}
                    </a>
                );

            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);

            case 'date':
                if (!value) return <span className="text-gray-400">-</span>;
                try {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                } catch (error) {
                    return value;
                }

            case 'percentage':
                return `${value}%`;

            case 'multiline':
                return (
                    <div className="whitespace-pre-wrap max-w-md">
                        {value}
                    </div>
                );

            case 'badge':
                // This would be used for status badges, but we'll keep it simple for now
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {value}
                    </span>
                );

            case 'text':
            default:
                return value;
        }
    };

    return (
        <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
            <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
            <div className="text-sm text-gray-900">
                {renderValue()}
            </div>
        </div>
    );
};

// Helper component for editing mode
export const EditableDetailRow = ({
    label,
    field,
    value,
    onChange,
    type = 'text',
    options = null,
    placeholder = '',
    span = false,
    required = false
}) => {
    const handleChange = (newValue) => {
        if (onChange) {
            onChange(field, newValue);
        }
    };

    const renderInput = () => {
        switch (type) {
            case 'boolean':
                return (
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => handleChange(e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm">{value ? 'Yes' : 'No'}</span>
                    </label>
                );

            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        required={required}
                    >
                        <option value="">Select...</option>
                        {options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );

            case 'textarea':
            case 'multiline':
                return (
                    <textarea
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        rows={3}
                        placeholder={placeholder}
                        required={required}
                    />
                );

            case 'array':
                return (
                    <input
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : (value || '')}
                        onChange={(e) => handleChange(e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder || "Separate multiple values with commas"}
                        required={required}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder}
                        required={required}
                    />
                );

            case 'currency':
                return (
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={placeholder}
                            required={required}
                            min="0"
                            step="0.01"
                        />
                    </div>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        required={required}
                    />
                );

            case 'email':
                return (
                    <input
                        type="email"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder || "email@example.com"}
                        required={required}
                    />
                );

            case 'phone':
                return (
                    <input
                        type="tel"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder || "(555) 123-4567"}
                        required={required}
                    />
                );

            case 'url':
                return (
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder || "https://example.com"}
                        required={required}
                    />
                );

            case 'percentage':
                return (
                    <div className="relative">
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                            className="w-full pr-8 pl-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={placeholder}
                            required={required}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                );

            case 'text':
            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={placeholder}
                        required={required}
                    />
                );
        }
    };

    return (
        <div className={`py-2 ${span ? 'col-span-2' : ''}`}>
            <div className="text-sm font-medium text-gray-600 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {renderInput()}
        </div>
    );
};

export default DetailRow;