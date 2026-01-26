import React from 'react';
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
} from 'remotion';
import { ProgressBar } from '../elements/ProgressBar';

interface RenderProgressShowcaseProps {
  fileName?: string;
}

export const RenderProgressShowcase: React.FC<RenderProgressShowcaseProps> = ({ 
  fileName = 'my-video.mp4' 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          fontSize: 64,
          fontWeight: 800,
          color: '#0f172a',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Rendering Your Video
      </div>
      
      {/* Progress bar component */}
      <ProgressBar
        element={{
          id: 'render-progress',
          type: 'progress',
          content: fileName,
          position: { x: 50, y: 50, z: 1 },
          size: { width: 400, height: 150 },
        }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        colors={['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7']}
        sceneFrame={frame}
      />
      
      {/* Info text */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          fontSize: 20,
          color: '#64748b',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: 600,
        }}
      >
        High-quality video rendering with real-time progress tracking
      </div>
    </AbsoluteFill>
  );
};
