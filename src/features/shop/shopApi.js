import { baseApi } from "../../apiBaseQuery";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create shop
    create: builder.mutation({
      query: (data) => ({
        url: "/dashboard/create-shop",
        method: "POST",
        body: data,
      }),
      invalidatesTags:["shop"]
    }),

    // Get all shops
    allShop: builder.query({
      query: () => ({
        url: "/dashboard/all-shops",
        method: "GET",
      }),
      providesTags: ['shop','bank']
    }),

    // Get a single shop by ID
    getShopById: builder.query({
      query: (id) => ({
        url: `/dashboard/get-shop/${id}`,
        method: "GET",
      }),
      providesTags:["shop"]
    }),

    // Update shop
    update: builder.mutation({
      query: ({ shopId, data }) => ({
        url: `/dashboard/update-shop/${shopId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags:["shop"]
    }),

    updateShopStatus: builder.mutation({
      query: ( id ) => ({
        url: `/dashboard/shop-off-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags:["shop"]
    }),

    // Delete shop
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `/dashboard/delete-shop/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['shop'],
    }),
  }),
});

export const {
  useCreateMutation,
  useAllShopQuery,
  useGetShopByIdQuery, 
  useUpdateMutation,
  useDeleteShopMutation,
  useUpdateShopStatusMutation
} = shopApi;
