import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./AxiosInstance";
import user_image from "../assets/user_image.jpg"; // Adjust the path as necessary
import { useSelector } from "react-redux";
const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Access the Redux store state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user) || {
    username: "User",
    profilePic: user_image,
  };
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
      {isAuthenticated ? (
        <div className="profile-section" onClick={handleProfileClick}>
          <img
            src={user.profilePic}
            width={50}
            height={50}
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{user.username}</span>
        </div>
      ) : (
        <button onClick={() => navigate("/login")} className="login-button">
          Login
        </button>
      )}
    </nav>
  );
};

export default Navigation;
