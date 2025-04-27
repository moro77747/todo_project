import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

const Navigation = ({ isAuthenticated }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({
    username: "User",
    profilePic: "default-pic-url",
  });
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.get(`/api/search/${searchQuery}`);
      console.log("Search results:", response.data);
      // Handle search results (e.g., navigate to a search results page or display results)
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleProfileClick = () => {
    // Navigate to user profile page or open a modal to change user information
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="profile-section" onClick={handleProfileClick}>
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <span className="username">{user.username}</span>
      </div>
    </nav>
  );
};

export default Navigation;
