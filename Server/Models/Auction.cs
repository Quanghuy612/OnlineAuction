using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineAuction_BE.Models
{
    public class Auction
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal BidPerTurn { get; set; }
        public decimal StartingPrice { get; set; }
        public decimal? CurrentHighestBid { get; set; }
        public string Status { get; set; } = "Waitting";
        public int? WinnerUserId { get; set; }
        public int OwnerId { get; set; }
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
