import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "../lib/state/authSlice";

// Define and export a custom base query function that takes a baseUrl (e.g., "https://api.example.com")
export const customFetchBaseQuery = ({ baseUrl }) => {
  const baseQuery = fetchBaseQuery({
    baseUrl, // The root URL that all endpoints will be appended to
    credentials: "include", // Tells fetch to include credentials like cookies (important for sessions)

    // prepareHeaders lets you modify the headers before every request
    prepareHeaders: (headers, { getState }) => {
      // Access the current Redux state and pull the token from the auth slice
      const token = getState().auth?.accessToken;

      // If we have a token, set it in the request headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Return the modified headers so fetchBaseQuery can include them in the request
      return headers;
    },
  });

  // Return a function that wraps the baseQuery to add refresh-token logic
  return async (args, api, extraOptions) => {
    /**
     * args: the request details like URL, method, body, etc.
     * api: an object containing dispatch, getState, etc.
     * extraOptions: any extra options passed to the query
     */
    let result = await baseQuery(args, api, extraOptions);

    // If we get a 401 Unauthorized response, we can try to refresh the token
    if (result.error && result.error.status === 401) {
      console.log("Access token expired. Attempting to refresh...");

      /**
       * Call the refresh endpoint to get a new token.
       * This assumes your backend sends a new access token when given a valid refresh token (e.g., from a cookie).
       */
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      // Pull the new access token from the refresh response (if it worked)
      const newToken = refreshResult.data?.accessToken;

      if (newToken) {
        // Refresh succeeded — store the new token in Redux
        api.dispatch(setCredentials({ accessToken: newToken }));

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — maybe the refresh token expired or was revoked
        console.log("Failed to refresh token. Logging out...");

        // Clear auth state — this will log the user out
        api.dispatch(clearCredentials());
      }
    }

    return result;
  };
};
