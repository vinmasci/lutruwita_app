import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { LoginOutlined, LogoutOutlined } from '@mui/icons-material';

/**
 * Authentication button component that shows login/logout
 * based on current authentication state
 */
export const AuthButton = () => {
  const { isAuthenticated, loginUrl, logoutUrl, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Button
        href={logoutUrl}
        variant="outlined"
        color="inherit"
        startIcon={<LogoutOutlined />}
      >
        Logout
      </Button>
    );
  }

  return (
    <Button
      href={loginUrl}
      variant="outlined"
      color="inherit"
      startIcon={<LoginOutlined />}
    >
      Login
    </Button>
  );
};

export default AuthButton;
