using MedGid.DataAccess.Context;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.User;

namespace MedGid.BusinessLayer.Core;

public class UserActions
{
    public UserActions()
    {
    }

    internal List<UserDto> GetAllUsersActionExecution()
    {
        using var db = new MedGidDbContext();

        return db.Users
            .OrderBy(user => user.Name)
            .ToList()
            .Select(user => user.ToDto())
            .ToList();
    }

    internal UserDto? GetUserByIdActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var user = db.Users.FirstOrDefault(item => item.Id == id);
        return user?.ToDto();
    }

    internal UserDto? UpdateProfileActionExecution(Guid id, UpdateProfileDto dto)
    {
        using var db = new MedGidDbContext();

        var user = db.Users.FirstOrDefault(item => item.Id == id);
        if (user is null)
        {
            return null;
        }

        var email = dto.Email.Trim().ToLower();
        if (db.Users.Any(item => item.Id != id && item.Email == email))
        {
            throw new BusinessRuleException("Există deja un cont cu această adresă de e-mail.");
        }

        user.Name = dto.Name.Trim();
        user.Email = email;
        user.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim();

        db.Users.Update(user);
        db.SaveChanges();

        return user.ToDto();
    }

    internal bool ChangePasswordActionExecution(Guid id, ChangePasswordDto dto)
    {
        using var db = new MedGidDbContext();

        var user = db.Users.FirstOrDefault(item => item.Id == id);
        if (user is null)
        {
            return false;
        }

        // Knowing the current password is what proves the session belongs to the
        // account's owner and not to a borrowed, still-valid token.
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            throw new BusinessRuleException(
                "Parola curentă nu este corectă.",
                BusinessRuleException.StatusCodes.BadRequest);
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

        db.Users.Update(user);
        db.SaveChanges();

        return true;
    }

    internal bool DeleteUserActionExecution(Guid id)
    {
        using var db = new MedGidDbContext();

        var user = db.Users.FirstOrDefault(item => item.Id == id);
        if (user is null)
        {
            return false;
        }

        // The catalogue would lose its last administrator and become uneditable.
        if (user.Role == "admin" && db.Users.Count(item => item.Role == "admin") == 1)
        {
            throw new BusinessRuleException("Nu poți șterge ultimul cont de administrator.");
        }

        // The patient's appointments cascade with the account (see MedGidDbContext).
        db.Users.Remove(user);
        db.SaveChanges();

        return true;
    }
}
