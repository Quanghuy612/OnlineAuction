using OnlineAuction_BE.DTOs.Auth;
using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Response<LoginResponse>> Login(LoginRequest request);
        Task<Response<object>> Register(RegisterRequest request);
        Task<Response<object>> Logout();
        Task<Response<LoginResponse>> RefreshToken(string refreshTokenFromCookie, string expiredToken);
    }
}
