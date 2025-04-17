using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineAuction_BE.Common;
using OnlineAuction_BE.Configurations;
using OnlineAuction_BE.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<OnlineAuctionContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddConfigSerivces();
builder.Services.AddScoped<GetUserData>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.WebHost.ConfigureKestrel(options =>
{
    builder.Configuration.GetSection("Kestrel").Bind(options);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var config = builder.Configuration;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["token"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowFrontendApp");
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "OnlineAuction API V1");    
    options.RoutePrefix = string.Empty;
});
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<AuctionHub>("/auctionHub");
app.MapControllers();
app.Run();
