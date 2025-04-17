using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineAuction_BE.Models
{
    public class AuctionLog
    {
        [Key]
        public int Id { get; set; }
        public decimal? BidAmount { get; set; }
        public DateTime Timestamp { get; set; }
        public string Action { get; set; }
        public int UserId { get; set; }
        public int AuctionId { get; set; }
    }
}
