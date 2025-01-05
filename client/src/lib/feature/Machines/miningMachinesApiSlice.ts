import { Machine } from '@/types/machine';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const miningMachinesApiSlice = createApi({
  reducerPath: 'miningMachinesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }), // Adjust your base URL accordingly
  tagTypes: ['MiningMachine'],
  endpoints: (builder) => ({
    getAllMiningMachines: builder.query<Machine[], void>({
      query: () => '/mining-machines',
      providesTags: ['MiningMachine'],
    }),
    getMiningMachineById: builder.query({
      query: (id) => `/mining-machines/${id}`,
      providesTags: (result, error, id) => [{ type: 'MiningMachine', id }],
    }),
    createMiningMachine: builder.mutation({
      query: (newMachine) => ({
        url: '/mining-machines',
        method: 'POST',
        body: newMachine,
      }),
      invalidatesTags: ['MiningMachine'],
    }),
    updateMiningMachine: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/mining-machines/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MiningMachine', id }],
    }),
    deleteMiningMachine: builder.mutation({
      query: (id) => ({
        url: `/mining-machines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MiningMachine', id }],
    }),
  }),
});

export const {
  useGetAllMiningMachinesQuery,
  useGetMiningMachineByIdQuery,
  useCreateMiningMachineMutation,
  useUpdateMiningMachineMutation,
  useDeleteMiningMachineMutation,
} = miningMachinesApiSlice;
