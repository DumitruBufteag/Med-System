using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Specialty;

namespace MedGid.BusinessLayer.Structure;

public class SpecialtyActionExecution : SpecialtyActions, ISpecialtyAction
{
    public List<SpecialtyDto> GetAllSpecialtiesAction() => GetAllSpecialtiesActionExecution();
}
