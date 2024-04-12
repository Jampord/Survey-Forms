import { api } from "./API";

const branchAPI = api
  .enhanceEndpoints({ addTagTypes: ["branch"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllBranches: builder.query({
        query: (params) => ({
          url: "Branch/BranchListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["branch"],
      }),

      addBranch: builder.mutation({
        query: (body) => ({
          url: "Branch/AddBranch",
          method: "POST",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["branch"],
      }),

      updateBranch: builder.mutation({
        query: ({ Id, body }) => ({
          url: `Branch/UpdateBranch/${Id}`,
          method: "PUT",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["branch"],
      }),

      archiveBranch: builder.mutation({
        query: ({ Id }) => ({
          url: `Branch/SetIsactive/${Id}`,
          method: "PATCH",
          body: Id,
        }),
        invalidatesTags: ["branch"],
      }),
    }),
  });

export const {
  useGetAllBranchesQuery,
  useAddBranchMutation,
  useArchiveBranchMutation,
  useUpdateBranchMutation,
} = branchAPI;
