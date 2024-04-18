import { userAPI } from "./API";

const dummyDepartmentAPI = userAPI
  .enhanceEndpoints({
    addTagTypes: ["dummydepartments"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllDummyUsers: builder.query({
        query: (params) => ({
          url: "users",
          method: "GET",
          params,
        }),
        providesTags: ["dummydepartments"],
      }),
    }),
  });

export const { useGetAllDummyUsersQuery } = dummyDepartmentAPI;
