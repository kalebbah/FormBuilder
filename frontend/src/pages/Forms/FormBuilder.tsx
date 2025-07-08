import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CogIcon,
  BarsArrowUpIcon,
  CalendarIcon,
  DocumentIcon,
  PhotoIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ListBulletIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LinkIcon,
  EyeSlashIcon,
  StarIcon,
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
  const [formTitle, setFormTitle] = useState('Untitled Form');

  const fieldTypes = [
    // Basic Fields
    { type: 'text', label: 'Text Input', icon: PencilSquareIcon, category: 'basic' },
    { type: 'textarea', label: 'Text Area', icon: DocumentIcon, category: 'basic' },
    { type: 'number', label: 'Number', icon: CurrencyDollarIcon, category: 'basic' },
    { type: 'email', label: 'Email', icon: '@', category: 'basic' },
    { type: 'phone', label: 'Phone', icon: PhoneIcon, category: 'basic' },
    { type: 'url', label: 'URL', icon: LinkIcon, category: 'basic' },
    
    // Selection Fields
    { type: 'select', label: 'Dropdown', icon: ListBulletIcon, category: 'selection' },
    { type: 'radio', label: 'Radio Buttons', icon: CheckCircleIcon, category: 'selection' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckCircleIcon, category: 'selection' },
    { type: 'multiselect', label: 'Multi-Select', icon: ListBulletIcon, category: 'selection' },
    
    // Date and Time
    { type: 'date', label: 'Date Picker', icon: CalendarIcon, category: 'datetime' },
    { type: 'time', label: 'Time Picker', icon: ClockIcon, category: 'datetime' },
    { type: 'datetime', label: 'Date & Time', icon: CalendarIcon, category: 'datetime' },
    
    // Advanced Fields
    { type: 'file', label: 'File Upload', icon: DocumentIcon, category: 'advanced' },
    { type: 'image', label: 'Image Upload', icon: PhotoIcon, category: 'advanced' },
    { type: 'signature', label: 'Signature', icon: PencilSquareIcon, category: 'advanced' },
    { type: 'rating', label: 'Star Rating', icon: StarIcon, category: 'advanced' },
    { type: 'slider', label: 'Range Slider', icon: BarsArrowUpIcon, category: 'advanced' },
    { type: 'location', label: 'Location', icon: MapPinIcon, category: 'advanced' },
    { type: 'hidden', label: 'Hidden Field', icon: EyeSlashIcon, category: 'advanced' },
  ];

  const fieldCategories = [
    { key: 'basic', label: 'Basic Fields' },
    { key: 'selection', label: 'Selection' },
    { key: 'datetime', label: 'Date & Time' },
    { key: 'advanced', label: 'Advanced' },
  ];

  const addFieldToCanvas = (fieldType: string, dropIndex?: number) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      isRequired: false,
      order: dropIndex !== undefined ? dropIndex : formDefinition.fields.length,
      validation: {},
      properties: getDefaultPropertiesForFieldType(fieldType),
    };

    const newFields = [...formDefinition.fields];
    if (dropIndex !== undefined) {
      newFields.splice(dropIndex, 0, newField);
      // Update order for all subsequent fields
      newFields.forEach((field, index) => {
        field.order = index;
      });
    } else {
      newFields.push(newField);
    }

    setFormDefinition(prev => ({
      ...prev,
      fields: newFields,
    }));
  };

  const getDefaultPropertiesForFieldType = (fieldType: string): Record<string, any> => {
    switch (fieldType) {
      case 'select':
      case 'radio':
      case 'checkbox':
      case 'multiselect':
        return { options: ['Option 1', 'Option 2', 'Option 3'] };
      case 'number':
      case 'slider':
        return { min: 0, max: 100, step: 1 };
      case 'file':
      case 'image':
        return { maxSize: 5, allowedTypes: ['image/*'], multiple: false };
      case 'rating':
        return { maxRating: 5, allowHalf: false };
      case 'textarea':
        return { rows: 4, maxLength: 1000 };
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return { maxLength: 255 };
      default:
        return {};
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Handle dragging from sidebar to canvas
    if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
      const fieldType = draggableId.replace('sidebar-', '');
      addFieldToCanvas(fieldType, destination.index);
      return;
    }

    // Handle reordering within canvas
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const newFields = Array.from(formDefinition.fields);
      const [reorderedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, reorderedField);
      
      // Update order property
      newFields.forEach((field, index) => {
        field.order = index;
      });

      setFormDefinition(prev => ({
        ...prev,
        fields: newFields,
      }));
    }
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
    const formData = {
      title: formTitle,
      description: '',
      formDefinition,
      isTemplate: false,
      category: '',
    };
    
    console.log('Saving form:', formData);
    // TODO: Call API to save form
    navigate('/forms');
  };

  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      disabled: true,
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={field.properties?.rows || 4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option>Select an option</option>
                                     {(field.properties?.options as string[])?.map((option: string, index: number) => (
                           <option key={index} value={option}>{option}</option>
                         ))}
          </select>
        );
      case 'radio':
        return (
                     <div className="space-y-2">
             {(field.properties?.options as string[])?.map((option: string, index: number) => (
               <label key={index} className="flex items-center">
                 <input type="radio" name={field.id} className="mr-2" disabled />
                 <span>{option}</span>
               </label>
             ))}
          </div>
        );
      case 'checkbox':
        return (
                     <div className="space-y-2">
             {(field.properties?.options as string[])?.map((option: string, index: number) => (
               <label key={index} className="flex items-center">
                 <input type="checkbox" className="mr-2" disabled />
                 <span>{option}</span>
               </label>
             ))}
          </div>
        );
      case 'file':
      case 'image':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          </div>
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: field.properties?.maxRating || 5 }).map((_, index) => (
              <StarIcon key={index} className="h-6 w-6 text-gray-300" />
            ))}
          </div>
        );
      case 'slider':
        return (
          <input 
            type="range" 
            min={field.properties?.min || 0}
            max={field.properties?.max || 100}
            className="w-full"
            disabled
          />
        );
      case 'date':
        return <input {...commonProps} type="date" />;
      case 'time':
        return <input {...commonProps} type="time" />;
      case 'datetime':
        return <input {...commonProps} type="datetime-local" />;
      case 'number':
        return <input {...commonProps} type="number" />;
      case 'email':
        return <input {...commonProps} type="email" />;
      case 'phone':
        return <input {...commonProps} type="tel" />;
      case 'url':
        return <input {...commonProps} type="url" />;
      case 'hidden':
        return <div className="text-sm text-gray-500 italic">Hidden field - not visible to users</div>;
      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen bg-gray-50">
        {/* Left sidebar - Field types */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Form Elements</h3>
            <p className="text-sm text-gray-500">Drag fields to the canvas</p>
          </div>
          
          <Droppable droppableId="sidebar" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="p-4">
                {fieldCategories.map((category) => (
                  <div key={category.key} className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{category.label}</h4>
                    <div className="space-y-2">
                      {fieldTypes.filter(ft => ft.category === category.key).map((fieldType, index) => (
                        <Draggable
                          key={fieldType.type}
                          draggableId={`sidebar-${fieldType.type}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center p-3 text-left border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 transition-colors ${
                                snapshot.isDragging ? 'bg-primary-50 border-primary-300 shadow-lg' : ''
                              }`}
                            >
                              <div className="w-8 h-8 bg-primary-100 rounded flex items-center justify-center text-primary-600 mr-3">
                                {typeof fieldType.icon === 'string' ? (
                                  <span className="text-sm font-medium">{fieldType.icon}</span>
                                ) : (
                                  <fieldType.icon className="h-4 w-4" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {fieldType.label}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Main canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 bg-transparent"
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
              <Droppable droppableId="canvas">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-96 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary-50 border-2 border-dashed border-primary-300' : ''
                    }`}
                  >
                    {formDefinition.fields.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <PlusIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Start building your form
                        </h3>
                        <p className="text-gray-500">
                          Drag fields from the left sidebar to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formDefinition.fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                  selectedField?.id === field.id
                                    ? 'border-primary-500 ring-2 ring-primary-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                onClick={() => setSelectedField(field)}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <div {...provided.dragHandleProps} className="mr-2 text-gray-400 hover:text-gray-600">
                                      <BarsArrowUpIcon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {field.label}
                                    </span>
                                    {field.isRequired && (
                                      <span className="ml-2 text-red-500">*</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedField(field);
                                      }}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      <CogIcon className="h-4 w-4" />
                                    </button>
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
                                </div>
                                
                                {/* Field preview */}
                                <div className="space-y-2">
                                  {renderFieldPreview(field)}
                                  {field.isRequired && (
                                    <span className="text-xs text-red-600">* Required</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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

              {/* Field-specific properties */}
              {(selectedField.type === 'select' || selectedField.type === 'radio' || 
                selectedField.type === 'checkbox' || selectedField.type === 'multiselect') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options (one per line)
                  </label>
                  <textarea
                    value={selectedField.properties?.options?.join('\n') || ''}
                    onChange={(e) => updateField(selectedField.id, { 
                      properties: {
                        ...selectedField.properties,
                        options: e.target.value.split('\n').filter(option => option.trim())
                      }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              {(selectedField.type === 'number' || selectedField.type === 'slider') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      value={selectedField.properties?.min || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        properties: {
                          ...selectedField.properties,
                          min: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      value={selectedField.properties?.max || ''}
                      onChange={(e) => updateField(selectedField.id, { 
                        properties: {
                          ...selectedField.properties,
                          max: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>
              )}

              {selectedField.type === 'rating' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Rating
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={selectedField.properties?.maxRating || 5}
                    onChange={(e) => updateField(selectedField.id, { 
                      properties: {
                        ...selectedField.properties,
                        maxRating: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              {selectedField.type === 'textarea' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={selectedField.properties?.rows || 4}
                    onChange={(e) => updateField(selectedField.id, { 
                      properties: {
                        ...selectedField.properties,
                        rows: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              {(selectedField.type === 'file' || selectedField.type === 'image') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={selectedField.properties?.maxSize || 5}
                      onChange={(e) => updateField(selectedField.id, { 
                        properties: {
                          ...selectedField.properties,
                          maxSize: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="multiple"
                      checked={selectedField.properties?.multiple || false}
                      onChange={(e) => updateField(selectedField.id, { 
                        properties: {
                          ...selectedField.properties,
                          multiple: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="multiple" className="ml-2 block text-sm text-gray-900">
                      Allow multiple files
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default FormBuilder; 