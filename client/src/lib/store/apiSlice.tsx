import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',

  }),
  endpoints: () => ({}),
  tagTypes: ['User'],
});