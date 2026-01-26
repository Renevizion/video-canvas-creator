import React from 'react';
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { interpolateColors } from 'remotion';

interface YearInReviewProps {
  year?: number;
  stats?: Array<{ label: string; value: number; suffix?: string }>;
}

export const YearInReview: React.FC<YearInReviewProps> = ({ 
  year = 2024,
  stats = [
    { label: 'Videos Created', value: 1250, suffix: '' },
    { label: 'Hours Rendered', value: 480, suffix: 'h' },
    { label: 'Projects Completed', value: 89, suffix: '' },
    { label: 'Team Members', value: 24, suffix: '' },
  ]
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Title animation
  const titleProgress = spring({
    fps,
    frame,
    config: { damping: 30, stiffness: 100 },
  });
  
  const titleScale = interpolate(titleProgress, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      {/* Animated background particles */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (i * 137.5) % 100;
        const y = (i * 73.3) % 100;
        const delay = i * 2;
        
        const particleProgress = spring({
          fps,
          frame: frame - delay,
          config: { damping: 20, stiffness: 50 },
        });
        
        const particleY = interpolate(particleProgress, [0, 1], [0, -50]);
        const particleOpacity = interpolate(particleProgress, [0, 1], [0, 0.3]);
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'white',
              transform: `translateY(${particleY}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}
      
      {/* Year title */}
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 40,
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          fontFamily: 'Inter, system-ui, sans-serif',
          textShadow: '0 10px 40px rgba(251, 191, 36, 0.3)',
        }}
      >
        {year}
      </div>
      
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: 'white',
          marginBottom: 80,
          opacity: titleOpacity,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Year in Review
      </div>
      
      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 40,
          maxWidth: 900,
        }}
      >
        {stats.map((stat, i) => {
          const statDelay = 30 + i * 15;
          const statProgress = spring({
            fps,
            frame: Math.max(0, frame - statDelay),
            config: { damping: 25, stiffness: 80 },
          });
          
          const statScale = interpolate(statProgress, [0, 1], [0.8, 1]);
          const statOpacity = interpolate(statProgress, [0, 1], [0, 1]);
          
          // Animate counting up
          const countProgress = interpolate(
            statProgress,
            [0, 1],
            [0, stat.value],
            { easing: Easing.out(Easing.cubic) }
          );
          
          const displayValue = Math.floor(countProgress);
          
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: 40,
                borderRadius: 20,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: `scale(${statScale})`,
                opacity: statOpacity,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 12,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                {displayValue}{stat.suffix}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontSize: 24,
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Powered by Remotion
      </div>
    </AbsoluteFill>
  );
};
