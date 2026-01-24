import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useExportState } from '@/hooks/useExportState';

export function ExportIndicator() {
  const { isExporting, progress, message, status, blob, resetExport } = useExportState();

  // Prevent accidental refresh/navigation during export.
  useEffect(() => {
    if (!isExporting) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for Chrome.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isExporting]);

  const handleDownload = () => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resetExport();
    }
  };

  const shouldShow = isExporting || status === 'complete' || status === 'error';

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-[100] w-80"
        >
          <div className="glass-card p-4 border border-border shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                {isExporting ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : status === 'complete' ? (
                  <CheckCircle className="w-5 h-5 text-glow-success" />
                ) : status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <Download className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    Video Export
                  </h4>
                  {!isExporting && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={resetExport}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {message}
                </p>
                
                {isExporting && (
                  <div className="mt-2">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {Math.round(progress)}%
                    </p>
                  </div>
                )}
                
                {status === 'complete' && blob && (
                  <Button
                    size="sm"
                    className="mt-2 w-full gap-2 bg-gradient-to-r from-primary to-accent"
                    onClick={handleDownload}
                  >
                    <Download className="w-3 h-3" />
                    Download ({(blob.size / 1024 / 1024).toFixed(1)} MB)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
