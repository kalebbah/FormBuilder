using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class Workflow
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public string WorkflowDefinition { get; set; } = string.Empty; // JSON definition
    
    public bool IsActive { get; set; } = true;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
    
    public string CreatedById { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public string? UpdatedById { get; set; }
    
    public int Version { get; set; } = 1;
    
    // Navigation properties
    public virtual User CreatedBy { get; set; } = null!;
    public virtual User? UpdatedBy { get; set; }
    public virtual ICollection<WorkflowInstance> Instances { get; set; } = new List<WorkflowInstance>();
    public virtual ICollection<Form> AssociatedForms { get; set; } = new List<Form>();
    
    // Helper methods for working with workflow definition
    public WorkflowDefinition? GetWorkflowDefinition()
    {
        try
        {
            return JsonConvert.DeserializeObject<WorkflowDefinition>(WorkflowDefinition);
        }
        catch
        {
            return null;
        }
    }
    
    public void SetWorkflowDefinition(WorkflowDefinition definition)
    {
        WorkflowDefinition = JsonConvert.SerializeObject(definition, Formatting.Indented);
    }
}

public class WorkflowDefinition
{
    public List<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    public List<WorkflowConnection> Connections { get; set; } = new List<WorkflowConnection>();
    public WorkflowSettings Settings { get; set; } = new WorkflowSettings();
    public Dictionary<string, object>? Variables { get; set; }
}

public class WorkflowStep
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // form, approval, notification, decision, etc.
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public Dictionary<string, object>? Properties { get; set; }
    public StepAssignment? Assignment { get; set; }
    public List<string>? Conditions { get; set; }
    public int? TimeoutHours { get; set; }
    public string? TimeoutAction { get; set; } // escalate, auto-approve, auto-reject
}

public class WorkflowConnection
{
    public string Id { get; set; } = string.Empty;
    public string FromStepId { get; set; } = string.Empty;
    public string ToStepId { get; set; } = string.Empty;
    public string? Condition { get; set; } // JSON expression for conditional routing
    public string? Label { get; set; }
}

public class StepAssignment
{
    public string Type { get; set; } = string.Empty; // user, role, group, dynamic
    public string? UserId { get; set; }
    public string? Role { get; set; }
    public string? GroupId { get; set; }
    public string? DynamicExpression { get; set; } // JSON expression for dynamic assignment
    public bool AllowReassignment { get; set; } = true;
    public bool RequireAllApprovers { get; set; } = false; // For multiple assignees
}

public class WorkflowSettings
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

public static class WorkflowStepTypes
{
    public const string Start = "start";
    public const string Form = "form";
    public const string Approval = "approval";
    public const string Notification = "notification";
    public const string Decision = "decision";
    public const string Parallel = "parallel";
    public const string Join = "join";
    public const string End = "end";
    
    public static readonly string[] AllTypes = { Start, Form, Approval, Notification, Decision, Parallel, Join, End };
    
    public static bool IsValidType(string type) => AllTypes.Contains(type);
    
    public static bool IsTerminalType(string type) => type is End;
    
    public static bool IsParallelType(string type) => type is Parallel or Join;
} 