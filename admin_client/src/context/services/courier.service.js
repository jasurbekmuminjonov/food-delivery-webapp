import { api } from "./api";

export const courierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCourier: builder.mutation({
      query: (body) => ({
        url: "/courier/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),

    getCouriers: builder.query({
      query: () => ({
        url: "/courier/get",
        method: "GET",
      }),
      providesTags: ["Courier"],
    }),

    editCourier: builder.mutation({
      query: ({ id, body }) => ({
        url: `/courier/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),
    editCourierPassword: builder.mutation({
      query: ({ id, body }) => ({
        url: `/courier/password/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),
  }),
});

export const {
  useCreateCourierMutation,
  useEditCourierMutation,
  useEditCourierPasswordMutation,
  useGetCouriersQuery,
} = courierApi;
