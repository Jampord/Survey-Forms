import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptToken } from "../../features/tokenService";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7248/api/",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      localStorage.getItem("encryptedToken") &&
        headers.set(
          "Authorization",
          `Bearer ${decryptToken(localStorage.getItem("encryptedToken"))}`
        );
    },
    // credentials: "include",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: () => ({}),
});

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/",
  }),
  endpoints: () => ({}),
});
