namespace OnlineAuction_BE.DTOs.Response
{
    public class Response<T>
    {
        public required bool success { get; set; }
        public string? message { get; set; }
        public T? data { get; set; }
        public Response() { }

        public Response(bool success, string? message = null, T? data = default)
        {
            this.success = success;
            this.message = message;
            this.data = data;
        }
    }
}
