namespace OnlineAuction_BE.DTOs.Auth
{
    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
