import { baseApi } from '@/store/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<unknown, void>({
      query: () => '/auth/profile',
    }),
    syncUser: builder.mutation<unknown, { name: string; email: string }>({
      query: (body) => ({
        url: '/users/sync',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserProfileQuery, useSyncUserMutation } = authApi;
