import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "../../utils/customFetchBaseQuery";

export const userApi = createApi({
  reducerPath: "userApi", // Unique key for the API slice
  baseQuery: customFetchBaseQuery({
    baseUrl: "http://localhost:8000", // Base URL for the API
  }),
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => "/user/me",
    }),
  }),
});

export const { useGetUserDataQuery } = userApi;
