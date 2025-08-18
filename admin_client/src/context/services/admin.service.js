import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCouriers: builder.query({
      query: () => ({
        url: "/courier/get",
        method: "GET",
      }),
      providesTags: ["Courier"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/user/get",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    blockUserToggle: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    createCourier: builder.mutation({
      query: (body) => ({
        url: "/courier/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),

    loginAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
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
  useGetCouriersQuery,
  useCreateCourierMutation,
  useGetUsersQuery,
  useLoginAdminMutation,
  useEditCourierMutation,
  useEditCourierPasswordMutation,
  useBlockUserToggleMutation
} = userApi;
