'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import Map from '../components/Map';
import { WelcomeModal } from '@lutruwita/ui';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Map />
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
    </Box>
  );
}
