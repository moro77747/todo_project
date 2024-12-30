import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../security/AuthUtils";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call the logout function to clear user session or token
    logout();

    // Redirect to the login page or homepage after logging out
    navigate("/login"); // Adjust the path as needed
  }, [navigate]);
 
  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
