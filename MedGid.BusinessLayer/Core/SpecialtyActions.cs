using MedGid.DataAccess.Context;
using MedGid.Domain.Models.Specialty;

namespace MedGid.BusinessLayer.Core;

public class SpecialtyActions
{
    public SpecialtyActions()
    {
    }

    internal List<SpecialtyDto> GetAllSpecialtiesActionExecution()
    {
        using var db = new MedGidDbContext();

        return db.Specialties
            .OrderBy(specialty => specialty.Name)
            .ToList()
            .Select(specialty => specialty.ToDto())
            .ToList();
    }
}
