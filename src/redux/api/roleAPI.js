import { api } from "./API";

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
