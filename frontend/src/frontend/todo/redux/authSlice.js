import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/AxiosInstance";
// Thunks for async actions
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`api/auth/login`, credentials);
      const { token, user } = response.data;
      // Save token to localStorage
      localStorage.setItem("token", token);
      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Login failed. Please try again."
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/auth/register`, userData);
      const { token, user } = response.data;
      // Save token to localStorage
      localStorage.setItem("token", token);
      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Registration failed. Please try again."
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  // Remove token from localStorage
  localStorage.removeItem("token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      });
  },
});

export default authSlice.reducer;
