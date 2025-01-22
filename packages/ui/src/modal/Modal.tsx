import React from 'react';
import {
  Modal as MuiModal,
  Box,
  IconButton,
  Theme,
  SxProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  outline: 'none',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
};

const closeButtonStyle: SxProps<Theme> = {
  position: 'absolute',
  right: 1,
  top: 1,
};

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  maxWidth?: string | number;
  hideCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  open,
  onClose,
  maxWidth = '600px',
  hideCloseButton = false,
}) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ ...modalStyle, maxWidth }}>
        {!hideCloseButton && (
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={closeButtonStyle}
          >
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </MuiModal>
  );
};
