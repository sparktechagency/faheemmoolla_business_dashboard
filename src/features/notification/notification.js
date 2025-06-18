import { baseApi } from "../../apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => "/notification",
      providesTags: ["notification"],
    }),
    readNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['notification'],
    }),

    deleteAllNotification: builder.mutation({
      query: () => ({
        url: `/notification/all-notifications/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),

    deleteSingleNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useReadNotificationMutation,
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation
} = notificationApi;
