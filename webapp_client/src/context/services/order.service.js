import { api } from "./api";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/order/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrders: builder.query({
      query: () => ({
        url: "/order/user/get",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (body) => ({
        url: `/order/cancel`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery, useCancelOrderMutation } = orderApi;
