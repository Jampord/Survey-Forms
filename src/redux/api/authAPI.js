import { api } from "./API";

const authAPI = api
  .enhanceEndpoints({ addTagTypes: ["userInfo"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      userLogin: builder.mutation({
        query: ({ userName, password }) => ({
          url: "Login/authenticate",
          method: "POST",
          body: { userName, password },
        }),
        invalidatesTags: ["userInfo"],
        transformErrorResponse: (error) => error.data,
        // onSuccess: (data, { dispatch }) => {
        //   if (data.userToken) {
        //     localStorage.setItem("userToken", data.userToken);
        //     // You can dispatch an action if needed
        //     // dispatch(someAction());
        //   }
        // },
      }),
    }),
  });

export const { useUserLoginMutation } = authAPI;
export default authAPI;
