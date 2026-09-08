namespace MedGid.Domain.Entities.Specialty;

/// <summary>A medical specialty (e.g. Cardiology) used for filtering.</summary>
public class SpecialtyData
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    /// <summary>Name of the lucide-react icon rendered for this specialty.</summary>
    public string Icon { get; set; } = string.Empty;

    public int DoctorsCount { get; set; }
}
