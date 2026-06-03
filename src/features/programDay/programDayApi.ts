import { baseApi } from "@/store/baseApi";

export interface ExerciseTarget {
  id: string;
  programDayId: string;
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  order: number;
  // include other properties as needed
}

export interface ProgramDay {
  id: string;
  programId: string;
  dayNumber: number;
  targets: ExerciseTarget[];
  exerciseTargets?: ExerciseTarget[];
  ExerciseTarget?: ExerciseTarget[];
}

export const programDayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgramDays: builder.query<ProgramDay[], string>({
      query: (programId) => `/program-days?programId=${programId}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ProgramDay" as const, id })),
              { type: "ProgramDay", id: "LIST" },
            ]
          : [{ type: "ProgramDay", id: "LIST" }],
    }),
    createProgramDay: builder.mutation<
      ProgramDay,
      { programId: string; dayNumber: number }
    >({
      query: (body) => ({
        url: "/program-days",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ProgramDay", id: "LIST" }],
    }),
    updateProgramDay: builder.mutation<
      ProgramDay,
      { id: string; dayNumber?: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/program-days/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ProgramDay", id }],
    }),
    deleteProgramDay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/program-days/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ProgramDay", id },
        { type: "ProgramDay", id: "LIST" },
      ],
    }),
    addExerciseTarget: builder.mutation<
      ExerciseTarget,
      {
        programDayId: string;
        exerciseId: string;
        targetSets: number;
        targetReps: string;
        order: number;
      }
    >({
      query: ({ programDayId, ...body }) => ({
        url: `/program-days/${programDayId}/targets`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { programDayId }) => [
        { type: "ProgramDay", id: programDayId },
      ],
    }),
    updateExerciseTarget: builder.mutation<
      ExerciseTarget,
      {
        targetId: string;
        programDayId: string; // Used for invalidation
        exerciseId?: string;
        targetSets?: number;
        targetReps?: string;
        order?: number;
      }
    >({
      query: ({ targetId, programDayId, ...body }) => ({
        url: `/program-days/targets/${targetId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { programDayId }) => [
        { type: "ProgramDay", id: programDayId },
      ],
    }),
    deleteExerciseTarget: builder.mutation<
      void,
      { targetId: string; programDayId: string }
    >({
      query: ({ targetId }) => ({
        url: `/program-days/targets/${targetId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { programDayId }) => [
        { type: "ProgramDay", id: programDayId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProgramDaysQuery,
  useCreateProgramDayMutation,
  useUpdateProgramDayMutation,
  useDeleteProgramDayMutation,
  useAddExerciseTargetMutation,
  useUpdateExerciseTargetMutation,
  useDeleteExerciseTargetMutation,
} = programDayApi;
