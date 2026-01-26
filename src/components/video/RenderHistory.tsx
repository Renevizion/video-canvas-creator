import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, ExternalLink, Trash2, X, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRenderHistory, removeRenderFromHistory, type RenderHistoryItem } from '@/lib/renderHistory';

interface RenderHistoryProps {
  projectId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RenderHistory: React.FC<RenderHistoryProps> = ({ projectId, isOpen, onClose }) => {
  const [history, setHistory] = React.useState<RenderHistoryItem[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, projectId]);

  const loadHistory = () => {
    const allHistory = getRenderHistory();
    if (projectId) {
      setHistory(allHistory.filter(item => item.projectId === projectId));
    } else {
      setHistory(allHistory);
    }
  };

  const handleRemove = (id: string) => {
    removeRenderFromHistory(id);
    loadHistory();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Film className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Render History</h2>
                  <p className="text-sm text-muted-foreground">
                    {history.length} rendered video{history.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No rendered videos yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Export a video to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {item.title || `Video ${item.id.slice(0, 8)}`}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                              {formatDuration(item.duration)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.timestamp)}
                            </span>
                            <span className="font-mono">
                              {item.resolution.width}x{item.resolution.height}
                            </span>
                            <span className="font-mono">{item.fps}fps</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(item.videoUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a href={item.videoUrl} download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {item.videoUrl && (
                        <div className="mt-3 p-2 rounded-lg bg-background/50 border border-border/30">
                          <a 
                            href={item.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline break-all font-mono"
                          >
                            {item.videoUrl}
                          </a>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RenderHistory;
