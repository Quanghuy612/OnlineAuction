using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Product;
using OnlineAuction_BE.DTOs.Response;
using OnlineAuction_BE.Models;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly OnlineAuctionContext _db;
        private readonly GetUserData _getUserData;
        public ProductService(OnlineAuctionContext db, GetUserData getUserData)
        {
            _db = db;
            _getUserData = getUserData;
        }

        public async Task<Response<object>> GetProducts(string? category, string? name)
        {
            try
            {
                var query = _db.Products.AsQueryable();

                if (!string.IsNullOrEmpty(category)) query = query.Where(p => p.Category == category);

                if (!string.IsNullOrEmpty(name)) query = query.Where(p => p.Name.Contains(name));

                var products = await query.ToListAsync();


                return new Response<object>
                {
                    success = true,
                    message = "Login successful",
                    data = products
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

        public async Task<Response<object>> GetProductDetail(int id)
        {
            try
            {
                var product = await _db.Products.FindAsync(id);

                if (product == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Product not found"
                    };
                }

                return new Response<object>
                {
                    success = true,
                    message = "Login successful",
                    data = product
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

        public async Task<Response<object>> AddProduct(ProductRequest request)
        {
            try
            {
                var user = await _getUserData.GetCurrentUserAsync();

                if (user == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "User not authenticated or not found"
                    };
                }

                var product = new Product
                {
                    Name = request.Name,
                    Category = request.Category,
                    Price = request.Price,
                    Image = request.Image,
                    UserId = user.Id,
                };
                _db.Products.Add(product);
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Product added successfully",
                    data = product
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

        public async Task<Response<object>> UpdateProduct(int id, ProductRequest request)
        {
            try
            {
                var product = await _db.Products.FindAsync(id);

                if (product == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Product not found"
                    };
                }

                bool isInLiveAuction = await _db.Auctions.AnyAsync(a => a.ProductId == id && a.Status == "Online");

                if (isInLiveAuction)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Cannot update product during a live auction"
                    };
                }

                product.Name = request.Name;
                product.Category = request.Category;
                product.Price = request.Price;
                product.Image = request.Image;

                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Product updated successfully"
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

        public async Task<Response<object>> DeleteProduct(int id)
        {
            try
            {
                var product = await _db.Products.FindAsync(id);

                if (product == null)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Product not found"
                    };
                }

                bool isInAuction = await _db.Auctions.AnyAsync(a => a.ProductId == id);

                if (isInAuction)
                {
                    return new Response<object>
                    {
                        success = false,
                        message = "Cannot delete product in an aunction"
                    };
                }

                _db.Products.Remove(product);
                await _db.SaveChangesAsync();

                return new Response<object>
                {
                    success = true,
                    message = "Product deleted successfully"
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

    }
}
