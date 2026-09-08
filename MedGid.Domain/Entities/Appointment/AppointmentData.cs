namespace MedGid.Domain.Entities.Appointment;

/// <summary>An appointment booked by a patient.</summary>
public class AppointmentData
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid ClinicId { get; set; }
    public Guid DoctorId { get; set; }

    /// <summary>ISO date string (YYYY-MM-DD), kept as text so no time zone can shift it.</summary>
    public string Date { get; set; } = string.Empty;

    /// <summary>Time slot in "HH:mm" format.</summary>
    public string Time { get; set; } = string.Empty;

    /// <summary>One of: pending, confirmed, cancelled, done.</summary>
    public string Status { get; set; } = "confirmed";

    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
