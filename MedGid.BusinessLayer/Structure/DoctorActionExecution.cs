using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Doctor;

namespace MedGid.BusinessLayer.Structure;

public class DoctorActionExecution : DoctorActions, IDoctorAction
{
    public List<DoctorDto> GetAllDoctorsAction() => GetAllDoctorsActionExecution();
    public List<DoctorDto> GetDoctorsByClinicAction(string clinicSlug) => GetDoctorsByClinicActionExecution(clinicSlug);
    public DoctorDto? GetDoctorByIdAction(Guid id) => GetDoctorByIdActionExecution(id);
    public DoctorDto CreateDoctorAction(DoctorInputDto dto) => CreateDoctorActionExecution(dto);
    public DoctorDto? UpdateDoctorAction(Guid id, DoctorInputDto dto) => UpdateDoctorActionExecution(id, dto);
    public bool DeleteDoctorAction(Guid id) => DeleteDoctorActionExecution(id);
}
