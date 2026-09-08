using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// Bookings. Everything here is tied to an identity, so the whole controller
/// requires a token — except the availability lookup, which the booking form
/// needs before the visitor has committed to signing in.
/// </summary>
[Route("api/appointments")]
[Authorize]
public class AppointmentsController : MedGidControllerBase
{
    internal readonly IAppointmentAction _appointment;

    public AppointmentsController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _appointment = bl.AppointmentAction();
    }

    /// <summary>Slots already booked for a doctor on a given day.</summary>
    [HttpGet("getTakenSlots")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
    public IActionResult GetTakenSlots([FromQuery] Guid doctorId, [FromQuery] string? date)
    {
        if (doctorId == Guid.Empty || string.IsNullOrWhiteSpace(date))
        {
            // The form asks before a doctor and a day are picked; an empty list is
            // the honest answer, not an error.
            return Ok(new List<string>());
        }

        return Ok(_appointment.GetTakenSlotsAction(doctorId, date));
    }

    [HttpGet("getByPatient/{patientId:guid}")]
    [ProducesResponseType(typeof(List<AppointmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult GetByPatient(Guid patientId)
    {
        if (!CanActOnBehalfOf(patientId))
        {
            return ForbiddenError("Poți vedea doar propriile programări.");
        }

        return Ok(_appointment.GetAppointmentsByPatientAction(patientId));
    }

    [HttpGet("getAll")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(List<AppointmentDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_appointment.GetAllAppointmentsAction());
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Create([FromBody] CreateAppointmentDto dto)
    {
        // The patient comes from the token, never from the body, so a booking
        // cannot be filed under someone else.
        var created = _appointment.CreateAppointmentAction(CurrentUserId, dto);
        return CreatedAtAction(nameof(GetByPatient), new { patientId = created.PatientId }, created);
    }

    [HttpPut("cancel/{id:guid}")]
    [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Cancel(Guid id)
    {
        var cancelled = _appointment.CancelAppointmentAction(id, CurrentUserId, IsAdmin);

        return cancelled is null
            ? NotFoundError("Programarea nu a fost găsită.")
            : Ok(cancelled);
    }
}
