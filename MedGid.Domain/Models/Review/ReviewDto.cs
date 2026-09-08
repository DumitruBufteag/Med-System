namespace MedGid.Domain.Models.Review;

/// <summary>Mirrors the `Review` TypeScript interface.</summary>
public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}
