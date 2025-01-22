import { useUser } from '@auth0/nextjs-auth0/client';
import { useCallback } from 'react';

export interface UseAuthReturn {
  user: ReturnType<typeof useUser>['user'];
  error: ReturnType<typeof useUser>['error'];
  isLoading: ReturnType<typeof useUser>['isLoading'];
  isAuthenticated: boolean;
  loginUrl: string;
  logoutUrl: string;
}

/**
 * Custom hook for handling authentication state and actions
 * Wraps Auth0's useUser hook and provides additional functionality
 */
export const useAuth = (): UseAuthReturn => {
  const { user, error, isLoading } = useUser();

  // Compute authentication state
  const isAuthenticated = Boolean(user && !error && !isLoading);

  // Define login URL with redirect back to current page
  const loginUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      const returnTo = window.location.pathname;
      return `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
    }
    return '/api/auth/login';
  }, [])();

  // Define logout URL with redirect back to home
  const logoutUrl = '/api/auth/logout';

  return {
    user,
    error,
    isLoading,
    isAuthenticated,
    loginUrl,
    logoutUrl,
  };
};
