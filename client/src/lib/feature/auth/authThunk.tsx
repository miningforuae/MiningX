import { baseApiSlice } from '../../store/apiSlice';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../../../types/user';

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: 'api/v1/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: 'api/v1/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'api/v1/logoutUser',
        method: 'GET',
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: 'api/v1/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: 'api/v1/updateProfile',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),

    verifyPassword: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: 'api/v1/verify-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useVerifyPasswordMutation,
} = authApiSlice;