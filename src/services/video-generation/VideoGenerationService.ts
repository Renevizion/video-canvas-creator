/**
 * Video Generation Service
 * Professional service layer for creating videos from templates
 */

import type { VideoConfig, VideoScene } from '@/core/video-engine/types';

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  category: VideoCategory;
  thumbnail?: string;
  config: Partial<VideoConfig>;
  scenes: VideoScene[];
  variables?: TemplateVariable[];
}

export type VideoCategory =
  | 'product-demo'
  | 'youtube'
  | 'presentation'
  | 'motion-graphics'
  | 'social-media'
  | 'marketing'
  | 'tutorial';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'color' | 'image' | 'number';
  default?: any;
  required?: boolean;
}

export interface VideoGenerationRequest {
  templateId: string;
  variables?: Record<string, any>;
  customizations?: VideoCustomization;
}

export interface VideoCustomization {
  branding?: BrandingConfig;
  audio?: AudioConfig;
  style?: StyleConfig;
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  font?: string;
}

export interface AudioConfig {
  backgroundMusic?: string;
  voiceOver?: string | VoiceOverConfig;
  soundEffects?: SoundEffect[];
}

export interface VoiceOverConfig {
  text: string;
  voice: string;
  speed?: number;
  pitch?: number;
}

export interface SoundEffect {
  type: string;
  trigger: 'start' | 'end' | 'frame';
  frame?: number;
  volume?: number;
}

export interface StyleConfig {
  colorScheme?: 'light' | 'dark' | 'auto';
  fontFamily?: string;
  borderRadius?: number;
  spacing?: number;
}

/**
 * Video Generation Service
 */
export class VideoGenerationService {
  private templates: Map<string, VideoTemplate> = new Map();

  /**
   * Register a video template
   */
  registerTemplate(template: VideoTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): VideoTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates by category
   */
  getTemplatesByCategory(category: VideoCategory): VideoTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.category === category
    );
  }

  /**
   * Generate video from template
   */
  async generateVideo(
    request: VideoGenerationRequest
  ): Promise<VideoConfig & { scenes: VideoScene[] }> {
    const template = this.getTemplate(request.templateId);
    if (!template) {
      throw new Error(`Template not found: ${request.templateId}`);
    }

    // Apply variables and customizations
    const config = this.applyCustomizations(template, request);

    return config;
  }

  /**
   * Apply customizations to template
   */
  private applyCustomizations(
    template: VideoTemplate,
    request: VideoGenerationRequest
  ): VideoConfig & { scenes: VideoScene[] } {
    const config: VideoConfig = {
      id: `video-${Date.now()}`,
      name: template.name,
      description: template.description,
      duration: template.config.duration || 30,
      fps: template.config.fps || 30,
      width: template.config.width || 1920,
      height: template.config.height || 1080,
      aspectRatio: template.config.aspectRatio || '16:9',
    };

    // Deep clone scenes to avoid mutation
    const scenes = JSON.parse(JSON.stringify(template.scenes));

    // Apply variables
    if (request.variables) {
      this.applyVariables(scenes, request.variables);
    }

    // Apply branding
    if (request.customizations?.branding) {
      this.applyBranding(scenes, request.customizations.branding);
    }

    return { ...config, scenes };
  }

  /**
   * Apply variables to scenes
   */
  private applyVariables(
    scenes: VideoScene[],
    variables: Record<string, any>
  ): void {
    scenes.forEach((scene) => {
      scene.layers.forEach((layer) => {
        Object.keys(variables).forEach((key) => {
          const value = variables[key];
          const placeholder = `{{${key}}}`;

          // Replace in properties
          Object.keys(layer.properties).forEach((prop) => {
            if (
              typeof layer.properties[prop] === 'string' &&
              layer.properties[prop].includes(placeholder)
            ) {
              layer.properties[prop] = layer.properties[prop].replace(
                placeholder,
                value
              );
            }
          });
        });
      });
    });
  }

  /**
   * Apply branding to scenes
   */
  private applyBranding(scenes: VideoScene[], branding: BrandingConfig): void {
    scenes.forEach((scene) => {
      scene.layers.forEach((layer) => {
        if (layer.type === 'text') {
          layer.properties.color = layer.properties.color || branding.primaryColor;
          layer.properties.fontFamily = layer.properties.fontFamily || branding.font;
        }
      });

      // Update background colors if present
      if (scene.background?.type === 'color') {
        // Keep existing background or could apply branding
      }
    });
  }
}

// Export singleton instance
export const videoGenerationService = new VideoGenerationService();
