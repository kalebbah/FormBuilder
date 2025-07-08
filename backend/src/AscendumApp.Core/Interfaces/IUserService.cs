using AscendumApp.Shared.DTOs;
using AscendumApp.Shared.Models;

namespace AscendumApp.Core.Interfaces;

public interface IUserService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> RefreshTokenAsync(string refreshToken);
    Task<bool> RegisterAsync(RegisterRequest request);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
    Task<UserDto> GetUserByIdAsync(string userId);
    Task<UserDto> GetUserByEmailAsync(string email);
    Task<UserDto> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    Task<bool> CreateUserAsync(CreateUserRequest request);
    Task<bool> UpdateUserAsync(string userId, UpdateUserRequest request);
    Task<bool> DeleteUserAsync(string userId);
    Task<List<UserDto>> GetUsersAsync(int page = 1, int pageSize = 20, string? search = null, string? role = null);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AddToRoleAsync(string userId, string role);
    Task<bool> RemoveFromRoleAsync(string userId, string role);
    Task<List<string>> GetUserRolesAsync(string userId);
    Task LogoutAsync(string userId);
} 