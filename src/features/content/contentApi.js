import { baseApi } from "../../apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    privacy: builder.query({
      query: () => "/legal/privacy-policy",
    }),

    about: builder.query({
      query: () => "/legal/about-us",
    }),

    support: builder.query({
      query: () => "/legal/support",
    }),

    terms: builder.query({
      query: () => "/legal/terms-of-service",
    }),
  }),
});

export const {
    usePrivacyQuery,
    useAboutQuery,
    useSupportQuery,
    useTermsQuery
} = offerApi;
