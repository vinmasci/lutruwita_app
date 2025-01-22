import React, { useCallback, useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  styled,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { GpxUploadProps, UploadState, UploadError, UploadProgress } from './types';

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  position: 'relative',
  border: `2px dashed ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&[data-dragging="true"]': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
})) as typeof Paper;

export const GpxUpload: React.FC<GpxUploadProps> = ({
  onUploadComplete,
  onError,
  onProgress,
  maxSize = DEFAULT_MAX_SIZE,
  className,
}) => {
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    isUploading: false,
    progress: null,
    error: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): UploadError | null => {
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      return {
        name: 'Invalid file type',
        message: 'Only GPX files are allowed',
        code: 'FILE_TYPE',
      };
    }

    if (file.size > maxSize) {
      return {
        name: 'File too large',
        message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
        code: 'FILE_SIZE',
      };
    }

    return null;
  };

  const handleUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setState((prev) => ({ ...prev, error }));
      onError(error);
      return;
    }

    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      progress: { loaded: 0, total: file.size, percent: 0 },
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percent: Math.round((event.loaded * 100) / event.total),
          };
          setState((prev) => ({ ...prev, progress }));
          onProgress?.(progress);
        }
      });

      const response = await new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.routeId);
            } catch {
              reject(new Error('Invalid server response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', '/api/gpx/upload');
        xhr.send(formData);
      });

      onUploadComplete(response);
    } catch (err) {
      const uploadError: UploadError = {
        name: 'Upload failed',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        code: 'UNKNOWN',
      };
      setState((prev) => ({ ...prev, error: uploadError }));
      onError(uploadError);
    } finally {
      setState((prev) => ({ ...prev, isUploading: false }));
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragging: false }));

      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <Box className={className}>
      <StyledPaper
        elevation={0}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-dragging={state.isDragging}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Upload GPX File
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Drag and drop your GPX file here, or click to select
        </Typography>
        {state.isUploading && state.progress && (
          <Box sx={{ mt: 2, px: 2 }}>
            <LinearProgress
              variant="determinate"
              value={state.progress.percent}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {Math.round(state.progress.percent)}%
            </Typography>
          </Box>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".gpx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </StyledPaper>
      {state.error && (
        <Box
          sx={{
            color: 'error.main',
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2">{state.error.message}</Typography>
          <IconButton size="small" onClick={clearError}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
