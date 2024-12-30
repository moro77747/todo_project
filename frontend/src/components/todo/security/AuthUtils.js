import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Helper function to set the JWT token in the request headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/authenticate`,
      credentials
    );
    const { token } = response.data;
    setAuthToken(token);
    // Store the token in localStorage or sessionStorage
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout function
export const logout = () => {
  // Remove the token from localStorage or sessionStorage
  localStorage.removeItem("token");
  // Remove the token from the request headers
  setAuthToken(null);
};
