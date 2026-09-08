using System.ComponentModel.DataAnnotations;

namespace MedGid.Domain.Models.User;

/// <summary>A user as it reaches the client — mirrors the `User` TypeScript interface.</summary>
public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string Role { get; set; } = "patient";

    /// <summary>ISO 8601 timestamp, matching `User.createdAt` on the client.</summary>
    public string CreatedAt { get; set; } = string.Empty;
}

/// <summary>Payload for editing the signed-in user's own profile.</summary>
public class UpdateProfileDto
{
    [Required, MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
}

/// <summary>Payload for changing the signed-in user's password.</summary>
public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}
