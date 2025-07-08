import axios from 'axios';
import {
  Form,
  FormDefinition,
  FormSubmission,
  FormListRequest,
  FormListResponse,
  SubmissionListRequest,
  SubmissionListResponse,
  CreateFormRequest,
  UpdateFormRequest,
  SubmitFormRequest,
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

class FormService {
  // Form Management
  async createForm(formData: CreateFormRequest): Promise<Form> {
    const response = await api.post<ApiResponse<Form>>('/forms', formData);
    return response.data.data;
  }

  async updateForm(formId: number, formData: UpdateFormRequest): Promise<Form> {
    const response = await api.put<ApiResponse<Form>>(`/forms/${formId}`, formData);
    return response.data.data;
  }

  async deleteForm(formId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/forms/${formId}`);
    return response.data.data;
  }

  async getForm(formId: number): Promise<Form> {
    const response = await api.get<ApiResponse<Form>>(`/forms/${formId}`);
    return response.data.data;
  }

  async getForms(request: FormListRequest): Promise<FormListResponse> {
    const params = new URLSearchParams();
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<FormListResponse>>(`/forms?${params}`);
    return response.data.data;
  }

  async publishForm(formId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/forms/${formId}/publish`);
    return response.data.data;
  }

  async unpublishForm(formId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/forms/${formId}/unpublish`);
    return response.data.data;
  }

  // Form Templates
  async getFormTemplates(): Promise<Form[]> {
    const response = await api.get<ApiResponse<Form[]>>('/forms/templates');
    return response.data.data;
  }

  async createFormFromTemplate(templateId: number, formData: CreateFormRequest): Promise<Form> {
    const response = await api.post<ApiResponse<Form>>(`/forms/templates/${templateId}`, formData);
    return response.data.data;
  }

  async saveAsTemplate(formId: number): Promise<Form> {
    const form = await this.getForm(formId);
    const templateData: CreateFormRequest = {
      title: `${form.title} Template`,
      description: form.description,
      formDefinition: form.formDefinition,
      isTemplate: true,
      category: form.category,
    };
    return this.createForm(templateData);
  }

  // Form Submission
  async submitForm(formId: number, formData: Record<string, any>, options?: {
    saveDraft?: boolean;
    comments?: string;
    signature?: string;
  }): Promise<FormSubmission> {
    const submissionData: SubmitFormRequest = {
      formId,
      formData,
      comments: options?.comments,
      signature: options?.signature,
      metadata: {
        isDraft: options?.saveDraft || false,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    };

    const endpoint = options?.saveDraft ? `/forms/${formId}/draft` : `/forms/${formId}/submit`;
    const response = await api.post<ApiResponse<FormSubmission>>(endpoint, submissionData);
    return response.data.data;
  }

  async saveDraft(formId: number, formData: Record<string, any>, comments?: string): Promise<FormSubmission> {
    return this.submitForm(formId, formData, { saveDraft: true, comments });
  }

  // Form Submissions Management
  async getSubmissions(request: SubmissionListRequest): Promise<SubmissionListResponse> {
    const params = new URLSearchParams();
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<SubmissionListResponse>>(`/forms/submissions?${params}`);
    return response.data.data;
  }

  async getSubmission(submissionId: number): Promise<FormSubmission> {
    const response = await api.get<ApiResponse<FormSubmission>>(`/forms/submissions/${submissionId}`);
    return response.data.data;
  }

  async updateSubmission(submissionId: number, formData: Record<string, any>, comments?: string): Promise<FormSubmission> {
    const updateData = {
      formData,
      comments,
      metadata: {
        updatedAt: new Date().toISOString(),
      },
    };

    const response = await api.put<ApiResponse<FormSubmission>>(`/forms/submissions/${submissionId}`, updateData);
    return response.data.data;
  }

  async deleteSubmission(submissionId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/forms/submissions/${submissionId}`);
    return response.data.data;
  }

  // Form Validation
  async validateFormData(formId: number, formData: Record<string, any>): Promise<{ isValid: boolean; errors: Record<string, string[]> }> {
    try {
      const response = await api.post<ApiResponse<{ isValid: boolean; errors: Record<string, string[]> }>>(
        `/forms/${formId}/validate`,
        { formData }
      );
      return response.data.data;
    } catch (error) {
      console.error('Form validation error:', error);
      return { isValid: false, errors: { general: ['Validation failed'] } };
    }
  }

  // File Upload
  async uploadFile(file: File, fieldId: string): Promise<{ url: string; fileId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldId', fieldId);

    const response = await api.post<ApiResponse<{ url: string; fileId: string }>>(
      '/forms/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  async uploadFiles(files: File[], fieldId: string): Promise<{ url: string; fileId: string }[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, fieldId));
    return Promise.all(uploadPromises);
  }

  // Form Statistics
  async getFormStatistics(formId: number): Promise<{
    totalSubmissions: number;
    draftSubmissions: number;
    completedSubmissions: number;
    avgCompletionTime: number;
    submissionsByDate: { date: string; count: number }[];
  }> {
    const response = await api.get<ApiResponse<any>>(`/forms/${formId}/statistics`);
    return response.data.data;
  }

  // Form Export
  async exportSubmissions(formId: number, format: 'csv' | 'excel' | 'json' = 'csv'): Promise<Blob> {
    const response = await api.get(`/forms/${formId}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Conditional Logic Helpers
  evaluateConditionalRules(formData: Record<string, any>, formDefinition: FormDefinition): string[] {
    const hiddenFields: string[] = [];

    formDefinition.conditionalRules?.forEach(rule => {
      const triggerValue = formData[rule.condition];
      const shouldHide = rule.action === 'hide' && triggerValue === rule.value;
      const shouldShow = rule.action === 'show' && triggerValue !== rule.value;

      if (shouldHide || shouldShow) {
        hiddenFields.push(rule.targetFieldId);
      }
    });

    return hiddenFields;
  }

  // Form Duplication
  async duplicateForm(formId: number, newTitle?: string): Promise<Form> {
    const originalForm = await this.getForm(formId);
    const duplicateData: CreateFormRequest = {
      title: newTitle || `${originalForm.title} (Copy)`,
      description: originalForm.description,
      formDefinition: originalForm.formDefinition,
      isTemplate: false,
      category: originalForm.category,
    };
    return this.createForm(duplicateData);
  }

  // Workflow Integration Helpers
  async getFormsWithWorkflows(): Promise<Form[]> {
    const response = await api.get<ApiResponse<Form[]>>('/forms?hasWorkflow=true');
    return response.data.data;
  }

  async associateFormWithWorkflow(formId: number, workflowId: number): Promise<boolean> {
    const response = await api.post<ApiResponse<boolean>>(`/forms/${formId}/workflow/${workflowId}`);
    return response.data.data;
  }

  async disassociateFormFromWorkflow(formId: number): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/forms/${formId}/workflow`);
    return response.data.data;
  }
}

export default new FormService();