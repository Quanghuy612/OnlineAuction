using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Interfaces
{
    public interface IAuctionService
    {
        public Task<Response<object>> GetAuctions(string? category, string? name);
        public Task<Response<object>> GetAuctionDetail(int auctionId);
        public Task<Response<object>> BidAuction(int auctionId);
    }
}
