// src/features/trainingPlans/trainingPlansApi.ts
import { baseApi } from "@/store/baseApi";

// Define the Types based on your Prisma Schema
export interface Program {
  id: string;
  name: string;
  description: string | null;
  durationWeeks: number;
  category: string;
  coachId: string;
  createdAt: string;
  // include coach profile if your backend populates it
  coach?: {
    id: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  enrollments?: {
    id: string;
    athleteId: string;
    athlete?: {
      id: string;
      email: string;
      profile?: {
        firstName: string;
        lastName: string;
      };
    };
  }[];
}

export interface PaginatedResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}

export const trainingPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Matches: router.get("/public")
    getPublicPrograms: builder.query<
      PaginatedResponse<Program>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/programs/public",
        params: params || { page: 1, limit: 20 },
      }),
      providesTags: ["Programs"],
    }),

    // Matches: router.get("/:id") -> Note: Backend requires Auth for this!
    getProgramById: builder.query<Program, string>({
      query: (id) => `/programs/${id}`,
      providesTags: (result, error, id) => [{ type: "Programs", id }],
    }),

    // Matches: router.get("/my-programs")
    getCoachPrograms: builder.query<Program[], void>({
      query: () => "/programs/my-programs",
      transformResponse: (response: any) => response.data,
      providesTags: ["Programs"],
    }),

    // Matches: router.post("/")
    createProgram: builder.mutation<
      Program,
      {
        name: string;
        description?: string;
        durationWeeks: number;
        category?: string;
      }
    >({
      query: (body) => ({
        url: "/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Programs"],
    }),

    // Matches: router.patch("/:id")
    updateProgram: builder.mutation<
      Program,
      {
        id: string;
        name?: string;
        description?: string;
        durationWeeks?: number;
        category?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/programs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Programs", { type: "Programs", id: "LIST" }], // Invalidate to refetch list and detail
    }),

    // Matches: router.delete("/:id")
    deleteProgram: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPublicProgramsQuery,
  useGetProgramByIdQuery,
  useGetCoachProgramsQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = trainingPlansApi;
