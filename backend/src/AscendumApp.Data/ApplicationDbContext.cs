using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AscendumApp.Shared.Models;

namespace AscendumApp.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for our custom entities
    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<FormSubmission> FormSubmissions { get; set; }
    public DbSet<Workflow> Workflows { get; set; }
    public DbSet<WorkflowInstance> WorkflowInstances { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(450);
            entity.Property(e => e.UserName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(256).IsRequired();
            entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Role).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.UserName).IsUnique();
        });

        // Configure Form entity
        modelBuilder.Entity<Form>(entity =>
        {
            entity.ToTable("Forms");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FormDefinition).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedById).HasMaxLength(450).IsRequired();
            entity.Property(e => e.UpdatedById).HasMaxLength(450);
            
            entity.HasOne(e => e.CreatedBy)
                .WithMany(e => e.CreatedForms)
                .HasForeignKey(e => e.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.UpdatedBy)
                .WithMany()
                .HasForeignKey(e => e.UpdatedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.AssociatedWorkflow)
                .WithMany(e => e.AssociatedForms)
                .HasForeignKey(e => e.AssociatedWorkflowId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure FormSubmission entity
        modelBuilder.Entity<FormSubmission>(entity =>
        {
            entity.ToTable("FormSubmissions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FormData).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
            entity.Property(e => e.SubmittedById).HasMaxLength(450).IsRequired();
            entity.Property(e => e.UpdatedById).HasMaxLength(450);
            entity.Property(e => e.Comments).HasMaxLength(2000);
            entity.Property(e => e.Signature).HasMaxLength(10000); // Base64 signature
            
            entity.HasOne(e => e.Form)
                .WithMany(e => e.Submissions)
                .HasForeignKey(e => e.FormId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.SubmittedBy)
                .WithMany(e => e.FormSubmissions)
                .HasForeignKey(e => e.SubmittedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.UpdatedBy)
                .WithMany()
                .HasForeignKey(e => e.UpdatedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.WorkflowInstance)
                .WithOne(e => e.FormSubmission)
                .HasForeignKey<WorkflowInstance>(e => e.FormSubmissionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Workflow entity
        modelBuilder.Entity<Workflow>(entity =>
        {
            entity.ToTable("Workflows");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.WorkflowDefinition).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.CreatedById).HasMaxLength(450).IsRequired();
            entity.Property(e => e.UpdatedById).HasMaxLength(450);
            
            entity.HasOne(e => e.CreatedBy)
                .WithMany(e => e.CreatedWorkflows)
                .HasForeignKey(e => e.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.UpdatedBy)
                .WithMany()
                .HasForeignKey(e => e.UpdatedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure WorkflowInstance entity
        modelBuilder.Entity<WorkflowInstance>(entity =>
        {
            entity.ToTable("WorkflowInstances");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
            entity.Property(e => e.CurrentStepId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.StartedById).HasMaxLength(450).IsRequired();
            entity.Property(e => e.FinalOutcome).HasMaxLength(50);
            entity.Property(e => e.Comments).HasMaxLength(2000);
            
            entity.HasOne(e => e.Workflow)
                .WithMany(e => e.Instances)
                .HasForeignKey(e => e.WorkflowId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.StartedBy)
                .WithMany(e => e.StartedWorkflows)
                .HasForeignKey(e => e.StartedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Task entity
        modelBuilder.Entity<Task>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StepId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.AssignedToId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.Type).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Outcome).HasMaxLength(50);
            entity.Property(e => e.Comments).HasMaxLength(2000);
            
            entity.HasOne(e => e.WorkflowInstance)
                .WithMany(e => e.Tasks)
                .HasForeignKey(e => e.WorkflowInstanceId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.AssignedTo)
                .WithMany(e => e.AssignedTasks)
                .HasForeignKey(e => e.AssignedToId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure AuditLog entity
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLogs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).HasMaxLength(450).IsRequired();
            entity.Property(e => e.Action).HasMaxLength(100).IsRequired();
            entity.Property(e => e.EntityType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.EntityId).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.OldValues).HasMaxLength(10000);
            entity.Property(e => e.NewValues).HasMaxLength(10000);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.UserAgent).HasMaxLength(500);
            entity.Property(e => e.SessionId).HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.WorkflowInstance)
                .WithMany(e => e.AuditLogs)
                .HasForeignKey(e => e.WorkflowInstanceId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Task)
                .WithMany(e => e.AuditLogs)
                .HasForeignKey(e => e.TaskId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure indexes for better performance
        modelBuilder.Entity<Form>().HasIndex(e => e.Category);
        modelBuilder.Entity<Form>().HasIndex(e => e.IsActive);
        modelBuilder.Entity<Form>().HasIndex(e => e.CreatedAt);
        
        modelBuilder.Entity<FormSubmission>().HasIndex(e => e.FormId);
        modelBuilder.Entity<FormSubmission>().HasIndex(e => e.Status);
        modelBuilder.Entity<FormSubmission>().HasIndex(e => e.SubmittedById);
        modelBuilder.Entity<FormSubmission>().HasIndex(e => e.CreatedAt);
        
        modelBuilder.Entity<Workflow>().HasIndex(e => e.Category);
        modelBuilder.Entity<Workflow>().HasIndex(e => e.IsActive);
        modelBuilder.Entity<Workflow>().HasIndex(e => e.CreatedAt);
        
        modelBuilder.Entity<WorkflowInstance>().HasIndex(e => e.WorkflowId);
        modelBuilder.Entity<WorkflowInstance>().HasIndex(e => e.Status);
        modelBuilder.Entity<WorkflowInstance>().HasIndex(e => e.StartedById);
        modelBuilder.Entity<WorkflowInstance>().HasIndex(e => e.StartedAt);
        
        modelBuilder.Entity<Task>().HasIndex(e => e.WorkflowInstanceId);
        modelBuilder.Entity<Task>().HasIndex(e => e.AssignedToId);
        modelBuilder.Entity<Task>().HasIndex(e => e.Status);
        modelBuilder.Entity<Task>().HasIndex(e => e.Type);
        modelBuilder.Entity<Task>().HasIndex(e => e.AssignedAt);
        modelBuilder.Entity<Task>().HasIndex(e => e.DueDate);
        
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.UserId);
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.Action);
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.EntityType);
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.Timestamp);
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.WorkflowInstanceId);
        modelBuilder.Entity<AuditLog>().HasIndex(e => e.TaskId);
    }
} 