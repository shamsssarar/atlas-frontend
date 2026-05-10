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
    getPublicPrograms: builder.query<PaginatedResponse<Program>, { page?: number; limit?: number } | void>({
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
  }),
  overrideExisting: true,
});

export const { useGetPublicProgramsQuery, useGetProgramByIdQuery } = trainingPlansApi;