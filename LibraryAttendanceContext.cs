using Microsoft.EntityFrameworkCore;
using LibraryAttendanceSystem.Models;

namespace LibraryAttendanceSystem.Data
{
    public class LibraryAttendanceContext : DbContext
    {
        public LibraryAttendanceContext(DbContextOptions<LibraryAttendanceContext> options)
            : base(options)
        {
        }

        public DbSet<Attendance> Attendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Attendance entity
            modelBuilder.Entity<Attendance>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.VisitorName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.VisitorId)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.Purpose)
                .HasMaxLength(200);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.CheckInTime)
                .IsRequired();

            // Create index for faster searches
            modelBuilder.Entity<Attendance>()
                .HasIndex(a => a.VisitorId);

            modelBuilder.Entity<Attendance>()
                .HasIndex(a => a.CheckInTime);
        }
    }
}