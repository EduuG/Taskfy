using System.Net;
using System.Net.Mail;
using Backend.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
using Task = System.Threading.Tasks.Task;

namespace Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _sendGridApiKey;
        
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _sendGridApiKey = _configuration["SendGrid:ApiKey"];
        }

        public async Task SendPasswordResetEmail(string email, string resetLink)
        {
           var client = new SendGridClient(_sendGridApiKey);
           var from = new EmailAddress("no-reply@taskfy.xyz", "Taskfy");
           var to = new EmailAddress(email);
           var subject = "Redefinição de senha";
           
           var htmlContent = $"<p>Para redefinir sua senha, clique no link abaixo:</p><a href='{resetLink}'>Redefinir Senha</a>";
           var plainTextContent = $"Para redefinir sua senha, clique no link abaixo: {resetLink}";
           
           var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
           
           var response = await client.SendEmailAsync(msg);
        }
    }
}

