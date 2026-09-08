using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Specialty;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// The specialty list that drives the catalogue filters and the landing page grid.
/// Public, because filtering has to work before anyone signs in.
/// </summary>
[Route("api/specialties")]
[AllowAnonymous]
public class SpecialtiesController : MedGidControllerBase
{
    internal readonly ISpecialtyAction _specialty;

    public SpecialtiesController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _specialty = bl.SpecialtyAction();
    }

    [HttpGet("getAll")]
    [ProducesResponseType(typeof(List<SpecialtyDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_specialty.GetAllSpecialtiesAction());
    }
}
