using MedGid.Domain.Models.Doctor;

namespace MedGid.BusinessLayer.Interfaces;

public interface IDoctorAction
{
    List<DoctorDto> GetAllDoctorsAction();
    List<DoctorDto> GetDoctorsByClinicAction(string clinicSlug);
    DoctorDto? GetDoctorByIdAction(Guid id);
    DoctorDto CreateDoctorAction(DoctorInputDto dto);
    DoctorDto? UpdateDoctorAction(Guid id, DoctorInputDto dto);
    bool DeleteDoctorAction(Guid id);
}
