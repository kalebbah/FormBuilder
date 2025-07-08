using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class WorkflowInstance
{
    public int Id { get; set; }
    
    public int WorkflowId { get; set; }
    
    public string StartedById { get; set; } = string.Empty;
    
    public int? FormSubmissionId { get; set; }
    
    public string Status { get; set; } = InstanceStatus.Active;
    
    public string CurrentStepId { get; set; } = string.Empty;
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public DateTime? LastActivityAt { get; set; }
    
    public string? FinalOutcome { get; set; } // approved, rejected, cancelled, etc.
    
    public Dictionary<string, object>? Variables { get; set; } // Runtime variables
    
    public string? Comments { get; set; }
    
    // Navigation properties
    public virtual Workflow Workflow { get; set; } = null!;
    public virtual User StartedBy { get; set; } = null!;
    public virtual FormSubmission? FormSubmission { get; set; }
    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    
    // Helper methods
    public bool IsActive => Status == InstanceStatus.Active;
    
    public bool IsCompleted => Status == InstanceStatus.Completed;
    
    public TimeSpan GetDuration()
    {
        var endTime = CompletedAt ?? DateTime.UtcNow;
        return endTime - StartedAt;
    }
    
    public void UpdateLastActivity()
    {
        LastActivityAt = DateTime.UtcNow;
    }
    
    public void SetVariable(string key, object value)
    {
        Variables ??= new Dictionary<string, object>();
        Variables[key] = value;
    }
    
    public T? GetVariable<T>(string key)
    {
        if (Variables != null && Variables.ContainsKey(key))
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(Variables[key]));
            }
            catch
            {
                return default;
            }
        }
        return default;
    }
}

public static class InstanceStatus
{
    public const string Active = "Active";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
    public const string Suspended = "Suspended";
    public const string Error = "Error";
    
    public static readonly string[] AllStatuses = { Active, Completed, Cancelled, Suspended, Error };
    
    public static bool IsValidStatus(string status) => AllStatuses.Contains(status);
    
    public static bool IsFinalStatus(string status) => status is Completed or Cancelled or Error;
} 