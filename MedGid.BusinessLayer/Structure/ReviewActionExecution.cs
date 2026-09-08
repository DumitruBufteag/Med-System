using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Review;

namespace MedGid.BusinessLayer.Structure;

public class ReviewActionExecution : ReviewActions, IReviewAction
{
    public List<ReviewDto> GetReviewsByClinicAction(string clinicSlug) => GetReviewsByClinicActionExecution(clinicSlug);
}
