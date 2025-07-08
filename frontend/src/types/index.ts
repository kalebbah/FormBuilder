// User types
export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  fullName: string;
}

// Form types
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  isRequired: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: FieldValidation;
  properties?: Record<string, any>;
  sectionId?: string;
  order: number;
}

export interface FieldValidation {
  minValue?: string;
  maxValue?: string;
  pattern?: string;
  customValidation?: string;
  errorMessage?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  isCollapsible: boolean;
  isCollapsed: boolean;
  order: number;
}

export interface ConditionalRule {
  id: string;
  targetFieldId: string;
  condition: string;
  action: string;
  value?: string;
}

export interface FormSettings {
  allowSaveDraft: boolean;
  allowEditAfterSubmit: boolean;
  requireSignature: boolean;
  submitButtonText?: string;
  saveDraftButtonText?: string;
  theme?: Record<string, any>;
}

export interface FormDefinition {
  fields: FormField[];
  sections: FormSection[];
  conditionalRules: ConditionalRule[];
  settings: FormSettings;
}

export interface Form {
  id: number;
  title: string;
  description?: string;
  formDefinition: FormDefinition;
  isActive: boolean;
  isTemplate: boolean;
  category?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  updatedByName?: string;
  associatedWorkflowId?: number;
  associatedWorkflowName?: string;
  submissionCount: number;
}

// Form Submission types
export interface FormSubmission {
  id: number;
  formId: number;
  formTitle: string;
  submittedById: string;
  submittedByName: string;
  formData: Record<string, any>;
  status: string;
  createdAt: string;
  submittedAt?: string;
  updatedAt?: string;
  updatedByName?: string;
  comments?: string;
  signature?: string;
  metadata?: Record<string, any>;
  workflowInstanceId?: number;
  workflowStatus?: string;
}

// Workflow types
export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  description?: string;
  order: number;
  properties?: Record<string, any>;
  assignment?: StepAssignment;
  conditions?: string[];
  timeoutHours?: number;
  timeoutAction?: string;
}

export interface StepAssignment {
  type: string;
  userId?: string;
  role?: string;
  groupId?: string;
  dynamicExpression?: string;
  allowReassignment: boolean;
  requireAllApprovers: boolean;
}

export interface WorkflowConnection {
  id: string;
  fromStepId: string;
  toStepId: string;
  condition?: string;
  label?: string;
}

export interface WorkflowSettings {
  allowParallelExecution: boolean;
  requireAllSteps: boolean;
  allowStepSkipping: boolean;
  enableNotifications: boolean;
  enableAuditLogging: boolean;
  maxExecutionDays?: number;
  defaultTimeoutAction?: string;
  notificationTemplates?: Record<string, any>;
}

export interface WorkflowDefinition {
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
  settings: WorkflowSettings;
  variables?: Record<string, any>;
}

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  workflowDefinition: WorkflowDefinition;
  isActive: boolean;
  isTemplate: boolean;
  category?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
  updatedByName?: string;
  version: number;
  instanceCount: number;
  activeInstanceCount: number;
}

// Workflow Instance types
export interface WorkflowInstance {
  id: number;
  workflowId: number;
  workflowName: string;
  startedById: string;
  startedByName: string;
  formSubmissionId?: number;
  status: string;
  currentStepId: string;
  currentStepName: string;
  startedAt: string;
  completedAt?: string;
  lastActivityAt?: string;
  finalOutcome?: string;
  variables?: Record<string, any>;
  comments?: string;
  tasks: Task[];
  duration: string;
}

// Task types
export interface Task {
  id: number;
  workflowInstanceId: number;
  stepId: string;
  stepName: string;
  assignedToId: string;
  assignedToName: string;
  type: string;
  status: string;
  title: string;
  description?: string;
  assignedAt: string;
  completedAt?: string;
  dueDate?: string;
  outcome?: string;
  comments?: string;
  data?: Record<string, any>;
  priority: number;
  isUrgent: boolean;
  isOverdue: boolean;
  duration: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form List Response
export interface FormListResponse {
  forms: Form[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Submission List Response
export interface SubmissionListResponse {
  submissions: FormSubmission[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Workflow List Response
export interface WorkflowListResponse {
  workflows: Workflow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Instance List Response
export interface InstanceListResponse {
  instances: WorkflowInstance[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Task List Response
export interface TaskListResponse {
  tasks: Task[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Request types
export interface FormListRequest {
  search?: string;
  category?: string;
  isActive?: boolean;
  isTemplate?: boolean;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

export interface SubmissionListRequest {
  formId?: number;
  status?: string;
  submittedBy?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

export interface WorkflowListRequest {
  search?: string;
  category?: string;
  isActive?: boolean;
  isTemplate?: boolean;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

export interface InstanceListRequest {
  workflowId?: number;
  status?: string;
  startedBy?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

export interface TaskListRequest {
  status?: string;
  type?: string;
  assignedTo?: string;
  priority?: number;
  isUrgent?: boolean;
  isOverdue?: boolean;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Create/Update types
export interface CreateFormRequest {
  title: string;
  description?: string;
  formDefinition: FormDefinition;
  isTemplate: boolean;
  category?: string;
  associatedWorkflowId?: number;
}

export interface UpdateFormRequest {
  title: string;
  description?: string;
  formDefinition: FormDefinition;
  isActive: boolean;
  isTemplate: boolean;
  category?: string;
  associatedWorkflowId?: number;
}

export interface SubmitFormRequest {
  formId: number;
  formData: Record<string, any>;
  comments?: string;
  signature?: string;
  metadata?: Record<string, any>;
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  workflowDefinition: WorkflowDefinition;
  isTemplate: boolean;
  category?: string;
}

export interface UpdateWorkflowRequest {
  name: string;
  description?: string;
  workflowDefinition: WorkflowDefinition;
  isActive: boolean;
  isTemplate: boolean;
  category?: string;
}

export interface CompleteTaskRequest {
  outcome: string;
  comments?: string;
  data?: Record<string, any>;
}

export interface ReassignTaskRequest {
  newAssigneeId: string;
  comments?: string;
} 