using OnlineAuction_BE.DTOs.Product;
using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Services.Interfaces
{
    public interface IProductService
    {
        public Task<Response<object>> GetProducts(string? category, string? name);
        public Task<Response<object>> GetProductDetail(int ProductId);
        public Task<Response<object>> AddProduct(ProductRequest request);
        public Task<Response<object>> UpdateProduct(int ProductId, ProductRequest request);
        public Task<Response<object>> DeleteProduct(int ProductId);
    }
}
