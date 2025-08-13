import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserByQuery: builder.query({
      query: (telegramId) => ({
        url: `/user/get?telegram_id=${telegramId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/user/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLazyGetUserByQueryQuery, useCreateUserMutation } = userApi;
