import { api } from "./API";

const userAPI = api
  .enhanceEndpoints({ addTagTypes: ["user"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllUsers: builder.query({
        query: (params) => ({
          url: "User/CustomerListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["user"],
      }),

      addUser: builder.mutation({
        query: (body) => ({
          url: "User/AddUser",
          method: "POST",
          body,
        }),
        invalidatesTags: ["user"],
      }),

      updateUser: builder.mutation({
        query: ({ Id, body }) => ({
          url: `User/UpdateUser/${Id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["user"],
      }),

      archiveUser: builder.mutation({
        query: ({ Id }) => ({
          url: `User/SetIsActive/${Id}`,
          method: "PATCH",
          body: Id,
        }),
        invalidatesTags: ["user"],
      }),
    }),
  });

export const {
  useGetAllUsersQuery,
  useAddUserMutation,
  useArchiveUserMutation,
  useUpdateUserMutation,
} = userAPI;

const roleAPI = api
  .enhanceEndpoints({ addTagTypes: ["role"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllRoles: builder.query({
        query: (params) => ({
          url: "Role/RoleListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["role"],
      }),

      addRole: builder.mutation({
        query: (body) => ({
          url: "Role/AddNewRole",
          method: "POST",
          body,
        }),
        invalidatesTags: ["role"],
      }),

      updateRole: builder.mutation({
        query: ({ Id, body }) => ({
          url: `Role/UpdateRole/${Id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["role"],
      }),

      archiveRole: builder.mutation({
        query: ({ Id }) => ({
          url: `Role/SetIsActive/${Id}`,
          method: "PATCH",
          body: Id,
        }),
        invalidatesTags: ["role"],
      }),
    }),
  });

export const {
  useGetAllRolesQuery,
  useAddRoleMutation,
  useArchiveRoleMutation,
  useUpdateRoleMutation,
} = roleAPI;
