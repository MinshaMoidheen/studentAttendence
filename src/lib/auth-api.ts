import { AUTH_URL } from "@/constants/constants";

import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    username: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post(`${AUTH_URL}/login`, credentials);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post(`${AUTH_URL}/logout`);
  },

  // Refresh token
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post(`${AUTH_URL}/refresh_token`);
    return response.data;
  },

  // Get current user (if needed)
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get(`${AUTH_URL}/me`);
    return response.data;
  },
};
