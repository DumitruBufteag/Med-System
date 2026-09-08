using MedGid.DataAccess.Context;
using MedGid.Domain.Entities.Doctor;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.Doctor;

namespace MedGid.BusinessLayer.Core;

public class DoctorActions
{
    public DoctorActions()
    {
    }

    internal List<DoctorDto> GetAllDoctorsActionExecution()
    {
        using var db = new MedGidDbContext();

        return db.Doctors
            .OrderBy(doctor => doctor.Name)
            .ToList()
            .Select(doctor => doctor.ToDto())
            .ToList();
    }

    /// <summary>Doctors are addressed by clinic slug, the same identifier used in the URL.</summary>
    internal List<DoctorDto> GetDoctorsByClinicActionExecution(string clinicSlug)
    {
        using var db = new MedGidDbContext();

        var clinicId = db.Clinics
            .Where(clinic => clinic.Slug == clinicSlug)
            .Select(clinic => clinic.Id)
            .FirstOrDefault();

        if (clinicId == Guid.Empty)
        {
            return new List<DoctorDto>();
        }

        return db.Doctors
            .Where(doctor => doctor.ClinicId == clinicId)
            .OrderBy(doctor => doctor.Name)
            .ToList()
            .Select(doctor => doctor.ToDto())
            .ToList();
    }

    internal DoctorDto? GetDoctorByIdActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var doctor = db.Doctors.FirstOrDefault(item => item.Id == id);
        return doctor?.ToDto();
    }

    internal DoctorDto CreateDoctorActionExecution(DoctorInputDto dto)
    {
        using var db = new MedGidDbContext();

        if (!db.Clinics.Any(clinic => clinic.Id == dto.ClinicId))
        {
            throw new BusinessRuleException("Clinica selectată nu există.", BusinessRuleException.StatusCodes.BadRequest);
        }

        if (IsNameTaken(db, dto, null))
        {
            throw new BusinessRuleException("Există deja un medic cu acest nume în clinica selectată.");
        }

        var entity = new DoctorData
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            SpecialtySlug = dto.SpecialtySlug,
            ClinicId = dto.ClinicId,
            YearsOfExperience = dto.YearsOfExperience,
            // Ratings come from patient reviews, so a new doctor starts without one.
            Rating = 0,
            Initials = CatalogHelpers.Initials(dto.Name)
        };

        db.Doctors.Add(entity);
        db.SaveChanges();

        return entity.ToDto();
    }

    internal DoctorDto? UpdateDoctorActionExecution(Guid id, DoctorInputDto dto)
    {
        using var db = new MedGidDbContext();

        var entity = db.Doctors.FirstOrDefault(doctor => doctor.Id == id);
        if (entity is null)
        {
            return null;
        }

        if (!db.Clinics.Any(clinic => clinic.Id == dto.ClinicId))
        {
            throw new BusinessRuleException("Clinica selectată nu există.", BusinessRuleException.StatusCodes.BadRequest);
        }

        if (IsNameTaken(db, dto, id))
        {
            throw new BusinessRuleException("Există deja un medic cu acest nume în clinica selectată.");
        }

        entity.Name = dto.Name.Trim();
        entity.SpecialtySlug = dto.SpecialtySlug;
        entity.ClinicId = dto.ClinicId;
        entity.YearsOfExperience = dto.YearsOfExperience;
        entity.Initials = CatalogHelpers.Initials(dto.Name);
        // Rating is earned from reviews and survives an edit.

        db.Doctors.Update(entity);
        db.SaveChanges();

        return entity.ToDto();
    }

    internal bool DeleteDoctorActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var entity = db.Doctors.FirstOrDefault(doctor => doctor.Id == id);
        if (entity is null)
        {
            return false;
        }

        // Deleting a doctor with live bookings would leave those appointments
        // pointing at nothing, so the admin has to cancel them first.
        var activeBookings = db.Appointments.Count(appointment =>
            appointment.DoctorId == id && appointment.Status != "cancelled");

        if (activeBookings > 0)
        {
            throw new BusinessRuleException(
                $"Medicul are {activeBookings} programări active. Anulează-le înainte de ștergere.");
        }

        db.Doctors.Remove(entity);
        db.SaveChanges();

        return true;
    }

    /// <summary>Two doctors with the same name in the same clinic would be indistinguishable.</summary>
    private static bool IsNameTaken(MedGidDbContext db, DoctorInputDto dto, Guid? exceptId)
    {
        var name = dto.Name.Trim().ToLower();

        return db.Doctors.Any(doctor =>
            doctor.ClinicId == dto.ClinicId &&
            doctor.Name.ToLower() == name &&
            (exceptId == null || doctor.Id != exceptId));
    }
}
