import React from 'react';
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate,
  spring,
  Audio,
} from 'remotion';
import { interpolateColors } from 'remotion';

interface MusicVisualizationProps {
  audioSrc?: string;
}

export const MusicVisualization: React.FC<MusicVisualizationProps> = ({ audioSrc }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Simulate audio visualization (in a real implementation, use @remotion/media-utils getAudioData)
  const bars = 64;
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Audio element (if source provided) */}
      {audioSrc && <Audio src={audioSrc} />}
      
      {/* Centered title */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Music Visualization
      </div>
      
      {/* Visualizer bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 8,
          height: 300,
        }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          // Create animated bars with different frequencies
          const barProgress = spring({
            fps,
            frame: frame - i * 0.5,
            config: { damping: 20, stiffness: 100 },
          });
          
          // Simulate audio reactivity with sine waves at different frequencies
          const frequency = 0.05 + (i / bars) * 0.1;
          const amplitude = Math.sin(frame * frequency) * 0.5 + 0.5;
          const barHeight = interpolate(
            amplitude,
            [0, 1],
            [20, 250]
          ) * barProgress;
          
          // Color gradient based on position and height
          const hue = interpolate(i, [0, bars], [240, 320]);
          const lightness = interpolate(barHeight, [20, 250], [40, 70]);
          
          return (
            <div
              key={i}
              style={{
                width: width / bars - 8,
                height: barHeight,
                background: `hsl(${hue}, 80%, ${lightness}%)`,
                borderRadius: 4,
                boxShadow: `0 0 20px hsla(${hue}, 80%, ${lightness}%, 0.5)`,
              }}
            />
          );
        })}
      </div>
      
      {/* Pulsing circle in center */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {[0, 1, 2].map((i) => {
          const delay = i * 20;
          const pulseProgress = spring({
            fps,
            frame: frame - delay,
            config: { damping: 20 },
          });
          
          const scale = interpolate(pulseProgress, [0, 1], [0, 2]);
          const opacity = interpolate(pulseProgress, [0, 1], [0.8, 0]);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '3px solid white',
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
