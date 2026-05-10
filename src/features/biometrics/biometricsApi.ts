import { baseApi } from "@/store/baseApi";

export const biometricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBiometricsHistory: builder.query({
      query: (days = 7) => `/biometrics?days=${days}`,
      providesTags: ["Biometrics"],
    }),

    // ADD THIS NEW MUTATION
    logBiometrics: builder.mutation({
      query: (payload) => ({
        url: "/biometrics",
        method: "POST",
        body: payload,
      }),
      // THE MAGIC: This tells Redux to instantly refetch the history query above!
      invalidatesTags: ["Biometrics"],
    }),
  }),
  overrideExisting: true,
});

// Notice we added the new useLogBiometricsMutation hook here
export const { useGetBiometricsHistoryQuery, useLogBiometricsMutation } =
  biometricsApi;
