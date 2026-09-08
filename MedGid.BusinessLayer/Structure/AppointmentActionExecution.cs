using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Appointment;

namespace MedGid.BusinessLayer.Structure;

public class AppointmentActionExecution : AppointmentActions, IAppointmentAction
{
    public List<string> GetTakenSlotsAction(Guid doctorId, string date) => GetTakenSlotsActionExecution(doctorId, date);
    public List<AppointmentDto> GetAppointmentsByPatientAction(Guid patientId) => GetAppointmentsByPatientActionExecution(patientId);
    public List<AppointmentDto> GetAllAppointmentsAction() => GetAllAppointmentsActionExecution();
    public AppointmentDto CreateAppointmentAction(Guid patientId, CreateAppointmentDto dto) => CreateAppointmentActionExecution(patientId, dto);

    public AppointmentDto? CancelAppointmentAction(Guid id, Guid requesterId, bool requesterIsAdmin) =>
        CancelAppointmentActionExecution(id, requesterId, requesterIsAdmin);
}
