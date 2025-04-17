using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Auction;
using OnlineAuction_BE.DTOs.Response;
using OnlineAuction_BE.Models;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly OnlineAuctionContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GetUserData _getUserData;
        private readonly IHubContext<AuctionHub> _hubContext;

        public UserService(OnlineAuctionContext db, IHttpContextAccessor httpContextAccessor, GetUserData getUserData, IHubContext<AuctionHub> hubContext)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
            _getUserData = getUserData;
            _hubContext = hubContext;
        }

        public async Task<Response<object>> GetUserAuctions()
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

                var auctions = await (
                    from a in _db.Auctions
                    join p in _db.Products on a.ProductId equals p.Id
                    where a.OwnerId == user.Id
                    select new
                    {
                        Id = a.Id,
                        a.Name,
                        a.Status,
                        a.OwnerId,
                        a.ProductId,
                        a.StartTime,
                        a.EndTime,
                        a.StartingPrice,
                        AuctionStatus = a.Status,
                        ProductName = p.Name,
                        ProductCategory = p.Category,
                        ImageFile = p.Image
                    }
                ).ToListAsync();

                if (auctions.Count() == 0)
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
                    message = "Get auctions successfully",
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

        public async Task<Response<object>> GetUserProducts(string name)
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

                var products = await _db.Products.Where(x => x.UserId == user.Id && x.Name.Contains(name)).Select(x => new { x.Id, x.Name, x.Price }).ToListAsync();

                if (products.Count() == 0)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Products not found"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Get products successfully",
                    data = products
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

        public async Task<Response<object>> AddAuction(AuctionRequest request)
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

                var auction = new Auction
                {
                    Name = request.Name,
                    ProductId = request.ProductId,
                    StartingPrice = request.StartingPrice,
                    BidPerTurn = request.BidPerTurn,
                    StartTime = HandleDatetime.ConverDateTime(request.StartTime),
                    EndTime = HandleDatetime.ConverDateTime(request.EndTime),
                    OwnerId = user.Id
                };
                _db.Auctions.Add(auction);
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Add new auction successfully"
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

        public async Task<Response<object>> ToggleAuction(int auctionId, string status)
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

                var auction = await _db.Auctions.FirstOrDefaultAsync(a => a.Id == auctionId && a.OwnerId == user.Id);

                if (auction == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction not found"
                    };
                }

                var currentTime = DateTime.UtcNow;
                var currentStatus = auction.Status.ToLower();

                AuctionLog auctionLog = new()
                {
                    AuctionId = auctionId,
                    Timestamp = currentTime,
                    UserId = user.Id,
                };

                if (currentStatus == "waitting" && status.ToLower() != "ready" && status.ToLower() != "canceled")
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "This auction is pending approval from admin"
                    };
                }
                else if (currentStatus == "ready" && status.ToLower() == "started")
                {

                    if (currentTime < auction.StartTime)
                    {
                        var timeDiff = auction.StartTime - currentTime;
                        var minutesRemaining = Math.Ceiling(timeDiff.TotalMinutes);

                        return new Response<object>
                        {
                            success = false,
                            message = $"Auction cannot be started yet. Please wait {minutesRemaining} minute(s)."
                        };
                    }

                    auction.Status = "Started";
                    auctionLog.Action = "Auction started";
                }
                else if (currentStatus == "waitting" && status.ToLower() == "ready")
                {
                    auction.Status = status;
                    auctionLog.Action = "Auction aproved";
                }
                else if (currentStatus == "waitting" && status.ToLower() == "canceled")
                {
                    auction.Status = status;
                    auctionLog.Action = "Auction canceled";
                }
                else if (currentStatus == "started" && status.ToLower() == "ended")
                {
                    auction.Status = status;
                    auctionLog.Action = "Auction ended";
                }
                else
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"Cannot change status from '{currentStatus}' to '{status}'."
                    };
                }

                _db.AuctionLogs.Add(auctionLog);

                if (auction.Status.ToLower() == "ended")
                {
                    var winningBid = await _db.AuctionLogs.Where(log => log.AuctionId == auction.Id).OrderByDescending(log => log.BidAmount).FirstOrDefaultAsync();

                    if (winningBid != null && auction.CurrentHighestBid == winningBid.BidAmount)
                    {
                        auction.WinnerUserId = winningBid.UserId;
                    }
                }

                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = $"Auction status updated to '{auction.Status}'"
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

        public async Task<Response<object>> AddBid(BidRequest request)
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

                var auction = await _db.Auctions.FirstOrDefaultAsync(a => a.Id == request.AuctionId);

                if (auction == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Auction not found"
                    };
                }

                if (user.Id == auction.OwnerId)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "You are the host of this auction. The fuck you bid for ?"
                    };
                }

                if (auction.CurrentHighestBid == 0 && request.BidAmount < auction.StartingPrice + auction.BidPerTurn)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"The bid amount must be at least {auction.StartingPrice + auction.BidPerTurn} for the first bid."
                    };
                }
                else if (auction.CurrentHighestBid > 0 && request.BidAmount < auction.CurrentHighestBid + auction.BidPerTurn)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"The bid amount must be at least {auction.CurrentHighestBid + auction.BidPerTurn} to outbid the current highest bid."
                    };
                }

                auction.CurrentHighestBid = request.BidAmount;

                var currentTime = DateTime.UtcNow;
                var currentStatus = auction.Status.ToLower();

                if (currentStatus == "ready")
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"Auction has not started"
                    };
                }

                if (currentStatus == "canceled")
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"Auction had been canceled"
                    };
                }

                if (currentStatus == "ended")
                {
                    return new Response<object>
                    {
                        success = false,
                        message = $"Auction had ended"
                    };
                }

                AuctionLog auctionLog = new()
                {
                    AuctionId = request.AuctionId,
                    Timestamp = currentTime,
                    BidAmount = request.BidAmount,
                    Action = $"User {user.Username} had bided {request.BidAmount}",
                    UserId = user.Id
                };
                _db.AuctionLogs.Add(auctionLog);

                await _db.SaveChangesAsync();

                var bid = new
                {
                    user = user.Username,
                    bidAmount = request.BidAmount,
                    timestamp = DateTime.UtcNow.ToString("s") + "Z"
                };

                await _hubContext.Clients.Group($"auction-{request.AuctionId}").SendAsync("ReceiveBid", bid);

                return new Response<object>
                {
                    success = true,
                    message = $"Bid successfully"
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

        public async Task<Response<object>> ShowBidHistory(int auctionId)
        {
            try
            {
                var history = await _db.AuctionLogs.Where(a => a.AuctionId == auctionId).ToListAsync();

                if (history.Count() == 0)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "No one had bided yet"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Load history success",
                    data = history
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
