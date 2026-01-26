/**
 * Usable Video Components Registry
 * All showcase components that can actually be used to make videos
 */

import { Composition } from 'remotion';
import type { VideoPlan } from '@/types/video';

// Import all the working showcase components
import { MusicVisualization } from './MusicVisualization';
import { CaptionsShowcase } from './CaptionsShowcase';
import { ScreencastShowcase } from './ScreencastShowcase';
import { YearInReview } from './YearInReview';
import { RenderProgressShowcase } from './RenderProgressShowcase';
import { ModernMusicVisualization, ModernCaptions, ModernYearInReview } from './ModernShowcases';
import { CompleteExampleVideo, CompleteExampleLandscape } from './CompleteExampleVideo';

export interface UsableVideoComponent {
  id: string;
  name: string;
  description: string;
  category: 'music' | 'captions' | 'stats' | 'tutorial' | 'complete';
  component: React.ComponentType<any>;
  defaultProps: any;
  config: {
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
  };
  keywords: string[];
}

/**
 * Registry of all usable video components
 */
export const USABLE_VIDEO_COMPONENTS: UsableVideoComponent[] = [
  {
    id: 'music-visualization',
    name: 'Music Visualization',
    description: 'Audio reactive bars and waveforms',
    category: 'music',
    component: MusicVisualization,
    defaultProps: {},
    config: {
      durationInFrames: 300,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['music', 'audio', 'visualization', 'bars', 'waveform', 'sound'],
  },
  {
    id: 'modern-music-visualization',
    name: 'Modern Music Visualization',
    description: 'Sleek modern audio visualization',
    category: 'music',
    component: ModernMusicVisualization,
    defaultProps: {},
    config: {
      durationInFrames: 300,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['music', 'audio', 'modern', 'visualization', 'sleek'],
  },
  {
    id: 'captions',
    name: 'TikTok-Style Captions',
    description: 'Animated word-by-word captions',
    category: 'captions',
    component: CaptionsShowcase,
    defaultProps: {},
    config: {
      durationInFrames: 240,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['captions', 'subtitles', 'tiktok', 'text', 'animated', 'words'],
  },
  {
    id: 'modern-captions',
    name: 'Modern Captions',
    description: 'Clean modern caption style',
    category: 'captions',
    component: ModernCaptions,
    defaultProps: {},
    config: {
      durationInFrames: 240,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['captions', 'modern', 'clean', 'subtitles'],
  },
  {
    id: 'year-in-review',
    name: 'Year in Review Stats',
    description: 'Animated statistics and counters',
    category: 'stats',
    component: YearInReview,
    defaultProps: {},
    config: {
      durationInFrames: 240,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['stats', 'statistics', 'numbers', 'counters', 'year', 'review', 'data'],
  },
  {
    id: 'modern-year-in-review',
    name: 'Modern Year in Review',
    description: 'Modern stats display',
    category: 'stats',
    component: ModernYearInReview,
    defaultProps: {},
    config: {
      durationInFrames: 240,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['stats', 'modern', 'numbers', 'data'],
  },
  {
    id: 'screencast',
    name: 'Screencast Tutorial',
    description: 'Screen recording with annotations',
    category: 'tutorial',
    component: ScreencastShowcase,
    defaultProps: {},
    config: {
      durationInFrames: 360,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['screencast', 'tutorial', 'screen', 'recording', 'demo'],
  },
  {
    id: 'render-progress',
    name: 'Render Progress',
    description: 'Rendering progress indicator',
    category: 'tutorial',
    component: RenderProgressShowcase,
    defaultProps: {},
    config: {
      durationInFrames: 270,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['progress', 'loading', 'render', 'status'],
  },
  {
    id: 'complete-vertical',
    name: 'Complete Vertical Video',
    description: 'Full-featured vertical video (TikTok/Reels)',
    category: 'complete',
    component: CompleteExampleVideo,
    defaultProps: {},
    config: {
      durationInFrames: 270,
      fps: 30,
      width: 1080,
      height: 1920,
    },
    keywords: ['vertical', 'tiktok', 'reels', 'shorts', 'complete', 'full'],
  },
  {
    id: 'complete-landscape',
    name: 'Complete Landscape Video',
    description: 'Full-featured landscape video (YouTube)',
    category: 'complete',
    component: CompleteExampleLandscape,
    defaultProps: {},
    config: {
      durationInFrames: 260,
      fps: 30,
      width: 1920,
      height: 1080,
    },
    keywords: ['landscape', 'youtube', 'complete', 'full', 'horizontal'],
  },
];

/**
 * Find components matching keywords from prompt
 */
export function findMatchingComponents(prompt: string): UsableVideoComponent[] {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);

  return USABLE_VIDEO_COMPONENTS.filter((component) => {
    return component.keywords.some((keyword) =>
      words.some((word) => word.includes(keyword) || keyword.includes(word))
    );
  }).sort((a, b) => {
    // Sort by number of matching keywords
    const aMatches = a.keywords.filter((k) => lowerPrompt.includes(k)).length;
    const bMatches = b.keywords.filter((k) => lowerPrompt.includes(k)).length;
    return bMatches - aMatches;
  });
}

/**
 * Convert component to video plan
 */
export function componentToVideoPlan(component: UsableVideoComponent): VideoPlan {
  return {
    id: component.id,
    duration: component.config.durationInFrames / component.config.fps,
    fps: component.config.fps,
    resolution: {
      width: component.config.width,
      height: component.config.height,
    },
    requiredAssets: [],
    scenes: [
      {
        id: 'main',
        startTime: 0,
        duration: component.config.durationInFrames / component.config.fps,
        description: component.description,
        animations: [],
        transition: { type: 'fade', duration: 0.3 },
        elements: [
          {
            id: 'component',
            type: 'component',
            content: component.name,
            position: { x: 0, y: 0, z: 1 },
            size: { width: 100, height: 100 },
            style: {
              componentType: component.id,
              component: component.component,
            },
            animation: {
              type: 'fade',
              name: 'fadeIn',
              duration: 0.5,
              delay: 0,
              easing: 'ease-out',
              properties: {},
            },
          },
        ],
      },
    ],
    style: {
      colorPalette: ['#ffffff', '#3b82f6', '#1e293b', '#0f172a'],
      typography: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'monospace',
        sizes: { h1: 64, h2: 48, body: 24 },
      },
      borderRadius: 16,
      spacing: 24,
    },
  };
}
