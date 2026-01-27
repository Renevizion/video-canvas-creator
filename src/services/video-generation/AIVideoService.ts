/**
 * Natural Language Video Generation Service
 * AI-powered video creation from simple text prompts
 * 
 * Usage: "Create a product demo for my app" → Video generated
 */

import type { VideoTemplate } from './VideoGenerationService';
import type { VideoConfig, VideoScene } from '@/core/video-engine/types';
import { VIDEO_TEMPLATES } from '@/features/templates/video-templates';

export interface NaturalLanguageRequest {
  prompt: string;
  context?: {
    brandColors?: string[];
    brandName?: string;
    assets?: string[];
  };
}

export interface VideoGenerationResult {
  success: boolean;
  video?: VideoConfig & { scenes: VideoScene[] };
  template?: VideoTemplate;
  variables?: Record<string, any>;
  error?: string;
}

/**
 * AI Service for Natural Language Video Generation
 */
export class AIVideoService {
  /**
   * Generate video from natural language prompt
   * NOW USES SOPHISTICATED PRODUCTION SYSTEM BY DEFAULT
   * 
   * Examples:
   * - "Create a product demo for Bookedin showing scheduling and payments"
   * - "Make a YouTube video about our new features"
   * - "Generate a social media post saying 'Happy Holidays'"
   */
  async generateFromPrompt(request: NaturalLanguageRequest): Promise<VideoGenerationResult> {
    try {
      // Import sophisticated video generator (now standard)
      const { generateSophisticatedVideo } = await import('@/services/SophisticatedVideoGenerator');
      
      // Step 1: Analyze the prompt to understand intent
      const analysis = this.analyzePrompt(request.prompt);

      // Step 2: Generate sophisticated video (replaces old template system)
      const sophisticatedPlan = await generateSophisticatedVideo({
        prompt: request.prompt,
        duration: analysis.duration,
        style: this.mapVideoTypeToStyle(analysis.videoType),
        motionStyle: this.inferMotionStyle(request.prompt),
        fps: 30
      });
      
      // Step 3: Convert to VideoConfig format (for compatibility)
      const video = this.convertToVideoConfig(sophisticatedPlan, analysis);

      return {
        success: true,
        video,
        variables: {
          productionGrade: sophisticatedPlan.sophisticatedMetadata?.productionGrade || 'professional',
          hasCameraPaths: sophisticatedPlan.sophisticatedMetadata?.usesOrbitalCamera || false,
          hasCurvedPaths: sophisticatedPlan.sophisticatedMetadata?.usesCurvedPaths || false,
          hasParallax: sophisticatedPlan.sophisticatedMetadata?.usesParallax || false,
          hasColorGrading: sophisticatedPlan.sophisticatedMetadata?.usesColorGrading || false
        },
      };
    } catch (error) {
      console.error('[AIVideoService] Error generating sophisticated video:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
  
  /**
   * Map video type to sophisticated style
   */
  private mapVideoTypeToStyle(videoType: string): 'space-journey' | 'product-launch' | 'data-story' | 'cinematic' {
    const styleMap: Record<string, 'space-journey' | 'product-launch' | 'data-story' | 'cinematic'> = {
      'product-demo': 'product-launch',
      'youtube': 'cinematic',
      'presentation': 'data-story',
      'motion-graphics': 'cinematic',
      'social-media': 'space-journey',
      'marketing': 'product-launch',
      'tutorial': 'data-story'
    };
    
    return styleMap[videoType] || 'cinematic';
  }
  
  /**
   * Infer motion style from prompt
   */
  private inferMotionStyle(prompt: string): 'cinematic' | 'tech' | 'corporate' | 'creative' | 'social' | 'minimal' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('corporate') || lowerPrompt.includes('business')) return 'corporate';
    if (lowerPrompt.includes('tech') || lowerPrompt.includes('software') || lowerPrompt.includes('app')) return 'tech';
    if (lowerPrompt.includes('social') || lowerPrompt.includes('tiktok') || lowerPrompt.includes('instagram')) return 'social';
    if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) return 'minimal';
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic')) return 'creative';
    
    return 'cinematic'; // Default to highest quality
  }
  
  /**
   * Convert sophisticated plan to VideoConfig format
   */
  private convertToVideoConfig(sophisticatedPlan: any, analysis: PromptAnalysis): VideoConfig & { scenes: VideoScene[]; metadata?: any } {
    return {
      id: sophisticatedPlan.id,
      name: sophisticatedPlan.id,
      duration: sophisticatedPlan.duration,
      fps: sophisticatedPlan.fps,
      width: sophisticatedPlan.resolution.width,
      height: sophisticatedPlan.resolution.height,
      aspectRatio: '16:9' as const,
      scenes: sophisticatedPlan.scenes,
      // Add sophisticated metadata as custom data
      metadata: {
        sophisticated: true,
        productionGrade: sophisticatedPlan.sophisticatedMetadata?.productionGrade || 'professional',
        cameraSystem: !!sophisticatedPlan.cameraPath,
        curvedPaths: sophisticatedPlan.characterPaths?.size || 0,
        parallaxLayers: sophisticatedPlan.parallaxConfig ? Object.keys(sophisticatedPlan.parallaxConfig).length : 0,
        colorGrading: !!sophisticatedPlan.colorGrading
      }
    };
  }

  /**
   * Analyze prompt to understand user intent
   */
  private analyzePrompt(prompt: string): PromptAnalysis {
    const lowerPrompt = prompt.toLowerCase();

    // Detect video type
    let videoType: string = 'social-media'; // default

    if (lowerPrompt.includes('product') || lowerPrompt.includes('demo') || lowerPrompt.includes('showcase')) {
      videoType = 'product-demo';
    } else if (lowerPrompt.includes('youtube') || lowerPrompt.includes('tutorial') || lowerPrompt.includes('video')) {
      videoType = 'youtube';
    } else if (lowerPrompt.includes('presentation') || lowerPrompt.includes('slides')) {
      videoType = 'presentation';
    } else if (lowerPrompt.includes('social') || lowerPrompt.includes('instagram') || lowerPrompt.includes('tiktok') || lowerPrompt.includes('post')) {
      videoType = 'social-media';
    } else if (lowerPrompt.includes('motion') || lowerPrompt.includes('graphics') || lowerPrompt.includes('animation')) {
      videoType = 'motion-graphics';
    }

    // Detect duration preference
    let duration = 30; // default
    if (lowerPrompt.includes('short') || lowerPrompt.includes('quick')) {
      duration = 15;
    } else if (lowerPrompt.includes('long') || lowerPrompt.includes('detailed')) {
      duration = 60;
    }

    // Detect aspect ratio preference
    let aspectRatio: '16:9' | '9:16' | '1:1' = '16:9';
    if (lowerPrompt.includes('vertical') || lowerPrompt.includes('tiktok') || lowerPrompt.includes('stories') || lowerPrompt.includes('reels')) {
      aspectRatio = '9:16';
    } else if (lowerPrompt.includes('square') || lowerPrompt.includes('instagram feed')) {
      aspectRatio = '1:1';
    }

    return {
      videoType,
      duration,
      aspectRatio,
      keywords: this.extractKeywords(prompt),
    };
  }

  /**
   * Extract keywords from prompt
   */
  private extractKeywords(prompt: string): string[] {
    // Simple keyword extraction - in real implementation, use NLP
    const stopWords = new Set(['a', 'an', 'the', 'for', 'to', 'with', 'about', 'create', 'make', 'generate']);
    const words = prompt.toLowerCase().split(/\s+/);
    return words.filter((w) => !stopWords.has(w) && w.length > 2);
  }

  /**
   * Find best matching template based on analysis
   */
  private findBestTemplate(analysis: PromptAnalysis): VideoTemplate | null {
    // Find template by category
    let matches = VIDEO_TEMPLATES.filter((t) => t.category === analysis.videoType);

    if (matches.length === 0) {
      // Fallback to any template
      matches = VIDEO_TEMPLATES;
    }

    // Return first match (in real implementation, score and rank)
    return matches[0] || null;
  }

  /**
   * Extract variables from prompt
   */
  private extractVariables(
    prompt: string,
    template: VideoTemplate,
    context?: NaturalLanguageRequest['context']
  ): Record<string, any> {
    const variables: Record<string, any> = {};

    if (!template.variables) {
      return variables;
    }

    // Try to extract values for each variable
    template.variables.forEach((variable) => {
      const extracted = this.extractVariableValue(prompt, variable.key, context);
      if (extracted) {
        variables[variable.key] = extracted;
      } else if (variable.default) {
        variables[variable.key] = variable.default;
      } else {
        // Generate sensible default based on type
        variables[variable.key] = this.generateDefaultValue(variable.key, prompt, context);
      }
    });

    return variables;
  }

  /**
   * Extract specific variable value from prompt
   */
  private extractVariableValue(
    prompt: string,
    variableKey: string,
    context?: NaturalLanguageRequest['context']
  ): string | null {
    // Use context if available
    if (context?.brandName && (variableKey.includes('name') || variableKey.includes('product'))) {
      return context.brandName;
    }

    // Try to extract from prompt based on variable name
    const lowerPrompt = prompt.toLowerCase();
    const lowerKey = variableKey.toLowerCase();

    // Look for patterns like "for [NAME]" or "about [TOPIC]"
    if (lowerKey.includes('name') || lowerKey.includes('product')) {
      const forMatch = prompt.match(/for\s+([A-Za-z0-9\s]+?)(?:\s+showing|\s+with|\s+that|$)/i);
      if (forMatch) return forMatch[1].trim();
    }

    if (lowerKey.includes('title') || lowerKey.includes('headline')) {
      const aboutMatch = prompt.match(/about\s+([^.]+?)(?:\.|$)/i);
      if (aboutMatch) return aboutMatch[1].trim();
    }

    if (lowerKey.includes('tagline') || lowerKey.includes('message')) {
      const sayingMatch = prompt.match(/saying\s+['"](.+?)['"]|saying\s+([^.]+)/i);
      if (sayingMatch) return sayingMatch[1] || sayingMatch[2];
    }

    if (lowerKey.includes('feature')) {
      const showingMatch = prompt.match(/showing\s+(.+?)(?:\s+and|$)/i);
      if (showingMatch) {
        const features = showingMatch[1].split(/\s+and\s+/i);
        const featureNum = parseInt(variableKey.match(/\d+/)?.[0] || '1', 10);
        return features[featureNum - 1]?.trim() || null;
      }
    }

    return null;
  }

  /**
   * Generate default value for variable
   */
  private generateDefaultValue(
    variableKey: string,
    prompt: string,
    context?: NaturalLanguageRequest['context']
  ): string {
    const lowerKey = variableKey.toLowerCase();

    if (lowerKey.includes('name') || lowerKey.includes('product')) {
      return context?.brandName || 'Your Product';
    }

    if (lowerKey.includes('title') || lowerKey.includes('headline')) {
      return 'Amazing Solution';
    }

    if (lowerKey.includes('tagline') || lowerKey.includes('subtitle')) {
      return 'The future is here';
    }

    if (lowerKey.includes('cta') || lowerKey.includes('action')) {
      return 'Get Started Today';
    }

    if (lowerKey.includes('feature')) {
      const featureNum = parseInt(variableKey.match(/\d+/)?.[0] || '1', 10);
      const defaultFeatures = [
        'Easy to use',
        'Fast & reliable',
        'Available everywhere',
      ];
      return defaultFeatures[featureNum - 1] || 'Great feature';
    }

    if (lowerKey.includes('message') || lowerKey.includes('content')) {
      return prompt.substring(0, 100);
    }

    return `${variableKey} placeholder`;
  }

  /**
   * Build final video configuration
   */
  private buildVideoConfig(
    template: VideoTemplate,
    variables: Record<string, any>
  ): VideoConfig & { scenes: VideoScene[] } {
    // Clone template config
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

    // Deep clone scenes
    const scenes: VideoScene[] = JSON.parse(JSON.stringify(template.scenes));

    // Apply variables to scenes
    this.applyVariablesToScenes(scenes, variables);

    return { ...config, scenes };
  }

  /**
   * Apply variables to scenes
   */
  private applyVariablesToScenes(scenes: VideoScene[], variables: Record<string, any>): void {
    scenes.forEach((scene) => {
      scene.layers.forEach((layer) => {
        Object.keys(layer.properties).forEach((prop) => {
          const value = layer.properties[prop];
          if (typeof value === 'string') {
            // Replace {{variable}} placeholders
            let replaced = value;
            Object.keys(variables).forEach((key) => {
              const placeholder = `{{${key}}}`;
              replaced = replaced.replace(placeholder, variables[key]);
            });
            layer.properties[prop] = replaced;
          }
        });
      });
    });
  }
}

interface PromptAnalysis {
  videoType: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  keywords: string[];
}

// Export singleton
export const aiVideoService = new AIVideoService();
