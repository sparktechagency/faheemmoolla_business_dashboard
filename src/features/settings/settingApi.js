import { baseApi } from "../../apiBaseQuery";


export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      changePassword: builder.mutation({
        query: (data) => ({
          url: "/auth/change-password",
          method: "POST",
          body: data,
        }),
      }),
    }), 
  });
  

  export const {
        useChangePasswordMutation
  } = offerApi;