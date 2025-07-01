// Utility functions for formatting various data types

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  } catch (error) {
    return date;
  }
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(dateObj);
  } catch (error) {
    return date;
  }
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return '-';
  
  // If value is already a percentage (e.g., 5 for 5%), divide by 100
  const decimal = value > 1 ? value / 100 : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(decimal);
};

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatBoolean = (value) => {
  if (value === null || value === undefined) return '-';
  return value ? 'Yes' : 'No';
};

export const formatArray = (arr, separator = ', ') => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '-';
  return arr.join(separator);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatAddress = (address) => {
  if (!address) return '-';
  
  // If it's already a formatted address string, return it
  if (typeof address === 'string') return address;
  
  // If it's an object with address components
  const parts = [
    address.street1,
    address.street2,
    address.city,
    address.state,
    address.zip
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatName = (firstName, lastName, middleName = '') => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ') || '-';
};