import React from 'react';
import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate,
  spring,
} from 'remotion';
import { CodeEditor } from '../elements/CodeEditor';
import { Laptop3D } from '../elements/Laptop3D';

interface ScreencastShowcaseProps {
  code?: string;
}

export const ScreencastShowcase: React.FC<ScreencastShowcaseProps> = ({ code }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const exampleCode = code || `import { AbsoluteFill, Video } from 'remotion';

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      <Video
        src="video.mp4"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </AbsoluteFill>
  );
};`;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
          position: 'absolute',
          top: 60,
          fontSize: 56,
          fontWeight: 800,
          color: 'white',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Screencast Recording
      </div>
      
      {/* Code Editor with typing animation */}
      <CodeEditor
        element={{
          id: 'screencast-editor',
          type: 'code',
          content: exampleCode,
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 500 },
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
      
      {/* Recording indicator */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 20px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: 24,
          border: '2px solid rgba(239, 68, 68, 0.5)',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
            animation: 'pulse 2s infinite',
          }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          REC
        </span>
      </div>
    </AbsoluteFill>
  );
};
