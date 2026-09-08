using System.Text.Json;
using MedGid.Domain.Exceptions;
using MedGid.Domain.Models.Responses;

namespace MedGid.API.Middleware;

/// <summary>
/// Turns anything thrown below it into the JSON error body the client expects:
/// <c>{ "status": 409, "message": "..." }</c>, which is what
/// <c>extractServiceError</c> and the axios response interceptor read.
///
/// Having it here means a controller never has to translate a domain rule into a
/// status code by hand, and an unexpected crash still leaves the API answering
/// JSON instead of an HTML error page the frontend cannot parse.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (BusinessRuleException exception)
        {
            // An expected outcome, not a failure: the request was well formed but
            // broke a rule of the domain, and the rule carries its own status.
            await WriteAsync(context, exception.StatusCode, exception.Message);
        }
        catch (UnauthorizedAccessException exception)
        {
            await WriteAsync(context, StatusCodes.Status401Unauthorized, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception while processing {Method} {Path}",
                context.Request.Method, context.Request.Path);

            // The real message could leak connection strings or table names, so it
            // only reaches the client while developing.
            var message = _environment.IsDevelopment()
                ? exception.Message
                : "A apărut o eroare pe server. Încearcă din nou mai târziu.";

            await WriteAsync(context, StatusCodes.Status500InternalServerError, message);
        }
    }

    private static async Task WriteAsync(HttpContext context, int status, string message)
    {
        // Anything already sent cannot be replaced by an error body.
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.Clear();
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var payload = JsonSerializer.Serialize(
            new ErrorResponse(status, message),
            new JsonSerializerOptions(JsonSerializerDefaults.Web));

        await context.Response.WriteAsync(payload);
    }
}
