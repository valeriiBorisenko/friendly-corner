namespace Friendly_Corner_backend.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan BookingTime { get; set; }

        public Room? Room { get; set; }
        public User? User { get; set; }
    }
}