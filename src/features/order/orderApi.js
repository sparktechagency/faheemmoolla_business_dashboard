import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      
      getOrder: builder.query({
        query: ({ shopId, page = 1, limit = 10 }) => 
          `/orders/${shopId}?page=${page}&limit=${limit}`,
        providesTags: ["order"]
      }),

      singleOrder: builder.query({
        query: (id) => `/orders/detail/${id}`,
        providesTags: ["order"]
      }),

      getOrderAnalysis: builder.query({
        query: (id) => `/orders/analysis/${id}`,
        providesTags: ["order"]
      }),

      updateOrder: builder.mutation({
        query: (orderData) => ({
          url: `/orders/${orderData.id}`,
          method: 'PATCH',
          body: orderData,  
        }),
        invalidatesTags: ["order"]
      }),

    }), 
});

export const {
    useGetOrderAnalysisQuery,
    useGetOrderQuery,
    useUpdateOrderMutation,
    useSingleOrderQuery
} = offerApi;
