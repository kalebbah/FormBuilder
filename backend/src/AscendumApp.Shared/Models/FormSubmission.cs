using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class FormSubmission
{
    public int Id { get; set; }
    
    public int FormId { get; set; }
    
    public string SubmittedById { get; set; } = string.Empty;
    
    [Required]
    public string FormData { get; set; } = string.Empty; // JSON data
    
    public string Status { get; set; } = SubmissionStatus.Draft;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? SubmittedAt { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
    
    public string? UpdatedById { get; set; }
    
    public string? Comments { get; set; }
    
    public string? Signature { get; set; } // Base64 encoded signature image
    
    public Dictionary<string, object>? Metadata { get; set; } // Additional submission metadata
    
    // Navigation properties
    public virtual Form Form { get; set; } = null!;
    public virtual User SubmittedBy { get; set; } = null!;
    public virtual User? UpdatedBy { get; set; }
    public virtual WorkflowInstance? WorkflowInstance { get; set; }
    
    // Helper methods for working with form data
    public Dictionary<string, object>? GetFormData()
    {
        try
        {
            return JsonConvert.DeserializeObject<Dictionary<string, object>>(FormData);
        }
        catch
        {
            return null;
        }
    }
    
    public void SetFormData(Dictionary<string, object> data)
    {
        FormData = JsonConvert.SerializeObject(data, Formatting.Indented);
    }
    
    public T? GetFieldValue<T>(string fieldId)
    {
        var data = GetFormData();
        if (data != null && data.ContainsKey(fieldId))
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(data[fieldId]));
            }
            catch
            {
                return default;
            }
        }
        return default;
    }
    
    public void SetFieldValue<T>(string fieldId, T value)
    {
        var data = GetFormData() ?? new Dictionary<string, object>();
        data[fieldId] = value!;
        SetFormData(data);
    }
}

public static class SubmissionStatus
{
    public const string Draft = "Draft";
    public const string Submitted = "Submitted";
    public const string InProgress = "InProgress";
    public const string Approved = "Approved";
    public const string Rejected = "Rejected";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
    
    public static readonly string[] AllStatuses = { Draft, Submitted, InProgress, Approved, Rejected, Completed, Cancelled };
    
    public static bool IsValidStatus(string status) => AllStatuses.Contains(status);
    
    public static bool IsFinalStatus(string status) => status is Approved or Rejected or Completed or Cancelled;
} 