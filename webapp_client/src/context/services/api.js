import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/api/v1/basic",
  prepareHeaders: (headers) => {
    const telegramId = localStorage.getItem("telegram_id");

    if (telegramId) {
      const payload = JSON.stringify({ telegram_id: telegramId });
      const encoded = btoa(payload);
      headers.set("Authorization", `Basic ${encoded}`);
    }

    headers.set("Cache-Control", "no-cache");
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    window.location.reload();
  }

  return result;
};

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: [],
  endpoints: () => ({}),
});
