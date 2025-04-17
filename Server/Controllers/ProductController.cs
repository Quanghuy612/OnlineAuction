using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction_BE.Data;
using OnlineAuction_BE.DTOs.Product;
using OnlineAuction_BE.Models;
using OnlineAuction_BE.Services.Implementations;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Controllers
{
    [Route("api/v1/products")]
    [ApiController]
    public class ProductController : BaseApiController
    {

        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] string? category, [FromQuery] string? name)
        {
            var result = await _productService.GetProducts(category, name);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            var result = await _productService.GetProductDetail(id);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] ProductRequest product)
        {
            var result = await _productService.AddProduct(product);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct([FromQuery] int id, [FromBody] ProductRequest product)
        {
            var result = await _productService.UpdateProduct(id, product);

            return ToActionResult(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteProduct([FromQuery] int id)
        {
            var result = await _productService.DeleteProduct(id);

            return ToActionResult(result);
        }
    }
}
