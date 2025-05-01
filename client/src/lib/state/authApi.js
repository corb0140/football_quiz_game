import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi", // Unique key for the API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth", // Base URL for the API
    credentials: "include", // Include cookies in requests
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => "/refresh-token",
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
