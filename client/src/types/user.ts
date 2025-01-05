export interface User {
  _id: string;
  firstName?: string;
  lastName: string;
  email: string;
  country: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Omit<User, '_id'> {
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// types/auth.ts
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}
