import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/product/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "/product/get",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    editProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    insertImageToProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/product/image/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteImageInProduct: builder.mutation({
      query: ({ product, image_index }) => ({
        url: `/product/image?product=${product}&image=${image_index}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    setImageToMain: builder.mutation({
      query: ({ product, image_index }) => ({
        url: `/product/image/main?product=${product}&image=${image_index}`,
        method: "PUT",
      }),
      invalidatesTags: ["Product"],
    }),

    createDiscountForProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/discount/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    removeDiscountInProduct: builder.mutation({
      query: ({ product, discount_index }) => ({
        url: `/product/discount?product=${product}&discount=${discount_index}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createStockForProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/stock/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    searchProducts: builder.query({
      query: (query) => ({
        url: `/product/search?q=${query}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    toggleProductStatus: builder.mutation({
      query: (id) => ({
        url: `/product/status/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
  useInsertImageToProductMutation,
  useDeleteImageInProductMutation,
  useSetImageToMainMutation,
  useCreateDiscountForProductMutation,
  useRemoveDiscountInProductMutation,
  useCreateStockForProductMutation,
  useSearchProductsQuery,
  useToggleProductStatusMutation,
  useDeleteProductMutation
} = productApi;
