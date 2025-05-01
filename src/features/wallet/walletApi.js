import { baseApi } from "../../apiBaseQuery";

export const yocoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    walletBalance: builder.query({
      query: () => ({
        url: "/dashboard/wallet-balance",
        method: "GET",
      }),
      providesTags: ["walletbalance"],
    }),

    walletPayouts: builder.query({
      query: ({ page = 1, searchTerm = '' }) => ({
        url: `/dashboard/wallet-payouts?page=${page}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
    }),

    walletSinglePayout: builder.query({
      query: (id) => ({
        url: `/dashboard/wallet-payout/${id}`,
        method: "GET",
      }),
    }),
    requestPayout: builder.mutation({
      query: () => ({
        url: `/dashboard/wallet-withdraw-request`,
        method: "POST",
      }),
      invalidatesTags: ["walletbalance"],
    }),

    yocoverify: builder.mutation({
      query: (data) => ({
        url: `/dashboard/add-yoco-account`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["walletbalance"],
    }),
  }),
});

export const { useWalletBalanceQuery, useWalletPayoutsQuery, useWalletSinglePayoutQuery, useRequestPayoutMutation, useYocoverifyMutation } = yocoApi;
