namespace MedGid.Domain.Entities.Review;

/// <summary>A patient review left for a clinic.</summary>
public class ReviewData
{
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;

    /// <summary>ISO date string (YYYY-MM-DD).</summary>
    public string CreatedAt { get; set; } = string.Empty;
}
