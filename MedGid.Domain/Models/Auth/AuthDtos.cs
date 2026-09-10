using System.ComponentModel.DataAnnotations;
using MedGid.Domain.Models.User;

namespace MedGid.Domain.Models.Auth;

/// <summary>Credentials posted to /api/auth/login.</summary>
public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

/// <summary>Payload required to create an account.</summary>
public class RegisterDto
{
    [Required, MinLength(2)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? Phone { get; set; }
}

/// <summary>
/// What the client stores after a successful sign in: the bearer token and the
/// account it belongs to. Matches `{ token, user }` destructured in authService.
/// </summary>
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;

    /// <summary>ISO 8601 instant the token stops being accepted.</summary>
    public string ExpiresAt { get; set; } = string.Empty;

    public UserDto User { get; set; } = new();
}

/// <summary>
/// The outcome of checking a bearer token against the signing key, issuer,
/// audience and lifetime — the claims the API itself would read from it.
/// Returned by /api/auth/validate so a token can be inspected without guessing.
/// </summary>
public class TokenValidationResultDto
{
    public bool IsValid { get; set; }

    /// <summary>Why the token was rejected. Null when <see cref="IsValid"/> is true.</summary>
    public string? Error { get; set; }

    public Guid? UserId { get; set; }
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Role { get; set; }

    /// <summary>ISO 8601, read from the `exp` claim.</summary>
    public string? ExpiresAt { get; set; }
}
