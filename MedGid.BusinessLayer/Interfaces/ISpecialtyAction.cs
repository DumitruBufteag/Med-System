using MedGid.Domain.Models.Specialty;

namespace MedGid.BusinessLayer.Interfaces;

public interface ISpecialtyAction
{
    List<SpecialtyDto> GetAllSpecialtiesAction();
}
