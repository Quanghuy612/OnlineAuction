using System.ComponentModel.DataAnnotations;

namespace OnlineAuction_BE.DTOs.Auction
{
    public class BidRequest
    {
        public decimal BidAmount { get; set; }
        public required int AuctionId { get; set; }
    }
}
