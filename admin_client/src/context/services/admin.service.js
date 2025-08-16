import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Barcha kuryerlarni olish
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

    // Kuryerni tahrirlash (ID orqali)
    blockUserToggle: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Yangi kuryer yaratish
    createCourier: builder.mutation({
      query: (body) => ({
        url: "/courier/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),

    // Login qilish
    loginAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
    }),

    // Kuryerni tahrirlash (ID orqali)
    editCourier: builder.mutation({
      query: ({ id, body }) => ({
        url: `/courier/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Courier"],
    }),

    // Kuryer parolini tahrirlash
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
