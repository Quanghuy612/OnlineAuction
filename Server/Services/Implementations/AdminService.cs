using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Response;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly OnlineAuctionContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GetUserData _getUserData;

        public AdminService(OnlineAuctionContext db, IHttpContextAccessor httpContextAccessor, GetUserData getUserData)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
            _getUserData = getUserData;
        }

        public async Task<Response<object>> GetListAuctions(string status)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var auctions = await _db.Auctions.Where(x => x.Status == status).ToListAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Get list waitting auctions done",
                    data = auctions
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> AprroveAuction(int auctionId)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var auction = await _db.Auctions.Where(x => x.Id == auctionId).FirstOrDefaultAsync();

                if (auction == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction not found"
                    };
                }

                auction.Status = "Ready";
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Auction approved"
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> GetAuctionsReport()
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var auctions = await _db.AuctionLogs.ToListAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Get auctions report done",
                    data = auctions
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> GetUserReport(int userId)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var auctions = await _db.AuctionLogs.Where(x => x.UserId == userId).ToListAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Get list waitting auctions done",
                    data = auctions
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> LockUser(int? userId)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                if (user.Id == userId)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "The fuck you lock yourself for"
                    };
                }

                var userLock = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (userLock == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not found"
                    };
                }

                userLock.IsActive = false;
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Lock user successfully"
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> SearchUser(string name)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var users = await _db.Users.Where(x => x.Username.Contains(name)).ToListAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Lock user successfully",
                    data = users
                };
            }
            catch (Exception ex)
            {
                return new Response<object>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }
    }
}
