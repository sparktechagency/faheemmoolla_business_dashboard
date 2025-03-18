import { baseApi } from "../../apiBaseQuery";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Signup
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/user/create-businessman",
        method: "POST",
        body: newUser,
      }),
    }),

    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email Verification
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/dashboard/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/dashboard/reset-password",
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} = authApi;
