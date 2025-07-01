import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle, XCircle, ExternalLink, FileText } from 'lucide-react';
import TabContainer from './TabContainer';
import StatusBadge from './StatusBadge';
import Pills from './Pills';
import DetailRow, { EditableDetailRow } from './DetailRow';
import { getEntityTabs, getTabConfig, getTableConfig } from '../../utils/tabsConfig';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';
import { useCachedMutations } from '../../hooks/useCachedData';

const UnifiedDetail = ({ 
  entity,
  entityType,
  onBack,
  renderSummaryTab,
  renderCustomTab,
  tabDataHooks,
  onActionClick,
  title,
  customActions
}) => {
  // Get tabs configuration for this entity type
  const tabs = useMemo(() => getEntityTabs(entityType), [entityType]);
  
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id || 'summary');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntity, setEditedEntity] = useState(entity);
  
  const { updateRecord, loading: mutationLoading } = useCachedMutations();
  
  // Get data for active tab using provided hooks
  const tabData = useMemo(() => {
    if (tabDataHooks && tabDataHooks[activeTab]) {
      return tabDataHooks[activeTab](entity.id);
    }
    return { data: [], loading: false, error: null };
  }, [activeTab, entity.id, tabDataHooks]);

  if (!entity) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No {entityType} Data</h2>
          <p className="text-gray-600 mb-4">{entityType} data was not provided to this component.</p>
          <button 
            onClick={onBack}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleEditSave = async (fields) => {
    try {
      await updateRecord(entityType === 'educators' ? 'Educators' : entityType === 'schools' ? 'Schools' : 'Charters', entity.id, fields);
      setIsEditing(false);
      setEditedEntity({ ...editedEntity, ...fields });
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      alert(`Failed to update ${entityType}. Please try again.`);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedEntity(prev => ({ ...prev, [field]: value }));
  };

  // Render cell based on column type
  const renderCell = (value, column, item) => {
    if (!value && value !== 0 && value !== false) return '-';
    
    switch (column.type) {
      case 'currency':
        return formatCurrency(value);
        
      case 'date':
        return formatDate(value);
        
      case 'percent':
        return formatPercent(value);
        
      case 'boolean':
        return value ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />;
        
      case 'status':
        return <StatusBadge status={value} />;
        
      case 'array':
        return <Pills values={value} colorScheme="blue" />;
        
      case 'link':
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-900">
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : '-';
        
      case 'email':
        return (
          <a href={`mailto:${value}`} className="text-cyan-600 hover:underline">
            {value}
          </a>
        );
        
      default:
        if (column.expandable && value.length > 100) {
          return (
            <div className="max-w-xs">
              <p className="truncate" title={value}>{value}</p>
            </div>
          );
        }
        return value;
    }
  };

  // Render action buttons based on action type
  const renderActions = (item, actions, tableType) => {
    const defaultActionButtons = {
      edit: (
        <button 
          key="edit"
          onClick={() => onActionClick && onActionClick('edit', item, tableType)}
          className="text-cyan-600 hover:text-cyan-900 mr-3"
        >
          Edit
        </button>
      ),
      delete: (
        <button 
          key="delete"
          onClick={() => onActionClick && onActionClick('delete', item, tableType)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      ),
      view: (
        <button 
          key="view"
          onClick={() => onActionClick && onActionClick('view', item, tableType)}
          className="text-cyan-600 hover:text-cyan-900 mr-3"
        >
          View
        </button>
      ),
      open: (
        <button 
          key="open"
          onClick={() => onActionClick && onActionClick('open', item, tableType)}
          className="bg-cyan-600 text-white px-3 py-1 rounded text-xs hover:bg-cyan-700 mr-2"
        >
          Open school
        </button>
      ),
      editStint: (
        <button 
          key="editStint"
          onClick={() => onActionClick && onActionClick('editStint', item, tableType)}
          className="text-cyan-600 hover:text-cyan-900 mr-2"
        >
          Edit stint
        </button>
      ),
      endStint: (
        <button 
          key="endStint"
          onClick={() => onActionClick && onActionClick('endStint', item, tableType)}
          className="text-cyan-600 hover:text-cyan-900 mr-2"
        >
          End stint
        </button>
      ),
      deleteStint: (
        <button 
          key="deleteStint"
          onClick={() => onActionClick && onActionClick('deleteStint', item, tableType)}
          className="text-red-600 hover:text-red-900"
        >
          Delete stint
        </button>
      )
    };

    // Merge custom actions with default ones
    const actionButtons = { ...defaultActionButtons, ...(customActions || {}) };

    return (
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {actions.map(action => actionButtons[action] || null)}
      </td>
    );
  };

  // Generic table renderer
  const renderTable = (data, tableConfig, tableType) => {
    const { columns, actions } = tableConfig;
    
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCell(item[column.key], column, item)}
                  </td>
                ))}
                {actions && actions.length > 0 && renderActions(item, actions, tableType)}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {getTabConfig(entityType, activeTab)?.emptyMessage || 'No data found.'}
          </div>
        )}
      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    // Check for custom tab renderer first
    if (renderCustomTab) {
      const customContent = renderCustomTab(activeTab, entity, tabData, {
        isEditing,
        setIsEditing,
        editedEntity,
        handleInputChange,
        handleEditSave,
        mutationLoading
      });
      if (customContent) return customContent;
    }
    
    // Special handling for summary tab
    if (activeTab === 'summary' && renderSummaryTab) {
      return renderSummaryTab(entity, {
        isEditing,
        setIsEditing,
        editedEntity,
        handleInputChange,
        handleEditSave,
        mutationLoading
      });
    }
    
    // Get tab and table configuration
    const tabConfig = getTabConfig(entityType, activeTab);
    const tableConfig = getTableConfig(activeTab);
    
    if (!tabConfig) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Tab configuration not found.</p>
        </div>
      );
    }
    
    // Handle loading state
    if (tabData.loading) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600 mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      );
    }
    
    // Handle error state
    if (tabData.error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading data: {tabData.error.message}</p>
        </div>
      );
    }
    
    // Render content based on table configuration
    return (
      <div>
        {/* Header with add button if applicable */}
        {tabConfig.hasAddButton && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{tabConfig.label}</h3>
            <button 
              onClick={() => onActionClick && onActionClick('add', null, activeTab)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {tabConfig.addButtonText}
            </button>
          </div>
        )}
        
        {/* Render table or custom content */}
        {tableConfig ? (
          tableConfig.sections ? (
            // Handle multi-section tabs (like funding with grants and loans)
            <div className="space-y-8">
              {tableConfig.sections.map(section => (
                <div key={section}>
                  <h3 className="text-lg font-semibold mb-4 capitalize">{section}</h3>
                  {renderTable(
                    tabData.data[section] || [], 
                    tableConfig[section], 
                    section
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Single table
            renderTable(tabData.data, tableConfig, activeTab)
          )
        ) : (
          // Fallback for tabs without table configuration
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-semibold mb-2">{tabConfig.label}</h3>
              <p>{tabConfig.emptyMessage || 'No data available.'}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <TabContainer
      title={title || entity.name || entity.fullName || 'Details'}
      onBack={onBack}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </TabContainer>
  );
};

export default React.memo(UnifiedDetail);
