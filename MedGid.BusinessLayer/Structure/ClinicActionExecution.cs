using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Clinic;

namespace MedGid.BusinessLayer.Structure;

public class ClinicActionExecution : ClinicActions, IClinicAction
{
    public List<ClinicDto> GetAllClinicsAction(ClinicFilterDto filters) => GetAllClinicsActionExecution(filters);
    public List<ClinicDto> GetFeaturedClinicsAction(int limit) => GetFeaturedClinicsActionExecution(limit);
    public ClinicDto? GetClinicBySlugAction(string slug) => GetClinicBySlugActionExecution(slug);
    public ClinicDto? GetClinicByIdAction(Guid id) => GetClinicByIdActionExecution(id);
    public ClinicDto CreateClinicAction(ClinicInputDto dto) => CreateClinicActionExecution(dto);
    public ClinicDto? UpdateClinicAction(Guid id, ClinicInputDto dto) => UpdateClinicActionExecution(id, dto);
    public bool DeleteClinicAction(Guid id) => DeleteClinicActionExecution(id);
}
