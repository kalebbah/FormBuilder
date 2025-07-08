using System.ComponentModel.DataAnnotations;

namespace AscendumApp.Shared.DTOs;

public class CreateWorkflowRequest
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public WorkflowDefinitionDto WorkflowDefinition { get; set; } = null!;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
}

public class UpdateWorkflowRequest
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public WorkflowDefinitionDto WorkflowDefinition { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
}

public class WorkflowDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkflowDefinitionDto WorkflowDefinition { get; set; } = null!;
    public bool IsActive { get; set; }
    public bool IsTemplate { get; set; }
    public string? Category { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public string CreatedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedByName { get; set; }
    public int Version { get; set; }
    public int InstanceCount { get; set; }
    public int ActiveInstanceCount { get; set; }
}

public class WorkflowDefinitionDto
{
    public List<WorkflowStepDto> Steps { get; set; } = new List<WorkflowStepDto>();
    public List<WorkflowConnectionDto> Connections { get; set; } = new List<WorkflowConnectionDto>();
    public WorkflowSettingsDto Settings { get; set; } = new WorkflowSettingsDto();
    public Dictionary<string, object>? Variables { get; set; }
}

public class WorkflowStepDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public Dictionary<string, object>? Properties { get; set; }
    public StepAssignmentDto? Assignment { get; set; }
    public List<string>? Conditions { get; set; }
    public int? TimeoutHours { get; set; }
    public string? TimeoutAction { get; set; }
}

public class WorkflowConnectionDto
{
    public string Id { get; set; } = string.Empty;
    public string FromStepId { get; set; } = string.Empty;
    public string ToStepId { get; set; } = string.Empty;
    public string? Condition { get; set; }
    public string? Label { get; set; }
}

public class StepAssignmentDto
{
    public string Type { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? Role { get; set; }
    public string? GroupId { get; set; }
    public string? DynamicExpression { get; set; }
    public bool AllowReassignment { get; set; } = true;
    public bool RequireAllApprovers { get; set; } = false;
}

public class WorkflowSettingsDto
{
    public bool AllowParallelExecution { get; set; } = false;
    public bool RequireAllSteps { get; set; } = true;
    public bool AllowStepSkipping { get; set; } = false;
    public bool EnableNotifications { get; set; } = true;
    public bool EnableAuditLogging { get; set; } = true;
    public int? MaxExecutionDays { get; set; }
    public string? DefaultTimeoutAction { get; set; } = "escalate";
    public Dictionary<string, object>? NotificationTemplates { get; set; }
}

public class WorkflowInstanceDto
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; } = string.Empty;
    public string StartedById { get; set; } = string.Empty;
    public string StartedByName { get; set; } = string.Empty;
    public int? FormSubmissionId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CurrentStepId { get; set; } = string.Empty;
    public string CurrentStepName { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? LastActivityAt { get; set; }
    public string? FinalOutcome { get; set; }
    public Dictionary<string, object>? Variables { get; set; }
    public string? Comments { get; set; }
    public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
    public TimeSpan Duration => (CompletedAt ?? DateTime.UtcNow) - StartedAt;
}

public class TaskDto
{
    public int Id { get; set; }
    public int WorkflowInstanceId { get; set; }
    public string StepId { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public string AssignedToId { get; set; } = string.Empty;
    public string AssignedToName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Outcome { get; set; }
    public string? Comments { get; set; }
    public Dictionary<string, object>? Data { get; set; }
    public int Priority { get; set; }
    public bool IsUrgent { get; set; }
    public bool IsOverdue { get; set; }
    public TimeSpan Duration => (CompletedAt ?? DateTime.UtcNow) - AssignedAt;
}

public class CompleteTaskRequest
{
    [Required]
    public string Outcome { get; set; } = string.Empty;
    
    public string? Comments { get; set; }
    
    public Dictionary<string, object>? Data { get; set; }
}

public class ReassignTaskRequest
{
    [Required]
    public string NewAssigneeId { get; set; } = string.Empty;
    
    public string? Comments { get; set; }
}

public class WorkflowListRequest
{
    public string? Search { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsTemplate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}

public class WorkflowListResponse
{
    public List<WorkflowDto> Workflows { get; set; } = new List<WorkflowDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class InstanceListRequest
{
    public int? WorkflowId { get; set; }
    public string? Status { get; set; }
    public string? StartedBy { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}

public class InstanceListResponse
{
    public List<WorkflowInstanceDto> Instances { get; set; } = new List<WorkflowInstanceDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class TaskListRequest
{
    public string? Status { get; set; }
    public string? Type { get; set; }
    public string? AssignedTo { get; set; }
    public int? Priority { get; set; }
    public bool? IsUrgent { get; set; }
    public bool? IsOverdue { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}

public class TaskListResponse
{
    public List<TaskDto> Tasks { get; set; } = new List<TaskDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
} 