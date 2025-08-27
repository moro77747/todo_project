import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import Navigation from "./components/Navigation";
import store from "./redux/store";
import Login from "./components/LoginComponent";
import SignUpComponent from "./components/SignUpComponent";
import DashBoard from "./components/DashBoard";
import AppHeader from "./components/AppHeader";
import PrivateRoute from "./PrivateRoute";
import Profile from "./components/Profile";
const App = () => {
  useEffect(() => {
    document.title = "Todo App"; // Set the new title here
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div>
          <AppHeader />
          {/* <Navigation /> */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
