import { create } from 'zustand';

interface ExportState {
  isExporting: boolean;
  projectId: string | null;
  progress: number;
  message: string;
  status: 'idle' | 'preparing' | 'recording' | 'encoding' | 'complete' | 'error';
  blob: Blob | null;
  startExport: (projectId: string) => void;
  updateProgress: (progress: number, message: string, status: ExportState['status']) => void;
  completeExport: (blob: Blob) => void;
  failExport: (message: string) => void;
  resetExport: () => void;
}

export const useExportState = create<ExportState>((set) => ({
  isExporting: false,
  projectId: null,
  progress: 0,
  message: '',
  status: 'idle',
  blob: null,
  startExport: (projectId) => set({
    isExporting: true,
    projectId,
    progress: 0,
    message: 'Starting export...',
    status: 'preparing',
    blob: null,
  }),
  updateProgress: (progress, message, status) => set({
    progress,
    message,
    status,
  }),
  completeExport: (blob) => set({
    isExporting: false,
    progress: 100,
    message: 'Export complete!',
    status: 'complete',
    blob,
  }),
  failExport: (message) => set({
    isExporting: false,
    progress: 0,
    message,
    status: 'error',
    blob: null,
  }),
  resetExport: () => set({
    isExporting: false,
    projectId: null,
    progress: 0,
    message: '',
    status: 'idle',
    blob: null,
  }),
}));
