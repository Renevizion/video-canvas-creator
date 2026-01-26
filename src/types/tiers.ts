/**
 * 3-Tier Video Creation System
 * Based on the video tutorial structure showing progression from basic to advanced
 */

export type TierLevel = 'level1' | 'level2' | 'level3';

export interface TierCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface VideoTier {
  level: TierLevel;
  name: string;
  title: string;
  description: string;
  capabilities: TierCapability[];
  videoTypes: VideoTemplateType[];
  requiredIntegrations: Integration[];
}

export type VideoTemplateType = 
  | 'product-demo'
  | 'youtube-video'
  | 'presentation'
  | 'motion-graphics'
  | 'tutorial'
  | 'social-media'
  | 'marketing';

export interface VideoTemplate {
  id: string;
  type: VideoTemplateType;
  name: string;
  description: string;
  icon: string;
  tierLevel: TierLevel;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  features: string[];
}

export type IntegrationType = 'claude' | 'remotion' | 'elevenlabs' | 'neno-banana';

export interface Integration {
  type: IntegrationType;
  name: string;
  description: string;
  required: boolean;
  configured: boolean;
}

export interface WorkflowStep {
  id: string;
  integration: IntegrationType;
  name: string;
  description: string;
  order: number;
}

export interface VideoWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  tierLevel: TierLevel;
}
