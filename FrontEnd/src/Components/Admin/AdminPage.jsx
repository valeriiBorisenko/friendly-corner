/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar'; 
import MainPanel from './MainPanel';
import './AdminPage.css'

function AdminPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedComponent, setSelectedComponent] = useState('SlackFeed');

  function handleLogout() {
    // Clear tokens from both localStorage and sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-cont">
      <div className="logout-cont">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
            <Sidebar setSelectedComponent={setSelectedComponent} />
            <MainPanel selectedComponent={selectedComponent} />
    </div>
  );
}

export default AdminPage;