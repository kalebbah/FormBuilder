using System.ComponentModel.DataAnnotations;

namespace AscendumApp.Shared.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string UserName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    public string? PhoneNumber { get; set; }
    
    public string Role { get; set; } = UserRoles.User;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<FormSubmission> FormSubmissions { get; set; } = new List<FormSubmission>();
    public virtual ICollection<WorkflowInstance> StartedWorkflows { get; set; } = new List<WorkflowInstance>();
    public virtual ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
    public virtual ICollection<Form> CreatedForms { get; set; } = new List<Form>();
    public virtual ICollection<Workflow> CreatedWorkflows { get; set; } = new List<Workflow>();
}

public static class UserRoles
{
    public const string User = "User";
    public const string Admin = "Admin";
    public const string SuperAdmin = "SuperAdmin";
    
    public static readonly string[] AllRoles = { User, Admin, SuperAdmin };
    
    public static bool IsValidRole(string role) => AllRoles.Contains(role);
    
    public static int GetRoleLevel(string role) => role switch
    {
        User => 1,
        Admin => 2,
        SuperAdmin => 3,
        _ => 0
    };
    
    public static bool HasPermission(string userRole, string requiredRole)
    {
        return GetRoleLevel(userRole) >= GetRoleLevel(requiredRole);
    }
} 