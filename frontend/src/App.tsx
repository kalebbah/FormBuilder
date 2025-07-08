import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import FormsList from './pages/Forms/FormsList';
import FormBuilder from './pages/Forms/FormBuilder';
import FormView from './pages/Forms/FormView';
import WorkflowsList from './pages/Workflows/WorkflowsList';
import TasksList from './pages/Tasks/TasksList';
import UsersList from './pages/Users/UsersList';
import Profile from './pages/Profile/Profile';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/forms/create" element={<FormBuilder />} />
        <Route path="/forms/:id/edit" element={<FormBuilder />} />
        <Route path="/forms/:id" element={<FormView />} />
        <Route path="/workflows" element={<WorkflowsList />} />
        <Route path="/workflows/create" element={<div>Workflow Builder - Coming Soon</div>} />
        <Route path="/workflows/:id/edit" element={<div>Workflow Builder - Coming Soon</div>} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App; 