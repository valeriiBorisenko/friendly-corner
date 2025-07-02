using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Friendly_Corner_backend.Models;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPass = Environment.GetEnvironmentVariable("DB_PASS");

var slackChannelId = Environment.GetEnvironmentVariable("SLACK_CHANNEL_ID");
var slackToken = Environment.GetEnvironmentVariable("SLACK_TOKEN");

builder.Configuration["Slack:ChannelId"] = slackChannelId;
builder.Configuration["Slack:Token"] = slackToken;

var connectionString = $"Server=localhost;Database={dbName};User={dbUser};Password={dbPass};";

// Set the connection string in the configuration
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigin",
        builder => builder.WithOrigins("http://localhost:5173") // Replace port nr to corresponding number
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Get the JWT key from configuration
var jwtSigningKey = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY")
    ?? throw new ArgumentNullException("JWT_SIGNING_KEY", "JWT Signing Key not found in environment.");
builder.Configuration["JwtSettings:SigningKey"] = jwtSigningKey;
var keyBytes = Encoding.ASCII.GetBytes(jwtSigningKey);

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

// Register Slack service
builder.Services.AddSingleton<SlackService>();
builder.Services.Configure<SlackOptions>(builder.Configuration.GetSection("Slack"));

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

// Check database connection
using (var scope = builder.Services.BuildServiceProvider().CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (db.Database.CanConnect())
            Console.WriteLine("Database connection successful!");
        else
            Console.WriteLine("Database connection failed!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Database connection failed: " + ex.Message);
    }
}

app.Run();
