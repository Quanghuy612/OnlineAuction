using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.DTOs.Auth;
using OnlineAuction_BE.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.Models;
using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly OnlineAuctionContext _db;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GetUserData _getUserData;

        public AuthService(OnlineAuctionContext db, IConfiguration config, IHttpContextAccessor httpContextAccessor, GetUserData getUserData)
        {
            _db = db;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _getUserData = getUserData;
        }

        public async Task<Response<LoginResponse>> Login(LoginRequest request)
        {
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (user == null)
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "User not found"
                    };
                }

                if (user.IsActive == false)
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "Your account is blocked! Please contact admin support"
                    };
                }

                bool isValid = BCryptStatic.VerifyPassword(request.Password, user.Password);
                if (!isValid)
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "Invalid password"
                    };
                }

                var accessToken = JwtTokenGenerator.GenerateToken(user.Id, user.Username, user.Role, _config);
                var refreshToken = JwtTokenGenerator.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpires = DateTime.UtcNow.AddDays(7);
                await _db.SaveChangesAsync();

                return new Response<LoginResponse>
                {
                    success = true,
                    message = "Login successful",
                    data = new LoginResponse
                    {
                        Token = accessToken,
                        RefreshToken = refreshToken
                    }
                };
            }
            catch (Exception ex)
            {
                return new Response<LoginResponse>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }

        public async Task<Response<object>> Register(RegisterRequest request)
        {
            try
            {
                if (await _db.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Username or email already in use",
                    };
                }

                var newUser = new User
                {
                    FullName = request.FullName,
                    Username = request.Username,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    Password = BCryptStatic.HashPassword(request.Password),
                    Role = "User",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _db.Users.Add(newUser);
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Registration successful",
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

        public async Task<Response<object>> Logout()
        {
            try
            {
                var username = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

                if (string.IsNullOrEmpty(username))
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Invalid token or user not authenticated"
                    };
                }

                var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not found"
                    };
                }

                user.RefreshToken = null;
                user.RefreshTokenExpires = null;

                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "User logged out successfully"
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

        public async Task<Response<LoginResponse>> RefreshToken(string refreshTokenFromCookie, string expiredToken)
        {
            try
            {
                var userIdStr = _getUserData.ExtractUserIdFromExpiredToken(expiredToken);
                if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "Invalid user ID from token."
                    };
                }

                var user = await _getUserData.GetUserByRefreshTokenAsync(refreshTokenFromCookie, userId);

                if (user == null)
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                if (user.RefreshTokenExpires <= DateTime.UtcNow)
                {
                    return new Response<LoginResponse>
                    {
                        success = false,
                        message = "Expired refresh token"
                    };
                }

                var accessToken = JwtTokenGenerator.GenerateToken(user.Id, user.Username, user.Role, _config);
                var refreshToken = JwtTokenGenerator.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpires = DateTime.UtcNow.AddDays(7);

                return new Response<LoginResponse>
                {
                    success = true,
                    message = "Refreshed Token",
                    data = new LoginResponse
                    {
                        Token = accessToken,
                        RefreshToken = refreshToken
                    }
                };
            }
            catch (Exception ex)
            {
                return new Response<LoginResponse>
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                };
            }
        }
    }
}
