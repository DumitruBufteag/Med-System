using System.ComponentModel.DataAnnotations;

namespace MedGid.Domain.Models.Appointment;

/// <summary>Mirrors the `Appointment` TypeScript interface.</summary>
public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid ClinicId { get; set; }
    public Guid DoctorId { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

/// <summary>
/// Payload required to book an appointment. The patient is never taken from the
/// body — it is read from the bearer token, so nobody can book on someone else's behalf.
/// </summary>
public class CreateAppointmentDto
{
    [Required]
    public Guid ClinicId { get; set; }

    [Required]
    public Guid DoctorId { get; set; }

    /// <summary>ISO date string (YYYY-MM-DD).</summary>
    [Required, RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "Date must use the YYYY-MM-DD format.")]
    public string Date { get; set; } = string.Empty;

    /// <summary>Time slot in "HH:mm" format.</summary>
    [Required, RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "Time must use the HH:mm format.")]
    public string Time { get; set; } = string.Empty;

    public string? Notes { get; set; }
}
