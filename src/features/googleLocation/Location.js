import { baseApi } from "../../apiBaseQuery";


export const LocationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchLocation: builder.query({
      query: (search) => ({
        url: `/home/auto-complete?input=${search}`,
        method: "GET",
      }),
    }),

    getCordinate: builder.query({
      query: (place_id) => ({
        url: `/home/get-coordinates?placeId=${place_id}`,
        method: "GET",
      }),
    }),


  }),
});


export const {
  useLazySearchLocationQuery,
  useLazyGetCordinateQuery
} = LocationApi;