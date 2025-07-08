using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class Task
{
    public int Id { get; set; }
    
    public int WorkflowInstanceId { get; set; }
    
    public string StepId { get; set; } = string.Empty;
    
    public string AssignedToId { get; set; } = string.Empty;
    
    public string Type { get; set; } = string.Empty; // form, approval, review, etc.
    
    public string Status { get; set; } = TaskStatus.Pending;
    
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public DateTime? DueDate { get; set; }
    
    public string? Outcome { get; set; } // approved, rejected, completed, etc.
    
    public string? Comments { get; set; }
    
    public Dictionary<string, object>? Data { get; set; } // Task-specific data
    
    public int Priority { get; set; } = 1; // 1=Low, 2=Medium, 3=High, 4=Urgent
    
    public bool IsUrgent => Priority >= 4;
    
    public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status == TaskStatus.Pending;
    
    // Navigation properties
    public virtual WorkflowInstance WorkflowInstance { get; set; } = null!;
    public virtual User AssignedTo { get; set; } = null!;
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    
    // Helper methods
    public bool IsCompleted => Status == TaskStatus.Completed;
    
    public bool IsPending => Status == TaskStatus.Pending;
    
    public TimeSpan GetDuration()
    {
        var endTime = CompletedAt ?? DateTime.UtcNow;
        return endTime - AssignedAt;
    }
    
    public void Complete(string outcome, string? comments = null)
    {
        Status = TaskStatus.Completed;
        Outcome = outcome;
        Comments = comments;
        CompletedAt = DateTime.UtcNow;
    }
    
    public void Reassign(string newAssigneeId)
    {
        AssignedToId = newAssigneeId;
        AssignedAt = DateTime.UtcNow;
        Status = TaskStatus.Pending;
        Outcome = null;
        CompletedAt = null;
    }
    
    public T? GetData<T>(string key)
    {
        if (Data != null && Data.ContainsKey(key))
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(Data[key]));
            }
            catch
            {
                return default;
            }
        }
        return default;
    }
    
    public void SetData<T>(string key, T value)
    {
        Data ??= new Dictionary<string, object>();
        Data[key] = value!;
    }
}

public static class TaskStatus
{
    public const string Pending = "Pending";
    public const string InProgress = "InProgress";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
    public const string Deferred = "Deferred";
    
    public static readonly string[] AllStatuses = { Pending, InProgress, Completed, Cancelled, Deferred };
    
    public static bool IsValidStatus(string status) => AllStatuses.Contains(status);
    
    public static bool IsFinalStatus(string status) => status is Completed or Cancelled;
}

public static class TaskTypes
{
    public const string Form = "form";
    public const string Approval = "approval";
    public const string Review = "review";
    public const string Notification = "notification";
    public const string Decision = "decision";
    
    public static readonly string[] AllTypes = { Form, Approval, Review, Notification, Decision };
    
    public static bool IsValidType(string type) => AllTypes.Contains(type);
}

public static class TaskOutcomes
{
    public const string Approved = "approved";
    public const string Rejected = "rejected";
    public const string Completed = "completed";
    public const string Cancelled = "cancelled";
    public const string Deferred = "deferred";
    
    public static readonly string[] AllOutcomes = { Approved, Rejected, Completed, Cancelled, Deferred };
    
    public static bool IsValidOutcome(string outcome) => AllOutcomes.Contains(outcome);
} 