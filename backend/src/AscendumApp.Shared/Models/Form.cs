using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AscendumApp.Shared.Models;

public class Form
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public string FormDefinition { get; set; } = string.Empty; // JSON schema
    
    public bool IsActive { get; set; } = true;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
    
    public string CreatedById { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public string? UpdatedById { get; set; }
    
    public int? AssociatedWorkflowId { get; set; }
    
    // Navigation properties
    public virtual User CreatedBy { get; set; } = null!;
    public virtual User? UpdatedBy { get; set; }
    public virtual Workflow? AssociatedWorkflow { get; set; }
    public virtual ICollection<FormSubmission> Submissions { get; set; } = new List<FormSubmission>();
    
    // Helper methods for working with form definition
    public FormDefinition? GetFormDefinition()
    {
        try
        {
            return JsonConvert.DeserializeObject<FormDefinition>(FormDefinition);
        }
        catch
        {
            return null;
        }
    }
    
    public void SetFormDefinition(FormDefinition definition)
    {
        FormDefinition = JsonConvert.SerializeObject(definition, Formatting.Indented);
    }
}

public class FormDefinition
{
    public List<FormField> Fields { get; set; } = new List<FormField>();
    public List<FormSection> Sections { get; set; } = new List<FormSection>();
    public List<ConditionalRule> ConditionalRules { get; set; } = new List<ConditionalRule>();
    public FormSettings Settings { get; set; } = new FormSettings();
}

public class FormField
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // text, number, date, dropdown, checkbox, etc.
    public string Label { get; set; } = string.Empty;
    public string? Placeholder { get; set; }
    public bool IsRequired { get; set; } = false;
    public string? DefaultValue { get; set; }
    public List<string>? Options { get; set; } // For dropdown, radio, checkbox groups
    public FieldValidation? Validation { get; set; }
    public Dictionary<string, object>? Properties { get; set; } // Additional field-specific properties
    public string? SectionId { get; set; }
    public int Order { get; set; }
}

public class FormSection
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCollapsible { get; set; } = false;
    public bool IsCollapsed { get; set; } = false;
    public int Order { get; set; }
}

public class FieldValidation
{
    public string? MinValue { get; set; }
    public string? MaxValue { get; set; }
    public string? Pattern { get; set; }
    public string? CustomValidation { get; set; }
    public string? ErrorMessage { get; set; }
}

public class ConditionalRule
{
    public string Id { get; set; } = string.Empty;
    public string TargetFieldId { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty; // JSON expression
    public string Action { get; set; } = string.Empty; // show, hide, enable, disable
    public string? Value { get; set; }
}

public class FormSettings
{
    public bool AllowSaveDraft { get; set; } = true;
    public bool AllowEditAfterSubmit { get; set; } = false;
    public bool RequireSignature { get; set; } = false;
    public string? SubmitButtonText { get; set; } = "Submit";
    public string? SaveDraftButtonText { get; set; } = "Save Draft";
    public Dictionary<string, object>? Theme { get; set; }
} 