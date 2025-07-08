using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AscendumApp.Core.Interfaces;
using AscendumApp.Shared.DTOs;
using System.Security.Claims;

namespace AscendumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly IWorkflowService _workflowService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(IWorkflowService workflowService, ILogger<TasksController> logger)
    {
        _workflowService = workflowService;
        _logger = logger;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

    [HttpGet]
    public async Task<ActionResult<TaskListResponse>> GetTasks([FromQuery] TaskListRequest request)
    {
        try
        {
            var result = await _workflowService.GetTasksAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tasks");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        try
        {
            var result = await _workflowService.GetTaskByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting task {TaskId}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<bool>> CompleteTask(int id, [FromBody] CompleteTaskRequest request)
    {
        try
        {
            var result = await _workflowService.CompleteTaskAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing task {TaskId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/reassign")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> ReassignTask(int id, [FromBody] ReassignTaskRequest request)
    {
        try
        {
            var result = await _workflowService.ReassignTaskAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reassigning task {TaskId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-tasks")]
    public async Task<ActionResult<TaskListResponse>> GetMyTasks([FromQuery] TaskListRequest request)
    {
        try
        {
            // Override the request to only get tasks for the current user
            request.AssignedTo = GetUserId();
            var result = await _workflowService.GetTasksAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting my tasks");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("pending")]
    public async Task<ActionResult<TaskListResponse>> GetPendingTasks([FromQuery] TaskListRequest request)
    {
        try
        {
            request.Status = "Pending";
            var result = await _workflowService.GetTasksAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending tasks");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("urgent")]
    public async Task<ActionResult<TaskListResponse>> GetUrgentTasks([FromQuery] TaskListRequest request)
    {
        try
        {
            request.IsUrgent = true;
            var result = await _workflowService.GetTasksAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting urgent tasks");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("overdue")]
    public async Task<ActionResult<TaskListResponse>> GetOverdueTasks([FromQuery] TaskListRequest request)
    {
        try
        {
            request.IsOverdue = true;
            var result = await _workflowService.GetTasksAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting overdue tasks");
            return BadRequest(new { message = ex.Message });
        }
    }
}