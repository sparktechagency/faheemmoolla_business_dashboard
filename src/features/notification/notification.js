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
  }),
});

export const {
  useGetNotificationQuery,
  useReadNotificationMutation
} = notificationApi;
