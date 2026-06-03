import { baseApi } from "@/store/baseApi";

// Based on your Prisma schema
export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  biomechanicsType?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  muscleGroup: string;
  equipment: string;
  coachId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExercisePayload {
  name: string;
  targetMuscle: string;
  biomechanicsType?: string;
  description?: string;
  videoUrl?: string;
  muscleGroup: string;
  equipment: string;
}

export const exercisesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL EXERCISES
    getExercises: builder.query<Exercise[], void>({
      query: () => "/exercises",
      // 🛠️ The Industrial Fix: Strip the backend wrapper
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Exercise" as const, id })),
              { type: "Exercise", id: "LIST" },
            ]
          : [{ type: "Exercise", id: "LIST" }],
    }),

    // GET SINGLE EXERCISE
    getExerciseById: builder.query<Exercise, string>({
      query: (id) => `/exercises/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "Exercise", id }],
    }),

    // CREATE EXERCISE
    createExercise: builder.mutation<Exercise, CreateExercisePayload>({
      query: (body) => ({
        url: "/exercises",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Exercise", id: "LIST" }],
    }),

    // UPDATE EXERCISE
    updateExercise: builder.mutation<
      Exercise,
      { id: string; data: Partial<CreateExercisePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/exercises/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Exercise", id }],
    }),

    // DELETE EXERCISE
    deleteExercise: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exercises/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Exercise", id },
        { type: "Exercise", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetExercisesQuery,
  useGetExerciseByIdQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} = exercisesApi;