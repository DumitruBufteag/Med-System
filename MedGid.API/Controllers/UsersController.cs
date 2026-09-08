using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedGid.API.Controllers;

/// <summary>
/// Accounts: the admin patient list, and the profile screen every signed-in user
/// has. The user id travels in the path, so each route checks that the caller is
/// either that user or an administrator before touching anything.
/// </summary>
[Route("api/users")]
[Authorize]
public class UsersController : MedGidControllerBase
{
    internal readonly IUserAction _user;

    public UsersController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _user = bl.UserAction();
    }

    [HttpGet("getAll")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_user.GetAllUsersAction());
    }

    [HttpGet("getById/{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(Guid id)
    {
        if (!CanActOnBehalfOf(id))
        {
            return ForbiddenError("Poți vedea doar propriul cont.");
        }

        var user = _user.GetUserByIdAction(id);

        return user is null
            ? NotFoundError("Contul nu a fost găsit.")
            : Ok(user);
    }

    [HttpPut("updateProfile/{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult UpdateProfile(Guid id, [FromBody] UpdateProfileDto dto)
    {
        if (!CanActOnBehalfOf(id))
        {
            return ForbiddenError("Poți edita doar propriul cont.");
        }

        var updated = _user.UpdateProfileAction(id, dto);

        return updated is null
            ? NotFoundError("Contul nu a fost găsit.")
            : Ok(updated);
    }

    [HttpPut("changePassword/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult ChangePassword(Guid id, [FromBody] ChangePasswordDto dto)
    {
        // Not even an administrator gets to set someone else a new password without
        // knowing the current one, which is what this endpoint verifies.
        if (CurrentUserId != id)
        {
            return ForbiddenError("Poți schimba doar propria parolă.");
        }

        return _user.ChangePasswordAction(id, dto)
            ? NoContent()
            : NotFoundError("Contul nu a fost găsit.");
    }

    [HttpDelete("delete/{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public IActionResult Delete(Guid id)
    {
        return _user.DeleteUserAction(id)
            ? NoContent()
            : NotFoundError("Contul nu a fost găsit.");
    }
}
