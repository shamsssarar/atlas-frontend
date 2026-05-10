import { baseApi } from "@/store/baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query<any, void>({
      query: () => "/insights",
    }),
    askCoach: builder.mutation<{ response: string }, { question: string }>({
      query: (payload) => ({
        url: "/chatbot/ask",
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetInsightsQuery, useAskCoachMutation } = aiApi;
