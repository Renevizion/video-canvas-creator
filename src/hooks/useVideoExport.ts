import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ExportProgress {
  status: 'idle' | 'preparing' | 'recording' | 'encoding' | 'complete' | 'error';
  progress: number;
  message: string;
}

interface UseVideoExportOptions {
  fps?: number;
  quality?: number;
}

export function useVideoExport(options: UseVideoExportOptions = {}) {
  const { fps = 30, quality = 0.9 } = options;
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortRef = useRef(false);

  const exportVideo = useCallback(async (
    playerContainer: HTMLElement,
    durationInSeconds: number,
    filename: string = 'video.webm'
  ): Promise<Blob | null> => {
    abortRef.current = false;
    chunksRef.current = [];
    
    try {
      setExportProgress({ status: 'preparing', progress: 0, message: 'Preparing video export...' });
      
      // Find the video element or canvas inside the player
      const videoElement = playerContainer.querySelector('video');
      const canvasElement = playerContainer.querySelector('canvas');
      
      let stream: MediaStream;
      
      if (videoElement) {
        // If there's a video element, capture its stream
        stream = (videoElement as any).captureStream?.(fps);
        if (!stream) {
          throw new Error('captureStream not supported on video element');
        }
      } else if (canvasElement) {
        // If there's a canvas, capture its stream
        stream = (canvasElement as HTMLCanvasElement).captureStream(fps);
      } else {
        // Fallback: capture the entire container using html2canvas approach
        // For now, we'll use the new getDisplayMedia API with element capture
        // But that requires user permission, so let's try a different approach
        
        // Use a hidden canvas to capture frames
        const rect = playerContainer.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        
        stream = canvas.captureStream(fps);
        
        // We'll need to manually draw frames - this is complex, so let's use
        // a simpler approach: record the DOM element using html2canvas
        throw new Error('Direct DOM recording requires additional setup. Looking for video/canvas element.');
      }

      // Check for supported mime types
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4',
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported video format found in this browser');
      }

      setExportProgress({ status: 'recording', progress: 5, message: 'Recording video...' });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 5000000, // 5 Mbps for good quality
      });
      
      mediaRecorderRef.current = mediaRecorder;

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setExportProgress({ status: 'error', progress: 0, message: 'Recording failed' });
          reject(new Error('Recording failed'));
        };

        mediaRecorder.onstop = () => {
          if (abortRef.current) {
            setExportProgress({ status: 'idle', progress: 0, message: '' });
            resolve(null);
            return;
          }

          setExportProgress({ status: 'encoding', progress: 90, message: 'Encoding video...' });
          
          const blob = new Blob(chunksRef.current, { type: selectedMimeType });
          
          setExportProgress({ status: 'complete', progress: 100, message: 'Export complete!' });
          
          resolve(blob);
        };

        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms

        // Progress updates during recording
        const totalMs = durationInSeconds * 1000;
        const startTime = Date.now();
        
        const progressInterval = setInterval(() => {
          if (abortRef.current) {
            clearInterval(progressInterval);
            return;
          }
          
          const elapsed = Date.now() - startTime;
          const progress = Math.min(85, 5 + (elapsed / totalMs) * 80);
          setExportProgress({ 
            status: 'recording', 
            progress, 
            message: `Recording... ${Math.round((elapsed / 1000))}s / ${durationInSeconds}s` 
          });
        }, 200);

        // Stop recording after duration
        setTimeout(() => {
          clearInterval(progressInterval);
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, totalMs + 500); // Add small buffer
      });

    } catch (error) {
      console.error('Export error:', error);
      setExportProgress({ 
        status: 'error', 
        progress: 0, 
        message: error instanceof Error ? error.message : 'Export failed' 
      });
      toast.error('Failed to export video');
      return null;
    }
  }, [fps]);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Video downloaded successfully!');
  }, []);

  const cancelExport = useCallback(() => {
    abortRef.current = true;
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setExportProgress({ status: 'idle', progress: 0, message: '' });
  }, []);

  const resetExport = useCallback(() => {
    setExportProgress({ status: 'idle', progress: 0, message: '' });
  }, []);

  return {
    exportProgress,
    exportVideo,
    downloadBlob,
    cancelExport,
    resetExport,
  };
}
