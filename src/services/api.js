import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../utils/BaseURL";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/api/v1/user/create-businessman",
        method: "POST",
        body: newUser,
      }),
    }),

    
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verify: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotPass: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/dashboard/forget-password",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPass: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/dashboard/reset-password",
        method: "POST",
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
        body: credentials,
      }),
    }),


    createShop:builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/dashboard/create-shop",
        method: "POST",
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
        body: {
          ...credentials, 
          logo: credentials.logo,
          banner: credentials.banner,
        },
      }),
    }),
    

    getUsers: builder.query({
      query: () => "users",
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useVerifyMutation,
  useForgotPassMutation,
  useResetPassMutation,
  useCreateShopMutation
} = api;
