import { baseApi } from '@/store/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => '/auth/profile',
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserProfileQuery } = authApi;
