import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../../utils/customFetchBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi", // Unique key for the API slice
  baseQuery: customFetchBaseQuery({
    baseUrl: "http://localhost:8000/auth", // Base URL for the API
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
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
