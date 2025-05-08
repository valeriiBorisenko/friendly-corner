namespace Friendly_Corner_backend.Models
{

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string Role { get; set; } = "user";
        public string? Name { get; set; }
        public string? PictureUrl { get; set; }
        public string? Email { get; set; }
        public string? WebUrl { get; set; }
        public string? Description { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    }
}