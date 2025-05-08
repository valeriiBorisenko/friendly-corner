using Friendly_Corner_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Friendly_Corner_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly byte[] _keyBytes;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _keyBytes = Encoding.ASCII.GetBytes(s: configuration["JwtSettings:SigningKey"]?? string.Empty);
            /*string signingKey = configuration["JwtSettings:SigningKey"];
            if (!string.IsNullOrEmpty(signingKey))
            {
                _keyBytes = Encoding.ASCII.GetBytes(signingKey);
            }
            else
                throw new InvalidOperationException("Signing key is missing in configuration.");*/
           
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                return BadRequest("User already exists");

            // Hash the password before saving
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.RegistrationDate = DateTime.UtcNow;
            user.UpdatedDate = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized("Invalid credentials");

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        Username = u.Username ?? string.Empty,
                        u.Password,
                        Email = u.Email ?? string.Empty,
                        Name = u.Name ?? string.Empty,
                        //PictureUrl = !string.IsNullOrEmpty(u.PictureUrl) ? $"{baseUrl}/{u.PictureUrl.Replace("\\", "/")}" : string.Empty,
                        PictureUrl = u.PictureUrl ?? string.Empty,
                        WebUrl = u.WebUrl ?? string.Empty,
                        Description = u.Description ?? string.Empty
                    })
                    .ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            try
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Update user details
                user.Username = updatedUser.Username;
                user.Email = updatedUser.Email;
                user.Name = updatedUser.Name;
                user.PictureUrl = updatedUser.PictureUrl;
                user.WebUrl = updatedUser.WebUrl;
                user.Description = updatedUser.Description;

                // Update password if provided
                if (!string.IsNullOrEmpty(updatedUser.Password))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
                }

                user.UpdatedDate = DateTime.UtcNow;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                // Log the exception details for troubleshooting
                Console.WriteLine($"Error updating user: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Delete the associated image file if it exists
                if (!string.IsNullOrEmpty(user.PictureUrl))
                {
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img-prfl");
                    var filePath = Path.Combine(uploadsFolderPath, Path.GetFileName(user.PictureUrl));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok("User deleted successfully");
            }
            catch (Exception ex)
            {
                // Log the exception details for troubleshooting
                Console.WriteLine($"Error deleting user: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("uploadProfileImage")]
        public async Task<IActionResult> UploadProfileImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded");

            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img-prfl");
            if (!Directory.Exists(uploadsFolderPath))
                Directory.CreateDirectory(uploadsFolderPath);

            var filePath = Path.Combine(uploadsFolderPath, image.FileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            var relativePath = Path.Combine("img-prfl", image.FileName);
            return Ok(new { path = relativePath });
        }

    }

    public class LoginDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
