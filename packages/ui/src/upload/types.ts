export interface UploadError extends Error {
  code: 'FILE_TYPE' | 'FILE_SIZE' | 'FILE_CORRUPT' | 'UNKNOWN';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface GpxUploadProps {
  onUploadComplete: (routeId: string) => void;
  onError: (error: UploadError) => void;
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number; // in bytes, default 10MB
  className?: string;
}

export interface UploadState {
  isDragging: boolean;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: UploadError | null;
}
