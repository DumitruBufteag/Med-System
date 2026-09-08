namespace MedGid.Domain.Entities.Doctor;

/// <summary>A doctor working at one of the listed clinics.</summary>
public class DoctorData
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SpecialtySlug { get; set; } = string.Empty;
    public Guid ClinicId { get; set; }
    public int YearsOfExperience { get; set; }
    public double Rating { get; set; }
    public string Initials { get; set; } = string.Empty;
}
