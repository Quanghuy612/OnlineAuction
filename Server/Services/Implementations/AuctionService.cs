using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Auction;
using OnlineAuction_BE.DTOs.Response;
using OnlineAuction_BE.Models;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Services.Implementations
{
    public class AuctionService : IAuctionService
    {
        private readonly OnlineAuctionContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GetUserData _getUserData;

        public AuctionService(OnlineAuctionContext db, IHttpContextAccessor httpContextAccessor, GetUserData getUserData)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
            _getUserData = getUserData;
        }

        public async Task<Response<object>> GetAuctions(string? category, string? name)
        {
            try
            {
                var auctionList = await _db.Auctions
                    .Join(
                        _db.Products,
                        a => a.ProductId,
                        p => p.Id,
                        (a, p) => new { Auction = a, Product = p }
                    )
                    .Join(
                        _db.Users,
                        ap => ap.Auction.OwnerId,
                        u => u.Id,
                        (ap, user) => new
                        {
                            Id = ap.Auction.Id,
                            Name = ap.Auction.Name,
                            Status = ap.Auction.Status,
                            OwnerId = ap.Auction.OwnerId,
                            Username = user.Username,
                            ProductId = ap.Auction.ProductId,
                            StartTime = ap.Auction.StartTime,
                            EndTime = ap.Auction.EndTime,
                            StartingPrice = ap.Auction.StartingPrice,
                            AuctionStatus = ap.Auction.Status,
                            ProductName = ap.Product.Name,
                            ProductCategory = ap.Product.Category,
                            ImageFile = ap.Product.Image,
                        }
                    )
                    .ToListAsync();

                if (auctionList.Count == 0)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "No auctions found"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Get list auction successfully",
                    data = auctionList
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

        public async Task<Response<object>> GetAuctionDetail(int auctionId)
        {
            try
            {
                var auction = await (from a in _db.Auctions
                                     join p in _db.Products on a.ProductId equals p.Id
                                     join u in _db.Users on a.OwnerId equals u.Id
                                     join wu in _db.Users on a.WinnerUserId equals wu.Id into winnerJoin
                                     from wu in winnerJoin.DefaultIfEmpty()
                                     where a.Id == auctionId
                                     select new
                                     {
                                         a.Name,
                                         a.Id,
                                         p.Price,
                                         a.CurrentHighestBid,
                                         a.BidPerTurn,
                                         a.StartingPrice,
                                         a.Status,
                                         a.EndTime,
                                         ProductName = p.Name,
                                         Username = u.Username,
                                         WinnerUsername = wu.Username,
                                         ServerTime = DateTime.UtcNow
                                     }).FirstOrDefaultAsync();

                if (auction == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction not found"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Get detail auction successfully",
                    data = auction
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

        public async Task<Response<object>> BidAuction(int auctionId)
        {
            try
            {
                var auction = await _db.Auctions.Where(x => x.Id == auctionId).FirstOrDefaultAsync();

                if (auction == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction not found"
                    };
                }

                if (auction.Status.ToLower() != "started")
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction is not started"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Get detail auction successfully",
                    data = auction
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
