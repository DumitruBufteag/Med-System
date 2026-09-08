namespace MedGid.Domain.Entities.Clinic;

/// <summary>A private clinic or hospital listed in the catalogue.</summary>
public class ClinicData
{
    public Guid Id { get; set; }

    /// <summary>Stable slug used in URLs and filters.</summary>
    public string Slug { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    /// <summary>One of: hospital, medical_center, specialized_clinic, laboratory.</summary>
    public string Type { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Description { get; set; } = string.Empty;

    public double Rating { get; set; }
    public int ReviewsCount { get; set; }

    /// <summary>Specialty slugs offered by this clinic.</summary>
    public List<string> Specialties { get; set; } = new();

    /// <summary>Lowest consultation price, in MDL.</summary>
    public decimal ConsultationFrom { get; set; }

    public WorkingHoursData WorkingHours { get; set; } = new();

    public bool HasEmergency { get; set; }
    public bool AcceptsInsurance { get; set; }

    /// <summary>Brand colour used behind the logo and on the cover.</summary>
    public string BrandColor { get; set; } = "#0f766e";

    public string Initials { get; set; } = string.Empty;
}
