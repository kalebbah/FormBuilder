import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, FormField } from '../../types';

const FormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockForm: Form = {
      id: 1,
      title: 'Employee Onboarding Form',
      description: 'Complete onboarding process for new employees',
      formDefinition: {
        fields: [
          {
            id: 'field_1',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            isRequired: true,
            order: 1,
          },
          {
            id: 'field_2',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            isRequired: true,
            order: 2,
          },
          {
            id: 'field_3',
            type: 'select',
            label: 'Department',
            placeholder: 'Select your department',
            isRequired: true,
            options: ['HR', 'Finance', 'IT', 'Operations', 'Sales'],
            order: 3,
          },
          {
            id: 'field_4',
            type: 'textarea',
            label: 'Additional Information',
            placeholder: 'Any additional information you would like to provide',
            isRequired: false,
            order: 4,
          },
        ],
        sections: [],
        conditionalRules: [],
        settings: {
          allowSaveDraft: true,
          allowEditAfterSubmit: false,
          requireSignature: false,
        },
      },
      isActive: true,
      isTemplate: false,
      category: 'HR',
      createdById: '1',
      createdByName: 'John Doe',
      createdAt: '2024-01-15T10:00:00Z',
      submissionCount: 45,
    };

    setForm(mockForm);
    setLoading(false);
  }, [id]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validateForm = () => {
    if (!form) return false;
    
    for (const field of form.formDefinition.fields) {
      if (field.isRequired && (!formData[field.id] || formData[field.id].toString().trim() === '')) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    
    try {
      // API call to submit form
      console.log('Submitting form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Form submitted successfully!');
      navigate('/forms');
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    
    try {
      // API call to save draft
      console.log('Saving draft:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.isRequired}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.isRequired}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.isRequired}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="mt-1">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              required={field.isRequired}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
              {field.placeholder}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="mt-1 space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}_${option}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.isRequired}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor={`${field.id}_${option}`} className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.isRequired}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.isRequired}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Form not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
        {form.description && (
          <p className="mt-2 text-gray-600">{form.description}</p>
        )}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <span>Category: {form.category}</span>
          <span>Created by: {form.createdByName}</span>
          <span>{form.submissionCount} submissions</span>
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.formDefinition.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

          {/* Form actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {form.formDefinition.settings.allowSaveDraft && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormView; 