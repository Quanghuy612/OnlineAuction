namespace OnlineAuction_BE.DTOs.Auth
{
    public class LoginResponse
    {
        public required string Token { get; set; }
        public required string RefreshToken { get; set; }
    }
}
