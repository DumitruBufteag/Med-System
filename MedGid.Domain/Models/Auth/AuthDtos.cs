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
    public UserDto User { get; set; } = new();
}
