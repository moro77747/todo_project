import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../security/AuthUtils";

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  const handleLogout = () => { 
    dispatch(logout());
  };

  return (
    <header>
      <h1>Task Management App</h1>

      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
};

export default Header;
