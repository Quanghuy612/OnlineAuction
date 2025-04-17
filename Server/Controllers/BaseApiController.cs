using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction_BE.DTOs.Response;

namespace OnlineAuction_BE.Controllers
{
    public class BaseApiController : ControllerBase
    {
        protected IActionResult ToActionResult<T>(Response<T> response)
        {
            if (response.success)
                return Ok(response);

            if (response.message?.Contains("not authenticated", StringComparison.OrdinalIgnoreCase) == true)
                return Unauthorized(response);

            if (response.message?.StartsWith("Internal server error", StringComparison.OrdinalIgnoreCase) == true)
                return StatusCode(500, response);

            return BadRequest(response);
        }
    }

}
