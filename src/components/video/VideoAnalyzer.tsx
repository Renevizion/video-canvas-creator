import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Film, Loader2, CheckCircle, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoAnalyzerProps {
  onAnalysisComplete?: (patternId: string) => void;
}

export function VideoAnalyzer({ onAnalysisComplete }: VideoAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a video file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeVideo = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reference-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setProgress(30);
      setUploading(false);
      setAnalyzing(true);

      // Call edge function to analyze with AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-video', {
        body: { fileName, filePath: uploadData.path }
      });

      if (analysisError) throw analysisError;

      setProgress(100);
      setAnalysisResult(analysisData.patternId);
      toast.success('Video analyzed successfully!');
      onAnalysisComplete?.(analysisData.patternId);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze video');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/5 glow-primary'
            : file
            ? 'border-glow-success bg-glow-success/5'
            : 'border-border hover:border-primary/50 hover:bg-card/50'
        }`}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || analyzing}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-glow-success/20 flex items-center justify-center mb-4">
                <Film className="w-10 h-10 text-glow-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{file.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {!uploading && !analyzing && !analysisResult && (
                <Button variant="ghost" size="sm" onClick={clearFile} className="gap-2">
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ y: dragActive ? -5 : 0 }}
                className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
              >
                <Upload className={`w-10 h-10 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              </motion.div>
              <h3 className="font-semibold text-foreground mb-1">
                {dragActive ? 'Drop your video here' : 'Upload Reference Video'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Supports MP4, MOV, WebM up to 500MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress & Status */}
      <AnimatePresence>
        {(uploading || analyzing || analysisResult) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <Progress value={progress} className="h-2" />

            <div className="flex items-center gap-3">
              {uploading && (
                <>
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Uploading video...</span>
                </>
              )}
              {analyzing && (
                <>
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing with AI...</span>
                </>
              )}
              {analysisResult && (
                <>
                  <CheckCircle className="w-5 h-5 text-glow-success" />
                  <span className="text-sm text-foreground">Analysis complete!</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={analyzeVideo}
          disabled={!file || uploading || analyzing || !!analysisResult}
          className="flex-1 gap-2"
        >
          {uploading || analyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Analyze Video'}
        </Button>
      </div>
    </div>
  );
}
