import axios from 'axios';
import { ApiResponse } from '../types';

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

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  variables: string[];
}

interface NotificationRequest {
  templateId: string;
  recipients: string[];
  variables: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduleFor?: string;
  metadata?: Record<string, any>;
}

interface Notification {
  id: number;
  type: 'task_assigned' | 'task_completed' | 'workflow_started' | 'workflow_completed' | 'form_submitted' | 'reminder' | 'escalation';
  title: string;
  message: string;
  recipient: string;
  recipientName: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedEntityType?: 'form' | 'workflow' | 'task';
  relatedEntityId?: number;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationPreferences {
  email: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    workflowStarted: boolean;
    workflowCompleted: boolean;
    formSubmitted: boolean;
    reminders: boolean;
    escalations: boolean;
    digest: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'disabled';
  };
  inApp: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    workflowStarted: boolean;
    workflowCompleted: boolean;
    formSubmitted: boolean;
    reminders: boolean;
    escalations: boolean;
  };
  sms: {
    urgent: boolean;
    escalations: boolean;
  };
}

class NotificationService {
  // Notification Management
  async getNotifications(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      type?: string;
      isRead?: boolean;
      priority?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<any>>(`/notifications?${params}`);
    return response.data.data;
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications/unread');
    return response.data.data;
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/notifications/${notificationId}/read`);
    return response.data.data;
  }

  async markAllAsRead(): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/mark-all-read');
    return response.data.data;
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/notifications/${notificationId}`);
    return response.data.data;
  }

  async deleteAllRead(): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>('/notifications/read');
    return response.data.data;
  }

  // Email Notifications
  async sendEmail(request: NotificationRequest): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/email', request);
    return response.data.data;
  }

  async sendTaskAssignmentEmail(taskId: number, assigneeId: string, message?: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/task-assignment', {
      taskId,
      assigneeId,
      message,
    });
    return response.data.data;
  }

  async sendTaskCompletionEmail(taskId: number, outcome: string, comments?: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/task-completion', {
      taskId,
      outcome,
      comments,
    });
    return response.data.data;
  }

  async sendWorkflowStartedEmail(workflowInstanceId: number, initiatorId: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/workflow-started', {
      workflowInstanceId,
      initiatorId,
    });
    return response.data.data;
  }

  async sendWorkflowCompletedEmail(workflowInstanceId: number, outcome: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/workflow-completed', {
      workflowInstanceId,
      outcome,
    });
    return response.data.data;
  }

  async sendFormSubmissionEmail(formSubmissionId: number, reviewerIds: string[]): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/form-submission', {
      formSubmissionId,
      reviewerIds,
    });
    return response.data.data;
  }

  async sendReminderEmail(taskId: number, message: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/reminder', {
      taskId,
      message,
    });
    return response.data.data;
  }

  async sendEscalationEmail(taskId: number, escalatedToId: string, reason: string): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/escalation', {
      taskId,
      escalatedToId,
      reason,
    });
    return response.data.data;
  }

  // Notification Templates
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    const response = await api.get<ApiResponse<NotificationTemplate[]>>('/notifications/templates');
    return response.data.data;
  }

  async getNotificationTemplate(templateId: string): Promise<NotificationTemplate> {
    const response = await api.get<ApiResponse<NotificationTemplate>>(`/notifications/templates/${templateId}`);
    return response.data.data;
  }

  async createNotificationTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<NotificationTemplate> {
    const response = await api.post<ApiResponse<NotificationTemplate>>('/notifications/templates', template);
    return response.data.data;
  }

  async updateNotificationTemplate(templateId: string, template: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const response = await api.put<ApiResponse<NotificationTemplate>>(`/notifications/templates/${templateId}`, template);
    return response.data.data;
  }

  async deleteNotificationTemplate(templateId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/notifications/templates/${templateId}`);
    return response.data.data;
  }

  // Notification Preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<ApiResponse<NotificationPreferences>>('/notifications/preferences');
    return response.data.data;
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.put<ApiResponse<NotificationPreferences>>('/notifications/preferences', preferences);
    return response.data.data;
  }

  // Real-time Notifications (WebSocket/Server-Sent Events)
  connectToRealTimeNotifications(onNotification: (notification: Notification) => void): () => void {
    const eventSource = new EventSource(`${API_BASE_URL}/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Notification stream error:', error);
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }

  // Browser Notifications (Web Push)
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async showBrowserNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  // Notification Statistics
  async getNotificationStatistics(): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    deliveryRate: number;
    readRate: number;
    notificationsByType: { type: string; count: number }[];
    notificationsByPriority: { priority: string; count: number }[];
  }> {
    const response = await api.get<ApiResponse<any>>('/notifications/statistics');
    return response.data.data;
  }

  // Notification Queue Management
  async getNotificationQueue(): Promise<{
    id: number;
    type: string;
    recipient: string;
    status: 'pending' | 'processing' | 'sent' | 'failed';
    scheduledFor?: string;
    attempts: number;
    lastAttempt?: string;
    error?: string;
  }[]> {
    const response = await api.get<ApiResponse<any[]>>('/notifications/queue');
    return response.data.data;
  }

  async retryFailedNotifications(): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>('/notifications/queue/retry');
    return response.data.data;
  }

  // Utility Methods
  formatNotificationTime(createdAt: string): string {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return notificationTime.toLocaleDateString();
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      task_assigned: '📋',
      task_completed: '✅',
      workflow_started: '🔄',
      workflow_completed: '🏁',
      form_submitted: '📝',
      reminder: '⏰',
      escalation: '🚨',
    };
    return icons[type] || '📢';
  }

  getNotificationColor(priority: string): string {
    const colors: Record<string, string> = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  }
}

export default new NotificationService();