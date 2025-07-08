using AscendumApp.Shared.DTOs;
using AscendumApp.Shared.Models;

namespace AscendumApp.Core.Interfaces;

public interface IFormService
{
    Task<FormDto> CreateFormAsync(CreateFormRequest request, string userId);
    Task<FormDto> UpdateFormAsync(int formId, UpdateFormRequest request, string userId);
    Task<bool> DeleteFormAsync(int formId, string userId);
    Task<FormDto> GetFormByIdAsync(int formId);
    Task<FormDto> GetFormByIdAsync(int formId, string userId);
    Task<FormListResponse> GetFormsAsync(FormListRequest request, string userId);
    Task<FormSubmissionDto> SubmitFormAsync(SubmitFormRequest request, string userId);
    Task<FormSubmissionDto> UpdateSubmissionAsync(int submissionId, UpdateSubmissionRequest request, string userId);
    Task<FormSubmissionDto> GetSubmissionByIdAsync(int submissionId, string userId);
    Task<SubmissionListResponse> GetSubmissionsAsync(SubmissionListRequest request, string userId);
    Task<bool> DeleteSubmissionAsync(int submissionId, string userId);
    Task<List<FormDto>> GetFormTemplatesAsync();
    Task<FormDto> CreateFormFromTemplateAsync(int templateId, CreateFormRequest request, string userId);
    Task<bool> PublishFormAsync(int formId, string userId);
    Task<bool> UnpublishFormAsync(int formId, string userId);
    Task<bool> ValidateFormDataAsync(int formId, Dictionary<string, object> formData);
    Task<Dictionary<string, object>> GetFormDataAsync(int submissionId);
} 