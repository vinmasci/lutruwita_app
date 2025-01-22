'use client';

import { Box, Button, Container, Typography, Paper } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import Map from '../components/Map';
import TrpcTest from '../components/TrpcTest';

export default function Home() {
  return (
    <Box className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Container maxWidth="lg" className="py-8">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Welcome to Lutruwita
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '600px', mb: 4 }}
          >
            Explore and discover the natural beauty of Tasmania through interactive maps and trails
          </Typography>
          <TrpcTest />
          <Button
            variant="contained"
            size="large"
            startIcon={<ExploreIcon />}
            sx={{ py: 1.5, px: 4 }}
          >
            Start Exploring
          </Button>
        </Box>
      </Container>

      {/* Map Section */}
      <Box className="flex-1 p-4" sx={{ minHeight: '600px' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Map />
        </Paper>
      </Box>
    </Box>
  );
}
