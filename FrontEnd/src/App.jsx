import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

import Header from "./Components/Main/Header";
import Home from "./Components/Main/Home";
import Office from "./Components/Main/Office";
import MeetingRoom from "./Components/Main/MeetRoom";
import Butik from "./Components/Main/Butik";
import ContactUs from "./Components/Main/ContactUs";
import AdminPage from "./Components/Admin/AdminPage";
import UserPage from "./Components/User/UserPage";

import Footer from "./Components/Main/Footer";
import LoginModal from "./Components/Main/LoginModal";

import { BackgroundProvider } from "./context/BackgroundContext";
import SlackFeed from "./Components/Admin/Maintenance/Slackfeed";

import SpotifyPlayer from "./Components/Main/SpotifyPlayer"; // Add this import
import PlayerWidget from "./Components/PlayerWidget/PlayerWidget";
import { extractUsernameFromToken } from "./utils";
import { UserContext } from "./context/UserContext";

// SpotifyProfile component
function SpotifyProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const spotifyToken = localStorage.getItem("spotifyToken");
    if (spotifyToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data));
    }
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Spotify Profile</h2>
      <p>Name: {profile.display_name}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
}

function App() {
  const loginModalRef = useRef(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    function handleStorageChange() {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const username = extractUsernameFromToken(token);
      setUsername(username || null);
    }
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function openLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.openModal();
    }
  }

  useEffect(() => {
    // Fetch from your backend
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetch("https://localhost:5000/api/booking", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("Booking:", data));
    }

    // Fetch from Spotify API
    const spotifyToken = localStorage.getItem("spotifyToken");
    if (spotifyToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("Spotify:", data));
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      <BackgroundProvider>
        <Router>
          <div className="App" id="App">
            <Header onLoginClick={openLoginModal} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/office" element={<Office />} />
              <Route path="/meetingroom" element={<MeetingRoom />} />
              <Route path="/butik" element={<Butik />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/maintenance/slackfeed" element={<SlackFeed />} />
              <Route path="/spotify-player" element={<SpotifyPlayer />} />
            </Routes>
            {/* Add the SpotifyProfile component here */}
            <SpotifyProfile />
            <LoginModal ref={loginModalRef} />
            {username && (
              <PlayerWidget username={username} owner={"usertest"} />
            )}
            <Footer />
          </div>
        </Router>
      </BackgroundProvider>
    </UserContext.Provider>
  );
}

export default App;
