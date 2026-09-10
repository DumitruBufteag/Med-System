using System.Security.Claims;
using MedGid.BusinessLayer.Core;
using MedGid.Domain.Models.Responses;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// Shared plumbing for the controllers: who is calling, and the two error bodies
/// they all return. Keeping it here means every endpoint answers 404 and 403 in
/// the same shape, which is what lets the axios interceptor handle them globally.
/// </summary>
[ApiController]
public abstract class MedGidControllerBase : ControllerBase
{
    /// <summary>The signed-in account, read from the bearer token — never from the request body.</summary>
    protected Guid CurrentUserId
    {
        get
        {
            var value = User.FindFirstValue(AuthActions.UserIdClaim);
            if (string.IsNullOrEmpty(value) || !Guid.TryParse(value, out var userId))
            {
                throw new UnauthorizedAccessException("Sesiune invalidă. Autentifică-te din nou.");
            }

            return userId;
        }
    }

    /// <summary>The e-mail carried by the token, for endpoints that echo the session back.</summary>
    protected string? CurrentUserEmail => User.FindFirstValue(AuthActions.EmailClaim);

    /// <summary>The role carried by the token — the same value [Authorize(Roles = ...)] matches on.</summary>
    protected string? CurrentUserRole => User.FindFirstValue(AuthActions.RoleClaim);

    protected bool IsAdmin => User.IsInRole("admin");

    /// <summary>
    /// True when the caller is acting on their own data, or is an administrator.
    /// Several routes carry the user id in the path, and without this check any
    /// signed-in account could read or edit another one by changing the URL.
    /// </summary>
    protected bool CanActOnBehalfOf(Guid userId) => IsAdmin || CurrentUserId == userId;

    protected NotFoundObjectResult NotFoundError(string message) =>
        NotFound(new ErrorResponse(StatusCodes.Status404NotFound, message));

    protected ObjectResult ForbiddenError(string message) =>
        StatusCode(StatusCodes.Status403Forbidden, new ErrorResponse(StatusCodes.Status403Forbidden, message));

    protected UnauthorizedObjectResult UnauthorizedError(string message) =>
        Unauthorized(new ErrorResponse(StatusCodes.Status401Unauthorized, message));
}
