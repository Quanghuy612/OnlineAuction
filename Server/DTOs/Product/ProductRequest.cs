namespace OnlineAuction_BE.DTOs.Product
{
    public class ProductRequest
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public decimal Price { get; set; }
        public byte[]? Image { get; set; }
    }
}
