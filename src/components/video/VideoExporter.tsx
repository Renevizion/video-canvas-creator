import React, { useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, X, Film, CheckCircle, AlertCircle, Cloud, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DynamicVideo } from '@/components/remotion/DynamicVideo';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

interface VideoExporterProps {
  plan: VideoPlan;
  projectId?: string;
  onClose?: () => void;
}

type ExportStatus = 'idle' | 'rendering' | 'complete' | 'error';

export const VideoExporter = React.forwardRef<HTMLDivElement, VideoExporterProps>(
  function VideoExporter({ plan, projectId, onClose }, ref) {
    const playerRef = React.useRef<PlayerRef>(null);
    const [status, setStatus] = useState<ExportStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const duration = plan.duration || 10;
    const fps = plan.fps || 30;
    const totalFrames = duration * fps;

    const handleCloudRender = async () => {
      if (!projectId) {
        toast.error('Project ID required for cloud render');
        return;
      }

      setStatus('rendering');
      setProgress(10);
      setMessage('Sending to render server...');
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('render-video', {
          body: { planId: projectId },
        });

        if (fnError) throw fnError;

        setProgress(30);
        setMessage('Render job started...');

        // Poll for completion
        const pollInterval = setInterval(async () => {
          const { data: project } = await supabase
            .from('video_plans')
            .select('status, final_video_url, error')
            .eq('id', projectId)
            .single();

          if (project?.status === 'completed' && project.final_video_url) {
            clearInterval(pollInterval);
            setProgress(100);
            setMessage('Render complete!');
            setVideoUrl(project.final_video_url);
            setStatus('complete');
            toast.success('Video rendered successfully!');
          } else if (project?.status === 'failed') {
            clearInterval(pollInterval);
            setError(project.error || 'Render failed');
            setStatus('error');
            toast.error('Render failed');
          } else {
            // Increment progress while waiting
            setProgress(prev => Math.min(prev + 5, 90));
            setMessage('Rendering video...');
          }
        }, 3000);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          if (status === 'rendering') {
            setError('Render timed out. Check the project status later.');
            setStatus('error');
          }
        }, 300000);

      } catch (err) {
        console.error('Render error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
        toast.error('Failed to start render');
      }
    };

    const handleDownload = () => {
      if (videoUrl) {
        window.open(videoUrl, '_blank');
      }
    };

    const handleReset = () => {
      setStatus('idle');
      setProgress(0);
      setMessage('');
      setVideoUrl(null);
      setError(null);
    };

    const StatusIcon = {
      idle: Film,
      rendering: Loader2,
      complete: CheckCircle,
      error: AlertCircle,
    }[status];

    return (
      <motion.div
        ref={ref}
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
                  {duration}s @ {fps}fps • MP4 (H.264)
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={status === 'rendering'}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Player Preview */}
          <div className="mb-6 rounded-xl overflow-hidden bg-black">
            <div className="aspect-video">
              <Player
                ref={playerRef}
                component={DynamicVideo}
                inputProps={{ plan }}
                durationInFrames={totalFrames}
                compositionWidth={plan.resolution?.width || 1920}
                compositionHeight={plan.resolution?.height || 1080}
                fps={fps}
                style={{ width: '100%', height: '100%' }}
                controls
              />
            </div>
          </div>

          {/* Progress Section */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 glass-card ${
                  status === 'complete' ? 'bg-green-500/10 border-green-500/30' :
                  status === 'error' ? 'bg-destructive/10 border-destructive/30' :
                  'bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <StatusIcon className={`w-5 h-5 ${
                    status === 'rendering' ? 'animate-spin text-primary' :
                    status === 'complete' ? 'text-green-500' :
                    status === 'error' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`} />
                  <span className="font-medium text-foreground">
                    {error || message || 'Ready to export'}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            {status === 'idle' && (
              <Button
                onClick={handleCloudRender}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Cloud className="w-4 h-4" />
                Render Video (Cloud)
              </Button>
            )}

            {status === 'rendering' && (
              <Button variant="outline" disabled className="gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering...
              </Button>
            )}

            {status === 'complete' && videoUrl && (
              <>
                <Button variant="outline" onClick={handleReset}>
                  Render Again
                </Button>
                <Button onClick={handleDownload} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Download className="w-4 h-4" />
                  Download MP4
                </Button>
              </>
            )}

            {status === 'error' && (
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 border border-dashed border-muted-foreground/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Cloud Rendering:</strong> Your video is rendered on our dedicated server using Remotion + FFmpeg for professional-quality MP4 output. 
              Typical render time is 1-3 minutes depending on video length.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

VideoExporter.displayName = 'VideoExporter';

export default VideoExporter;
