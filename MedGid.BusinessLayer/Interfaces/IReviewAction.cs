using MedGid.Domain.Models.Review;

namespace MedGid.BusinessLayer.Interfaces;

public interface IReviewAction
{
    List<ReviewDto> GetReviewsByClinicAction(string clinicSlug);
}
