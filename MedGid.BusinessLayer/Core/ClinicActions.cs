using MedGid.DataAccess.Context;
using MedGid.Domain.Entities.Clinic;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.Clinic;

namespace MedGid.BusinessLayer.Core;

public class ClinicActions
{
    public ClinicActions()
    {
    }

    internal List<ClinicDto> GetAllClinicsActionExecution(ClinicFilterDto filters)
    {
        using var db = new MedGidDbContext();

        IQueryable<ClinicData> query = db.Clinics;

        // "all" is the sentinel the select inputs send for "no filter".
        if (!string.IsNullOrWhiteSpace(filters.City) && filters.City != "all")
        {
            query = query.Where(clinic => clinic.City == filters.City);
        }

        if (!string.IsNullOrWhiteSpace(filters.Type) && filters.Type != "all")
        {
            query = query.Where(clinic => clinic.Type == filters.Type);
        }

        if (!string.IsNullOrWhiteSpace(filters.SpecialtySlug))
        {
            query = query.Where(clinic => clinic.Specialties.Contains(filters.SpecialtySlug));
        }

        if (filters.MinRating.HasValue)
        {
            query = query.Where(clinic => clinic.Rating >= filters.MinRating.Value);
        }

        if (filters.MaxPrice.HasValue)
        {
            query = query.Where(clinic => clinic.ConsultationFrom <= filters.MaxPrice.Value);
        }

        if (filters.HasEmergency == true)
        {
            query = query.Where(clinic => clinic.HasEmergency);
        }

        // The last two filters cannot be expressed in SQL: the free-text search is
        // diacritic-insensitive, and "open now" has to be evaluated against the
        // jsonb schedule. The catalogue is small enough that finishing the work in
        // memory is cheaper than the indexes those filters would otherwise need.
        var clinics = query.OrderByDescending(clinic => clinic.Rating).ToList();

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            var needle = CatalogHelpers.Normalise(filters.Query);
            clinics = clinics
                .Where(clinic =>
                    CatalogHelpers.Normalise(clinic.Name).Contains(needle) ||
                    CatalogHelpers.Normalise(clinic.Address).Contains(needle) ||
                    CatalogHelpers.Normalise(clinic.City).Contains(needle) ||
                    clinic.Specialties.Any(slug => CatalogHelpers.Normalise(slug).Contains(needle)))
                .ToList();
        }

        if (filters.OpenNow == true)
        {
            var now = DateTime.Now;
            clinics = clinics.Where(clinic => CatalogHelpers.IsOpenNow(clinic.WorkingHours, now)).ToList();
        }

        return clinics.Select(clinic => clinic.ToDto()).ToList();
    }

    internal List<ClinicDto> GetFeaturedClinicsActionExecution(int limit)
    {
        using var db = new MedGidDbContext();

        return db.Clinics
            .OrderByDescending(clinic => clinic.Rating)
            .Take(limit)
            .ToList()
            .Select(clinic => clinic.ToDto())
            .ToList();
    }

    internal ClinicDto? GetClinicBySlugActionExecution(string slug)
    {
        using var db = new MedGidDbContext();

        var clinic = db.Clinics.FirstOrDefault(item => item.Slug == slug);
        return clinic?.ToDto();
    }

    internal ClinicDto? GetClinicByIdActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var clinic = db.Clinics.FirstOrDefault(item => item.Id == id);
        return clinic?.ToDto();
    }

    internal ClinicDto CreateClinicActionExecution(ClinicInputDto dto)
    {
        using var db = new MedGidDbContext();

        var slug = CatalogHelpers.Slugify(dto.Name);
        if (string.IsNullOrEmpty(slug) || db.Clinics.Any(clinic => clinic.Slug == slug))
        {
            throw new BusinessRuleException("O clinică cu acest nume există deja.");
        }

        var entity = new ClinicData
        {
            Id = Guid.NewGuid(),
            Slug = slug,
            Name = dto.Name.Trim(),
            Type = dto.Type,
            City = dto.City,
            Address = dto.Address.Trim(),
            Phone = dto.Phone.Trim(),
            Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website.Trim(),
            Description = dto.Description.Trim(),
            // Ratings come from patient reviews, so a new clinic starts without one.
            Rating = 0,
            ReviewsCount = 0,
            Specialties = dto.Specialties,
            ConsultationFrom = dto.ConsultationFrom,
            WorkingHours = CatalogHelpers.BuildWorkingHours(dto.Schedule),
            HasEmergency = dto.HasEmergency,
            AcceptsInsurance = dto.AcceptsInsurance,
            BrandColor = dto.BrandColor,
            Initials = CatalogHelpers.Initials(dto.Name)
        };

        db.Clinics.Add(entity);
        db.SaveChanges();

        return entity.ToDto();
    }

    internal ClinicDto? UpdateClinicActionExecution(Guid id, ClinicInputDto dto)
    {
        using var db = new MedGidDbContext();

        var entity = db.Clinics.FirstOrDefault(clinic => clinic.Id == id);
        if (entity is null)
        {
            return null;
        }

        var slug = CatalogHelpers.Slugify(dto.Name);
        if (string.IsNullOrEmpty(slug) || db.Clinics.Any(clinic => clinic.Id != id && clinic.Slug == slug))
        {
            throw new BusinessRuleException("O clinică cu acest nume există deja.");
        }

        entity.Slug = slug;
        entity.Name = dto.Name.Trim();
        entity.Type = dto.Type;
        entity.City = dto.City;
        entity.Address = dto.Address.Trim();
        entity.Phone = dto.Phone.Trim();
        entity.Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website.Trim();
        entity.Description = dto.Description.Trim();
        entity.Specialties = dto.Specialties;
        entity.ConsultationFrom = dto.ConsultationFrom;
        entity.WorkingHours = CatalogHelpers.BuildWorkingHours(dto.Schedule);
        entity.HasEmergency = dto.HasEmergency;
        entity.AcceptsInsurance = dto.AcceptsInsurance;
        entity.BrandColor = dto.BrandColor;
        entity.Initials = CatalogHelpers.Initials(dto.Name);

        db.Clinics.Update(entity);
        db.SaveChanges();

        return entity.ToDto();
    }

    internal bool DeleteClinicActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var entity = db.Clinics.FirstOrDefault(clinic => clinic.Id == id);
        if (entity is null)
        {
            return false;
        }

        // Removing a clinic while patients are still booked with it would leave
        // those appointments pointing at nothing, so the admin has to clear them first.
        var activeBookings = db.Appointments.Count(appointment =>
            appointment.ClinicId == id && appointment.Status != "cancelled");

        if (activeBookings > 0)
        {
            throw new BusinessRuleException(
                $"Clinica are {activeBookings} programări active. Anulează-le înainte de ștergere.");
        }

        // Doctors and reviews cascade with the clinic (see MedGidDbContext).
        db.Clinics.Remove(entity);
        db.SaveChanges();

        return true;
    }
}
