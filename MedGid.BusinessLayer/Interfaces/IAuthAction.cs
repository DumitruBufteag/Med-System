using MedGid.Domain.Models.Auth;

namespace MedGid.BusinessLayer.Interfaces;

public interface IAuthAction
{
    /// <summary>Returns null when the e-mail is unknown or the password does not match.</summary>
    AuthResponseDto? LoginAction(LoginDto dto);

    /// <summary>Throws a BusinessRuleException when the e-mail is already registered.</summary>
    AuthResponseDto RegisterAction(RegisterDto dto);

    /// <summary>
    /// Checks signature, issuer, audience and lifetime, and reports the claims.
    /// An invalid token comes back as a result with IsValid false, not an exception.
    /// </summary>
    TokenValidationResultDto ValidateToken(string? token);
}
