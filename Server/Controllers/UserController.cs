using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction_BE.DTOs.Auction;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Controllers
{
    [Route("api/v1/user")]
    [ApiController]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("auctions")]
        public async Task<IActionResult> GetUserAuctions()
        {
            var result = await _userService.GetUserAuctions();

            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("products")]
        public async Task<IActionResult> GetUserProducts([FromQuery] string name)
        {
            var result = await _userService.GetUserProducts(name);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost("add-auction")]
        public async Task<IActionResult> AddAuction([FromBody] AuctionRequest request)
        {
            var result = await _userService.AddAuction(request);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPut("toggle-auction/{auctionId}")]
        public async Task<IActionResult> ToggleAuction(int auctionId, [FromBody] string status)
        {
            var result = await _userService.ToggleAuction(auctionId, status);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost("bid")]
        public async Task<IActionResult> AddBid([FromBody] BidRequest request)
        {
            var result = await _userService.AddBid(request);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("bid-history")]
        public async Task<IActionResult> ShowBidHistory([FromQuery] int auctionId)
        {
            var result = await _userService.ShowBidHistory(auctionId);

            return ToActionResult(result);
        }
    }
}
