import axios from "axios";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log(process.env.REACT_APP_BASEURL);
const API = axios.create({
  baseURL: "http://localhost:5221/api/",
});

export default API;

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5221/api/" }),
//   endpoints: (builder) => ({
//     getAllUsers: builder.query({
//       query: () => "User/CustomerListPagnation",
//     }),
//   }),
// });

// export const { useGetAllUsersQuery } = apiSlice;
