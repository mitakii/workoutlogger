using BusinessLayer;
using DataAccessLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using BusinessLayer.Services;
using DataAccessLayer.Data;


var builder = WebApplication.CreateBuilder(args);

var issuer = builder.Configuration["JWTOptions:Issuer"] ?? throw new InvalidOperationException("issuer");
var audience = builder.Configuration["JWTOptions:Audience"] ?? throw new InvalidOperationException("audience");
var key = builder.Configuration["JWTOptions:SigningKey"] ?? throw new InvalidOperationException("key");


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
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


builder.Services.AddAuthorization();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        await SeedRoles.SeedRolesAsync(scope.ServiceProvider);
        await SeedAdmin.SeedAsync(scope.ServiceProvider);
    }
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();