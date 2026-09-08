using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Clinic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// The clinic catalogue. Reading it is public — the landing page and the search
/// results have to work for a visitor who never signs in. Writing is admin-only.
/// </summary>
[Route("api/clinics")]
public class ClinicsController : MedGidControllerBase
{
    internal readonly IClinicAction _clinic;

    public ClinicsController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _clinic = bl.ClinicAction();
    }

    [HttpGet("getAll")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<ClinicDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll([FromQuery] ClinicFilterDto filters)
    {
        return Ok(_clinic.GetAllClinicsAction(filters));
    }

    [HttpGet("getFeatured")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<ClinicDto>), StatusCodes.Status200OK)]
    public IActionResult GetFeatured([FromQuery] int limit = 6)
    {
        // A negative or huge limit is a client mistake, not a reason to fail the page.
        var safeLimit = Math.Clamp(limit, 1, 50);
        return Ok(_clinic.GetFeaturedClinicsAction(safeLimit));
    }

    [HttpGet("getBySlug/{slug}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ClinicDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetBySlug(string slug)
    {
        var clinic = _clinic.GetClinicBySlugAction(slug);

        return clinic is null
            ? NotFoundError($"Clinica „{slug}” nu a fost găsită.")
            : Ok(clinic);
    }

    [HttpGet("getById/{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ClinicDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(Guid id)
    {
        var clinic = _clinic.GetClinicByIdAction(id);

        return clinic is null
            ? NotFoundError("Clinica nu a fost găsită.")
            : Ok(clinic);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ClinicDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Create([FromBody] ClinicInputDto dto)
    {
        var created = _clinic.CreateClinicAction(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("update/{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ClinicDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Update(Guid id, [FromBody] ClinicInputDto dto)
    {
        var updated = _clinic.UpdateClinicAction(id, dto);

        return updated is null
            ? NotFoundError("Clinica nu a fost găsită.")
            : Ok(updated);
    }

    [HttpDelete("delete/{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid id)
    {
        return _clinic.DeleteClinicAction(id)
            ? NoContent()
            : NotFoundError("Clinica nu a fost găsită.");
    }
}
