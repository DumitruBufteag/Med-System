namespace MedGid.Domain.Entities.User;

/// <summary>A registered account, as stored in the database.</summary>
public class UserData
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }

    /// <summary>One of: patient, clinic, admin.</summary>
    public string Role { get; set; } = "patient";

    /// <summary>BCrypt digest. Never leaves the business layer.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
