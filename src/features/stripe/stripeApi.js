import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStripe: builder.mutation({
      query: () => ({
        url: "/dashboard/create-connected-account",
        method: "POST",
      }),
    }),

    onboarding: builder.mutation({
      query: () => ({
        url: "/dashboard/create-onboarding-link",
        method: "POST",
      }),
    }),

    verifyAccaunt: builder.mutation({
      query: () => ({
        url: "/dashboard/verify-accaunt",
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateStripeMutation , useOnboardingMutation , useVerifyAccauntMutation } = offerApi;
