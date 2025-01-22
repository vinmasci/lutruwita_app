'use client';

import { Box, Paper, Typography, Avatar } from '@mui/material';
import { withAuth } from '../../hooks/withAuth';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../../components/LoadingScreen';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={user?.picture || undefined}
            alt={user?.name || 'User'}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date(user?.updated_at || '').toLocaleDateString()}
        </Typography>
      </Paper>
    </Box>
  );
};

// Wrap the page with authentication protection
export default withAuth(ProfilePage, {
  loading: LoadingScreen,
  returnTo: '/profile',
  onRedirecting: () => console.log('Redirecting to login...'),
  onError: (error) => console.error('Auth error:', error),
});
