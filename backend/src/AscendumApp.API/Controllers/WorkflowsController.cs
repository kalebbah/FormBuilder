using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AscendumApp.Core.Interfaces;
using AscendumApp.Shared.DTOs;
using System.Security.Claims;

namespace AscendumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkflowsController : ControllerBase
{
    private readonly IWorkflowService _workflowService;
    private readonly ILogger<WorkflowsController> _logger;

    public WorkflowsController(IWorkflowService workflowService, ILogger<WorkflowsController> logger)
    {
        _workflowService = workflowService;
        _logger = logger;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

    [HttpPost]
    [Authorize(Policy = "RequireSuperAdminRole")]
    public async Task<ActionResult<WorkflowDto>> CreateWorkflow([FromBody] CreateWorkflowRequest request)
    {
        try
        {
            var result = await _workflowService.CreateWorkflowAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workflow");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireSuperAdminRole")]
    public async Task<ActionResult<WorkflowDto>> UpdateWorkflow(int id, [FromBody] UpdateWorkflowRequest request)
    {
        try
        {
            var result = await _workflowService.UpdateWorkflowAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating workflow {WorkflowId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireSuperAdminRole")]
    public async Task<ActionResult<bool>> DeleteWorkflow(int id)
    {
        try
        {
            var result = await _workflowService.DeleteWorkflowAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting workflow {WorkflowId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkflowDto>> GetWorkflow(int id)
    {
        try
        {
            var result = await _workflowService.GetWorkflowByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workflow {WorkflowId}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<WorkflowListResponse>> GetWorkflows([FromQuery] WorkflowListRequest request)
    {
        try
        {
            var result = await _workflowService.GetWorkflowsAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workflows");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/start")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<WorkflowInstanceDto>> StartWorkflow(int id, [FromBody] StartWorkflowRequest request)
    {
        try
        {
            var result = await _workflowService.StartWorkflowAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting workflow {WorkflowId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("instances")]
    public async Task<ActionResult<InstanceListResponse>> GetWorkflowInstances([FromQuery] InstanceListRequest request)
    {
        try
        {
            var result = await _workflowService.GetWorkflowInstancesAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workflow instances");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("instances/{id}")]
    public async Task<ActionResult<WorkflowInstanceDto>> GetWorkflowInstance(int id)
    {
        try
        {
            var result = await _workflowService.GetWorkflowInstanceByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workflow instance {InstanceId}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("instances/{id}/cancel")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> CancelWorkflowInstance(int id)
    {
        try
        {
            var result = await _workflowService.CancelWorkflowInstanceAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling workflow instance {InstanceId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("templates")]
    [Authorize(Policy = "RequireSuperAdminRole")]
    public async Task<ActionResult<List<WorkflowDto>>> GetWorkflowTemplates()
    {
        try
        {
            var result = await _workflowService.GetWorkflowTemplatesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting workflow templates");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("templates/{templateId}")]
    [Authorize(Policy = "RequireSuperAdminRole")]
    public async Task<ActionResult<WorkflowDto>> CreateWorkflowFromTemplate(int templateId, [FromBody] CreateWorkflowRequest request)
    {
        try
        {
            var result = await _workflowService.CreateWorkflowFromTemplateAsync(templateId, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workflow from template {TemplateId}", templateId);
            return BadRequest(new { message = ex.Message });
        }
    }
}