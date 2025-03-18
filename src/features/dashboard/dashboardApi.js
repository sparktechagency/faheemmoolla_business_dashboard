import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allCountAnalysis: builder.query({
      query: () => "/dashboard",
      providesTags:["dashboard"]
    }),

    pieChartAnalysis: builder.query({
        query: (year = 2024) => `/dashboard/pie-chart?year=${year}`,
        providesTags:["dashboard"]
      }),

      orderChartAnalysis: builder.query({
        query: () => "/dashboard/order-chart",
        providesTags:["dashboard"]
      }),

      revinueChartAnalysis: builder.query({
        query: (year = 2024) => `/dashboard/revenue-chart?year=${year}`,
        providesTags:["dashboard"]
      }),
      customerMapAnalysis: builder.query({
        query: () => "/dashboard/order-chart",
        providesTags:["dashboard"]
      }),

  }),


});

export const { useAllCountAnalysisQuery , usePieChartAnalysisQuery , useOrderChartAnalysisQuery , useRevinueChartAnalysisQuery , useCustomerMapAnalysisQuery} = offerApi;
