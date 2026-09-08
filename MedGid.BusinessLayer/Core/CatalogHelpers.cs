using System.Globalization;
using System.Text;
using MedGid.Domain.Entities.Clinic;
using MedGid.Domain.Models.Clinic;

namespace MedGid.BusinessLayer.Core;

/// <summary>
/// Text and schedule helpers shared by the catalogue actions.
///
/// These deliberately mirror the client-side helpers in <c>src/lib/utils.ts</c> and
/// <c>src/services/filterService.ts</c>, so a clinic filtered on the server and the
/// same clinic filtered in mock mode behave identically.
/// </summary>
internal static class CatalogHelpers
{
    /// <summary>Lowercases and strips diacritics, so "Chișinău" matches "chisinau".</summary>
    internal static string Normalise(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var decomposed = value.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(decomposed.Length);

        foreach (var character in decomposed)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark)
            {
                builder.Append(character);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC).Trim();
    }

    /// <summary>Turns a clinic name into the slug used in URLs, e.g. "Clinica Sante Bălți" to "clinica-sante-balti".</summary>
    internal static string Slugify(string value)
    {
        var normalised = Normalise(value);
        var builder = new StringBuilder(normalised.Length);

        foreach (var character in normalised)
        {
            if (char.IsLetterOrDigit(character))
            {
                builder.Append(character);
            }
            else if (builder.Length > 0 && builder[^1] != '-')
            {
                builder.Append('-');
            }
        }

        return builder.ToString().Trim('-');
    }

    /// <summary>Up to two initials, used as the fallback when a clinic or doctor has no logo.</summary>
    internal static string Initials(string value)
    {
        var words = value.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            // "Dr." is a title, not part of the name.
            .Where(word => !word.Equals("Dr.", StringComparison.OrdinalIgnoreCase))
            .Where(word => char.IsLetter(word[0]))
            .Take(2)
            .ToList();

        if (words.Count == 0)
        {
            return string.Empty;
        }

        return string.Concat(words.Select(word => char.ToUpperInvariant(word[0])));
    }

    /// <summary>
    /// True when the clinic is open at <paramref name="now"/>.
    /// Mirrors <c>isClinicOpenNow</c> on the client: the status is always derived,
    /// never stored, so it cannot go stale.
    /// </summary>
    internal static bool IsOpenNow(WorkingHoursData workingHours, DateTime now)
    {
        if (workingHours.AlwaysOpen)
        {
            return true;
        }

        var day = (int)now.DayOfWeek;
        var minutesNow = (now.Hour * 60) + now.Minute;

        return workingHours.Periods.Any(period =>
            period.Days.Contains(day) &&
            minutesNow >= ToMinutes(period.Start) &&
            minutesNow < ToMinutes(period.End));
    }

    /// <summary>Parses "HH:mm" into minutes past midnight; malformed input never opens a clinic.</summary>
    private static int ToMinutes(string time)
    {
        var parts = time.Split(':');
        if (parts.Length != 2 ||
            !int.TryParse(parts[0], out var hours) ||
            !int.TryParse(parts[1], out var minutes))
        {
            return -1;
        }

        return (hours * 60) + minutes;
    }

    /// <summary>Turns the admin form's simplified schedule into a display label and periods.</summary>
    internal static WorkingHoursData BuildWorkingHours(ClinicScheduleDto schedule)
    {
        if (schedule.AlwaysOpen)
        {
            return new WorkingHoursData { Label = "Non-stop, 24/7", AlwaysOpen = true };
        }

        var labelParts = new List<string> { $"Lun–Vin, {schedule.WeekdayStart}–{schedule.WeekdayEnd}" };
        var periods = new List<WorkingHoursPeriodData>
        {
            new()
            {
                Days = new List<int> { 1, 2, 3, 4, 5 },
                Start = schedule.WeekdayStart,
                End = schedule.WeekdayEnd
            }
        };

        if (schedule.SaturdayEnabled)
        {
            labelParts.Add($"Sâm, {schedule.SaturdayStart}–{schedule.SaturdayEnd}");
            periods.Add(new WorkingHoursPeriodData
            {
                Days = new List<int> { 6 },
                Start = schedule.SaturdayStart,
                End = schedule.SaturdayEnd
            });
        }

        return new WorkingHoursData
        {
            Label = string.Join(" · ", labelParts),
            Periods = periods
        };
    }
}
