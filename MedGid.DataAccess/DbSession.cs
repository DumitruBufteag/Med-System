namespace MedGid.DataAccess;

/// <summary>
/// Holds the connection string for the whole process.
/// The API sets it once at startup from configuration, so every
/// <see cref="Context.MedGidDbContext"/> created further down the stack — including the
/// ones the business layer news up itself — talks to the same database without
/// having to carry the connection string through every call.
/// </summary>
public static class DbSession
{
    public static string ConnectionString { get; set; } = string.Empty;
}
