namespace Friendly_Corner_backend.Models
{
    public class Price
    {
        public int Id { get; set; }
        public string? Location { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}