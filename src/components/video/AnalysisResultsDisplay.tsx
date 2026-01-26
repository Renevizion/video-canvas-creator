import { motion } from 'framer-motion';
import { Film, Palette, Clock, Music, Eye, Layers } from 'lucide-react';

interface VideoAnalysisResult {
  pattern?: {
    colors?: string[];
    sceneChanges?: number[];
    duration?: number;
    resolution?: { width: number; height: number };
    fps?: number;
    audio?: {
      meanVolume?: number;
      maxVolume?: number;
      hasBeat?: boolean;
      codec?: string;
    };
  };
  metadata?: {
    processTime?: number;
    frameUrls?: string[];
  };
}

interface AnalysisResultsDisplayProps {
  result: VideoAnalysisResult;
}

export function AnalysisResultsDisplay({ result }: AnalysisResultsDisplayProps) {
  const { pattern, metadata } = result;

  if (!pattern) return null;

  const sceneCount = (pattern.sceneChanges?.length || 0) + 1;
  const avgSceneDuration = pattern.duration && pattern.sceneChanges 
    ? pattern.duration / sceneCount 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          FFmpeg Analysis Complete!
        </h3>
        <p className="text-sm text-muted-foreground">
          Processed in {metadata?.processTime?.toFixed(1)}s
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Duration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 text-center"
        >
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {pattern.duration?.toFixed(1)}s
          </div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </motion.div>

        {/* Scenes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 text-center"
        >
          <Layers className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{sceneCount}</div>
          <div className="text-xs text-muted-foreground">Scenes</div>
        </motion.div>

        {/* FPS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 text-center"
        >
          <Film className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{pattern.fps}</div>
          <div className="text-xs text-muted-foreground">FPS</div>
        </motion.div>

        {/* Resolution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 text-center"
        >
          <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {pattern.resolution?.width}x{pattern.resolution?.height}
          </div>
          <div className="text-xs text-muted-foreground">Resolution</div>
        </motion.div>
      </div>

      {/* Color Palette */}
      {pattern.colors && pattern.colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">
              Extracted Color Palette
            </h4>
          </div>
          <div className="flex gap-3 flex-wrap">
            {pattern.colors.map((color, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border shadow-lg"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {color}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scene Transitions */}
      {pattern.sceneChanges && pattern.sceneChanges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-accent" />
            <h4 className="font-semibold text-foreground">
              Scene Transitions
            </h4>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">
              Detected {sceneCount} scenes with average duration of{' '}
              {avgSceneDuration?.toFixed(1)}s
            </div>
            <div className="flex flex-wrap gap-2">
              {pattern.sceneChanges.map((time, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-mono"
                >
                  {time.toFixed(2)}s
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Audio Analysis */}
      {pattern.audio && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-foreground">Audio Analysis</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Mean Volume</div>
              <div className="text-lg font-bold text-foreground">
                {pattern.audio.meanVolume?.toFixed(1)} dB
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Max Volume</div>
              <div className="text-lg font-bold text-foreground">
                {pattern.audio.maxVolume?.toFixed(1)} dB
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Beat Detected</div>
              <div className="text-lg font-bold text-foreground">
                {pattern.audio.hasBeat ? (
                  <span className="text-glow-success">Yes ✓</span>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Codec</div>
              <div className="text-lg font-bold text-foreground">
                {pattern.audio.codec?.toUpperCase() || 'N/A'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Extracted Frames */}
      {metadata?.frameUrls && metadata.frameUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Film className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Extracted Frames</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {metadata.frameUrls.map((url, i) => (
              <motion.img
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                src={url}
                alt={`Frame ${i + 1}`}
                className="w-full aspect-video object-cover rounded-lg border border-border"
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
