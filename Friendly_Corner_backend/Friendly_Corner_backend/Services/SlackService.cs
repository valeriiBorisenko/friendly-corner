using Friendly_Corner_backend.Models;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Concurrent;

/// <summary>
/// Service that provides integration with Slack API
/// Allows sending messages to and retrieving messages from a configured Slack channel
/// </summary>
public class SlackService
{
    private readonly string _token;              // Slack API authentication token
    private readonly string _channelId;          // Target Slack channel ID
    private readonly HttpClient _httpClient;     // HTTP client for API requests
    
    // Thread-safe cache of user information to avoid repeated API calls
    private readonly ConcurrentDictionary<string, SlackUserInfo> _userCache = new ConcurrentDictionary<string, SlackUserInfo>();

    /// <summary>
    /// Constructor that initializes the service with configuration values
    /// </summary>
    /// <param name="options">Slack configuration options (token, channel ID)</param>
    /// <param name="httpClientFactory">Factory for creating HTTP clients</param>
    public SlackService(IOptions<SlackOptions> options, IHttpClientFactory httpClientFactory)
    {
        var slackOptions = options.Value;
        _token = slackOptions.Token ?? throw new ArgumentNullException(nameof(slackOptions.Token), "Slack token is not configured.");
        _channelId = slackOptions.ChannelId ?? throw new ArgumentNullException(nameof(slackOptions.ChannelId), "Slack channel ID is not configured.");
        
        // Create and configure HTTP client with authentication header
        _httpClient = httpClientFactory.CreateClient("Slack");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
    }

    /// <summary>
    /// Sends a message to the configured Slack channel
    /// </summary>
    /// <param name="message">The message text to send</param>
    /// <returns>Async task</returns>
    public async Task NotifySlackAsync(string message)
    {
        // Create request payload
        var content = new
        {
            channel = _channelId,
            text = message
        };
        
        // Serialize to JSON
        var jsonContent = new StringContent(
            JsonSerializer.Serialize(content),
            Encoding.UTF8,
            "application/json");
        
        // Make API call to Slack    
        var response = await _httpClient.PostAsync("https://slack.com/api/chat.postMessage", jsonContent);
        
        // Log success/failure
        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Message sent successfully");
        }
        else
        {
            Console.WriteLine($"Error sending message: {response.StatusCode}");
        }
    }
    
    /// <summary>
    /// Retrieves user information from Slack API by user ID
    /// Uses caching to improve performance for repeated lookups
    /// </summary>
    /// <param name="userId">Slack user ID (e.g., U08A7U54ZV4)</param>
    /// <returns>User information including display name, real name</returns>
    private async Task<SlackUserInfo> GetUserInfoAsync(string userId)
    {
        // First check if user info is in cache
        if (_userCache.TryGetValue(userId, out var cachedUser))
        {
            return cachedUser;
        }

        // If not in cache, fetch from Slack API
        var url = $"https://slack.com/api/users.info?user={userId}";
        var response = await _httpClient.GetAsync(url);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var userResponse = JsonSerializer.Deserialize<SlackUserResponse>(content);
            
            // If user found, cache it for future use
            if (userResponse?.ok == true && userResponse.user != null)
            {
                _userCache[userId] = userResponse.user;
                return userResponse.user;
            }
        }
        
        // Return placeholder for unknown users
        return new SlackUserInfo
        {
            id = userId,
            name = "Unknown User",
            real_name = "Unknown User",
            profile = new SlackUserProfile { display_name = "Unknown User" }
        };
    }
    
    /// <summary>
    /// Retrieves message history from the configured Slack channel
    /// Enriches messages with user information for display
    /// </summary>
    /// <param name="count">Number of messages to retrieve (default: 50)</param>
    /// <returns>Response containing messages with user information</returns>
    public async Task<SlackHistoryResponse> GetMessageHistoryAsync(int count = 50)
    {
        // Build API URL with parameters
        var url = $"https://slack.com/api/conversations.history?channel={_channelId}&limit={count}&include_all_metadata=true";
        
        var response = await _httpClient.GetAsync(url);
        
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var historyResponse = JsonSerializer.Deserialize<SlackHistoryResponse>(content) 
                ?? new SlackHistoryResponse { ok = false, error = "Failed to deserialize response" };
            
            // Process messages and add user information
            foreach (var message in historyResponse.messages)
            {
                // Handle messages from named users in Slack
                if (!string.IsNullOrEmpty(message.user) && message.user.StartsWith("U"))
                {
                    // Look up user info for this user ID
                    var userInfo = await GetUserInfoAsync(message.user);
                    
                    // Set the display name (prefer display_name, then real_name, then username)
                    message.username = userInfo.profile?.display_name;
                    if (string.IsNullOrEmpty(message.username))
                    {
                        message.username = userInfo.real_name ?? userInfo.name;
                    }
                }
                // For messages without a user ID, try to extract from text
                else if (string.IsNullOrEmpty(message.user) && !string.IsNullOrEmpty(message.text))
                {
                    // Parse messages with "username: message" format
                    var parts = message.text.Split(':', 2);
                    if (parts.Length > 1)
                    {
                        message.username = parts[0].Trim();
                        message.text = parts[1].Trim();
                    }
                }
            }
            
            return historyResponse;
        }
        
        // Return error response if API call fails
        return new SlackHistoryResponse { ok = false, error = $"Request failed: {response.StatusCode}" };
    }
}

/// <summary>
/// Response model for Slack conversations.history API
/// </summary>
public class SlackHistoryResponse
{
    public bool ok { get; set; }
    public List<SlackMessage> messages { get; set; } = new List<SlackMessage>();
    public string? error { get; set; }
}

/// <summary>
/// Model for individual Slack messages
/// </summary>
public class SlackMessage
{
    public string? type { get; set; }      // Message type (e.g., "message")
    public string? user { get; set; }      // User ID who sent the message (e.g., "U08A7U54ZV4")
    public string? username { get; set; }  // Human-readable username (e.g., "John Doe")
    public string? text { get; set; }      // Message content
    public string ts { get; set; } = string.Empty; // Timestamp (Unix epoch time)
}

/// <summary>
/// Response model for Slack users.info API
/// </summary>
public class SlackUserResponse
{
    public bool ok { get; set; }
    public SlackUserInfo? user { get; set; }
    public string? error { get; set; }
}

/// <summary>
/// Model for Slack user information
/// </summary>
public class SlackUserInfo
{
    public string id { get; set; } = string.Empty;  // User ID
    public string? name { get; set; }               // Username
    public string? real_name { get; set; }          // Full name
    public SlackUserProfile? profile { get; set; }  // Additional profile information
}

/// <summary>
/// Model for Slack user profile details
/// </summary>
public class SlackUserProfile
{
    public string? display_name { get; set; }  // Display name set by the user
    public string? image_72 { get; set; }      // Profile image URL (72px)
}