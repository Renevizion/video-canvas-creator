import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, X, Film, CheckCircle, AlertCircle, Cloud, Monitor, History, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SophisticatedVideo } from '@/components/remotion/SophisticatedVideo';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';
import { addRenderToHistory, getRenderHistory, type RenderHistoryItem } from '@/lib/renderHistory';

interface VideoExporterProps {
  plan: VideoPlan;
  projectId?: string;
  onClose?: () => void;
}

type ExportStatus = 'idle' | 'rendering' | 'complete' | 'error';

export const VideoExporter = React.forwardRef<HTMLDivElement, VideoExporterProps>(
  function VideoExporter({ plan, projectId, onClose }, ref) {
    const [status, setStatus] = useState<ExportStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [renderHistory, setRenderHistory] = useState<RenderHistoryItem[]>([]);

    const duration = plan.duration || 10;
    const fps = plan.fps || 30;
    const totalFrames = duration * fps;

    // Load render history on mount
    React.useEffect(() => {
      const history = getRenderHistory();
      setRenderHistory(history);
    }, []);

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
            
            // Save to render history
            if (projectId) {
              addRenderToHistory({
                projectId,
                videoUrl: project.final_video_url,
                duration,
                fps,
                resolution: plan.resolution || { width: 1920, height: 1080 },
                title: plan.id || 'Untitled Video',
              });
              // Refresh history display
              setRenderHistory(getRenderHistory());
            }
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
          <div className="mb-6 rounded-xl overflow-hidden bg-black" style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}>
            <Player
              component={SophisticatedVideo as any}
              inputProps={{ videoPlan: plan as any }}
              durationInFrames={totalFrames}
              compositionWidth={plan.resolution?.width || 1920}
              compositionHeight={plan.resolution?.height || 1080}
              fps={fps}
              style={{ width: '100%', height: '100%', display: 'block' }}
              controls
              renderLoading={() => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#000' }}>
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            />
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
          <div className="flex items-center gap-3 justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Hide' : 'Show'} History ({renderHistory.length})
            </Button>

            <div className="flex items-center gap-3">
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
          </div>

          {/* Render History */}
          <AnimatePresence>
            {showHistory && renderHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 border-t border-muted-foreground/20 pt-6"
              >
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Renders
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {renderHistory.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 glass-card hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.title || 'Untitled Video'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()} • {item.duration}s @ {item.fps}fps • {item.resolution.width}x{item.resolution.height}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(item.videoUrl, '_blank')}
                        className="gap-2 ml-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
