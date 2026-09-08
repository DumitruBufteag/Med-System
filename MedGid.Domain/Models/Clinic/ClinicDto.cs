namespace MedGid.Domain.Models.Clinic;

/// <summary>Mirrors the `WorkingHoursPeriod` TypeScript interface.</summary>
public class WorkingHoursPeriodDto
{
    public List<int> Days { get; set; } = new();
    public string Start { get; set; } = string.Empty;
    public string End { get; set; } = string.Empty;
}

/// <summary>Mirrors the `WorkingHours` TypeScript interface.</summary>
public class WorkingHoursDto
{
    public string Label { get; set; } = string.Empty;
    public bool AlwaysOpen { get; set; }
    public List<WorkingHoursPeriodDto> Periods { get; set; } = new();
}

/// <summary>Mirrors the `Clinic` TypeScript interface.</summary>
public class ClinicDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Description { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int ReviewsCount { get; set; }
    public List<string> Specialties { get; set; } = new();
    public decimal ConsultationFrom { get; set; }
    public WorkingHoursDto WorkingHours { get; set; } = new();
    public bool HasEmergency { get; set; }
    public bool AcceptsInsurance { get; set; }
    public string BrandColor { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
}
