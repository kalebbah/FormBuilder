import axios from 'axios';
import {
  Task,
  TaskListRequest,
  TaskListResponse,
  CompleteTaskRequest,
  ReassignTaskRequest,
  ApiResponse,
} from '../types';

const API_BASE_URL = (window as any).env?.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class TaskService {
  // Task Retrieval
  async getTasks(request: TaskListRequest): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<TaskListResponse>>(`/tasks?${params}`);
    return response.data.data;
  }

  async getTask(taskId: number): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data;
  }

  async getMyTasks(request?: Partial<TaskListRequest>): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (request) {
      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<TaskListResponse>>(`/tasks/my-tasks?${params}`);
    return response.data.data;
  }

  async getPendingTasks(request?: Partial<TaskListRequest>): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (request) {
      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<TaskListResponse>>(`/tasks/pending?${params}`);
    return response.data.data;
  }

  async getUrgentTasks(request?: Partial<TaskListRequest>): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (request) {
      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<TaskListResponse>>(`/tasks/urgent?${params}`);
    return response.data.data;
  }

  async getOverdueTasks(request?: Partial<TaskListRequest>): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (request) {
      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<TaskListResponse>>(`/tasks/overdue?${params}`);
    return response.data.data;
  }

  // Task Actions
  async completeTask(taskId: number, completion: CompleteTaskRequest): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/tasks/${taskId}/complete`, completion);
    return response.data.data;
  }

  async approveTask(taskId: number, comments?: string, data?: Record<string, any>): Promise<boolean> {
    return this.completeTask(taskId, {
      outcome: 'approved',
      comments,
      data,
    });
  }

  async rejectTask(taskId: number, comments: string, data?: Record<string, any>): Promise<boolean> {
    return this.completeTask(taskId, {
      outcome: 'rejected',
      comments,
      data,
    });
  }

  async submitTask(taskId: number, formData: Record<string, any>, comments?: string): Promise<boolean> {
    return this.completeTask(taskId, {
      outcome: 'submitted',
      comments,
      data: formData,
    });
  }

  async reassignTask(taskId: number, reassignment: ReassignTaskRequest): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/tasks/${taskId}/reassign`, reassignment);
    return response.data.data;
  }

  // Task Status and Progress
  async getTaskProgress(workflowInstanceId: number): Promise<{
    totalSteps: number;
    completedSteps: number;
    currentStep: string;
    progress: number;
    estimatedCompletion?: string;
  }> {
    const response = await api.get<ApiResponse<any>>(`/tasks/progress/${workflowInstanceId}`);
    return response.data.data;
  }

  async getTaskHistory(taskId: number): Promise<{
    id: number;
    action: string;
    performedBy: string;
    performedAt: string;
    outcome?: string;
    comments?: string;
    data?: Record<string, any>;
  }[]> {
    const response = await api.get<ApiResponse<any[]>>(`/tasks/${taskId}/history`);
    return response.data.data;
  }

  // Task Notifications
  async markTaskAsRead(taskId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/tasks/${taskId}/mark-read`);
    return response.data.data;
  }

  async getTaskNotifications(): Promise<{
    id: number;
    taskId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: 'assignment' | 'reminder' | 'escalation' | 'completion';
  }[]> {
    const response = await api.get<ApiResponse<any[]>>('/tasks/notifications');
    return response.data.data;
  }

  async markAllNotificationsAsRead(): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/tasks/notifications/mark-all-read');
    return response.data.data;
  }

  // Task Comments and Collaboration
  async addTaskComment(taskId: number, comment: string): Promise<{
    id: number;
    comment: string;
    authorName: string;
    createdAt: string;
  }> {
    const response = await api.post<ApiResponse<any>>(`/tasks/${taskId}/comments`, { comment });
    return response.data.data;
  }

  async getTaskComments(taskId: number): Promise<{
    id: number;
    comment: string;
    authorName: string;
    createdAt: string;
  }[]> {
    const response = await api.get<ApiResponse<any[]>>(`/tasks/${taskId}/comments`);
    return response.data.data;
  }

  // Task Filters and Search
  async searchTasks(query: string, filters?: {
    status?: string;
    type?: string;
    assignedTo?: string;
    priority?: number;
    fromDate?: string;
    toDate?: string;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Task[]>>(`/tasks/search?${params}`);
    return response.data.data;
  }

  // Task Statistics
  async getTaskStatistics(): Promise<{
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
    avgCompletionTime: number;
    tasksByType: { type: string; count: number }[];
    tasksByStatus: { status: string; count: number }[];
    completionRate: number;
  }> {
    const response = await api.get<ApiResponse<any>>('/tasks/statistics');
    return response.data.data;
  }

  async getUserTaskStatistics(userId?: string): Promise<{
    assignedTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    avgCompletionTime: number;
    performanceScore: number;
  }> {
    const endpoint = userId ? `/tasks/statistics/user/${userId}` : '/tasks/statistics/my';
    const response = await api.get<ApiResponse<any>>(endpoint);
    return response.data.data;
  }

  // Task Export
  async exportTasks(filters?: TaskListRequest, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/tasks/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Task Scheduling and Reminders
  async scheduleTaskReminder(taskId: number, reminderDate: string, message?: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/tasks/${taskId}/remind`, {
      reminderDate,
      message,
    });
    return response.data.data;
  }

  async cancelTaskReminder(taskId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/tasks/${taskId}/remind`);
    return response.data.data;
  }

  // Task Priority Management
  async updateTaskPriority(taskId: number, priority: number): Promise<boolean> {
    const response = await api.patch<ApiResponse<boolean>>(`/tasks/${taskId}/priority`, { priority });
    return response.data.data;
  }

  async markTaskAsUrgent(taskId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/tasks/${taskId}/urgent`);
    return response.data.data;
  }

  async unmarkTaskAsUrgent(taskId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/tasks/${taskId}/urgent`);
    return response.data.data;
  }

  // Bulk Operations
  async completeBulkTasks(taskIds: number[], outcome: string, comments?: string): Promise<{
    successful: number[];
    failed: { taskId: number; error: string }[];
  }> {
    const response = await api.post<ApiResponse<any>>('/tasks/bulk/complete', {
      taskIds,
      outcome,
      comments,
    });
    return response.data.data;
  }

  async reassignBulkTasks(taskIds: number[], newAssigneeId: string, comments?: string): Promise<{
    successful: number[];
    failed: { taskId: number; error: string }[];
  }> {
    const response = await api.post<ApiResponse<any>>('/tasks/bulk/reassign', {
      taskIds,
      newAssigneeId,
      comments,
    });
    return response.data.data;
  }
}

export default new TaskService();