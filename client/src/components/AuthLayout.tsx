"use client"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '@/lib/feature/auth/authThunk';
import { setUser } from '@/lib/feature/auth/authSlice';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: user, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    }
  }, [dispatch, isSuccess, user]);

  return <>{children}</>;
}