import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { User } from '../../types';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const roles = ['All', 'User', 'Manager', 'Admin', 'SuperAdmin'];
  const statuses = ['All', 'Active', 'Inactive'];

  // Mock data - replace with API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        userName: 'john.doe',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1-555-0123',
        role: 'Manager',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastLoginAt: '2024-01-20T14:30:00Z',
        fullName: 'John Doe',
      },
      {
        id: '2',
        userName: 'jane.smith',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1-555-0124',
        role: 'Admin',
        isActive: true,
        createdAt: '2024-01-10T14:30:00Z',
        lastLoginAt: '2024-01-20T16:45:00Z',
        fullName: 'Jane Smith',
      },
      {
        id: '3',
        userName: 'mike.johnson',
        email: 'mike.johnson@company.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phoneNumber: '+1-555-0125',
        role: 'User',
        isActive: false,
        createdAt: '2024-01-08T09:15:00Z',
        lastLoginAt: '2024-01-18T11:20:00Z',
        fullName: 'Mike Johnson',
      },
    ];

    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || 
                         (selectedStatus === 'Active' && user.isActive) ||
                         (selectedStatus === 'Inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // API call to delete user
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = async (userId: string) => {
    // API call to toggle user status
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their permissions
          </p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add User
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
              placeholder="Search users..."
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <div>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
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
              setSelectedRole('');
              setSelectedStatus('');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span className="font-medium">{user.userName}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Last Login:</span>
                  <span>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  to={`/users/${user.id}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  to={`/users/${user.id}/edit`}
                  className="text-gray-600 hover:text-gray-500"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className={user.isActive ? "text-yellow-600 hover:text-yellow-500" : "text-green-600 hover:text-green-500"}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UsersList; 