namespace MedGid.Domain.Exceptions;

/// <summary>
/// Raised by the business layer when a request is well formed but breaks a rule
/// of the domain — a taken e-mail, a slot already booked, a doctor that still
/// has appointments. The controllers translate it into the HTTP status it
/// carries, so the rule and the status code stay defined in one place.
/// </summary>
public class BusinessRuleException : Exception
{
    /// <summary>HTTP status the API should answer with. Defaults to 409 Conflict.</summary>
    public int StatusCode { get; }

    public BusinessRuleException(string message, int statusCode = StatusCodes.Conflict) : base(message)
    {
        StatusCode = statusCode;
    }

    /// <summary>The handful of statuses the business rules actually use.</summary>
    public static class StatusCodes
    {
        public const int BadRequest = 400;
        public const int Forbidden = 403;
        public const int Conflict = 409;
    }
}
