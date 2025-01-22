import { WithPageAuthRequiredOptions, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

interface WithAuthOptions extends Omit<WithPageAuthRequiredOptions, 'returnTo'> {
  returnTo?: string;
  loading?: ComponentType;
}

/**
 * Higher-order component that protects routes requiring authentication
 * Extends Auth0's withPageAuthRequired with custom loading and error handling
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { loading, ...auth0Options } = options;
  return withPageAuthRequired(
    function WithAuthWrapper(props: P) {
      const router = useRouter();

      // Handle authentication errors
      useEffect(() => {
        if (options.onError) {
          const handleError = (error: Error) => {
            options.onError?.(error);
            // Redirect to login on authentication errors
            router.push(`/api/auth/login?returnTo=${encodeURIComponent(options.returnTo || window.location.pathname)}`);
          };

          window.addEventListener('auth-error', (e) => handleError((e as CustomEvent).detail));
          return () => window.removeEventListener('auth-error', (e) => handleError((e as CustomEvent).detail));
        }
      }, [router]);

      return <WrappedComponent {...props} />;
    },
    {
      ...auth0Options,
    }
  );
}

/**
 * Example usage:
 * 
 * const ProtectedPage = withAuth(YourComponent, {
 *   returnTo: '/dashboard',
 *   loading: LoadingSpinner,
 *   onRedirecting: () => console.log('Redirecting to login...'),
 *   onError: (error) => console.error('Auth error:', error)
 * });
 */
