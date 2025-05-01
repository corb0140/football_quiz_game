import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi", // Unique key for the API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/user", // Base URL for the API
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken; // Get the access token from the Redux state

      console.log("Token:", token); // Log the token for debugging

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => "/me",
    }),
  }),
});

export const { useGetUserDataQuery } = userApi;
