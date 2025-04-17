namespace OnlineAuction_BE.DTOs.Auth
{
    public class RegisterRequest
    {
        public required string FullName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string? PhoneNumber { get; set; }
        public required string Password { get; set; }
    }
}
