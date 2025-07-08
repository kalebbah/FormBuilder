import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  DocumentTextIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Forms',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: DocumentTextIcon,
    },
    {
      name: 'Active Workflows',
      value: '8',
      change: '+3%',
      changeType: 'positive',
      icon: CogIcon,
    },
    {
      name: 'Pending Tasks',
      value: '12',
      change: '-2%',
      changeType: 'negative',
      icon: ClipboardDocumentListIcon,
    },
    {
      name: 'Total Users',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'form_submitted',
      title: 'New form submission',
      description: 'Employee Onboarding Form submitted by John Doe',
      time: '2 minutes ago',
      user: 'John Doe',
    },
    {
      id: 2,
      type: 'workflow_started',
      title: 'Workflow initiated',
      description: 'Approval Workflow started for Purchase Request #1234',
      time: '15 minutes ago',
      user: 'Jane Smith',
    },
    {
      id: 3,
      type: 'task_completed',
      title: 'Task completed',
      description: 'Manager approval completed for Expense Report #567',
      time: '1 hour ago',
      user: 'Mike Johnson',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'form_submitted':
        return DocumentTextIcon;
      case 'workflow_started':
        return CogIcon;
      case 'task_completed':
        return ClipboardDocumentListIcon;
      default:
        return ClockIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.firstName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Form Submissions</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                            <Icon className="h-5 w-5 text-primary-600" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={activity.time}>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 