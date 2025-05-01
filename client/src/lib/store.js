/**
 * @file configureStore.js
 * @description This file configures the Redux store for the application.
 * It imports the necessary dependencies and sets up the store with the authApi and authSlice reducers.
 * The store is then exported for use in the application.
 *
 * @file authApi.js
 * @description This file sets up the authentication API using Redux Toolkit's createApi via RTK Query.
 * It defines the base URL for the API and the endpoints for login, logout, and refresh token.
 * The api is then exported for use in the application.
 *
 * @file authSlice.js
 * @description This file defines the authentication slice of the Redux store.
 * It includes the initial state, reducers, and actions for managing authentication state.
 * The slice is then exported for use in the application.
 */
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./state/authApi";
import { userApi } from "./state/userApi";
import authReducer from "./state/authSlice";
import userReducer from "./state/userSlice";

/**
 * @description This function comes from Redux Toolkit and is a wrapper around Redux's createStore.
 * It simplifies the store setup process and allows for easy integration of middleware and enhancers.
 *
 * @reducer {Object} The root reducer object that combines all the slice reducers. This defines the global state structure.
 *
 * @[authApi.reducerPath] manages all the RTK Query api data (like isLoading, data, error etc)
 * @auth: authReducer The reducer for the authApi slice, which handles API calls and caching.
 *
 * @middleware {Function} The middleware intercepts actions before they hit the reducers.card
 * @getDefaultMiddleware {Function} This function returns the default middleware for Redux Toolkit.
 * @returns a chain with redux-thunk, serializability checks etc.
 *
 * @authApi.middleware: This middleware is used to handle the API calls made by the authApi.
 * RTK Query needs this to handle caching, polling, API request lifecycle actions, etc.
 * This must be added to enable RTK Query features.
 */
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});
