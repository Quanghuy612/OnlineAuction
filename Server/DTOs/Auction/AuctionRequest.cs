namespace OnlineAuction_BE.DTOs.Auction
{
    public class AuctionRequest
    {
        public required string Name { get; set; }
        public required int ProductId { get; set; }
        public decimal StartingPrice { get; set; }
        public decimal BidPerTurn { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
