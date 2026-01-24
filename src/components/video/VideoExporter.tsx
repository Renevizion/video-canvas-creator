import { useState, useRef, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, X, Film, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DynamicVideo } from '@/components/remotion/DynamicVideo';
import { useVideoExport } from '@/hooks/useVideoExport';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

interface VideoExporterProps {
  plan: VideoPlan;
  onClose?: () => void;
}

export function VideoExporter({ plan, onClose }: VideoExporterProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  
  const { exportProgress, exportVideo, downloadBlob, cancelExport, resetExport } = useVideoExport({
    fps: plan.fps || 30,
  });

  const duration = plan.duration || 10;
  const fps = plan.fps || 30;
  const totalFrames = duration * fps;

  const handleExport = async () => {
    if (!containerRef.current) {
      toast.error('Player not ready');
      return;
    }

    setIsExporting(true);
    setExportedBlob(null);

    // Reset player to start
    playerRef.current?.seekTo(0);
    
    // Small delay to ensure player is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start playing
    playerRef.current?.play();

    // Find the actual video/canvas element
    const playerElement = containerRef.current.querySelector('[data-player-container]') || containerRef.current;
    
    const blob = await exportVideo(
      playerElement as HTMLElement,
      duration,
      `video-${Date.now()}.webm`
    );

    // Pause player after recording
    playerRef.current?.pause();

    if (blob) {
      setExportedBlob(blob);
    }
    
    setIsExporting(false);
  };

  const handleDownload = () => {
    if (exportedBlob) {
      const filename = `video-${Date.now()}.webm`;
      downloadBlob(exportedBlob, filename);
    }
  };

  const handleCancel = () => {
    cancelExport();
    playerRef.current?.pause();
    setIsExporting(false);
  };

  const handleReset = () => {
    resetExport();
    setExportedBlob(null);
    playerRef.current?.seekTo(0);
  };

  const statusIcon = {
    idle: Film,
    preparing: Loader2,
    recording: Loader2,
    encoding: Loader2,
    complete: CheckCircle,
    error: AlertCircle,
  };

  const StatusIcon = statusIcon[exportProgress.status];
  const isLoading = ['preparing', 'recording', 'encoding'].includes(exportProgress.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Film className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Export Video</h2>
              <p className="text-sm text-muted-foreground">
                {duration}s @ {fps}fps • WebM format
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Player Preview */}
        <div ref={containerRef} className="mb-6 rounded-xl overflow-hidden bg-black">
          <div data-player-container className="aspect-video">
            <Player
              ref={playerRef}
              component={DynamicVideo}
              inputProps={{ plan }}
              durationInFrames={totalFrames}
              compositionWidth={plan.resolution?.width || 1920}
              compositionHeight={plan.resolution?.height || 1080}
              fps={fps}
              style={{ width: '100%', height: '100%' }}
              controls={!isExporting}
            />
          </div>
        </div>

        {/* Progress Section */}
        <AnimatePresence mode="wait">
          {exportProgress.status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 glass-card bg-primary/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <StatusIcon className={`w-5 h-5 ${isLoading ? 'animate-spin text-primary' : exportProgress.status === 'complete' ? 'text-green-500' : exportProgress.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className="font-medium text-foreground">{exportProgress.message}</span>
              </div>
              <Progress value={exportProgress.progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(exportProgress.progress)}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          {isExporting ? (
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          ) : exportedBlob ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Export Again
              </Button>
              <Button onClick={handleDownload} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Download className="w-4 h-4" />
                Download Video ({(exportedBlob.size / 1024 / 1024).toFixed(1)} MB)
              </Button>
            </>
          ) : (
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Start Export
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 border border-dashed border-muted-foreground/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">How it works:</strong> The video will play through completely while being recorded. 
            The export uses your browser's native video encoding - no external services required.
            Output format is WebM (VP9) for best compatibility.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
