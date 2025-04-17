using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineAuction_BE.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Category { get; set; }

        public decimal Price { get; set; }

        public string Status { get; set; } = "Ready";

        public byte[]? Image { get; set; }

        public int UserId { get; set; }
    }
}
