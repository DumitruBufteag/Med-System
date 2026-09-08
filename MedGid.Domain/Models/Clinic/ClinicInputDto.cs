using System.ComponentModel.DataAnnotations;

namespace MedGid.Domain.Models.Clinic;

/// <summary>Simplified weekly schedule captured by the admin clinic form.</summary>
public class ClinicScheduleDto
{
    public bool AlwaysOpen { get; set; }
    public string WeekdayStart { get; set; } = "08:00";
    public string WeekdayEnd { get; set; } = "18:00";
    public bool SaturdayEnabled { get; set; }
    public string SaturdayStart { get; set; } = "09:00";
    public string SaturdayEnd { get; set; } = "14:00";
}

/// <summary>Payload required to create or fully replace a clinic from the admin panel.</summary>
public class ClinicInputDto
{
    [Required, MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;

    public string? Website { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [Range(0, 100000)]
    public decimal ConsultationFrom { get; set; }

    public bool HasEmergency { get; set; }
    public bool AcceptsInsurance { get; set; }

    /// <summary>Specialty slugs offered by this clinic.</summary>
    public List<string> Specialties { get; set; } = new();

    public string BrandColor { get; set; } = "#0f766e";

    public ClinicScheduleDto Schedule { get; set; } = new();
}
