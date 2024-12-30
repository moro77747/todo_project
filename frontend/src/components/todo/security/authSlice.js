import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '/AuthUtils';

// Initial state for authentication
const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk for login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await apiLogin(credentials);
    return data; // Returns the response data, which includes user information and token
  } catch (error) {
    return rejectWithValue(error); // Return the error if the login fails
  }
});

// Thunk for registration
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await apiRegister(userData);
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      apiLogout(); // Perform the logout action
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login states
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user; // Assuming the response includes user data
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed. Please try again.';
      });

    // Handle register states
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally set user and isAuthenticated if you log them in right after registration
        state.user = action.payload.user; // Assuming the response includes user data
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed. Please try again.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
