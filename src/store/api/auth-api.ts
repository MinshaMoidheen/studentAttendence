import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL, AUTH_URL } from "@/constants/constants";

import { authSlice } from "../slices/auth-slice";

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

export interface LogoutResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // Important for cookies
    prepareHeaders: (headers) => {
      // Get token from localStorage if available
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Auth"],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Auth"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", data.accessToken);
          }
          // Update auth state
          dispatch(
            authSlice.actions.setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            }),
          );
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    // Logout endpoint
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Auth"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Clear token from localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
          }
          // Clear auth state
          dispatch(authSlice.actions.logout());
        } catch {
          // Even if logout fails on server, clear local state
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
          }
          dispatch(authSlice.actions.logout());
        }
      },
    }),

    // Refresh token endpoint
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: `${AUTH_URL}/refresh_token`,
        method: "POST",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Store new token in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", data.accessToken);
          }
          // Update auth state
          dispatch(authSlice.actions.setToken(data.accessToken));
        } catch {
          // Refresh failed, clear auth state
          dispatch(authSlice.actions.logout());
        }
      },
    }),

    // Get current user endpoint
    getCurrentUser: builder.query<User, void>({
      query: () => `${AUTH_URL}/me`,
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshTokenMutation, useGetCurrentUserQuery } = authApi;
