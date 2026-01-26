import React from 'react';
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate,
  spring,
} from 'remotion';

interface CaptionsShowcaseProps {
  caption?: string;
}

export const CaptionsShowcase: React.FC<CaptionsShowcaseProps> = ({ 
  caption = "Welcome to Remotion captions showcase with beautiful animations" 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const words = caption.split(' ');
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          marginBottom: 100,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Dynamic Captions
      </div>
      
      {/* Animated caption words */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 20,
          maxWidth: 1200,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = i * 5;
          const wordProgress = spring({
            fps,
            frame: Math.max(0, frame - wordDelay),
            config: { damping: 20, stiffness: 100 },
          });
          
          const scale = interpolate(wordProgress, [0, 1], [0.5, 1]);
          const opacity = interpolate(wordProgress, [0, 1], [0, 1]);
          
          // Highlight effect - words become yellow when "spoken"
          const highlightProgress = interpolate(
            frame,
            [wordDelay, wordDelay + 15],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          
          const isHighlighted = highlightProgress > 0.5;
          
          return (
            <span
              key={i}
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: isHighlighted ? '#fbbf24' : 'white',
                WebkitTextStroke: isHighlighted ? '0px' : '2px rgba(0,0,0,0.3)',
                opacity,
                transform: `scale(${scale})`,
                display: 'inline-block',
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: isHighlighted 
                  ? '0 0 30px rgba(251, 191, 36, 0.8), 0 4px 20px rgba(0,0,0,0.5)'
                  : '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      
      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontSize: 24,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        TikTok-style captions with word highlighting
      </div>
    </AbsoluteFill>
  );
};
