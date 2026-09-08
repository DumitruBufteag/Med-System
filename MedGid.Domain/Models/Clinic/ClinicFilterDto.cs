namespace MedGid.Domain.Models.Clinic;

/// <summary>
/// Catalogue filters, bound from the query string. Mirrors `ClinicFilters` on the
/// client, including the "all" sentinel the select inputs send for city and type.
/// </summary>
public class ClinicFilterDto
{
    /// <summary>Free-text query matched against name, address, city and specialties.</summary>
    public string? Query { get; set; }

    public string? City { get; set; }
    public string? Type { get; set; }
    public string? SpecialtySlug { get; set; }
    public double? MinRating { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? OpenNow { get; set; }
    public bool? HasEmergency { get; set; }
}
