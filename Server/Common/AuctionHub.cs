using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace OnlineAuction_BE.Common
{
    public class AuctionHub : Hub
    {
        public async Task JoinAuction(int auctionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"auction-{auctionId}");
        }

        public async Task StartAuction(int auctionId)
        {
            await Clients.Group($"auction-{auctionId}").SendAsync("AuctionStarted");
        }

        public async Task PlaceBid(int auctionId, string user, decimal bidAmount)
        {
            var bid = new
            {
                user,
                bidAmount,
                timestamp = DateTime.UtcNow.ToString("s") + "Z"
            };

            await Clients.Group($"auction-{auctionId}").SendAsync("ReceiveBid", bid);
        }

        public async Task EndAuction(int auctionId)
        {
            await Clients.Group($"auction-{auctionId}").SendAsync("AuctionEnded");
        }
    }

}
