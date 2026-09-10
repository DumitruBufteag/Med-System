using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MedGid.DataAccess.Context;
using MedGid.Domain.Entities.User;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.Auth;
using Microsoft.IdentityModel.Tokens;

namespace MedGid.BusinessLayer.Core;

public class AuthActions
{
    /// <summary>
    /// The claim names written into the token and read back out of it.
    ///
    /// Short, registered names rather than the WS-Federation URIs that
    /// <see cref="ClaimTypes"/> expands to: the browser decodes this payload to
    /// condition the interface, and `sub` is far easier to read there than
    /// `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`.
    /// The API mirrors these names in its TokenValidationParameters.
    /// </summary>
    public const string UserIdClaim = "sub";
    public const string EmailClaim = "email";
    public const string NameClaim = "name";
    public const string RoleClaim = "role";

    private readonly string _jwtKey;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly int _expiresInMinutes;

    public AuthActions(string jwtKey, string jwtIssuer, string jwtAudience, int expiresInMinutes)
    {
        _jwtKey = jwtKey;
        _jwtIssuer = jwtIssuer;
        _jwtAudience = jwtAudience;
        _expiresInMinutes = expiresInMinutes;
    }

    internal AuthResponseDto? LoginActionExecution(LoginDto dto)
    {
        using var db = new MedGidDbContext();

        var email = dto.Email.Trim().ToLower();
        var user = db.Users.FirstOrDefault(item => item.Email == email);

        // The caller gets the same null for both cases, so the login form cannot be
        // used to find out which addresses are registered.
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return null;
        }

        return BuildResponse(user);
    }

    internal AuthResponseDto RegisterActionExecution(RegisterDto dto)
    {
        using var db = new MedGidDbContext();

        var email = dto.Email.Trim().ToLower();
        if (db.Users.Any(item => item.Email == email))
        {
            throw new BusinessRuleException("Există deja un cont cu această adresă de e-mail.");
        }

        var user = new UserData
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Email = email,
            Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
            // Self-service registration always creates a patient; clinic and admin
            // accounts are provisioned, never claimed from the sign-up form.
            Role = "patient",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        db.SaveChanges();

        return BuildResponse(user);
    }

    /// <summary>
    /// Runs a token through the same checks the API's bearer middleware applies —
    /// signature, issuer, audience and lifetime — and reports the claims it holds.
    /// Never throws: an invalid token is an answer, not a failure.
    /// </summary>
    internal TokenValidationResultDto ValidateTokenExecution(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return new TokenValidationResultDto { IsValid = false, Error = "Token lipsă." };
        }

        // A client that copies the whole header instead of the token alone is a
        // common enough mistake to be worth absorbing here.
        token = token.Trim();
        if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            token = token["Bearer ".Length..].Trim();
        }

        var handler = new JwtSecurityTokenHandler
        {
            // Without this the handler renames `sub` to the ClaimTypes URI, and the
            // lookups below would silently find nothing.
            MapInboundClaims = false
        };

        try
        {
            var principal = handler.ValidateToken(token, BuildValidationParameters(), out var validated);

            return new TokenValidationResultDto
            {
                IsValid = true,
                UserId = Guid.TryParse(principal.FindFirst(UserIdClaim)?.Value, out var userId) ? userId : null,
                Email = principal.FindFirst(EmailClaim)?.Value,
                Name = principal.FindFirst(NameClaim)?.Value,
                Role = principal.FindFirst(RoleClaim)?.Value,
                ExpiresAt = validated.ValidTo.ToString("o")
            };
        }
        catch (SecurityTokenExpiredException)
        {
            return new TokenValidationResultDto { IsValid = false, Error = "Token expirat." };
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            return new TokenValidationResultDto { IsValid = false, Error = "Semnătura tokenului nu este validă." };
        }
        catch (SecurityTokenException)
        {
            // Deliberately not exception.Message: the handler's IDX messages spell
            // out the configured issuer and audience, and this endpoint is
            // anonymous, so anyone could read them off a rejected token.
            return new TokenValidationResultDto { IsValid = false, Error = "Token invalid." };
        }
        catch (ArgumentException)
        {
            // Not a JWT at all — a truncated or hand-typed string.
            return new TokenValidationResultDto { IsValid = false, Error = "Tokenul nu are formatul unui JWT." };
        }
    }

    /// <summary>Shared by token validation here and by the API's bearer middleware.</summary>
    private TokenValidationParameters BuildValidationParameters() => new()
    {
        ValidateIssuer = true,
        ValidIssuer = _jwtIssuer,
        ValidateAudience = true,
        ValidAudience = _jwtAudience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey)),
        // Default is five minutes of grace, which would let an expired token keep
        // working long enough to look like a bug rather than an expiry.
        ClockSkew = TimeSpan.Zero,
        NameClaimType = NameClaim,
        RoleClaimType = RoleClaim
    };

    private AuthResponseDto BuildResponse(UserData user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(_expiresInMinutes);

        return new AuthResponseDto
        {
            Token = GenerateToken(user, expiresAt),
            ExpiresAt = expiresAt.ToString("o"),
            User = user.ToDto()
        };
    }

    private string GenerateToken(UserData user, DateTime expiresAt)
    {
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(UserIdClaim, user.Id.ToString()),
            new Claim(EmailClaim, user.Email),
            new Claim(NameClaim, user.Name),
            new Claim(RoleClaim, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
