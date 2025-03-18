import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAccountDetails: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dashboard/update-accaunt-details/${id}`, 
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["bank"],
    }),
  }),
});

export const { useUpdateAccountDetailsMutation } = offerApi;
