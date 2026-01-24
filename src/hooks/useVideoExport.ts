import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

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
  
  const abortRef = useRef(false);

  const exportVideo = useCallback(async (
    playerContainer: HTMLElement,
    durationInSeconds: number,
    filename: string = 'video.webm'
  ): Promise<Blob | null> => {
    abortRef.current = false;
    
    try {
      setExportProgress({ status: 'preparing', progress: 0, message: 'Preparing video export...' });
      
      // Get the actual player content area
      const playerElement = playerContainer.querySelector('[data-player-container]') || playerContainer;
      const rect = playerElement.getBoundingClientRect();
      
      // Create a canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;
      
      // Set up MediaRecorder on the canvas stream
      const stream = canvas.captureStream(fps);
      
      // Check for supported mime types
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
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

      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps for good quality
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100);
      
      setExportProgress({ status: 'recording', progress: 5, message: 'Recording video...' });

      const totalFrames = durationInSeconds * fps;
      const frameInterval = 1000 / fps;
      
      // Record frames
      for (let frame = 0; frame < totalFrames; frame++) {
        if (abortRef.current) {
          mediaRecorder.stop();
          setExportProgress({ status: 'idle', progress: 0, message: '' });
          return null;
        }
        
        // Capture the current frame
        try {
          const frameCanvas = await html2canvas(playerElement as HTMLElement, {
            backgroundColor: '#000000',
            scale: canvas.width / rect.width,
            useCORS: true,
            logging: false,
            allowTaint: true,
          });
          
          // Draw to our recording canvas
          ctx.drawImage(frameCanvas, 0, 0, canvas.width, canvas.height);
        } catch (err) {
          console.warn('Frame capture error:', err);
        }
        
        // Update progress
        const progress = 5 + (frame / totalFrames) * 85;
        setExportProgress({ 
          status: 'recording', 
          progress, 
          message: `Recording frame ${frame + 1}/${totalFrames}` 
        });
        
        // Wait for next frame timing
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }

      // Stop recording
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          setExportProgress({ status: 'encoding', progress: 95, message: 'Encoding video...' });
          
          const blob = new Blob(chunks, { type: selectedMimeType });
          
          setExportProgress({ status: 'complete', progress: 100, message: 'Export complete!' });
          toast.success('Video exported successfully!');
          
          resolve(blob);
        };
        
        mediaRecorder.stop();
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
