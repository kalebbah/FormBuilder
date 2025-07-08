import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { Workflow } from '../../types';

const WorkflowsList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const categories = ['All', 'HR', 'Finance', 'IT', 'Operations', 'Sales'];
  const statuses = ['All', 'Active', 'Inactive', 'Template'];

  // Mock data - replace with API call
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: 1,
        name: 'Employee Onboarding Workflow',
        description: 'Complete onboarding process for new employees',
        workflowDefinition: { steps: [], connections: [], settings: {} as any, variables: {} },
        isActive: true,
        isTemplate: false,
        category: 'HR',
        createdById: '1',
        createdByName: 'John Doe',
        createdAt: '2024-01-15T10:00:00Z',
        version: 1,
        instanceCount: 45,
        activeInstanceCount: 12,
      },
      {
        id: 2,
        name: 'Expense Approval Workflow',
        description: 'Multi-level approval process for expense reports',
        workflowDefinition: { steps: [], connections: [], settings: {} as any, variables: {} },
        isActive: true,
        isTemplate: false,
        category: 'Finance',
        createdById: '1',
        createdByName: 'Jane Smith',
        createdAt: '2024-01-10T14:30:00Z',
        version: 2,
        instanceCount: 123,
        activeInstanceCount: 8,
      },
      {
        id: 3,
        name: 'IT Support Ticket Workflow',
        description: 'IT support ticket processing and resolution',
        workflowDefinition: { steps: [], connections: [], settings: {} as any, variables: {} },
        isActive: true,
        isTemplate: false,
        category: 'IT',
        createdById: '2',
        createdByName: 'Mike Johnson',
        createdAt: '2024-01-08T09:15:00Z',
        version: 1,
        instanceCount: 67,
        activeInstanceCount: 15,
      },
    ];

    setWorkflows(mockWorkflows);
    setLoading(false);
  }, []);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || workflow.category === selectedCategory;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || 
                         (selectedStatus === 'Active' && workflow.isActive) ||
                         (selectedStatus === 'Inactive' && !workflow.isActive) ||
                         (selectedStatus === 'Template' && workflow.isTemplate);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (workflowId: number) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      // API call to delete workflow
      setWorkflows(workflows.filter(workflow => workflow.id !== workflowId));
    }
  };

  const handleToggleStatus = async (workflowId: number) => {
    // API call to toggle workflow status
    setWorkflows(workflows.map(workflow =>
      workflow.id === workflowId ? { ...workflow, isActive: !workflow.isActive } : workflow
    ));
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
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create automated workflow processes
          </p>
        </div>
        <Link
          to="/workflows/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Workflow
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
              placeholder="Search workflows..."
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

      {/* Workflows grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    workflow.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {workflow.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {workflow.isTemplate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Template
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">v{workflow.version}</span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {workflow.name}
              </h3>
              
              {workflow.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {workflow.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{workflow.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Instances:</span>
                  <span>{workflow.instanceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Instances:</span>
                  <span className="text-primary-600 font-medium">{workflow.activeInstanceCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Created by {workflow.createdByName}</span>
                <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  to={`/workflows/${workflow.id}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  to={`/workflows/${workflow.id}/edit`}
                  className="text-gray-600 hover:text-gray-500"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleToggleStatus(workflow.id)}
                  className={workflow.isActive ? "text-yellow-600 hover:text-yellow-500" : "text-green-600 hover:text-green-500"}
                >
                  {workflow.isActive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={() => handleDelete(workflow.id)}
                className="text-red-600 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No workflows found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WorkflowsList; 