using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AscendumApp.Core.Interfaces;
using AscendumApp.Shared.DTOs;
using System.Security.Claims;

namespace AscendumApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _userService.LoginAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Email}", request.Email);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _userService.RegisterAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for user {Email}", request.Email);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _userService.RefreshTokenAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<bool>> Logout()
    {
        try
        {
            var result = await _userService.LogoutAsync(GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for user {UserId}", GetUserId());
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        try
        {
            var result = await _userService.GetUserByIdAsync(GetUserId());
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user {UserId}", GetUserId());
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var result = await _userService.UpdateProfileAsync(GetUserId(), request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile for user {UserId}", GetUserId());
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<bool>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var result = await _userService.ChangePasswordAsync(GetUserId(), request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user {UserId}", GetUserId());
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<bool>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            var result = await _userService.ForgotPasswordAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing forgot password for email {Email}", request.Email);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<bool>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var result = await _userService.ResetPasswordAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting password");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("verify-email")]
    public async Task<ActionResult<bool>> VerifyEmail([FromQuery] string token)
    {
        try
        {
            var result = await _userService.VerifyEmailAsync(token);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email");
            return BadRequest(new { message = ex.Message });
        }
    }
}