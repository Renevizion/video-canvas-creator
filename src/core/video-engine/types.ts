/**
 * Core Video Engine Types
 * Clean, professional type definitions for video generation
 */

export interface VideoConfig {
  id: string;
  name: string;
  description?: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  aspectRatio: AspectRatio;
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | '21:9';

export interface VideoScene {
  id: string;
  name: string;
  startFrame: number;
  durationInFrames: number;
  layers: VideoLayer[];
  transition?: Transition;
  background?: Background;
}

export interface VideoLayer {
  id: string;
  type: LayerType;
  startFrame: number;
  durationInFrames: number;
  properties: LayerProperties;
  animations?: Animation[];
}

export type LayerType = 
  | 'text'
  | 'image'
  | 'video'
  | 'shape'
  | 'audio'
  | 'lottie'
  | 'component';

export interface LayerProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  rotation?: number;
  scale?: number;
  [key: string]: any;
}

export interface Animation {
  property: string;
  from: any;
  to: any;
  startFrame: number;
  durationInFrames: number;
  easing?: EasingFunction;
}

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'spring'
  | 'bounce';

export interface Transition {
  type: TransitionType;
  durationInFrames: number;
}

export type TransitionType = 
  | 'fade'
  | 'slide'
  | 'wipe'
  | 'zoom'
  | 'custom';

export interface Background {
  type: 'color' | 'gradient' | 'image' | 'video';
  value: string | GradientConfig;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;
}

export interface RenderOptions {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  codec: 'h264' | 'h265' | 'vp9' | 'prores';
  audioBitrate?: string;
  videoBitrate?: string;
}
