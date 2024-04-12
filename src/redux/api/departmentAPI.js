import { api } from "./API";

const departmentAPI = api
  .enhanceEndpoints({ addTagTypes: ["department"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllDepartments: builder.query({
        query: (params) => ({
          url: "Department/DepartmentListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["department"],
      }),

      addDepartment: builder.mutation({
        query: (body) => ({
          url: "Department/AddNewDepartment",
          method: "POST",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["department"],
      }),

      updateDepartment: builder.mutation({
        query: ({ Id, body }) => ({
          url: `Department/UpdateDepartment/${Id}`,
          method: "PUT",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["department"],
      }),

      archiveDepartment: builder.mutation({
        query: ({ Id }) => ({
          url: `Department/SetIsActive/${Id}`,
          method: "PATCH",
          body: Id,
        }),
        invalidatesTags: ["department"],
      }),
    }),
  });

export const {
  useGetAllDepartmentsQuery,
  useAddDepartmentMutation,
  useArchiveDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentAPI;
