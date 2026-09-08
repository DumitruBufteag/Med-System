namespace MedGid.Domain.Models.Responses;

/// <summary>Uniform envelope returned by endpoints that have no body of their own.</summary>
public class ActionResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }

    public static ActionResponse Ok(string? message = null) => new() { IsSuccess = true, Message = message };
    public static ActionResponse Fail(string message) => new() { IsSuccess = false, Message = message };
}

/// <summary>Error body returned on every non-2xx response, read by the axios interceptor.</summary>
public class ErrorResponse
{
    public int Status { get; set; }
    public string Message { get; set; } = string.Empty;

    public ErrorResponse() { }

    public ErrorResponse(int status, string message)
    {
        Status = status;
        Message = message;
    }
}
