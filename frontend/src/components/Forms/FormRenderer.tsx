import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  CalendarIcon,
  PhotoIcon,
  DocumentIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { FormDefinition, FormField, FormSubmission } from '../../types';

interface FormRendererProps {
  formDefinition: FormDefinition;
  onSubmit: (data: Record<string, any>) => void;
  onSaveDraft?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  isSubmitting?: boolean;
  isReadOnly?: boolean;
  showRequiredIndicator?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  formDefinition,
  onSubmit,
  onSaveDraft,
  initialData = {},
  isSubmitting = false,
  isReadOnly = false,
  showRequiredIndicator = true,
}) => {
  const [conditionalFields, setConditionalFields] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Create validation schema dynamically based on form definition
  const createValidationSchema = () => {
    const schemaFields: Record<string, any> = {};

    formDefinition.fields.forEach((field) => {
      if (conditionalFields.has(field.id)) return; // Skip hidden conditional fields

      let fieldSchema: any;

      switch (field.type) {
        case 'email':
          fieldSchema = yup.string().email('Invalid email format');
          break;
        case 'number':
          fieldSchema = yup.number().typeError('Must be a number');
          if (field.properties?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.properties.min, `Minimum value is ${field.properties.min}`);
          }
          if (field.properties?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.properties.max, `Maximum value is ${field.properties.max}`);
          }
          break;
        case 'phone':
          fieldSchema = yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
          break;
        case 'url':
          fieldSchema = yup.string().url('Invalid URL format');
          break;
        case 'file':
        case 'image':
          fieldSchema = yup.mixed();
          break;
        default:
          fieldSchema = yup.string();
          if (field.properties?.maxLength) {
            fieldSchema = fieldSchema.max(field.properties.maxLength, `Maximum ${field.properties.maxLength} characters`);
          }
      }

      if (field.isRequired) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }

      // Add custom validation if exists
      if (field.validation?.pattern) {
        fieldSchema = fieldSchema.matches(
          new RegExp(field.validation.pattern),
          field.validation.errorMessage || 'Invalid format'
        );
      }

      schemaFields[field.id] = fieldSchema;
    });

    return yup.object().shape(schemaFields);
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createValidationSchema()),
    defaultValues: initialData,
  });

  const watchedValues = watch();

  // Handle conditional logic
  useEffect(() => {
    const hiddenFields = new Set<string>();

    formDefinition.conditionalRules?.forEach((rule) => {
      const triggerValue = watchedValues[rule.condition];
      const shouldHide = rule.action === 'hide' && triggerValue === rule.value;
      const shouldShow = rule.action === 'show' && triggerValue !== rule.value;

      if (shouldHide || shouldShow) {
        hiddenFields.add(rule.targetFieldId);
      }
    });

    setConditionalFields(hiddenFields);
  }, [watchedValues, formDefinition.conditionalRules]);

  const handleFileUpload = (fieldId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({ ...prev, [fieldId]: fileArray }));
      setValue(fieldId, fileArray);
    }
  };

  const handleRatingChange = (fieldId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [fieldId]: rating }));
    setValue(fieldId, rating);
  };

  const renderField = (field: FormField) => {
    if (conditionalFields.has(field.id)) return null;

    const commonProps = {
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      disabled: isReadOnly,
      className: `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
        errors[field.id] ? 'border-red-500' : ''
      }`,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <textarea
                {...formField}
                {...commonProps}
                rows={field.properties?.rows || 4}
                maxLength={field.properties?.maxLength}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <select {...formField} {...commonProps}>
                <option value="">Select an option</option>
                {(field.properties?.options as string[])?.map((option: string, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          />
        );

      case 'multiselect':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <select {...formField} {...commonProps} multiple size={4}>
                {(field.properties?.options as string[])?.map((option: string, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="space-y-2">
                {(field.properties?.options as string[])?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      {...formField}
                      value={option}
                      checked={formField.value === option}
                      disabled={isReadOnly}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="space-y-2">
                {(field.properties?.options as string[])?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={(formField.value || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = formField.value || [];
                        if (e.target.checked) {
                          formField.onChange([...currentValues, option]);
                        } else {
                          formField.onChange(currentValues.filter((v: string) => v !== option));
                        }
                      }}
                      disabled={isReadOnly}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          />
        );

      case 'file':
      case 'image':
        return (
          <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept={field.type === 'image' ? 'image/*' : '*'}
                multiple={field.properties?.multiple || false}
                onChange={(e) => handleFileUpload(field.id, e.target.files)}
                disabled={isReadOnly}
                className="hidden"
                id={`file-${field.id}`}
              />
              <label htmlFor={`file-${field.id}`} className="cursor-pointer">
                {field.type === 'image' ? (
                  <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                ) : (
                  <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  Max size: {field.properties?.maxSize || 5}MB
                </p>
              </label>
            </div>
            {uploadedFiles[field.id] && uploadedFiles[field.id].length > 0 && (
              <div className="text-sm text-gray-600">
                {uploadedFiles[field.id].map((file, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span>{file.name}</span>
                    <span className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'rating':
        const maxRating = field.properties?.maxRating || 5;
        const currentRating = ratings[field.id] || 0;
        return (
          <div className="flex space-x-1">
            {Array.from({ length: maxRating }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => !isReadOnly && handleRatingChange(field.id, index + 1)}
                disabled={isReadOnly}
                className={`p-1 ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
              >
                <StarIcon
                  className={`h-6 w-6 ${
                    index < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'slider':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="space-y-2">
                <input
                  type="range"
                  {...formField}
                  min={field.properties?.min || 0}
                  max={field.properties?.max || 100}
                  step={field.properties?.step || 1}
                  disabled={isReadOnly}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{field.properties?.min || 0}</span>
                  <span className="font-medium">{formField.value || 0}</span>
                  <span>{field.properties?.max || 100}</span>
                </div>
              </div>
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="relative">
                <input
                  type="date"
                  {...formField}
                  {...commonProps}
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'time':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="relative">
                <input
                  type="time"
                  {...formField}
                  {...commonProps}
                />
                <ClockIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'datetime':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="datetime-local"
                {...formField}
                {...commonProps}
              />
            )}
          />
        );

      case 'location':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <div className="relative">
                <input
                  type="text"
                  {...formField}
                  {...commonProps}
                  placeholder="Enter location or coordinates"
                />
                <MapPinIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            )}
          />
        );

      case 'hidden':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input type="hidden" {...formField} />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="number"
                {...formField}
                {...commonProps}
                min={field.properties?.min}
                max={field.properties?.max}
                step={field.properties?.step || 1}
              />
            )}
          />
        );

      case 'email':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="email"
                {...formField}
                {...commonProps}
              />
            )}
          />
        );

      case 'phone':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="tel"
                {...formField}
                {...commonProps}
              />
            )}
          />
        );

      case 'url':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="url"
                {...formField}
                {...commonProps}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: formField }) => (
              <input
                type="text"
                {...formField}
                {...commonProps}
                maxLength={field.properties?.maxLength}
              />
            )}
          />
        );
    }
  };

  const onFormSubmit = (data: Record<string, any>) => {
    // Include uploaded files and ratings in the submission
    const submissionData = {
      ...data,
      ...Object.fromEntries(
        Object.entries(uploadedFiles).map(([fieldId, files]) => [fieldId, files])
      ),
      ...ratings,
    };
    onSubmit(submissionData);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const currentData = getValues();
      const draftData = {
        ...currentData,
        ...Object.fromEntries(
          Object.entries(uploadedFiles).map(([fieldId, files]) => [fieldId, files])
        ),
        ...ratings,
      };
      onSaveDraft(draftData);
    }
  };

  // Sort fields by order
  const sortedFields = [...formDefinition.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {sortedFields.map((field) => (
          <div key={field.id} className={field.type === 'hidden' ? 'hidden' : 'space-y-2'}>
            {field.type !== 'hidden' && (
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.isRequired && showRequiredIndicator && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.id] && (
              <p className="text-sm text-red-600">{(errors[field.id] as any)?.message}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {formDefinition.settings.allowSaveDraft && onSaveDraft && !isReadOnly && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {formDefinition.settings.saveDraftButtonText || 'Save Draft'}
              </button>
            )}
          </div>
          
          <div>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : (formDefinition.settings.submitButtonText || 'Submit')}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormRenderer;