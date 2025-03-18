import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: ({ year, shopId, month, page = 1, limit = 10 }) => ({
        url: `/dashboard/earning?year=${year}&shopId=${shopId}&month=${month}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["earning"],
    }),
    getEarningsDetail: builder.query({
      query: (id) => ({
        url: `/dashboard/earning/detail/${id}`,
        method: "GET",
      }),
      providesTags: ["earning"],
    }),
  }),
});

export const { useGetEarningsQuery, useGetEarningsDetailQuery } = offerApi;
