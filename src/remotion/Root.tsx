import React from 'react';
import { Composition } from 'remotion';
import { DynamicVideo } from '../components/remotion/DynamicVideo';
import type { VideoPlan } from '../types/video';
import { 
  MusicVisualization, 
  CaptionsShowcase, 
  ScreencastShowcase, 
  YearInReview, 
  RenderProgressShowcase 
} from '../components/remotion/showcases';

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

// NEW: Example plan using showcase elements
const showcaseElementsPlan: VideoPlan = {
  id: 'showcase-elements-demo',
  duration: 15,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  requiredAssets: [],
  scenes: [
    {
      id: 'music-scene',
      startTime: 0,
      duration: 5,
      description: 'Music visualization',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'viz-title',
          type: 'text',
          content: 'Music Visualization',
          position: { x: 50, y: 15, z: 2 },
          style: { fontSize: 56, fontWeight: 800 },
          animation: { type: 'fade', name: 'fadeIn', duration: 1, delay: 0, easing: 'ease-out', properties: {} }
        },
        {
          id: 'music-bars',
          type: 'music-visualization',
          content: 'Audio bars',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 1400, height: 300 },
          animation: { type: 'fade', name: 'fadeIn', duration: 1.5, delay: 0.5, easing: 'ease-out', properties: {} }
        }
      ]
    },
    {
      id: 'caption-scene',
      startTime: 5,
      duration: 5,
      description: 'TikTok-style captions',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'caption-text',
          type: 'tiktok-captions',
          content: 'Welcome to our amazing showcase video',
          position: { x: 50, y: 50, z: 1 },
          style: { fontSize: 52 },
          animation: { type: 'fade', name: 'fadeIn', duration: 0.8, delay: 0, easing: 'ease-out', properties: {} }
        }
      ]
    },
    {
      id: 'stats-scene',
      startTime: 10,
      duration: 5,
      description: 'Year in review stats',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'stat-1',
          type: 'stats-counter',
          content: 'Videos Created',
          position: { x: 25, y: 40, z: 1 },
          size: { width: 400, height: 200 },
          style: { value: 542, label: 'Videos Created', delay: 10 },
          animation: { type: 'fade', name: 'fadeIn', duration: 0.8, delay: 0, easing: 'ease-out', properties: {} }
        },
        {
          id: 'stat-2',
          type: 'stats-counter',
          content: 'Happy Users',
          position: { x: 75, y: 40, z: 1 },
          size: { width: 400, height: 200 },
          style: { value: 1250, label: 'Happy Users', suffix: '+', delay: 25 },
          animation: { type: 'fade', name: 'fadeIn', duration: 0.8, delay: 0.2, easing: 'ease-out', properties: {} }
        }
      ]
    }
  ],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#8b5cf6', '#ec4899'],
    typography: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'SF Mono, monospace',
      sizes: { h1: 72, h2: 48, body: 24 },
    },
    borderRadius: 20,
    spacing: 32,
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
      
      {/* NEW: Demo composition showing how to use showcase elements in video plans */}
      <Composition
        id="ShowcaseElementsDemo"
        component={DynamicVideo as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={Math.round(showcaseElementsPlan.duration * 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          plan: showcaseElementsPlan,
        }}
      />
      
      {/* Remotion Showcase Compositions */}
      <Composition
        id="MusicVisualization"
        component={MusicVisualization}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      
      <Composition
        id="CaptionsShowcase"
        component={CaptionsShowcase}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      
      <Composition
        id="ScreencastShowcase"
        component={ScreencastShowcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      
      <Composition
        id="YearInReview"
        component={YearInReview}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      
      <Composition
        id="RenderProgressShowcase"
        component={RenderProgressShowcase}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
