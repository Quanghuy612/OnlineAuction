using OnlineAuction_BE.DTOs.Auction;
using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Interfaces
{
    public interface IUserService
    {
        public Task<Response<object>> GetUserAuctions();
        public Task<Response<object>> GetUserProducts(string name);
        public Task<Response<object>> AddAuction(AuctionRequest request);
        public Task<Response<object>> ToggleAuction(int auctionId, string Status);
        public Task<Response<object>> AddBid(BidRequest request);
        public Task<Response<object>> ShowBidHistory(int auctionId);
    }
}
