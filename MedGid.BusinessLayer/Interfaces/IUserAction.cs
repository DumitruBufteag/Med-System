using MedGid.Domain.Models.User;

namespace MedGid.BusinessLayer.Interfaces;

public interface IUserAction
{
    List<UserDto> GetAllUsersAction();
    UserDto? GetUserByIdAction(Guid id);
    UserDto? UpdateProfileAction(Guid id, UpdateProfileDto dto);
    bool ChangePasswordAction(Guid id, ChangePasswordDto dto);
    bool DeleteUserAction(Guid id);
}
