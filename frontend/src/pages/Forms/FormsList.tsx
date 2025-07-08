import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Form, FormListRequest } from '../../types';

const FormsList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['All', 'HR', 'Finance', 'IT', 'Operations', 'Sales'];
  const statuses = ['All', 'Active', 'Inactive', 'Template'];

  // Mock data - replace with API call
  useEffect(() => {
    const mockForms: Form[] = [
      {
        id: 1,
        title: 'Employee Onboarding Form',
        description: 'Complete onboarding process for new employees',
        formDefinition: { fields: [], sections: [], conditionalRules: [], settings: {} as any },
        isActive: true,
        isTemplate: false,
        category: 'HR',
        createdById: '1',
        createdByName: 'John Doe',
        createdAt: '2024-01-15T10:00:00Z',
        submissionCount: 45,
      },
      {
        id: 2,
        title: 'Expense Report',
        description: 'Submit expense reports for reimbursement',
        formDefinition: { fields: [], sections: [], conditionalRules: [], settings: {} as any },
        isActive: true,
        isTemplate: false,
        category: 'Finance',
        createdById: '1',
        createdByName: 'Jane Smith',
        createdAt: '2024-01-10T14:30:00Z',
        submissionCount: 123,
      },
      {
        id: 3,
        title: 'IT Support Request',
        description: 'Request IT support for technical issues',
        formDefinition: { fields: [], sections: [], conditionalRules: [], settings: {} as any },
        isActive: true,
        isTemplate: false,
        category: 'IT',
        createdById: '2',
        createdByName: 'Mike Johnson',
        createdAt: '2024-01-08T09:15:00Z',
        submissionCount: 67,
      },
    ];

    setForms(mockForms);
    setLoading(false);
  }, []);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || form.category === selectedCategory;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || 
                         (selectedStatus === 'Active' && form.isActive) ||
                         (selectedStatus === 'Inactive' && !form.isActive) ||
                         (selectedStatus === 'Template' && form.isTemplate);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (formId: number) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      // API call to delete form
      setForms(forms.filter(form => form.id !== formId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create forms for data collection
          </p>
        </div>
        <Link
          to="/forms/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Form
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Forms grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <div key={form.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  form.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
                {form.isTemplate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Template
                  </span>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {form.title}
              </h3>
              
              {form.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {form.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Category: {form.category}</span>
                <span>{form.submissionCount} submissions</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Created by {form.createdByName}</span>
                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  to={`/forms/${form.id}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  to={`/forms/${form.id}/edit`}
                  className="text-gray-600 hover:text-gray-500"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
              </div>
              <button
                onClick={() => handleDelete(form.id)}
                className="text-red-600 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No forms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FormsList; 