import { baseApi } from '@/store/baseApi';

export const workoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkouts: builder.query<any, void>({
      query: () => '/workouts',
    }),
  }),
  overrideExisting: false,
});

export const { useGetWorkoutsQuery } = workoutApi;
