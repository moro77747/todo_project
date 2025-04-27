import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header>
      <h1>Todo</h1>

      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
};

export default Header;
