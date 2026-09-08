using MedGid.BusinessLayer.Core;
using MedGid.BusinessLayer.Interfaces;
using MedGid.Domain.Models.User;

namespace MedGid.BusinessLayer.Structure;

public class UserActionExecution : UserActions, IUserAction
{
    public List<UserDto> GetAllUsersAction() => GetAllUsersActionExecution();
    public UserDto? GetUserByIdAction(Guid id) => GetUserByIdActionExecution(id);
    public UserDto? UpdateProfileAction(Guid id, UpdateProfileDto dto) => UpdateProfileActionExecution(id, dto);
    public bool ChangePasswordAction(Guid id, ChangePasswordDto dto) => ChangePasswordActionExecution(id, dto);
    public bool DeleteUserAction(Guid id) => DeleteUserActionExecution(id);
}
