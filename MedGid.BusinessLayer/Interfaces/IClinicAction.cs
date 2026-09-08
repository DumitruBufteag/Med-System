using MedGid.Domain.Models.Clinic;

namespace MedGid.BusinessLayer.Interfaces;

public interface IClinicAction
{
    List<ClinicDto> GetAllClinicsAction(ClinicFilterDto filters);
    List<ClinicDto> GetFeaturedClinicsAction(int limit);
    ClinicDto? GetClinicBySlugAction(string slug);
    ClinicDto? GetClinicByIdAction(Guid id);
    ClinicDto CreateClinicAction(ClinicInputDto dto);
    ClinicDto? UpdateClinicAction(Guid id, ClinicInputDto dto);
    bool DeleteClinicAction(Guid id);
}
