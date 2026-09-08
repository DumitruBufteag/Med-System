using System.Text.Json;
using MedGid.Domain.Entities.Appointment;
using MedGid.Domain.Entities.Clinic;
using MedGid.Domain.Entities.Doctor;
using MedGid.Domain.Entities.Review;
using MedGid.Domain.Entities.Specialty;
using MedGid.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MedGid.DataAccess.Context;

public class MedGidDbContext : DbContext
{
    public MedGidDbContext()
    {
    }

    public MedGidDbContext(DbContextOptions<MedGidDbContext> options) : base(options)
    {
    }

    public DbSet<UserData> Users => Set<UserData>();
    public DbSet<ClinicData> Clinics => Set<ClinicData>();
    public DbSet<DoctorData> Doctors => Set<DoctorData>();
    public DbSet<SpecialtyData> Specialties => Set<SpecialtyData>();
    public DbSet<AppointmentData> Appointments => Set<AppointmentData>();
    public DbSet<ReviewData> Reviews => Set<ReviewData>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(DbSession.ConnectionString))
        {
            throw new InvalidOperationException(
                "DbSession.ConnectionString has not been set. The API sets it at startup from 'ConnectionStrings:DefaultConnection'.");
        }

        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Opening hours are a small, always-read-together document, so they live
        // in a single jsonb column instead of two extra tables.
        var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

        var workingHoursComparer = new ValueComparer<WorkingHoursData>(
            (left, right) => JsonSerializer.Serialize(left, jsonOptions) == JsonSerializer.Serialize(right, jsonOptions),
            value => JsonSerializer.Serialize(value, jsonOptions).GetHashCode(),
            value => JsonSerializer.Deserialize<WorkingHoursData>(JsonSerializer.Serialize(value, jsonOptions), jsonOptions)!);

        modelBuilder.Entity<UserData>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(120);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(180);
            entity.Property(x => x.Role).IsRequired().HasMaxLength(20);
            entity.Property(x => x.PasswordHash).IsRequired();
            // One account per address — the login lookup relies on it.
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<ClinicData>(entity =>
        {
            entity.ToTable("clinics");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Slug).IsRequired().HasMaxLength(140);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(180);
            entity.Property(x => x.Type).IsRequired().HasMaxLength(40);
            entity.Property(x => x.City).IsRequired().HasMaxLength(80);
            entity.Property(x => x.ConsultationFrom).HasPrecision(10, 2);
            entity.Property(x => x.BrandColor).HasMaxLength(20);
            entity.Property(x => x.Initials).HasMaxLength(4);
            entity.HasIndex(x => x.Slug).IsUnique();

            entity.Property(x => x.Specialties)
                .HasColumnType("text[]");

            entity.Property(x => x.WorkingHours)
                .HasColumnType("jsonb")
                .HasConversion(
                    value => JsonSerializer.Serialize(value, jsonOptions),
                    value => JsonSerializer.Deserialize<WorkingHoursData>(value, jsonOptions) ?? new WorkingHoursData())
                .Metadata.SetValueComparer(workingHoursComparer);
        });

        modelBuilder.Entity<DoctorData>(entity =>
        {
            entity.ToTable("doctors");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(160);
            entity.Property(x => x.SpecialtySlug).IsRequired().HasMaxLength(80);
            entity.Property(x => x.Initials).HasMaxLength(4);
            entity.HasIndex(x => x.ClinicId);

            // Removing a clinic must not leave its doctors pointing at nothing.
            entity.HasOne<ClinicData>()
                .WithMany()
                .HasForeignKey(x => x.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SpecialtyData>(entity =>
        {
            entity.ToTable("specialties");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Slug).IsRequired().HasMaxLength(80);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(120);
            entity.Property(x => x.Icon).HasMaxLength(60);
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<AppointmentData>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Date).IsRequired().HasMaxLength(10);
            entity.Property(x => x.Time).IsRequired().HasMaxLength(5);
            entity.Property(x => x.Status).IsRequired().HasMaxLength(20);
            entity.HasIndex(x => x.PatientId);
            // getTakenSlots reads exactly this pair on every step of the booking form.
            entity.HasIndex(x => new { x.DoctorId, x.Date });

            entity.HasOne<UserData>()
                .WithMany()
                .HasForeignKey(x => x.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ReviewData>(entity =>
        {
            entity.ToTable("reviews");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.AuthorName).IsRequired().HasMaxLength(120);
            entity.Property(x => x.Comment).IsRequired();
            entity.Property(x => x.CreatedAt).HasMaxLength(10);
            entity.HasIndex(x => x.ClinicId);

            entity.HasOne<ClinicData>()
                .WithMany()
                .HasForeignKey(x => x.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        base.OnModelCreating(modelBuilder);
    }
}
