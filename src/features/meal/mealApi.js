import { baseApi } from "../../apiBaseQuery";

export const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new meal
    createMeal: builder.mutation({
      query: (data) => ({
        url: "/dashboard/create-meal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["meal", "category"],
    }),

    // Update a meal by ID
    updateMeal: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dashboard/update-meal/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["meal", "category"],
    }),

    // Delete a meal by ID
    deleteMeal: builder.mutation({
      query: (id) => ({
        url: `/dashboard/delete-meal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["meal", "category"],
    }),

    // Update meal status by ID
    updateMealStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dashboard/update-meal-status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["meal"],
    }),

    // Get meals by shop ID
    getMealsByShop: builder.query({
      query: (shopId) => (shopId && `/dashboard/meals-by-shop/${shopId}`),
      providesTags: ["meal","category"],
    }),

    // Get a single meal by ID
    getMealById: builder.query({
      query: (id) => `/dashboard/get-meal/${id}`,
      providesTags: ["meal","category"],
    }),

    // Get all meal categories
    getCategories: builder.query({
      query: () => "/dashboard/category",
      providesTags: ["meal","category"],
    }),
  }),
});

export const {
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useUpdateMealStatusMutation,
  useGetMealsByShopQuery,
  useGetMealByIdQuery,
  useGetCategoriesQuery,
} = mealApi;
