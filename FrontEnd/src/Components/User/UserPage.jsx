import React, { useState, useEffect } from "react";
import "./UserPage.css";
import UserSidebar from "./UserSidebar";
import UserMainPanel from "./UserMainPanel";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const [username, setUsername] = useState("User");
  const [selectedComponent, setSelectedComponent] = useState('SlackFeed');
  const navigate = useNavigate();

  // Extract username from JWT token on component mount
  useEffect(() => {
    // Get token from storage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        // Decode the JWT token
        const payload = JSON.parse(atob(token.split(".")[1]));

        // The ClaimTypes.Name is serialized as "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        // or might be shortened to just "unique_name" or "sub" depending on JWT configuration
        if (payload) {
          // Try different possible claim names
          const username =
            payload.unique_name ||
            payload.name ||
            payload.sub ||
            payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ];

          if (username) {
            setUsername(username);
          }

          // You can add a console.log to debug the token payload structure
          console.log("Token payload:", payload);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    navigate("/");
  };


  return (
    <div className="user-page-cont">
        
      <div className="logout-cont">
      <div className="welcome-cont">
            <p className="text">Logged in as,
          <strong className="logged-in-as" > {username}</strong></p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>    
      
        <UserSidebar setSelectedComponent={setSelectedComponent} />
        
        <UserMainPanel selectedComponent={selectedComponent} />
    </div>
  );
}

export default UserPage;

