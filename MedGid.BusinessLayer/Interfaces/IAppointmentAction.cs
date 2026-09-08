using MedGid.Domain.Models.Appointment;

namespace MedGid.BusinessLayer.Interfaces;

public interface IAppointmentAction
{
    List<string> GetTakenSlotsAction(Guid doctorId, string date);
    List<AppointmentDto> GetAppointmentsByPatientAction(Guid patientId);
    List<AppointmentDto> GetAllAppointmentsAction();
    AppointmentDto CreateAppointmentAction(Guid patientId, CreateAppointmentDto dto);

    /// <summary>
    /// Returns null when the appointment does not exist. Throws when the caller
    /// is neither the patient who booked it nor an administrator.
    /// </summary>
    AppointmentDto? CancelAppointmentAction(Guid id, Guid requesterId, bool requesterIsAdmin);
}
