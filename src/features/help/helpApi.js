import { baseApi } from "../../apiBaseQuery";


export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createContact: builder.mutation({
        query: (data) => ({
          url: "/dashboard/create",
          method: "POST",
          body: data,
        }),
      }),
    }), 
  });
  

  export const {
        useCreateContactMutation
  } = offerApi;