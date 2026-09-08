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

    private AuthResponseDto BuildResponse(UserData user) => new()
    {
        Token = GenerateToken(user),
        User = user.ToDto()
    };

    private string GenerateToken(UserData user)
    {
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            // Matches RoleClaimType = "Role" in the API's token validation, which is
            // what makes [Authorize(Roles = "admin")] work.
            new Claim("Role", user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expiresInMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
