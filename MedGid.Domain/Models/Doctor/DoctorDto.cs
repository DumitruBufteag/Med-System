using System.ComponentModel.DataAnnotations;

namespace MedGid.Domain.Models.Doctor;

/// <summary>Mirrors the `Doctor` TypeScript interface.</summary>
public class DoctorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SpecialtySlug { get; set; } = string.Empty;
    public Guid ClinicId { get; set; }
    public int YearsOfExperience { get; set; }
    public double Rating { get; set; }
    public string Initials { get; set; } = string.Empty;
}

/// <summary>Payload sent when an admin creates or edits a doctor.</summary>
public class DoctorInputDto
{
    [Required, MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string SpecialtySlug { get; set; } = string.Empty;

    [Required]
    public Guid ClinicId { get; set; }

    [Range(0, 70)]
    public int YearsOfExperience { get; set; }
}
