import { useState, useContext } from "react";
import "./UserPage.css";
import UserSidebar from "./UserSidebar";
import UserMainPanel from "./UserMainPanel";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function UserPage() {
  const { username, setUsername } = useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = useState("SlackFeed");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUsername(null);

    navigate("/");
  };

  return (
    <div className="user-page-cont">
      <div className="logout-cont">
        <div className="welcome-cont">
          <p className="text">
            Logged in as,
            <strong className="logged-in-as"> {username}</strong>
          </p>
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
