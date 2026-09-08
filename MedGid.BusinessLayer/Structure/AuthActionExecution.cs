using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.Auth;

namespace MedGid.BusinessLayer.Structure;

public class AuthActionExecution : AuthActions, IAuthAction
{
    public AuthActionExecution(string jwtKey, string jwtIssuer, string jwtAudience, int expiresInMinutes)
        : base(jwtKey, jwtIssuer, jwtAudience, expiresInMinutes)
    {
    }

    public AuthResponseDto? LoginAction(LoginDto dto) => LoginActionExecution(dto);
    public AuthResponseDto RegisterAction(RegisterDto dto) => RegisterActionExecution(dto);
}
