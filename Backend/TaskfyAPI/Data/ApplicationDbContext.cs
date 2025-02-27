using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Task = Backend.Models.Task;

namespace Backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Task> Tasks { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<ResetPasswordToken> ResetPasswordTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.UserId).IsRequired();
            entity.Property(t => t.Description).IsRequired().HasMaxLength(100);
            entity.Property(t => t.IsCompleted).IsRequired();
            entity.Property(t => t.Active).IsRequired();
            entity.Property(t => t.Order).IsRequired();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(255);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.HasOne(t => t.User)
                .WithMany(t => t.RefreshTokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(t => t.Token).HasMaxLength(255);
        });
        
        modelBuilder.Entity<ResetPasswordToken>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.HasOne(t => t.User)
                .WithMany(t => t.ResetPasswordTokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(t => t.Token).HasMaxLength(255);
        });
    }
}