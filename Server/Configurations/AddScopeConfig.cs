using FluentValidation;
using FluentValidation.AspNetCore;
using OnlineAuction_BE.Services.Implementations;
using OnlineAuction_BE.Services.Interfaces;

namespace OnlineAuction_BE.Configurations
{
    public static class AddScopeConfig
    {
        public static IServiceCollection AddConfigSerivces(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IAuctionService, AuctionService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
        public static IServiceCollection AddValidationServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<Program>();
            services.AddFluentValidationAutoValidation();

            return services;
        }
    }
}
