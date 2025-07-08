using AscendumApp.Shared.Models;

namespace AscendumApp.Core.Interfaces;

public interface IAuditService
{
    Task LogActionAsync(string userId, string action, string entityType, string? entityId = null, string? description = null, object? oldValues = null, object? newValues = null, string? ipAddress = null, string? userAgent = null, string? sessionId = null, int? workflowInstanceId = null, int? taskId = null);
    Task<List<AuditLog>> GetAuditLogsAsync(string? userId = null, string? action = null, string? entityType = null, string? entityId = null, DateTime? fromDate = null, DateTime? toDate = null, int page = 1, int pageSize = 20);
    Task<List<AuditLog>> GetAuditLogsForEntityAsync(string entityType, string entityId, int page = 1, int pageSize = 20);
    Task<List<AuditLog>> GetAuditLogsForUserAsync(string userId, int page = 1, int pageSize = 20);
    Task<List<AuditLog>> GetAuditLogsForWorkflowInstanceAsync(int workflowInstanceId, int page = 1, int pageSize = 20);
    Task<List<AuditLog>> GetAuditLogsForTaskAsync(int taskId, int page = 1, int pageSize = 20);
    Task<int> GetAuditLogCountAsync(string? userId = null, string? action = null, string? entityType = null, string? entityId = null, DateTime? fromDate = null, DateTime? toDate = null);
    Task<bool> DeleteAuditLogsAsync(DateTime beforeDate);
    Task<bool> ExportAuditLogsAsync(DateTime fromDate, DateTime toDate, string filePath);
} 