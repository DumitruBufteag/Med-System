using MedGid.DataAccess.Context;
using MedGid.Domain.Models.Review;

namespace MedGid.BusinessLayer.Core;

public class ReviewActions
{
    public ReviewActions()
    {
    }

    /// <summary>Reviews are addressed by clinic slug, the same identifier used in the URL.</summary>
    internal List<ReviewDto> GetReviewsByClinicActionExecution(string clinicSlug)
    {
        using var db = new MedGidDbContext();

        var clinicId = db.Clinics
            .Where(clinic => clinic.Slug == clinicSlug)
            .Select(clinic => clinic.Id)
            .FirstOrDefault();

        if (clinicId == Guid.Empty)
        {
            return new List<ReviewDto>();
        }

        // Newest first, matching the order the clinic page renders them in.
        return db.Reviews
            .Where(review => review.ClinicId == clinicId)
            .OrderByDescending(review => review.CreatedAt)
            .ToList()
            .Select(review => review.ToDto())
            .ToList();
    }
}
