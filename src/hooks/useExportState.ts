import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export const useExportState = create<ExportState>()(
  persist(
    (set) => ({
      isExporting: false,
      projectId: null,
      progress: 0,
      message: '',
      status: 'idle',
      blob: null,
      startExport: (projectId) =>
        set({
          isExporting: true,
          projectId,
          progress: 0,
          message: 'Export started — keep this tab open.',
          status: 'preparing',
          blob: null,
        }),
      updateProgress: (progress, message, status) =>
        set({
          progress,
          message,
          status,
        }),
      completeExport: (blob) =>
        set({
          isExporting: false,
          progress: 100,
          message: 'Export complete!',
          status: 'complete',
          blob,
        }),
      failExport: (message) =>
        set({
          isExporting: false,
          progress: 0,
          message,
          status: 'error',
          blob: null,
        }),
      resetExport: () =>
        set({
          isExporting: false,
          projectId: null,
          progress: 0,
          message: '',
          status: 'idle',
          blob: null,
        }),
    }),
    {
      name: 'video-export-state',
      version: 1,
      // Persist only lightweight status; never persist the Blob.
      partialize: (state) => ({
        isExporting: state.isExporting,
        projectId: state.projectId,
        progress: state.progress,
        message: state.message,
        status: state.status,
      }),
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        // If the page refreshed mid-export, we can't resume the recorder.
        if (state?.isExporting) {
          state.failExport('Export was interrupted (page refreshed / tab closed).');
        }
      },
    } as any
  )
);
