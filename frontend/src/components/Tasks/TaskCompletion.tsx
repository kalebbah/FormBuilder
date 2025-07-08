import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Task, Form, FormDefinition } from '../../types';
import FormRenderer from '../Forms/FormRenderer';
import taskService from '../../services/taskService';
import formService from '../../services/formService';
import notificationService from '../../services/notificationService';

interface TaskCompletionProps {
  task: Task;
  onTaskCompleted: (task: Task, outcome: string) => void;
  onCancel: () => void;
}

const TaskCompletion: React.FC<TaskCompletionProps> = ({
  task,
  onTaskCompleted,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [comments, setComments] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [relatedForm, setRelatedForm] = useState<Form | null>(null);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    loadTaskDetails();
  }, [task.id]);

  const loadTaskDetails = async () => {
    try {
      // Load task history
      const history = await taskService.getTaskHistory(task.id);
      setTaskHistory(history);

      // Load related form if this is a form task
      if (task.type === 'FormTask' && task.data?.formId) {
        const form = await formService.getForm(task.data.formId);
        setRelatedForm(form);
        
        // Pre-populate with existing data if available
        if (task.data?.formData) {
          setFormData(task.data.formData);
        }
      }
    } catch (error) {
      console.error('Error loading task details:', error);
    }
  };

  const getAvailableOutcomes = (): { value: string; label: string; color: string; icon: any }[] => {
    const baseOutcomes = [
      { value: 'completed', label: 'Mark as Completed', color: 'bg-green-600 hover:bg-green-700', icon: CheckCircleIcon },
      { value: 'submitted', label: 'Submit', color: 'bg-blue-600 hover:bg-blue-700', icon: DocumentTextIcon },
    ];

    switch (task.type) {
      case 'ApprovalTask':
        return [
          { value: 'approved', label: 'Approve', color: 'bg-green-600 hover:bg-green-700', icon: CheckCircleIcon },
          { value: 'rejected', label: 'Reject', color: 'bg-red-600 hover:bg-red-700', icon: XCircleIcon },
        ];
      case 'ReviewTask':
        return [
          { value: 'approved', label: 'Approve', color: 'bg-green-600 hover:bg-green-700', icon: CheckCircleIcon },
          { value: 'needs_changes', label: 'Needs Changes', color: 'bg-yellow-600 hover:bg-yellow-700', icon: ExclamationTriangleIcon },
          { value: 'rejected', label: 'Reject', color: 'bg-red-600 hover:bg-red-700', icon: XCircleIcon },
        ];
      case 'FormTask':
        return baseOutcomes;
      default:
        return baseOutcomes;
    }
  };

  const handleCompleteTask = async (outcome: string) => {
    if (!outcome) {
      alert('Please select an outcome');
      return;
    }

    setIsSubmitting(true);
    setSelectedOutcome(outcome);

    try {
      // Prepare completion data
      const completionData = {
        outcome,
        comments: comments.trim() || undefined,
        data: Object.keys(formData).length > 0 ? formData : undefined,
      };

      // Complete the task
      await taskService.completeTask(task.id, completionData);

      // Send notification about task completion
      await notificationService.sendTaskCompletionEmail(task.id, outcome, comments);

      // Notify parent component
      onTaskCompleted(task, outcome);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSelectedOutcome('');
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    handleCompleteTask('submitted');
  };

  const formatDuration = (assignedAt: string): string => {
    const now = new Date();
    const assigned = new Date(assignedAt);
    const diffInHours = Math.floor((now.getTime() - assigned.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const availableOutcomes = getAvailableOutcomes();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Task Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600 mt-1">{task.description}</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Assigned {formatDuration(task.assignedAt)} ago</span>
            </div>
            {task.isUrgent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Urgent
              </span>
            )}
            {task.isOverdue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Overdue
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Type:</span>
            <span className="ml-2 text-gray-600">{task.type}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Priority:</span>
            <span className={`ml-2 font-medium ${
              task.priority === 5 ? 'text-red-600' : 
              task.priority >= 3 ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {task.priority === 5 ? 'Critical' : task.priority >= 3 ? 'High' : 'Normal'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span className="ml-2 text-gray-600">{task.status}</span>
          </div>
        </div>

        {task.dueDate && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Due: {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Task History */}
      {taskHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task History</h3>
          <div className="space-y-3">
            {taskHistory.map((entry, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <UserIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-900">{entry.performedBy}</span>
                  <span className="text-gray-600 ml-2">{entry.action}</span>
                  {entry.outcome && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {entry.outcome}
                    </span>
                  )}
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(entry.performedAt).toLocaleString()}
                  </div>
                  {entry.comments && (
                    <div className="mt-1 text-gray-600 text-xs italic">"{entry.comments}"</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Renderer for Form Tasks */}
      {relatedForm && task.type === 'FormTask' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Form: {relatedForm.title}</h3>
          <FormRenderer
            formDefinition={relatedForm.formDefinition}
            onSubmit={handleFormSubmit}
            initialData={formData}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Task Completion Actions */}
      {task.type !== 'FormTask' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Task</h3>
          
          {/* Comments Section */}
          <div className="mb-6">
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Comments {selectedOutcome === 'rejected' || selectedOutcome === 'needs_changes' ? '(Required)' : '(Optional)'}
            </label>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any comments or notes about this task completion..."
              required={selectedOutcome === 'rejected' || selectedOutcome === 'needs_changes'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {availableOutcomes.map((outcome) => (
              <button
                key={outcome.value}
                onClick={() => handleCompleteTask(outcome.value)}
                disabled={isSubmitting || (
                  (outcome.value === 'rejected' || outcome.value === 'needs_changes') && 
                  !comments.trim()
                )}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  outcome.color
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting && selectedOutcome === outcome.value ? 'opacity-50' : ''
                }`}
              >
                {isSubmitting && selectedOutcome === outcome.value ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <outcome.icon className="h-4 w-4 mr-2" />
                )}
                {isSubmitting && selectedOutcome === outcome.value ? 'Processing...' : outcome.label}
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Form Task Completion */}
      {task.type === 'FormTask' && !relatedForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Form...</h3>
            <p className="text-gray-600">Please wait while we load the form for this task.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCompletion;