import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { saveUserToLocalStorage, clearUserFromLocalStorage } from "@/lib/user-utils";

export interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      // Save user data to localStorage
      saveUserToLocalStorage(action.payload.user);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      // Clear token and user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      clearUserFromLocalStorage();
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      // Clear token and user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      clearUserFromLocalStorage();
    },
  },
});

export const { setCredentials, setToken, logout, clearAuth } = authSlice.actions;
export { authSlice };
export default authSlice.reducer;
