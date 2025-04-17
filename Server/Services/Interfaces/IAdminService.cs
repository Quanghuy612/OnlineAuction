using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Interfaces
{
    public interface IAdminService
    {
        public Task<Response<object>> GetListAuctions(string status);
        public Task<Response<object>> AprroveAuction(int auctionId);
        public Task<Response<object>> GetAuctionsReport();
        public Task<Response<object>> GetUserReport(int userId);
        public Task<Response<object>> LockUser(int? userId);
        public Task<Response<object>> SearchUser(string name);
    }
}
