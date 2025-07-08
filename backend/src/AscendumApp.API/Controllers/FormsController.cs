using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AscendumApp.Core.Interfaces;
using AscendumApp.Shared.DTOs;
using System.Security.Claims;

namespace AscendumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FormsController : ControllerBase
{
    private readonly IFormService _formService;
    private readonly ILogger<FormsController> _logger;

    public FormsController(IFormService formService, ILogger<FormsController> logger)
    {
        _formService = formService;
        _logger = logger;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

    [HttpPost]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<FormDto>> CreateForm([FromBody] CreateFormRequest request)
    {
        try
        {
            var result = await _formService.CreateFormAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating form");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<FormDto>> UpdateForm(int id, [FromBody] UpdateFormRequest request)
    {
        try
        {
            var result = await _formService.UpdateFormAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating form {FormId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> DeleteForm(int id)
    {
        try
        {
            var result = await _formService.DeleteFormAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting form {FormId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormDto>> GetForm(int id)
    {
        try
        {
            var result = await _formService.GetFormByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting form {FormId}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<FormListResponse>> GetForms([FromQuery] FormListRequest request)
    {
        try
        {
            var result = await _formService.GetFormsAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting forms");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<FormSubmissionDto>> SubmitForm(int id, [FromBody] SubmitFormRequest request)
    {
        try
        {
            request.FormId = id;
            var result = await _formService.SubmitFormAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting form {FormId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/publish")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> PublishForm(int id)
    {
        try
        {
            var result = await _formService.PublishFormAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing form {FormId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/unpublish")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> UnpublishForm(int id)
    {
        try
        {
            var result = await _formService.UnpublishFormAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unpublishing form {FormId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("templates")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<List<FormDto>>> GetFormTemplates()
    {
        try
        {
            var result = await _formService.GetFormTemplatesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting form templates");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("templates/{templateId}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<FormDto>> CreateFormFromTemplate(int templateId, [FromBody] CreateFormRequest request)
    {
        try
        {
            var result = await _formService.CreateFormFromTemplateAsync(templateId, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating form from template {TemplateId}", templateId);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("submissions")]
    public async Task<ActionResult<SubmissionListResponse>> GetSubmissions([FromQuery] SubmissionListRequest request)
    {
        try
        {
            var result = await _formService.GetSubmissionsAsync(request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting submissions");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("submissions/{id}")]
    public async Task<ActionResult<FormSubmissionDto>> GetSubmission(int id)
    {
        try
        {
            var result = await _formService.GetSubmissionByIdAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting submission {SubmissionId}", id);
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("submissions/{id}")]
    public async Task<ActionResult<FormSubmissionDto>> UpdateSubmission(int id, [FromBody] UpdateSubmissionRequest request)
    {
        try
        {
            var result = await _formService.UpdateSubmissionAsync(id, request, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating submission {SubmissionId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("submissions/{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<bool>> DeleteSubmission(int id)
    {
        try
        {
            var result = await _formService.DeleteSubmissionAsync(id, GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting submission {SubmissionId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
}