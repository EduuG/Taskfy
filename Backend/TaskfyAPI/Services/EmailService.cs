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
        
        // Mailhog
       // private readonly string _smtpServer;
       // private readonly int _smtpPort;
       // private readonly string _senderEmail;
       // private readonly string _senderName;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _sendGridApiKey = _configuration["SendGrid:ApiKey"];
            
            // Mailhog
           // var emailConfig = configuration.GetSection("EmailSettings");
           // _smtpServer = emailConfig["SmtpServer"];
           // _smtpPort = int.Parse(emailConfig["SmtpPort"]);
           // _senderEmail = emailConfig["SenderEmail"];
           // _senderName = emailConfig["SenderName"];
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

          // msg.MailSettings = new MailSettings()
          // {
          //     SandboxMode = new SandboxMode
          //     {
          //         Enable = true,
          //     }
          // };
           
          var response = await client.SendEmailAsync(msg);
          
           // Mailhog
          // using var client = new SmtpClient(_smtpServer, _smtpPort);
          // client.Credentials = CredentialCache.DefaultNetworkCredentials;
          // client.EnableSsl = false;

          // var message = new MailMessage
          // {
          //     From = new MailAddress(_senderEmail, _senderName),
          //     Subject = "Redefinição de senha",
          //     Body =
          //         $"<p>Para redefinir sua senha, clique no link abaixo:</p><a href='{resetLink}'>Redefinir Senha</a>",
          //     IsBodyHtml = true
          // };
          // 
          // message.To.Add(_senderEmail);
          // await client.SendMailAsync(message);
        }
    }
}

