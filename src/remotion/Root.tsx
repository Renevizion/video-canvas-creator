import React from 'react';
import { Composition } from 'remotion';
import { DynamicVideo } from '../components/remotion/DynamicVideo';
import type { VideoPlan } from '../types/video';

// Default video plan for testing
const defaultPlan: VideoPlan = {
  id: 'default-composition',
  duration: 10,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  requiredAssets: [],
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: 'Intro scene with title',
      animations: [],
      transition: { type: 'fade', duration: 0.3 },
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Video Canvas Creator',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 80, height: 20 },
          animation: {
            type: 'fade',
            name: 'fadeIn',
            duration: 1,
            delay: 0,
            easing: 'ease-out',
            properties: { opacity: [0, 1] },
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
      animations: [],
      transition: { type: 'fade', duration: 0.3 },
      elements: [
        {
          id: 'subtitle',
          type: 'text',
          content: 'Create stunning videos with React',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 80, height: 15 },
          animation: {
            type: 'slide',
            name: 'slideUp',
            duration: 0.8,
            delay: 0,
            easing: 'ease-out',
            properties: { y: [100, 50] },
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
      sizes: { h1: 64, h2: 48, body: 18 },
    },
    borderRadius: 24,
    spacing: 24,
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicVideo"
        component={DynamicVideo as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={Math.round(defaultPlan.duration * 30)}
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
