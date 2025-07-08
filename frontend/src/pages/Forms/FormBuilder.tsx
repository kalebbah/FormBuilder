import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { FormDefinition, FormField, FormSection } from '../../types';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [formDefinition, setFormDefinition] = useState<FormDefinition>({
    fields: [],
    sections: [],
    conditionalRules: [],
    settings: {
      allowSaveDraft: true,
      allowEditAfterSubmit: false,
      requireSignature: false,
    },
  });
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: 'T' },
    { type: 'textarea', label: 'Text Area', icon: 'TA' },
    { type: 'number', label: 'Number', icon: 'N' },
    { type: 'email', label: 'Email', icon: 'E' },
    { type: 'select', label: 'Dropdown', icon: 'D' },
    { type: 'checkbox', label: 'Checkbox', icon: 'C' },
    { type: 'radio', label: 'Radio Buttons', icon: 'R' },
    { type: 'date', label: 'Date Picker', icon: 'DP' },
    { type: 'file', label: 'File Upload', icon: 'FU' },
  ];

  const addField = (fieldType: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      isRequired: false,
      order: formDefinition.fields.length,
    };

    setFormDefinition(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormDefinition(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const deleteField = (fieldId: string) => {
    setFormDefinition(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
    setSelectedField(null);
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      description: '',
      isCollapsible: false,
      isCollapsed: false,
      order: formDefinition.sections.length,
    };

    setFormDefinition(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleSave = async () => {
    // API call to save form
    console.log('Saving form:', formDefinition);
    navigate('/forms');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar - Field types */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Form Elements</h3>
          <p className="text-sm text-gray-500">Drag fields to the canvas</p>
        </div>
        <div className="p-4 space-y-2">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.type}
              onClick={() => addField(fieldType.type)}
              className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center text-primary-600 font-medium text-sm mr-3">
                {fieldType.icon}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {fieldType.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Form Title"
                className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0"
              />
              <button
                onClick={addSection}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Section
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Preview
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Save Form
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {formDefinition.fields.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start building your form
                </h3>
                <p className="text-gray-500">
                  Add fields from the left sidebar to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {formDefinition.fields.map((field) => (
                  <div
                    key={field.id}
                    className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedField?.id === field.id
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {field.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteField(field.id);
                        }}
                        className="text-red-600 hover:text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Field preview */}
                    <div className="space-y-2">
                      <input
                        type={field.type === 'textarea' ? 'text' : field.type}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled
                      />
                      {field.isRequired && (
                        <span className="text-xs text-red-600">* Required</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar - Field properties */}
      {selectedField && (
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Field Properties</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={selectedField.isRequired}
                onChange={(e) => updateField(selectedField.id, { isRequired: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                Required field
              </label>
            </div>

            {selectedField.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={selectedField.options?.join('\n') || ''}
                  onChange={(e) => updateField(selectedField.id, { 
                    options: e.target.value.split('\n').filter(option => option.trim()) 
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder; 