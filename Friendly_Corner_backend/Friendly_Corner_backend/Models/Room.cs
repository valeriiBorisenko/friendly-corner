

namespace Friendly_Corner_backend.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public bool Availability { get; set; }
    }
}