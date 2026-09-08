using MedGid.DataAccess.Context;
using MedGid.Domain.Entities.Appointment;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.Appointment;

namespace MedGid.BusinessLayer.Core;

public class AppointmentActions
{
    /// <summary>Slots a clinic offers in a day, mirroring TIME_SLOTS on the client.</summary>
    internal static readonly string[] TimeSlots =
    {
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00",
        "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    };

    public AppointmentActions()
    {
    }

    internal List<string> GetTakenSlotsActionExecution(Guid doctorId, string date)
    {
        using var db = new MedGidDbContext();

        return db.Appointments
            .Where(appointment =>
                appointment.DoctorId == doctorId &&
                appointment.Date == date &&
                appointment.Status != "cancelled")
            .Select(appointment => appointment.Time)
            .Distinct()
            .ToList();
    }

    internal List<AppointmentDto> GetAppointmentsByPatientActionExecution(Guid patientId)
    {
        using var db = new MedGidDbContext();

        return db.Appointments
            .Where(appointment => appointment.PatientId == patientId)
            .OrderBy(appointment => appointment.Date)
            .ThenBy(appointment => appointment.Time)
            .ToList()
            .Select(appointment => appointment.ToDto())
            .ToList();
    }

    internal List<AppointmentDto> GetAllAppointmentsActionExecution()
    {
        using var db = new MedGidDbContext();

        // Newest first — the admin list shows the most recent bookings on top.
        return db.Appointments
            .OrderByDescending(appointment => appointment.Date)
            .ThenByDescending(appointment => appointment.Time)
            .ToList()
            .Select(appointment => appointment.ToDto())
            .ToList();
    }

    internal AppointmentDto CreateAppointmentActionExecution(Guid patientId, CreateAppointmentDto dto)
    {
        using var db = new MedGidDbContext();

        if (!TimeSlots.Contains(dto.Time))
        {
            throw new BusinessRuleException("Ora selectată nu este un interval valid.", BusinessRuleException.StatusCodes.BadRequest);
        }

        var doctor = db.Doctors.FirstOrDefault(item => item.Id == dto.DoctorId);
        if (doctor is null)
        {
            throw new BusinessRuleException("Medicul selectat nu există.", BusinessRuleException.StatusCodes.BadRequest);
        }

        // The clinic comes from the request, but a doctor only works at one — trusting
        // the body here would let a booking be filed under the wrong clinic.
        if (doctor.ClinicId != dto.ClinicId)
        {
            throw new BusinessRuleException("Medicul selectat nu aparține clinicii indicate.", BusinessRuleException.StatusCodes.BadRequest);
        }

        var isTaken = db.Appointments.Any(appointment =>
            appointment.DoctorId == dto.DoctorId &&
            appointment.Date == dto.Date &&
            appointment.Time == dto.Time &&
            appointment.Status != "cancelled");

        if (isTaken)
        {
            throw new BusinessRuleException("Intervalul ales tocmai a fost rezervat. Alege altul.");
        }

        var entity = new AppointmentData
        {
            Id = Guid.NewGuid(),
            PatientId = patientId,
            ClinicId = dto.ClinicId,
            DoctorId = dto.DoctorId,
            Date = dto.Date,
            Time = dto.Time,
            Status = "confirmed",
            Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        db.Appointments.Add(entity);
        db.SaveChanges();

        return entity.ToDto();
    }

    internal AppointmentDto? CancelAppointmentActionExecution(Guid id, Guid requesterId, bool requesterIsAdmin)
    {
        using var db = new MedGidDbContext();

        var entity = db.Appointments.FirstOrDefault(appointment => appointment.Id == id);
        if (entity is null)
        {
            return null;
        }

        // Without this check any signed-in patient could cancel a stranger's booking
        // just by guessing its id.
        if (!requesterIsAdmin && entity.PatientId != requesterId)
        {
            throw new BusinessRuleException(
                "Poți anula doar propriile programări.",
                BusinessRuleException.StatusCodes.Forbidden);
        }

        entity.Status = "cancelled";
        db.Appointments.Update(entity);
        db.SaveChanges();

        return entity.ToDto();
    }
}
