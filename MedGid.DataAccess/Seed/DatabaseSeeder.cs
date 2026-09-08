using MedGid.DataAccess.Context;
using MedGid.Domain.Entities.Clinic;
using MedGid.Domain.Entities.Doctor;
using MedGid.Domain.Entities.Review;
using MedGid.Domain.Entities.Specialty;
using MedGid.Domain.Entities.User;

namespace MedGid.DataAccess.Seed;

/// <summary>
/// Fills an empty database with the demo catalogue the frontend used to serve
/// from <c>src/data/mockData.ts</c>, so switching VITE_USE_MOCK_DATA to false
/// shows the same clinics instead of an empty screen.
///
/// Every table is seeded independently and only when it is empty, so a clinic
/// deleted from the admin panel does not come back on the next restart.
/// </summary>
public static class DatabaseSeeder
{
    // Fixed ids keep the demo data stable across re-seeds, which is what makes
    // the doctor -> clinic and review -> clinic links writable by hand.
    private static Guid Id(char prefix, int index) =>
        Guid.Parse(prefix + "0000001-0000-4000-8000-" + index.ToString("D12"));

    public static void Seed()
    {
        using var db = new MedGidDbContext();

        SeedSpecialties(db);
        SeedClinics(db);
        SeedDoctors(db);
        SeedReviews(db);
        SeedUsers(db);

        db.SaveChanges();
    }

    private static void SeedSpecialties(MedGidDbContext db)
    {
        if (db.Specialties.Any())
        {
            return;
        }

        db.Specialties.AddRange(
            new SpecialtyData { Id = Id('a', 1), Slug = "cardiologie", Name = "Cardiologie", Icon = "HeartPulse", DoctorsCount = 78 },
            new SpecialtyData { Id = Id('a', 2), Slug = "stomatologie", Name = "Stomatologie", Icon = "Smile", DoctorsCount = 154 },
            new SpecialtyData { Id = Id('a', 3), Slug = "neurologie", Name = "Neurologie", Icon = "Brain", DoctorsCount = 46 },
            new SpecialtyData { Id = Id('a', 4), Slug = "oftalmologie", Name = "Oftalmologie", Icon = "Eye", DoctorsCount = 39 },
            new SpecialtyData { Id = Id('a', 5), Slug = "pediatrie", Name = "Pediatrie", Icon = "Baby", DoctorsCount = 92 },
            new SpecialtyData { Id = Id('a', 6), Slug = "ortopedie", Name = "Ortopedie", Icon = "Bone", DoctorsCount = 51 },
            new SpecialtyData { Id = Id('a', 7), Slug = "analize", Name = "Analize de laborator", Icon = "TestTube", DoctorsCount = 33 },
            new SpecialtyData { Id = Id('a', 8), Slug = "medicina-familie", Name = "Medicină de familie", Icon = "Stethoscope", DoctorsCount = 118 });
    }

    private static void SeedClinics(MedGidDbContext db)
    {
        if (db.Clinics.Any())
        {
            return;
        }

        var weekdays = new List<int> { 1, 2, 3, 4, 5 };
        var saturday = new List<int> { 6 };

        db.Clinics.AddRange(
            new ClinicData
            {
                Id = Id('c', 1),
                Slug = "medpark",
                Name = "Medpark International Hospital",
                Type = "hospital",
                City = "Chișinău",
                Address = "str. Andrei Doga 24",
                Phone = "+373 22 40 00 40",
                Website = "https://medpark.md",
                Description = "Primul spital internațional din Republica Moldova, inaugurat în 2011. Spital multidisciplinar acreditat Joint Commission International, cu centre de excelență în cardiologie și chirurgie cardiacă, oncologie, perinatologie, pediatrie și imagistică medicală, plus departament de medicină de urgență permanent.",
                Rating = 4.8,
                ReviewsCount = 1243,
                Specialties = new List<string> { "cardiologie", "ortopedie", "pediatrie", "analize", "neurologie" },
                ConsultationFrom = 600m,
                WorkingHours = new WorkingHoursData { Label = "Non-stop, 24/7", AlwaysOpen = true },
                HasEmergency = true,
                AcceptsInsurance = true,
                BrandColor = "#008286",
                Initials = "MP"
            },
            new ClinicData
            {
                Id = Id('c', 2),
                Slug = "terramed",
                Name = "Terramed",
                Type = "medical_center",
                City = "Chișinău",
                Address = "str. Trandafirilor 15/4",
                Phone = "+373 22 20 23 73",
                Website = "https://terramed.md",
                Description = "Centru medical fondat în 1999, cu două filiale în Chișinău. Acoperă policlinică pentru adulți și copii, staționar de zi, sală de operații și laborator propriu, cu specializări de la ginecologie și cardiologie până la ortopedie, dermatologie și oftalmologie.",
                Rating = 4.6,
                ReviewsCount = 812,
                Specialties = new List<string> { "medicina-familie", "pediatrie", "analize", "oftalmologie", "cardiologie" },
                ConsultationFrom = 450m,
                WorkingHours = new WorkingHoursData
                {
                    Label = "Lun–Vin, 08:00–19:00 · Sâm, 09:00–14:00",
                    Periods = new List<WorkingHoursPeriodData>
                    {
                        new() { Days = weekdays, Start = "08:00", End = "19:00" },
                        new() { Days = saturday, Start = "09:00", End = "14:00" }
                    }
                },
                HasEmergency = false,
                AcceptsInsurance = true,
                BrandColor = "#12a89b",
                Initials = "TM"
            },
            new ClinicData
            {
                Id = Id('c', 3),
                Slug = "repromed",
                Name = "Repromed",
                Type = "hospital",
                City = "Chișinău",
                Address = "bd. Cuza Vodă 29/1",
                Phone = "+373 22 26 38 88",
                Website = "https://repromed.md",
                Description = "Centru medical multidisciplinar cunoscut pentru clinica de fertilitate, cu spital propriu (Repromed+), farmacie specializată și departamente de ginecologie, chirurgie și mamologie. Oferă diagnostic de laborator și instrumental cu echipament modern.",
                Rating = 4.7,
                ReviewsCount = 546,
                Specialties = new List<string> { "medicina-familie", "analize", "pediatrie" },
                ConsultationFrom = 700m,
                WorkingHours = new WorkingHoursData
                {
                    Label = "Lun–Vin, 08:00–18:00 · Sâm, 08:00–14:00",
                    Periods = new List<WorkingHoursPeriodData>
                    {
                        new() { Days = weekdays, Start = "08:00", End = "18:00" },
                        new() { Days = saturday, Start = "08:00", End = "14:00" }
                    }
                },
                HasEmergency = false,
                AcceptsInsurance = false,
                BrandColor = "#8b5cf6",
                Initials = "RM"
            },
            new ClinicData
            {
                Id = Id('c', 4),
                Slug = "excellence",
                Name = "Excellence Medical Center",
                Type = "medical_center",
                City = "Chișinău",
                Address = "str. Grenoble 23",
                Phone = "+373 22 28 86 22",
                Website = "https://www.excellence.md",
                Description = "Centru medical axat pe diagnostic: tomografie computerizată spirală, radiografie, osteodensitometrie, ultrasonografie și elastografie, plus diagnostic funcțional computerizat (EEG, EMG, ECG, spirografie). Programările și rezultatele sunt gestionate într-un sistem informatic propriu.",
                Rating = 4.5,
                ReviewsCount = 389,
                Specialties = new List<string> { "neurologie", "ortopedie", "analize" },
                ConsultationFrom = 550m,
                WorkingHours = new WorkingHoursData
                {
                    Label = "Lun–Vin, 08:00–18:00",
                    Periods = new List<WorkingHoursPeriodData>
                    {
                        new() { Days = weekdays, Start = "08:00", End = "18:00" }
                    }
                },
                HasEmergency = false,
                AcceptsInsurance = true,
                BrandColor = "#1d4ed8",
                Initials = "EX"
            },
            new ClinicData
            {
                Id = Id('c', 5),
                Slug = "clinica-sante-balti",
                Name = "Clinica Sante Bălți",
                Type = "laboratory",
                City = "Bălți",
                Address = "str. Independenței 37",
                Phone = "+373 79 77 44 74",
                Website = "https://sante.md",
                Description = "Filiala din Bălți a rețelei Clinica Sante, cu laborator de analize medicale și consultații de specialitate. Recoltarea începe de la ora 07:00, iar rezultatele sunt disponibile online în contul pacientului.",
                Rating = 4.4,
                ReviewsCount = 271,
                Specialties = new List<string> { "analize", "medicina-familie", "cardiologie" },
                ConsultationFrom = 350m,
                WorkingHours = new WorkingHoursData
                {
                    Label = "Lun–Vin, 07:00–17:00 · Sâm, 08:00–13:00",
                    Periods = new List<WorkingHoursPeriodData>
                    {
                        new() { Days = weekdays, Start = "07:00", End = "17:00" },
                        new() { Days = saturday, Start = "08:00", End = "13:00" }
                    }
                },
                HasEmergency = false,
                AcceptsInsurance = true,
                BrandColor = "#f26f1a",
                Initials = "CS"
            },
            new ClinicData
            {
                Id = Id('c', 6),
                Slug = "terradent",
                Name = "TerraDent",
                Type = "specialized_clinic",
                City = "Chișinău",
                Address = "str. Trandafirilor 7",
                Phone = "+373 22 20 23 73",
                Website = "https://terradent.md",
                Description = "Clinică stomatologică premiată ca cea mai bună din republică patru ani consecutiv. Acoperă stomatologie digitală, implantologie, ortodonție, chirurgie orală și estetică dentară, cu scanare intraorală și planificare digitală a tratamentului.",
                Rating = 4.9,
                ReviewsCount = 964,
                Specialties = new List<string> { "stomatologie" },
                ConsultationFrom = 300m,
                WorkingHours = new WorkingHoursData
                {
                    Label = "Lun–Vin, 09:00–20:00 · Sâm, 09:00–15:00",
                    Periods = new List<WorkingHoursPeriodData>
                    {
                        new() { Days = weekdays, Start = "09:00", End = "20:00" },
                        new() { Days = saturday, Start = "09:00", End = "15:00" }
                    }
                },
                HasEmergency = false,
                AcceptsInsurance = false,
                BrandColor = "#c9a227",
                Initials = "TD"
            });
    }

    private static void SeedDoctors(MedGidDbContext db)
    {
        if (db.Doctors.Any())
        {
            return;
        }

        db.Doctors.AddRange(
            new DoctorData { Id = Id('d', 1), Name = "Dr. Daniela Moraru", SpecialtySlug = "cardiologie", ClinicId = Id('c', 1), YearsOfExperience = 14, Rating = 4.9, Initials = "DM" },
            new DoctorData { Id = Id('d', 2), Name = "Dr. Andrei Cebotari", SpecialtySlug = "ortopedie", ClinicId = Id('c', 1), YearsOfExperience = 11, Rating = 4.7, Initials = "AC" },
            new DoctorData { Id = Id('d', 3), Name = "Dr. Mihai Rusu", SpecialtySlug = "neurologie", ClinicId = Id('c', 1), YearsOfExperience = 18, Rating = 4.8, Initials = "MR" },
            new DoctorData { Id = Id('d', 4), Name = "Dr. Irina Bejan", SpecialtySlug = "pediatrie", ClinicId = Id('c', 2), YearsOfExperience = 9, Rating = 4.8, Initials = "IB" },
            new DoctorData { Id = Id('d', 5), Name = "Dr. Vasile Croitoru", SpecialtySlug = "cardiologie", ClinicId = Id('c', 2), YearsOfExperience = 21, Rating = 4.6, Initials = "VC" },
            new DoctorData { Id = Id('d', 6), Name = "Dr. Ana Lungu", SpecialtySlug = "oftalmologie", ClinicId = Id('c', 2), YearsOfExperience = 7, Rating = 4.5, Initials = "AL" },
            new DoctorData { Id = Id('d', 7), Name = "Dr. Elena Postică", SpecialtySlug = "medicina-familie", ClinicId = Id('c', 3), YearsOfExperience = 16, Rating = 4.9, Initials = "EP" },
            new DoctorData { Id = Id('d', 8), Name = "Dr. Nicolae Barbu", SpecialtySlug = "analize", ClinicId = Id('c', 3), YearsOfExperience = 12, Rating = 4.6, Initials = "NB" },
            new DoctorData { Id = Id('d', 9), Name = "Dr. Cristina Ursu", SpecialtySlug = "neurologie", ClinicId = Id('c', 4), YearsOfExperience = 13, Rating = 4.7, Initials = "CU" },
            new DoctorData { Id = Id('d', 10), Name = "Dr. Sergiu Pînzari", SpecialtySlug = "ortopedie", ClinicId = Id('c', 4), YearsOfExperience = 10, Rating = 4.4, Initials = "SP" },
            new DoctorData { Id = Id('d', 11), Name = "Dr. Tatiana Cojocaru", SpecialtySlug = "medicina-familie", ClinicId = Id('c', 5), YearsOfExperience = 15, Rating = 4.5, Initials = "TC" },
            new DoctorData { Id = Id('d', 12), Name = "Dr. Igor Melnic", SpecialtySlug = "cardiologie", ClinicId = Id('c', 5), YearsOfExperience = 8, Rating = 4.3, Initials = "IM" },
            new DoctorData { Id = Id('d', 13), Name = "Dr. Radu Ciobanu", SpecialtySlug = "stomatologie", ClinicId = Id('c', 6), YearsOfExperience = 17, Rating = 5, Initials = "RC" },
            new DoctorData { Id = Id('d', 14), Name = "Dr. Olga Grosu", SpecialtySlug = "stomatologie", ClinicId = Id('c', 6), YearsOfExperience = 6, Rating = 4.8, Initials = "OG" });
    }

    private static void SeedReviews(MedGidDbContext db)
    {
        if (db.Reviews.Any())
        {
            return;
        }

        db.Reviews.AddRange(
            new ReviewData { Id = Id('e', 1), ClinicId = Id('c', 1), AuthorName = "Victoria P.", Rating = 5, Comment = "Programare online în 2 minute, iar consultația a început la ora exactă. Recomand cu încredere.", CreatedAt = "2026-07-14" },
            new ReviewData { Id = Id('e', 2), ClinicId = Id('c', 6), AuthorName = "Sergiu M.", Rating = 5, Comment = "Prețurile afișate în aplicație au corespuns exact cu cele din clinică. Fără surprize.", CreatedAt = "2026-08-02" },
            new ReviewData { Id = Id('e', 3), ClinicId = Id('c', 5), AuthorName = "Elena C.", Rating = 4, Comment = "Foarte util că pot compara clinicile din Bălți fără să sun la fiecare în parte.", CreatedAt = "2026-08-21" },
            new ReviewData { Id = Id('e', 4), ClinicId = Id('c', 1), AuthorName = "Andrei T.", Rating = 5, Comment = "Am ajuns la urgențe noaptea, personalul a fost prompt și explicațiile foarte clare.", CreatedAt = "2026-06-30" },
            new ReviewData { Id = Id('e', 5), ClinicId = Id('c', 2), AuthorName = "Mihaela D.", Rating = 4, Comment = "Analizele au fost gata a doua zi, primite pe e-mail. Sala de așteptare cam aglomerată dimineața.", CreatedAt = "2026-08-11" },
            new ReviewData { Id = Id('e', 6), ClinicId = Id('c', 3), AuthorName = "Cristina B.", Rating = 5, Comment = "Echipa de la clinica de fertilitate a explicat fiecare pas al procedurii. Multă răbdare.", CreatedAt = "2026-05-19" },
            new ReviewData { Id = Id('e', 7), ClinicId = Id('c', 4), AuthorName = "Dorin V.", Rating = 4, Comment = "CT-ul s-a făcut rapid, iar rezultatul l-am descărcat din contul online în aceeași zi.", CreatedAt = "2026-07-28" },
            new ReviewData { Id = Id('e', 8), ClinicId = Id('c', 6), AuthorName = "Natalia S.", Rating = 5, Comment = "Tratament fără durere și un plan de lucru explicat pe înțelesul meu.", CreatedAt = "2026-08-25" });
    }

    private static void SeedUsers(MedGidDbContext db)
    {
        if (db.Users.Any())
        {
            return;
        }

        // The same demo credentials the login page advertises. They are demo
        // accounts, not secrets — but they are still stored as BCrypt digests,
        // exactly like an account created through /api/auth/register.
        db.Users.AddRange(
            new UserData
            {
                Id = Id('f', 1),
                Name = "Ana Popescu",
                Email = "pacient@medgid.md",
                Phone = "+373 69 123 456",
                Role = "patient",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("pacient123"),
                CreatedAt = DateTime.UtcNow
            },
            new UserData
            {
                Id = Id('f', 2),
                Name = "Administrator MedGid",
                Email = "admin@medgid.md",
                Role = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                CreatedAt = DateTime.UtcNow
            });
    }
}
