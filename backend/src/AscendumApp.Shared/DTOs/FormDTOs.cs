using System.ComponentModel.DataAnnotations;

namespace AscendumApp.Shared.DTOs;

public class CreateFormRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public FormDefinitionDto FormDefinition { get; set; } = null!;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
    
    public int? AssociatedWorkflowId { get; set; }
}

public class UpdateFormRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public FormDefinitionDto FormDefinition { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    
    public bool IsTemplate { get; set; } = false;
    
    public string? Category { get; set; }
    
    public int? AssociatedWorkflowId { get; set; }
}

public class FormDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public FormDefinitionDto FormDefinition { get; set; } = null!;
    public bool IsActive { get; set; }
    public bool IsTemplate { get; set; }
    public string? Category { get; set; }
    public string CreatedById { get; set; } = string.Empty;
    public string CreatedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedByName { get; set; }
    public int? AssociatedWorkflowId { get; set; }
    public string? AssociatedWorkflowName { get; set; }
    public int SubmissionCount { get; set; }
}

public class FormDefinitionDto
{
    public List<FormFieldDto> Fields { get; set; } = new List<FormFieldDto>();
    public List<FormSectionDto> Sections { get; set; } = new List<FormSectionDto>();
    public List<ConditionalRuleDto> ConditionalRules { get; set; } = new List<ConditionalRuleDto>();
    public FormSettingsDto Settings { get; set; } = new FormSettingsDto();
}

public class FormFieldDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Placeholder { get; set; }
    public bool IsRequired { get; set; } = false;
    public string? DefaultValue { get; set; }
    public List<string>? Options { get; set; }
    public FieldValidationDto? Validation { get; set; }
    public Dictionary<string, object>? Properties { get; set; }
    public string? SectionId { get; set; }
    public int Order { get; set; }
}

public class FormSectionDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCollapsible { get; set; } = false;
    public bool IsCollapsed { get; set; } = false;
    public int Order { get; set; }
}

public class FieldValidationDto
{
    public string? MinValue { get; set; }
    public string? MaxValue { get; set; }
    public string? Pattern { get; set; }
    public string? CustomValidation { get; set; }
    public string? ErrorMessage { get; set; }
}

public class ConditionalRuleDto
{
    public string Id { get; set; } = string.Empty;
    public string TargetFieldId { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? Value { get; set; }
}

public class FormSettingsDto
{
    public bool AllowSaveDraft { get; set; } = true;
    public bool AllowEditAfterSubmit { get; set; } = false;
    public bool RequireSignature { get; set; } = false;
    public string? SubmitButtonText { get; set; } = "Submit";
    public string? SaveDraftButtonText { get; set; } = "Save Draft";
    public Dictionary<string, object>? Theme { get; set; }
}

public class SubmitFormRequest
{
    public int FormId { get; set; }
    public Dictionary<string, object> FormData { get; set; } = new Dictionary<string, object>();
    public string? Comments { get; set; }
    public string? Signature { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public class UpdateSubmissionRequest
{
    public Dictionary<string, object> FormData { get; set; } = new Dictionary<string, object>();
    public string? Comments { get; set; }
    public string? Signature { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public class FormSubmissionDto
{
    public int Id { get; set; }
    public int FormId { get; set; }
    public string FormTitle { get; set; } = string.Empty;
    public string SubmittedById { get; set; } = string.Empty;
    public string SubmittedByName { get; set; } = string.Empty;
    public Dictionary<string, object> FormData { get; set; } = new Dictionary<string, object>();
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedByName { get; set; }
    public string? Comments { get; set; }
    public string? Signature { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    public int? WorkflowInstanceId { get; set; }
    public string? WorkflowStatus { get; set; }
}

public class FormListRequest
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

public class FormListResponse
{
    public List<FormDto> Forms { get; set; } = new List<FormDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class SubmissionListRequest
{
    public int? FormId { get; set; }
    public string? Status { get; set; }
    public string? SubmittedBy { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}

public class SubmissionListResponse
{
    public List<FormSubmissionDto> Submissions { get; set; } = new List<FormSubmissionDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
} 