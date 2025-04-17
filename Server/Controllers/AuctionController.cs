using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction_BE.DTOs.Auction;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Controllers
{
    [Route("api/v1/auctions")]
    [ApiController]
    public class AuctionController : BaseApiController
    {
        private readonly IAuctionService _auctionService;

        public AuctionController(IAuctionService auctionService)
        {
            _auctionService = auctionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAuctions([FromQuery] string? category, string? name)
        {
            var result = await _auctionService.GetAuctions(category, name);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuctionDetail(int id)
        {
            var result = await _auctionService.GetAuctionDetail(id);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("check-auction")]
        public async Task<IActionResult> BidAuction([FromQuery] int auctionId)
        {
            var result = await _auctionService.BidAuction(auctionId);

            return ToActionResult(result);
        }
    }
}
