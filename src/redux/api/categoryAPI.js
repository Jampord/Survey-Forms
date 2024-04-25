import { api } from "./API";

const categoryAPI = api
  .enhanceEndpoints({ addTagTypes: ["category"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllCategories: builder.query({
        query: (params) => ({
          url: "Category/CategoryListPagination",
          method: "GET",
          params,
        }),
        providesTags: ["category"],
      }),

      addCategory: builder.mutation({
        query: (body) => ({
          url: "Category/AddCategory",
          method: "POST",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["category"],
      }),

      updateCategory: builder.mutation({
        query: ({ Id, body }) => ({
          url: `Category/UpdateCategory/${Id}`,
          method: "PUT",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["category"],
      }),

      deleteCategory: builder.mutation({
        query: ({ Id }) => ({
          url: `Category/DeleteCategory/${Id}`,
          method: "DELETE",
          body: Id,
        }),
        invalidatesTags: ["category"],
      }),
    }),
  });

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryAPI;
