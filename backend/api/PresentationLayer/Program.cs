using BusinessLayer;
using DataAccessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataAccessLayer.Data;
using Hangfire;
using Hangfire.Dashboard;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using PresentationLayer.Filters;


var builder = WebApplication.CreateBuilder(args);

var issuer = builder.Configuration["JWTOptions:Issuer"] ?? throw new InvalidOperationException("issuer");
var audience = builder.Configuration["JWTOptions:Audience"] ?? throw new InvalidOperationException("audience");
var key = builder.Configuration["JWTOptions:SigningKey"] ?? throw new InvalidOperationException("key");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 5 * 1024 * 1024;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("https://app.mitakiilab.com", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.ConfigureDataAccessServices();
builder.ConfigureBusinessServices();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)),
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // manually take token from cookies instead of headers
            if(context.Request.Cookies.ContainsKey("accessToken"))
                context.Token = context.Request.Cookies["accessToken"];
            
            return Task.CompletedTask;
        }
    };
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                               ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddHangfire(config =>
{
    config.UsePostgreSqlStorage(
        options => options.UseNpgsqlConnection(
            builder.Configuration.GetConnectionString("DefaultConnection")),
        new PostgreSqlStorageOptions()
        {
            InvisibilityTimeout =  TimeSpan.FromMinutes(5),
            QueuePollInterval = TimeSpan.FromSeconds(10)
        });
});

builder.Services.AddHangfireServer();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddAuthorization();

var app = builder.Build();

app.MapHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new []
    {
        new AuthorizationFilter()
    }
});

RecurringJob.AddOrUpdate<IStatisticsService>(
    "statistics-processor",
    s => s.ProcessDirtyStatistics(),
    Cron.Minutely);

RecurringJob.AddOrUpdate<ITokenService>(
    "refresh-token-cleanup",
    s => s.CleanupStaleRefreshTokensAsync(),
    Cron.Daily);

app.UseExceptionHandler("/error");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
    await SeedRoles.SeedRolesAsync(scope.ServiceProvider);
    await SeedAdmin.SeedAsync(scope.ServiceProvider);
}
else
{
app.UseForwardedHeaders();
    
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();