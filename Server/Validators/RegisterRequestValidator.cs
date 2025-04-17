using FluentValidation;
using OnlineAuction_BE.DTOs.Auth;

namespace OnlineAuction_BE.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("FullName is required");

            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required")
                .MinimumLength(3).WithMessage("Username must be at least 3 characters long");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\d{10,15}$").When(x => !string.IsNullOrEmpty(x.PhoneNumber))
                .WithMessage("Phone number must be between 10 and 15 digits");
        }
    }
}
