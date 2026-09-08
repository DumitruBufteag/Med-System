using MedGid.BusinessLayer.Interfaces;
using MedGid.BusinessLayer.Structure;

namespace MedGid.BusinessLayer;

/// <summary>
/// The single entry point into the business layer.
///
/// Controllers new up a BusinessLogic and ask it for the action they need, so the
/// API never references a concrete implementation — only the interfaces. Changing
/// how an action is executed is a change in this one file.
/// </summary>
public class BusinessLogic
{
    public BusinessLogic()
    {
    }

    /// <summary>
    /// Signing a token needs the JWT settings the API holds, so they are handed
    /// over per call instead of being duplicated inside the business layer.
    /// </summary>
    public IAuthAction AuthAction(string jwtKey, string jwtIssuer, string jwtAudience, int expiresInMinutes)
    {
        return new AuthActionExecution(jwtKey, jwtIssuer, jwtAudience, expiresInMinutes);
    }

    public IUserAction UserAction()
    {
        return new UserActionExecution();
    }

    public IClinicAction ClinicAction()
    {
        return new ClinicActionExecution();
    }

    public IDoctorAction DoctorAction()
    {
        return new DoctorActionExecution();
    }

    public ISpecialtyAction SpecialtyAction()
    {
        return new SpecialtyActionExecution();
    }

    public IAppointmentAction AppointmentAction()
    {
        return new AppointmentActionExecution();
    }

    public IReviewAction ReviewAction()
    {
        return new ReviewActionExecution();
    }
}
