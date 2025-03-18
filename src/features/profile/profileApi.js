import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    profile: builder.query({
      query: () => "/user/profile",
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation
} = offerApi;
