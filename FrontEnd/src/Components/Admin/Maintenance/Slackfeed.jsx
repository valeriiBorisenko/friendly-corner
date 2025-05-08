import React, { useEffect, useState, useRef } from "react";
import "./UserList.css";
import axios from "axios";
import { BASE_URL } from "../../../config"; // Import the base URL
// import UserGallery from '../../Gallery/UserGallery';
import './SlackFeed.css';

/**
 * SlackFeed Component
 * 
 * This component provides a bidirectional chat interface between the website and Slack.
 * It allows users to send messages to a configured Slack channel and view messages from that channel.
 * The component automatically updates to show new messages using a polling approach.
 */
const SlackFeed = () => {
  // State management for the component
  const [message, setMessage] = useState(""); // Current message being typed
  const [messages, setMessages] = useState([]); // List of messages from Slack
  const [loading, setLoading] = useState(false); // Loading state during message send
  const [error, setError] = useState(null); // Error state for API failures
  const [success, setSuccess] = useState(false); // Success state after sending message
  const messagesEndRef = useRef(null); // Reference for auto-scrolling to latest messages

  /**
   * Fetches message history from the Slack channel
   * Uses JWT token for authentication with the backend
   * Parses and sorts messages by timestamp
   */
  const fetchMessages = async () => {
    try {
      // Get authentication token from storage (persistent or session)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Make API request to get message history
      const response = await axios.get(
        `${BASE_URL}/api/Slack/history`, 
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      // Process response if valid
      if (response.data && response.data.messages) {
        // Get the messages array from response
        const messages = response.data.messages;
        
        // Sort messages by timestamp (oldest first, newest at the bottom)
        const sortedMessages = messages.sort((a, b) => 
          parseFloat(a.ts) - parseFloat(b.ts)
        );
        
        // Update state with sorted messages
        setMessages(sortedMessages);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  /**
   * Set up message polling on component mount
   * Fetches messages immediately and then every 10 seconds
   * Cleans up the interval when component unmounts
   */
  useEffect(() => {
    // Initial fetch when component mounts
    fetchMessages();
    
    // Set up periodic polling for new messages
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000); // Poll every 10 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  /**
   * Auto-scroll to bottom when new messages arrive
   * This ensures the most recent messages are visible
   */
  useEffect(() => {
    // Get the messages container element
    const messagesContainer = document.querySelector('.messages-container');
    
    // If container exists and we have messages, scroll to bottom of container
    if (messagesContainer && messages.length > 0) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  /**
   * Updates the message state as the user types
   */
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  /**
   * Handles form submission to send a message to Slack
   * Sends the message to the backend, which forwards it to Slack
   * Updates UI states (loading, success, error) during the process
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't submit if message is empty
    if (!message.trim()) return;
    
    // Set loading state and clear previous status
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Get authentication token from storage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Send message to the backend API
      await axios.post(
        `${BASE_URL}/api/Slack/send`, 
        { Text: message },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      // Clear the input field after successful send
      setMessage("");
      // Show success message briefly
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Fetch messages again after a delay to see the new message
      setTimeout(fetchMessages, 1000);
    } catch (err) {
      // Show error message briefly
      setError(err.response?.data?.message || "Failed to send message");
      setTimeout(() => setError(null), 3000);
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  /**
   * Formats Unix timestamp to human-readable time
   * Converts Slack's epoch seconds format to hours:minutes
   * Includes error handling for invalid timestamps
   */
  const formatTimestamp = (ts) => {
    try {
      const timestamp = parseFloat(ts);
      if (isNaN(timestamp)) {
        return ''; // Return empty string for invalid timestamps
      }
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return '';
    }
  };

  return (
    <div className="user-list">
      <h1 className="slack-feed-title">Samtal med Slack</h1>
      
      <div className="slack-feed-container">
        {/* Message display area */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg, index) => {
              // Extract and format message content for display
              let displayUser = msg.user || "Unknown User";
              let displayText = msg.text || "";
              let isWebMessage = false;
              
              // Check if the message is from the web application
              // Web messages have format "username: message"
              const webMessageMatch = displayText.match(/^([^:]+):\s(.+)$/);
              if (webMessageMatch && !displayUser.includes("bot")) {
                // This is likely a message from our web app, so extract parts
                displayUser = webMessageMatch[1];
                displayText = webMessageMatch[2];
                isWebMessage = true;
              }
              
              // Render individual message
              return (
                <div key={index} className="message-item">
                  <div className="message-header">
                    {/* Username with visual distinction for web vs. Slack users */}
                    <span className="message-user">
                      {isWebMessage ? <strong>{displayUser}</strong> : displayUser}
                    </span>
                    {/* Timestamp display */}
                    <span className="message-time">{formatTimestamp(msg.ts)}</span>
                  </div>
                  {/* Message text content */}
                  <div className="message-text">{displayText}</div>
                </div>
              );
            })
          )}
          {/* This empty div is the target for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input form */}
        <form onSubmit={handleSubmit} className="slack-message-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={handleChange}
              disabled={loading}
              className="message-input"
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={loading || !message.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
          
          {/* Status messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Message sent successfully!</div>}
        </form>
        
      </div>
      
    </div>
  );
};

export default SlackFeed;
