import { baseApi } from '@/store/baseApi';

export interface UserProfile {
  id: string;
  email: string;
  role: 'ATHLETE' | 'COACH' | 'ADMIN';
  [key: string]: any;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
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

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery, useSyncUserMutation } = authApi;
