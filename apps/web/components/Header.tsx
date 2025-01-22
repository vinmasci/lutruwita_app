import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import AuthButton from './AuthButton';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

/**
 * Application header component with authentication controls
 * and navigation elements
 */
export const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          Lutruwita
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAuthenticated && (
            <Typography
              component={Link}
              href="/profile"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              Profile
            </Typography>
          )}
          <AuthButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
