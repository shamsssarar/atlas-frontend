import { baseApi } from "@/store/baseApi";

export const workoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkouts: builder.query<unknown, void>({
      query: () => "/workouts",
    }),
    // 🛠️ 1. ADD THIS NEW QUERY TO FETCH THE COACH'S PRESCRIPTION
    getTodayPrescription: builder.query<any, void>({
      query: () => "/workouts/today", // Ensure this matches the route you made in Express!
      transformResponse: (response: any) => response.data,
      providesTags: ["Workout"], // This ensures it refetches if a workout is completed
    }),

    getMyWorkoutsHistory: builder.query<any, void>({
      query: () => "/workouts/history",
      transformResponse: (response: any) => response.data,
      providesTags: ["Workout"], // Automatically updates when they finish a new workout!
    }),

    generateNextWorkout: builder.mutation<unknown, void>({
      query: () => ({
        url: "/aiInsights/generate-workout",
        method: "POST",
      }),
    }),

    startWorkout: builder.mutation<unknown, unknown>({
      query: (body) => ({
        url: "/workouts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workout"],
    }),

    completeWorkoutSession: builder.mutation<any, any>({
      query: (body) => ({
        url: "/workouts/complete",
        method: "POST",
        body,
      }),
      // This tells the UI to instantly refresh the History tab and the Dashboard
      invalidatesTags: ["Workout", "Athlete"],
    }),

    addExerciseToWorkout: builder.mutation<
      unknown,
      { workoutId: string; body: unknown }
    >({
      query: ({ workoutId, body }) => ({
        url: `/workouts/${workoutId}/exercises`,
        method: "POST",
        body,
      }),
    }),

    logSet: builder.mutation<
      unknown,
      { workoutExerciseId: string; body: unknown }
    >({
      query: ({ workoutExerciseId, body }) => ({
        url: `/workouts/exercises/${workoutExerciseId}/sets`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodayPrescriptionQuery,
  useGetMyWorkoutsHistoryQuery,
  useGetWorkoutsQuery,
  useGenerateNextWorkoutMutation,
  useStartWorkoutMutation,
  useCompleteWorkoutSessionMutation,
  useAddExerciseToWorkoutMutation,
  useLogSetMutation,
} = workoutApi;
