using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.Models;
using System.IdentityModel.Tokens.Jwt;

namespace OnlineAuction_BE.Common
{
    public class GetUserData
    {
        private readonly OnlineAuctionContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetUserData(OnlineAuctionContext db, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
        }

        public async Task<User?> GetCurrentUserAsync()
        {
            var id = GetUserId();

            if (string.IsNullOrEmpty(id)) return null;

            if (!int.TryParse(id, out int userId)) return null;

            return await _db.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive == true);
        }

        public  string? ExtractUserIdFromExpiredToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
                return null;

            var jwtToken = handler.ReadJwtToken(token);
            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            return userId;
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken, int? userId)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.Id == userId);
        }
    }
}
