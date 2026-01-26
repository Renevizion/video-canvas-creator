import React from 'react';
import { Composition } from 'remotion';
import { DynamicVideo } from '../components/remotion/DynamicVideo';
import type { VideoPlan } from '../types/video';

// Default video plan for testing
const defaultPlan: VideoPlan = {
  id: 'default-composition',
  title: 'Video Canvas Creator',
  description: 'High-quality video composition',
  duration: 10,
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: 'Intro scene with title',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Video Canvas Creator',
          position: { x: 50, y: 50, z: 1 },
          animation: {
            type: 'fadeIn',
            duration: 1,
            delay: 0,
          },
          style: {
            fontSize: 64,
            fontWeight: 800,
          },
        },
      ],
    },
    {
      id: 'scene-2',
      startTime: 5,
      duration: 5,
      description: 'Feature showcase',
      elements: [
        {
          id: 'subtitle',
          type: 'text',
          content: 'Create stunning videos with React',
          position: { x: 50, y: 50, z: 1 },
          animation: {
            type: 'slideUp',
            duration: 0.8,
            delay: 0,
          },
          style: {
            fontSize: 36,
            fontWeight: 500,
          },
        },
      ],
    },
  ],
  style: {
    colorPalette: ['#ffffff', '#06b6d4', '#1e293b', '#0f172a'],
    typography: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'monospace',
    },
    borderRadius: 24,
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicVideo"
        component={DynamicVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          plan: defaultPlan,
        }}
      />
    </>
  );
};
