import { api } from "./api";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: () => ({
        url: "/order/get",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/order/cancel/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    completePreparing: builder.mutation({
      query: ({ orderId, body }) => ({
        url: `/order/complete/preparing/${orderId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrderQuery,
  useCancelOrderMutation,
  useCompletePreparingMutation,
} = orderApi;
