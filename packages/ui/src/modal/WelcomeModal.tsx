import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

export interface WelcomeModalProps {
  onClose: () => void;
}

const WELCOME_SHOWN_KEY = 'welcome_modal_shown';

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Check if modal has been shown before
    const hasShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (hasShown) {
      handleClose();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 600,
          mx: 2,
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent click-through
      >
        <Typography
          id="welcome-modal-title"
          variant="h2"
          component="h1"
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Welcome to Lutruwita
        </Typography>
        <Typography
          id="welcome-modal-description"
          variant="h5"
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Explore and discover the natural beauty of Tasmania through interactive maps and trails
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleClose}
          startIcon={<ExploreIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 8,
            textTransform: 'none',
            fontSize: '1.2rem',
          }}
        >
          Start Exploring
        </Button>
      </Box>
    </Modal>
  );
}
