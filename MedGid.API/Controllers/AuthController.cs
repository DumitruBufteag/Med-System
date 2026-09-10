using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Auth;
using MedGid.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// Sign in and sign up. Both answer with the bearer token and the account it
/// belongs to, which is exactly what the client stores after a successful call.
///
/// Note there is no [AllowAnonymous] on the class: it wins over an action-level
/// [Authorize] regardless of order, which would leave /me open to anyone.
/// </summary>
[Route("api/auth")]
public class AuthController : MedGidControllerBase
{
    internal readonly IAuthAction _auth;
    internal readonly IUserAction _user;

    public AuthController(IConfiguration configuration)
    {
        var bl = new BusinessLayer.BusinessLogic();

        _auth = bl.AuthAction(
            configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing."),
            configuration["Jwt:Issuer"] ?? "MedGidAPI",
            configuration["Jwt:Audience"] ?? "MedGidApp",
            configuration.GetValue<int?>("Jwt:ExpiresInMinutes") ?? 60);

        _user = bl.UserAction();
    }

    [HttpPost("login")]
    [AllowAnonymous]
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
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var result = _auth.RegisterAction(dto);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>
    /// The account behind the bearer token. The client calls this on start-up to
    /// find out whether a token left in storage is still worth anything — a check
    /// that has to happen on the server, since a browser cannot verify a signature
    /// it has no key for.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Me()
    {
        var user = _user.GetUserByIdAction(CurrentUserId);

        // The token verified, but the account behind it is gone — deleted while the
        // session was still open. Treated as a dead session, not as a missing page.
        return user is null
            ? UnauthorizedError("Contul acestei sesiuni nu mai există.")
            : Ok(user);
    }

    /// <summary>
    /// Reports what the API makes of a token: valid or not, and the claims it
    /// carries. Anonymous on purpose — the point is to be able to inspect a token
    /// that has been rejected, which an [Authorize] route could never show.
    /// </summary>
    [HttpGet("validate")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(TokenValidationResultDto), StatusCodes.Status200OK)]
    public IActionResult Validate()
    {
        var header = Request.Headers.Authorization.ToString();
        return Ok(_auth.ValidateToken(header));
    }
}
