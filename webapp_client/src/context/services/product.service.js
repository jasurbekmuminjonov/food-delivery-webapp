import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/product/get",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductsByQuery: builder.query({
      query: ({
        category_id = "",
        product_id = "",
        q = "",
        discount = "false",
      }) => ({
        url: `/product/get/query?category_id=${category_id}&product_id=${product_id}&q=${encodeURIComponent(
          q
        )}&discount=${discount}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductsByNameQuery: builder.query({
      query: ({ q = "" }) => ({
        url: `/product/get/name?q=${encodeURIComponent(q)}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsByQueryQuery,
  useLazyGetProductsByNameQueryQuery,
} = productApi;
