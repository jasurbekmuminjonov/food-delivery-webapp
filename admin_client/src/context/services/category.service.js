import { api } from "./api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    createSubcategory: builder.mutation({
      query: (body) => ({
        url: "/subcategory/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategories: builder.query({
      query: () => ({
        url: "/category/get",   
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useGetCategoriesQuery,
} = categoryApi;
