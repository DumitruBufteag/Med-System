using System.Text;
using MedGid.API.Middleware;
using MedGid.BusinessLayer.Core;
using MedGid.DataAccess;
using MedGid.DataAccess.Context;
using MedGid.DataAccess.Seed;
using MedGid.Domain.Models.Responses;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Database ─────────────────────────────────────────────────────────────────
// appsettings.json ships this key empty on purpose: credentials must never be
// committed. In development they come from User Secrets, which live in the
// user profile rather than the repository; in production, from the environment.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "The database connection string is not configured. In development, set it once with:\n" +
        "  dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" \"Host=localhost;Port=5433;Database=medgid;Username=postgres;Password=<your password>\" --project MedGid.API\n" +
        "In production, set the environment variable ConnectionStrings__DefaultConnection instead.");
}

// Every DbContext created further down the stack reads this, so the business
// layer can open a connection without carrying the string through every call.
DbSession.ConnectionString = connectionString;

builder.Services.AddDbContext<MedGidDbContext>(options => options.UseNpgsql(connectionString));

// ── JWT ──────────────────────────────────────────────────────────────────────
// Checked for blank, not just for null: an empty string would sail past a null
// check and fail much later, deep inside token signing, with a useless message.
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "The JWT signing key is not configured. In development, set it once with:\n" +
        "  dotnet user-secrets set \"Jwt:Key\" \"<at least 32 characters>\" --project MedGid.API\n" +
        "In production, set the environment variable Jwt__Key instead.");
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MedGidAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "MedGidApp";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Off, so the `sub` and `role` claims AuthActions writes stay under those
        // names instead of being expanded into the WS-Federation ClaimTypes URIs.
        // The browser decodes the same payload, and short names are what it reads.
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            // Default is five minutes of grace, which would let an expired token
            // keep working long enough to look like a bug rather than an expiry.
            ClockSkew = TimeSpan.Zero,
            // Must match the claims AuthActions writes: this is what makes
            // [Authorize(Roles = "admin")] and User.Identity.Name resolve.
            NameClaimType = AuthActions.NameClaim,
            RoleClaimType = AuthActions.RoleClaim
        };

        // The default challenge writes an empty body; the client needs the same
        // JSON error shape here as everywhere else for its interceptor to read.
        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();

                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new ErrorResponse(
                        StatusCodes.Status401Unauthorized,
                        "Autentificare necesară."));
                }
            },
            OnForbidden = async context =>
            {
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new ErrorResponse(
                        StatusCodes.Status403Forbidden,
                        "Nu ai permisiunea necesară pentru această acțiune."));
                }
            }
        };
    });

builder.Services.AddAuthorization();

// ── CORS ─────────────────────────────────────────────────────────────────────
// The Vite dev server runs on a different origin, so the browser will not send
// the request at all without this policy.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ── MVC ──────────────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// A failed [Required] or [EmailAddress] check would otherwise answer with
// ValidationProblemDetails, whose shape the client does not read. This turns it
// into the same { status, message } body as every other error.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var message = string.Join(" ", context.ModelState
            .SelectMany(entry => entry.Value?.Errors ?? new())
            .Select(error => error.ErrorMessage)
            .Where(text => !string.IsNullOrWhiteSpace(text)));

        return new BadRequestObjectResult(new ErrorResponse(
            StatusCodes.Status400BadRequest,
            string.IsNullOrWhiteSpace(message) ? "Datele trimise nu sunt valide." : message));
    };
});

// ── Swagger ──────────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MedGid API",
        Version = "v1",
        Description = "Catalog de clinici, medici și programări medicale din Republica Moldova."
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Introdu tokenul JWT primit de la /api/auth/login (fără prefixul 'Bearer')."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── Schema and demo data ─────────────────────────────────────────────────────
// Applying migrations at startup keeps the project a single `dotnet run` away
// from working, which is what a reviewer cloning the repository needs.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MedGidDbContext>();
    db.Database.Migrate();
    DatabaseSeeder.Seed();
}

// ── Middleware pipeline ──────────────────────────────────────────────────────
// First in the pipeline, so it can still replace the response of anything that
// throws further down.
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "MedGid API v1");
        // Swagger UI on the root, so http://localhost:5200 opens the docs.
        options.RoutePrefix = string.Empty;
    });
}
else
{
    // The dev server talks plain HTTP on localhost; redirecting there would turn
    // every API call into a failed CORS preflight.
    app.UseHttpsRedirection();
}

app.UseCors("FrontendPolicy");

app.UseAuthentication(); // must come before UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
