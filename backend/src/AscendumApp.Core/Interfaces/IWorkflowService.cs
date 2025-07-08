using AscendumApp.Shared.DTOs;
using AscendumApp.Shared.Models;

namespace AscendumApp.Core.Interfaces;

public interface IWorkflowService
{
    Task<WorkflowDto> CreateWorkflowAsync(CreateWorkflowRequest request, string userId);
    Task<WorkflowDto> UpdateWorkflowAsync(int workflowId, UpdateWorkflowRequest request, string userId);
    Task<bool> DeleteWorkflowAsync(int workflowId, string userId);
    Task<WorkflowDto> GetWorkflowByIdAsync(int workflowId);
    Task<WorkflowListResponse> GetWorkflowsAsync(WorkflowListRequest request, string userId);
    Task<WorkflowInstanceDto> StartWorkflowAsync(int workflowId, string userId, int? formSubmissionId = null);
    Task<WorkflowInstanceDto> GetWorkflowInstanceByIdAsync(int instanceId, string userId);
    Task<InstanceListResponse> GetWorkflowInstancesAsync(InstanceListRequest request, string userId);
    Task<bool> CancelWorkflowInstanceAsync(int instanceId, string userId);
    Task<TaskDto> GetTaskByIdAsync(int taskId, string userId);
    Task<TaskListResponse> GetTasksAsync(TaskListRequest request, string userId);
    Task<TaskDto> CompleteTaskAsync(int taskId, CompleteTaskRequest request, string userId);
    Task<TaskDto> ReassignTaskAsync(int taskId, ReassignTaskRequest request, string userId);
    Task<bool> CancelTaskAsync(int taskId, string userId);
    Task<List<WorkflowDto>> GetWorkflowTemplatesAsync();
    Task<WorkflowDto> CreateWorkflowFromTemplateAsync(int templateId, CreateWorkflowRequest request, string userId);
    Task<bool> PublishWorkflowAsync(int workflowId, string userId);
    Task<bool> UnpublishWorkflowAsync(int workflowId, string userId);
    Task<WorkflowInstanceDto> GetWorkflowInstanceBySubmissionAsync(int formSubmissionId);
    Task<bool> ProcessWorkflowStepAsync(int instanceId, string stepId);
} 