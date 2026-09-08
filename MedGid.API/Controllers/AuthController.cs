using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// Sign in and sign up. Both answer with the bearer token and the account it
/// belongs to, which is exactly what the client stores after a successful call.
/// </summary>
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : MedGidControllerBase
{
    internal readonly IAuthAction _auth;

    public AuthController(IConfiguration configuration)
    {
        var bl = new BusinessLayer.BusinessLogic();

        _auth = bl.AuthAction(
            configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing."),
            configuration["Jwt:Issuer"] ?? "MedGidAPI",
            configuration["Jwt:Audience"] ?? "MedGidApp",
            configuration.GetValue<int?>("Jwt:ExpiresInMinutes") ?? 60);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var result = _auth.LoginAction(dto);

        // One message for both an unknown address and a wrong password, so the form
        // cannot be used to find out which e-mails are registered.
        return result is null
            ? UnauthorizedError("E-mail sau parolă incorectă.")
            : Ok(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var result = _auth.RegisterAction(dto);
        return StatusCode(StatusCodes.Status201Created, result);
    }
}
