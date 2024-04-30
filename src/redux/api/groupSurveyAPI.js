import { api } from "./API";

const groupSurveyAPI = api
  .enhanceEndpoints({ addTagTypes: ["survey"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllGroupSurveys: builder.query({
        query: (params) => ({
          url: "GroupSurvey/GroupSurveyPagination",
          method: "GET",
          params,
        }),
        providesTags: ["survey"],
      }),

      addGroupSurvey: builder.mutation({
        query: (body) => ({
          url: "GroupSurvey/AddGroupSurvey",
          method: "POST",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["survey"],
      }),

      viewSurvey: builder.mutation({
        query: ({ Id, body }) => ({
          url: `GroupSurvey/ViewSurveyGenerator/${Id}`,
          method: "PATCH",
          body,
          responseHandler: function (response) {
            return response.text();
          },
        }),
        invalidatesTags: ["survey"],
      }),

      updateGroupScore: builder.mutation({
        query: ({ surveyGeneratorId, body }) => ({
          url: `GroupSurvey/UpdateScore/${surveyGeneratorId}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["survey"],
      }),
    }),
  });

export const {
  useGetAllGroupSurveysQuery,
  useAddGroupSurveyMutation,
  useViewSurveyMutation,
  useUpdateGroupScoreMutation,
} = groupSurveyAPI;
