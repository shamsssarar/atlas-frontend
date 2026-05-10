import { baseApi } from "@/store/baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query<any, void>({
      query: () => "/aiInsights",
    }),
    askCoach: builder.mutation<
      { success: boolean; data: { answer: string } },
      { question: string }
    >({
      query: (payload) => ({
        url: "/ragChatbot/ask",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetInsightsQuery, useAskCoachMutation } = aiApi;
