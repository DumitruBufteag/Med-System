using MedGid.Domain.Entities.Appointment;
using MedGid.Domain.Entities.Clinic;
using MedGid.Domain.Entities.Doctor;
using MedGid.Domain.Entities.Review;
using MedGid.Domain.Entities.Specialty;
using MedGid.Domain.Entities.User;
using MedGid.Domain.Models.Appointment;
using MedGid.Domain.Models.Clinic;
using MedGid.Domain.Models.Doctor;
using MedGid.Domain.Models.Review;
using MedGid.Domain.Models.Specialty;
using MedGid.Domain.Models.User;

namespace MedGid.BusinessLayer.Core;

/// <summary>
/// Entity to DTO projections. Kept in one place so the shape the client sees is
/// defined once — and so a password digest can never slip out with a user.
/// </summary>
internal static class CatalogMapping
{
    internal static UserDto ToDto(this UserData entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Email = entity.Email,
        Phone = entity.Phone,
        Avatar = entity.Avatar,
        Role = entity.Role,
        CreatedAt = entity.CreatedAt.ToString("o")
    };

    internal static WorkingHoursDto ToDto(this WorkingHoursData entity) => new()
    {
        Label = entity.Label,
        AlwaysOpen = entity.AlwaysOpen,
        Periods = entity.Periods
            .Select(period => new WorkingHoursPeriodDto
            {
                Days = period.Days,
                Start = period.Start,
                End = period.End
            })
            .ToList()
    };

    internal static ClinicDto ToDto(this ClinicData entity) => new()
    {
        Id = entity.Id,
        Slug = entity.Slug,
        Name = entity.Name,
        Type = entity.Type,
        City = entity.City,
        Address = entity.Address,
        Phone = entity.Phone,
        Website = entity.Website,
        Description = entity.Description,
        Rating = entity.Rating,
        ReviewsCount = entity.ReviewsCount,
        Specialties = entity.Specialties,
        ConsultationFrom = entity.ConsultationFrom,
        WorkingHours = entity.WorkingHours.ToDto(),
        HasEmergency = entity.HasEmergency,
        AcceptsInsurance = entity.AcceptsInsurance,
        BrandColor = entity.BrandColor,
        Initials = entity.Initials
    };

    internal static DoctorDto ToDto(this DoctorData entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        SpecialtySlug = entity.SpecialtySlug,
        ClinicId = entity.ClinicId,
        YearsOfExperience = entity.YearsOfExperience,
        Rating = entity.Rating,
        Initials = entity.Initials
    };

    internal static SpecialtyDto ToDto(this SpecialtyData entity) => new()
    {
        Id = entity.Id,
        Slug = entity.Slug,
        Name = entity.Name,
        Icon = entity.Icon,
        DoctorsCount = entity.DoctorsCount
    };

    internal static AppointmentDto ToDto(this AppointmentData entity) => new()
    {
        Id = entity.Id,
        PatientId = entity.PatientId,
        ClinicId = entity.ClinicId,
        DoctorId = entity.DoctorId,
        Date = entity.Date,
        Time = entity.Time,
        Status = entity.Status,
        Notes = entity.Notes
    };

    internal static ReviewDto ToDto(this ReviewData entity) => new()
    {
        Id = entity.Id,
        ClinicId = entity.ClinicId,
        AuthorName = entity.AuthorName,
        Rating = entity.Rating,
        Comment = entity.Comment,
        CreatedAt = entity.CreatedAt
    };
}
