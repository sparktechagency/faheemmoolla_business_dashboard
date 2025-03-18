import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Signup
    createOffer: builder.mutation({
      query: (data) => ({
        url: "/dashboard/create-offer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["offer"],
    }),

    getAllOffer: builder.query({
      query: (id) => `/dashboard/offers/${id}`,
      providesTags: ["offer"],
    }),

    getOfferDetals: builder.query({
      query: (id) => `/dashboard/offer/${id}`,
      providesTags: ["offer"],
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useGetAllOfferQuery,
  useGetOfferDetalsQuery,
} = offerApi;
