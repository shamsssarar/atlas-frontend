import { baseApi } from '@/store/baseApi';

export const biometricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBiometrics: builder.query<any, void>({
      query: () => '/biometrics',
    }),
  }),
  overrideExisting: false,
});

export const { useGetBiometricsQuery } = biometricsApi;
