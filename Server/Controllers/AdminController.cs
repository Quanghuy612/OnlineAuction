using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    public class AdminController : BaseApiController
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("auction")]
        public async Task<IActionResult> GetAuctions([FromQuery] string status)
        {
            var result = await _adminService.GetListAuctions(status);

            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("auction/{auctionId}")]
        public async Task<IActionResult> AproveAuction(int auctionId)
        {
            var result = await _adminService.AprroveAuction(auctionId);

            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("report/auction")]
        public async Task<IActionResult> GetAuctionsReport()
        {
            var result = await _adminService.GetAuctionsReport();

            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("report/user")]
        public async Task<IActionResult> GetUserReport([FromQuery] int userId)
        {
            var result = await _adminService.GetUserReport(userId);

            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("lock/user/{userId}")]
        public async Task<IActionResult> LockUser(int? userId)
        {
            var result = await _adminService.LockUser(userId);

            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("search/users")]
        public async Task<IActionResult> SearchUser([FromQuery] string name)
        {
            var result = await _adminService.SearchUser(name);

            return ToActionResult(result);
        }
    }
}
