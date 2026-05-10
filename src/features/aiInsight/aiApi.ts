import { baseApi } from '@/store/baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query<any, void>({
      query: () => '/insights',
    }),
  }),
  overrideExisting: false,
});

export const { useGetInsightsQuery } = aiApi;
