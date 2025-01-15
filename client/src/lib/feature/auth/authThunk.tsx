import { baseApiSlice } from '../../store/apiSlice';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../../../types/user';

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: 'api/v1/register',
        method: 'POST',
        body: credentials,
        credentials: 'include', 
      }),
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: 'api/v1/login',
        method: 'POST',
        body: credentials,
        credentials: 'include', 
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'api/v1/logout',  // Updated to match backend route
        method: 'POST',        // Updated to match backend method
        credentials: 'include', 
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: 'api/v1/me',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: 'api/v1/profile/update',  // Updated to match backend route
        method: 'PUT',                 // Updated to match backend method
        body: updates,
        credentials: 'include',        // Added for consistency
      }),
      invalidatesTags: ['User'],
    }),

    verifyPassword: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: 'api/v1/verify-password',
        method: 'POST',
        body: data,
        credentials: 'include',        // Added for consistency
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