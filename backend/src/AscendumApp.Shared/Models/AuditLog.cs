using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class AuditLog
{
    public int Id { get; set; }
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    public string UserId { get; set; } = string.Empty;
    
    public string Action { get; set; } = string.Empty;
    
    public string EntityType { get; set; } = string.Empty;
    
    public string? EntityId { get; set; }
    
    public string? Description { get; set; }
    
    public string? OldValues { get; set; } // JSON serialized old values
    
    public string? NewValues { get; set; } // JSON serialized new values
    
    public string? IpAddress { get; set; }
    
    public string? UserAgent { get; set; }
    
    public string? SessionId { get; set; }
    
    public int? WorkflowInstanceId { get; set; }
    
    public int? TaskId { get; set; }
    
    public Dictionary<string, object>? Metadata { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual WorkflowInstance? WorkflowInstance { get; set; }
    public virtual Task? Task { get; set; }
    
    // Helper methods
    public void SetOldValues<T>(T values)
    {
        OldValues = JsonConvert.SerializeObject(values, Formatting.Indented);
    }
    
    public void SetNewValues<T>(T values)
    {
        NewValues = JsonConvert.SerializeObject(values, Formatting.Indented);
    }
    
    public T? GetOldValues<T>()
    {
        if (string.IsNullOrEmpty(OldValues))
            return default;
        
        try
        {
            return JsonConvert.DeserializeObject<T>(OldValues);
        }
        catch
        {
            return default;
        }
    }
    
    public T? GetNewValues<T>()
    {
        if (string.IsNullOrEmpty(NewValues))
            return default;
        
        try
        {
            return JsonConvert.DeserializeObject<T>(NewValues);
        }
        catch
        {
            return default;
        }
    }
}

public static class AuditActions
{
    // User actions
    public const string Login = "Login";
    public const string Logout = "Logout";
    public const string PasswordChange = "PasswordChange";
    public const string ProfileUpdate = "ProfileUpdate";
    
    // Form actions
    public const string FormCreated = "FormCreated";
    public const string FormUpdated = "FormUpdated";
    public const string FormDeleted = "FormDeleted";
    public const string FormPublished = "FormPublished";
    public const string FormSubmission = "FormSubmission";
    public const string FormSubmissionUpdated = "FormSubmissionUpdated";
    
    // Workflow actions
    public const string WorkflowCreated = "WorkflowCreated";
    public const string WorkflowUpdated = "WorkflowUpdated";
    public const string WorkflowDeleted = "WorkflowDeleted";
    public const string WorkflowStarted = "WorkflowStarted";
    public const string WorkflowCompleted = "WorkflowCompleted";
    public const string WorkflowCancelled = "WorkflowCancelled";
    
    // Task actions
    public const string TaskAssigned = "TaskAssigned";
    public const string TaskCompleted = "TaskCompleted";
    public const string TaskReassigned = "TaskReassigned";
    public const string TaskCancelled = "TaskCancelled";
    
    // System actions
    public const string SystemError = "SystemError";
    public const string ConfigurationChange = "ConfigurationChange";
    public const string DataExport = "DataExport";
    public const string DataImport = "DataImport";
    
    public static readonly string[] AllActions = {
        Login, Logout, PasswordChange, ProfileUpdate,
        FormCreated, FormUpdated, FormDeleted, FormPublished, FormSubmission, FormSubmissionUpdated,
        WorkflowCreated, WorkflowUpdated, WorkflowDeleted, WorkflowStarted, WorkflowCompleted, WorkflowCancelled,
        TaskAssigned, TaskCompleted, TaskReassigned, TaskCancelled,
        SystemError, ConfigurationChange, DataExport, DataImport
    };
    
    public static bool IsValidAction(string action) => AllActions.Contains(action);
}

public static class EntityTypes
{
    public const string User = "User";
    public const string Form = "Form";
    public const string FormSubmission = "FormSubmission";
    public const string Workflow = "Workflow";
    public const string WorkflowInstance = "WorkflowInstance";
    public const string Task = "Task";
    public const string System = "System";
    
    public static readonly string[] AllTypes = { User, Form, FormSubmission, Workflow, WorkflowInstance, Task, System };
    
    public static bool IsValidType(string type) => AllTypes.Contains(type);
} 