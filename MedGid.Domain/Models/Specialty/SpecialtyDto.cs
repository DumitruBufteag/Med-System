namespace MedGid.Domain.Models.Specialty;

/// <summary>Mirrors the `Specialty` TypeScript interface.</summary>
public class SpecialtyDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int DoctorsCount { get; set; }
}
