using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Auth;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : BaseApiController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
        {
            var result = await _authService.Login(request);

            return ToActionResult(result);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.Register(request);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _authService.Logout();

            return ToActionResult(result);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var expiredToken = Request.Cookies["token"];
            var refreshTokenFromCookie = HttpContext.Request.Cookies["refreshToken"];

            var result = await _authService.RefreshToken(refreshTokenFromCookie, expiredToken);

            return ToActionResult(result);
        }
    }
}
