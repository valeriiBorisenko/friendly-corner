using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Friendly_Corner_backend.Controllers
{
    /// <summary>
    /// Controller that handles Slack integration API endpoints
    /// Provides routes for sending messages to Slack and retrieving message history
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SlackController : ControllerBase
    {
        private readonly SlackService _slackService;

        /// <summary>
        /// Constructor that initializes the controller with required services
        /// </summary>
        /// <param name="slackService">Service for interacting with Slack API</param>
        public SlackController(SlackService slackService)
        {
            _slackService = slackService;
        }

        /// <summary>
        /// GET endpoint to retrieve message history from Slack channel
        /// Requires authentication (JWT token)
        /// </summary>
        /// <param name="count">Number of messages to retrieve (default: 50)</param>
        /// <returns>JSON response with messages and current user information</returns>
        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> GetHistory([FromQuery] int count = 50)
        {
            try 
            {
                // Fetch message history from Slack service
                var history = await _slackService.GetMessageHistoryAsync(count);
                
                // Extract the username from the JWT token
                var username = User.Identity?.Name;
                
                // Format the response to match what the frontend expects
                // Map SlackMessage objects to anonymous objects with required properties
                var messages = history.messages.Select(m => new {
                    user = m.username ?? m.user, // Prefer username if available, fall back to user ID
                    text = m.text,               // Message content
                    ts = m.ts                    // Timestamp
                });
                
                // Return successful response with messages and current user
                return Ok(new { 
                    messages = messages,
                    CurrentUser = username 
                });
            }
            catch (Exception ex)
            {
                // Return error response if anything fails
                return StatusCode(500, $"Failed to fetch messages: {ex.Message}");
            }
        }

        /// <summary>
        /// POST endpoint to send a message to Slack
        /// Requires authentication (JWT token)
        /// </summary>
        /// <param name="message">Message object containing the text to send</param>
        /// <returns>Success response if message is sent</returns>
        [HttpPost("send")]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            // Get the username from the JWT token
            var username = User.Identity?.Name;
            
            // Format the message to include the username
            // This allows identifying who sent messages from the web application
            string formattedMessage = $"{username}: {message.Text}";
            
            // Send the formatted message to Slack
            await _slackService.NotifySlackAsync(formattedMessage);
            
            // Return success response
            return Ok();
        }
    }

    /// <summary>
    /// Data transfer object for incoming chat messages
    /// </summary>
    public class ChatMessage
    {
        /// <summary>
        /// Text content of the message to be sent
        /// </summary>
        public required string Text { get; set; }
    }
}