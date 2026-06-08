import { baseApi } from "@/store/baseApi";

export const athleteCoachApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAthleteOverview: builder.query<any, string>({
      query: (athleteId) => `/athletes/${athleteId}/overview`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "Athlete", id }],
    }),
    getAthleteWorkouts: builder.query<any, string>({
      query: (athleteId) => `/athletes/${athleteId}/workouts`,
      providesTags: (result, error, id) => [{ type: "Athlete", id }],
    }),
    // Add this right below your getAthleteWorkouts query
    getAthleteAnalytics: builder.query<any, string>({
      query: (athleteId) => `/athletes/${athleteId}/analytics`,
      providesTags: (result, error, id) => [{ type: "Athlete", id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAthleteOverviewQuery,
  useGetAthleteWorkoutsQuery,
  useGetAthleteAnalyticsQuery,
} = athleteCoachApi;
[];
