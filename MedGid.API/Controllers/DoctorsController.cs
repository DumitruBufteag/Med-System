using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Doctor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// The medical teams shown on the clinic pages and managed from the admin panel.
/// </summary>
[Route("api/doctors")]
public class DoctorsController : MedGidControllerBase
{
    internal readonly IDoctorAction _doctor;

    public DoctorsController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _doctor = bl.DoctorAction();
    }

    [HttpGet("getAll")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<DoctorDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_doctor.GetAllDoctorsAction());
    }

    /// <summary>Doctors are addressed by clinic slug, the identifier already in the URL.</summary>
    [HttpGet("getByClinic/{clinicSlug}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<DoctorDto>), StatusCodes.Status200OK)]
    public IActionResult GetByClinic(string clinicSlug)
    {
        return Ok(_doctor.GetDoctorsByClinicAction(clinicSlug));
    }

    [HttpGet("getById/{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(Guid id)
    {
        var doctor = _doctor.GetDoctorByIdAction(id);

        return doctor is null
            ? NotFoundError("Medicul nu a fost găsit.")
            : Ok(doctor);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Create([FromBody] DoctorInputDto dto)
    {
        var created = _doctor.CreateDoctorAction(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("update/{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Update(Guid id, [FromBody] DoctorInputDto dto)
    {
        var updated = _doctor.UpdateDoctorAction(id, dto);

        return updated is null
            ? NotFoundError("Medicul nu a fost găsit.")
            : Ok(updated);
    }

    [HttpDelete("delete/{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid id)
    {
        return _doctor.DeleteDoctorAction(id)
            ? NoContent()
            : NotFoundError("Medicul nu a fost găsit.");
    }
}
