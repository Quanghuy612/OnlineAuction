using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace OnlineAuction_BE.Models
{
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(PhoneNumber), IsUnique = true)]
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string FullName { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; } = "User";
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }
        public bool IsEmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }
        public DateTime? EmailConfirmationTokenExpires { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
