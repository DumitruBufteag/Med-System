using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>Patient reviews rendered on the clinic detail page.</summary>
[Route("api/reviews")]
[AllowAnonymous]
public class ReviewsController : MedGidControllerBase
{
    internal readonly IReviewAction _review;

    public ReviewsController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _review = bl.ReviewAction();
    }

    /// <summary>Reviews are addressed by clinic slug, the identifier already in the URL.</summary>
    [HttpGet("getByClinic/{clinicSlug}")]
    [ProducesResponseType(typeof(List<ReviewDto>), StatusCodes.Status200OK)]
    public IActionResult GetByClinic(string clinicSlug)
    {
        return Ok(_review.GetReviewsByClinicAction(clinicSlug));
    }
}
