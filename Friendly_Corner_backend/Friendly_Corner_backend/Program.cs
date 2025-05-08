using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Friendly_Corner_backend.Models;

var builder = WebApplication.CreateBuilder(args);
// Add Slack configuration
builder.Services.Configure<SlackOptions>(builder.Configuration.GetSection("Slack"));

// Register Slack service
builder.Services.AddSingleton<SlackService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigin",
        builder => builder.WithOrigins("http://localhost:5173") // Replace port nr to corresponding number
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Get the JWT key from configuration
var jwtKey = builder.Configuration["JwtSettings:SigningKey"]
    ?? throw new ArgumentNullException("JwtSettings:SigningKey", "JWT Signing Key not found in configuration.");
var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

// Configure MySQL Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
    new MySqlServerVersion(new Version(8, 0, 26))));

// Configure Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth API", Version = "v1" });
});

// Add HTTP client factory
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Middleware for logging requests and setting CORS headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173");
    context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Log the request path for debugging
    Console.WriteLine($"Request Path: {context.Request.Path}");

    await next.Invoke();
});

app.UseRouting();
app.UseStaticFiles(); // Serve all files under wwwroot

app.UseCors("AllowAllOrigin");
app.UseSwagger();
app.UseSwaggerUI(); // Swagger UI
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
