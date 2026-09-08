namespace MedGid.Domain.Entities.Clinic;

/// <summary>A block of opening hours, e.g. Mon-Fri 08:00-19:00.</summary>
public class WorkingHoursPeriodData
{
    /// <summary>Days this period applies to: 0 = Sunday ... 6 = Saturday.</summary>
    public List<int> Days { get; set; } = new();

    /// <summary>24h "HH:mm" time the clinic opens.</summary>
    public string Start { get; set; } = string.Empty;

    /// <summary>24h "HH:mm" time the clinic closes.</summary>
    public string End { get; set; } = string.Empty;
}

/// <summary>
/// Opening hours of a clinic, persisted as a jsonb column.
/// The live open/closed status is derived from these periods, never stored.
/// </summary>
public class WorkingHoursData
{
    public string Label { get; set; } = string.Empty;
    public bool AlwaysOpen { get; set; }
    public List<WorkingHoursPeriodData> Periods { get; set; } = new();
}
