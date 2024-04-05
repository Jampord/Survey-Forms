import { api } from "./API";

const groupAPI = api
  .enhanceEndpoints({ addTagTypes: ["group"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllGroups: builder.query({
        query: (params) => ({
          url: "Group/GroupListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["group"],
      }),

      addGroup: builder.mutation({
        query: (body) => ({
          url: `Group/AddGroup`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["group"],
      }),

      updateGroup: builder.mutation({
        query: ({ Id, body }) => ({
          url: `Group/UpdateGroup/${Id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["group"],
      }),

      archiveGroup: builder.mutation({
        query: ({ Id }) => ({
          url: `Group/Setisactive/${Id}`,
          method: "PATCH",
          body: Id,
        }),
        invalidatesTags: ["group"],
      }),
    }),
  });

export const {
  useGetAllGroupsQuery,
  useUpdateGroupMutation,
  useAddGroupMutation,
  useArchiveGroupMutation,
} = groupAPI;
