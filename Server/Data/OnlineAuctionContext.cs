using Microsoft.EntityFrameworkCore;
using OnlineAuction_BE.Models;

namespace OnlineAuction_BE.Data
{
    public class OnlineAuctionContext : DbContext
    {
        public OnlineAuctionContext(DbContextOptions<OnlineAuctionContext> options): base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,4)");

            modelBuilder.Entity<Auction>().Property(p => p.StartingPrice).HasColumnType("decimal(18,4)");

            modelBuilder.Entity<Auction>().Property(p => p.CurrentHighestBid).HasColumnType("decimal(18,4)");

            modelBuilder.Entity<Auction>().Property(p => p.BidPerTurn).HasColumnType("decimal(18,4)");

            modelBuilder.Entity<AuctionLog>().Property(p => p.BidAmount).HasColumnType("decimal(18,4)");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<AuctionLog> AuctionLogs { get; set; }
    }
}
