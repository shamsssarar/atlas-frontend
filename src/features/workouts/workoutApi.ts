import { baseApi } from '@/store/baseApi';

export const workoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkouts: builder.query<unknown, void>({
      query: () => '/workouts',
    }),
    generateNextWorkout: builder.mutation<unknown, void>({
      query: () => ({
        url: '/aiInsights/generate-workout',
        method: 'POST',
      }),
    }),
    startWorkout: builder.mutation<unknown, unknown>({
      query: (body) => ({
        url: '/workouts',
        method: 'POST',
        body,
      }),
    }),
    addExerciseToWorkout: builder.mutation<unknown, { workoutId: string; body: unknown }>({
      query: ({ workoutId, body }) => ({
        url: `/workouts/${workoutId}/exercises`,
        method: 'POST',
        body,
      }),
    }),
    logSet: builder.mutation<unknown, { workoutExerciseId: string; body: unknown }>({
      query: ({ workoutExerciseId, body }) => ({
        url: `/workouts/exercises/${workoutExerciseId}/sets`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetWorkoutsQuery, 
  useGenerateNextWorkoutMutation, 
  useStartWorkoutMutation,
  useAddExerciseToWorkoutMutation,
  useLogSetMutation
} = workoutApi;
