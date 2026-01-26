/**
 * Advanced Scene Planning Service
 * 
 * Provides sophisticated scene planning capabilities including:
 * - Multi-pass scene optimization
 * - Intelligent pacing based on content type
 * - Camera/perspective system for POV changes
 * - Transition choreography
 * - Scene composition analysis
 */

import type { VideoPlan, PlannedScene, PlannedElement, AnimationPattern, TransitionPattern } from '@/types/video';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SceneCompositionAnalysis {
  elementCount: number;
  layerDistribution: Record<number, number>;
  visualWeight: number;
  balance: 'left' | 'right' | 'center' | 'balanced';
  density: 'sparse' | 'balanced' | 'dense' | 'overcrowded';
  recommendations: string[];
}

export interface CameraPerspective {
  type: 'default' | 'close-up' | 'wide' | 'birds-eye' | 'first-person' | 'inside' | 'dramatic';
  focalPoint: { x: number; y: number };
  zoom: number;
  rotation: number;
  description: string;
}

export interface NarrativeArc {
  hook: PlannedScene[];      // Opening 0-15% - grab attention
  setup: PlannedScene[];     // 15-25% - establish context
  build: PlannedScene[];     // 25-70% - main content
  climax: PlannedScene[];    // 70-85% - peak moment
  resolution: PlannedScene[]; // 85-100% - wrap up & CTA
}

export interface PacingProfile {
  contentType: 'product' | 'saas' | 'lifestyle' | 'tech' | 'corporate' | 'social' | 'cinematic';
  averageSceneDuration: number;
  transitionDuration: number;
  rhythm: 'fast' | 'moderate' | 'slow' | 'variable';
  energyLevel: 'low' | 'medium' | 'high';
}

export interface TransitionChoreography {
  from: string;  // scene ID
  to: string;    // scene ID
  transition: TransitionPattern;
  reasoning: string;
  cameraMove?: {
    from: CameraPerspective;
    to: CameraPerspective;
  };
}

// ============================================================================
// ADVANCED SCENE PLANNER
// ============================================================================

export class AdvancedScenePlanner {
  
  /**
   * Optimize video plan with advanced scene planning techniques
   */
  async optimizeVideoPlan(plan: VideoPlan, options: {
    contentType?: string;
    emphasizeHook?: boolean;
    allowPOVChanges?: boolean;
    targetPlatform?: 'youtube' | 'social' | 'presentation' | 'web';
  } = {}): Promise<VideoPlan> {
    
    console.log('[AdvancedScenePlanner] Starting multi-pass optimization...');
    
    // Pass 1: Analyze and structure narrative arc
    const narrativeArc = this.analyzeNarrativeArc(plan);
    
    // Pass 2: Optimize scene pacing
    const pacingProfile = this.determinePacingProfile(plan, options.contentType);
    const pacedScenes = this.optimizeScenePacing(plan.scenes, pacingProfile, plan.duration);
    
    // Pass 3: Add camera perspectives and POV changes
    let scenesWithPerspective = pacedScenes;
    if (options.allowPOVChanges) {
      scenesWithPerspective = this.addCameraPerspectives(pacedScenes, narrativeArc);
    }
    
    // Pass 4: Choreograph transitions
    const choreography = this.choreographTransitions(scenesWithPerspective, narrativeArc);
    const scenesWithTransitions = this.applyTransitionChoreography(scenesWithPerspective, choreography);
    
    // Pass 5: Analyze and optimize composition
    const optimizedScenes = this.optimizeSceneComposition(scenesWithTransitions);
    
    // Pass 6: Enhance hook if requested
    let finalScenes = optimizedScenes;
    if (options.emphasizeHook !== false) {
      finalScenes = this.enhanceHook(optimizedScenes, plan.duration);
    }
    
    console.log('[AdvancedScenePlanner] Optimization complete');
    
    return {
      ...plan,
      scenes: finalScenes
    };
  }
  
  /**
   * Analyze narrative structure and divide into story arc
   */
  private analyzeNarrativeArc(plan: VideoPlan): NarrativeArc {
    const scenes = plan.scenes;
    const duration = plan.duration;
    
    // Calculate time boundaries for each arc section
    const hookEnd = duration * 0.15;
    const setupEnd = duration * 0.25;
    const buildEnd = duration * 0.70;
    const climaxEnd = duration * 0.85;
    
    const arc: NarrativeArc = {
      hook: [],
      setup: [],
      build: [],
      climax: [],
      resolution: []
    };
    
    scenes.forEach(scene => {
      const sceneEnd = scene.startTime + scene.duration;
      const sceneMid = scene.startTime + (scene.duration / 2);
      
      if (sceneMid < hookEnd) {
        arc.hook.push(scene);
      } else if (sceneMid < setupEnd) {
        arc.setup.push(scene);
      } else if (sceneMid < buildEnd) {
        arc.build.push(scene);
      } else if (sceneMid < climaxEnd) {
        arc.climax.push(scene);
      } else {
        arc.resolution.push(scene);
      }
    });
    
    return arc;
  }
  
  /**
   * Determine optimal pacing profile based on content type
   */
  private determinePacingProfile(plan: VideoPlan, contentType?: string): PacingProfile {
    // Infer content type from scene elements if not provided
    const inferredType = contentType || this.inferContentType(plan);
    
    const profiles: Record<string, PacingProfile> = {
      product: {
        contentType: 'product',
        averageSceneDuration: 4,
        transitionDuration: 0.5,
        rhythm: 'moderate',
        energyLevel: 'medium'
      },
      saas: {
        contentType: 'saas',
        averageSceneDuration: 5,
        transitionDuration: 0.6,
        rhythm: 'moderate',
        energyLevel: 'medium'
      },
      lifestyle: {
        contentType: 'lifestyle',
        averageSceneDuration: 3.5,
        transitionDuration: 0.4,
        rhythm: 'fast',
        energyLevel: 'high'
      },
      tech: {
        contentType: 'tech',
        averageSceneDuration: 6,
        transitionDuration: 0.5,
        rhythm: 'moderate',
        energyLevel: 'medium'
      },
      corporate: {
        contentType: 'corporate',
        averageSceneDuration: 7,
        transitionDuration: 0.7,
        rhythm: 'slow',
        energyLevel: 'low'
      },
      social: {
        contentType: 'social',
        averageSceneDuration: 2.5,
        transitionDuration: 0.3,
        rhythm: 'fast',
        energyLevel: 'high'
      },
      cinematic: {
        contentType: 'cinematic',
        averageSceneDuration: 8,
        transitionDuration: 1.0,
        rhythm: 'slow',
        energyLevel: 'low'
      }
    };
    
    return profiles[inferredType] || profiles.product;
  }
  
  /**
   * Infer content type from video plan
   */
  private inferContentType(plan: VideoPlan): string {
    // Check for social media indicators (short duration, portrait aspect ratio)
    if (plan.duration < 30 && plan.aspectRatio === 'portrait') {
      return 'social';
    }
    
    // Check for tech indicators (code, terminal elements)
    const hasTechElements = plan.scenes.some(scene =>
      scene.elements.some(el => ['code-editor', 'terminal', 'laptop'].includes(el.type))
    );
    if (hasTechElements) return 'tech';
    
    // Check for data visualization (charts, stats)
    const hasDataViz = plan.scenes.some(scene =>
      scene.elements.some(el => ['data-viz', 'chart', 'stats-counter'].includes(el.type))
    );
    if (hasDataViz) return 'corporate';
    
    // Default to product
    return 'product';
  }
  
  /**
   * Optimize scene pacing based on pacing profile
   */
  private optimizeScenePacing(
    scenes: PlannedScene[],
    profile: PacingProfile,
    totalDuration: number
  ): PlannedScene[] {
    
    const optimizedScenes: PlannedScene[] = [];
    let currentTime = 0;
    
    // Constants for scene pacing
    const SCENE_DURATION_VARIANCE_RATIO = 0.3; // 30% variance for rhythm
    
    // Calculate ideal scene count
    const idealSceneCount = Math.round(totalDuration / profile.averageSceneDuration);
    const sceneDurationVariance = profile.averageSceneDuration * SCENE_DURATION_VARIANCE_RATIO;
    
    scenes.forEach((scene, index) => {
      // Vary duration for rhythm
      let duration = profile.averageSceneDuration;
      
      if (profile.rhythm === 'variable') {
        // Create varied rhythm
        const isEven = index % 2 === 0;
        duration = isEven
          ? profile.averageSceneDuration - sceneDurationVariance
          : profile.averageSceneDuration + sceneDurationVariance;
      } else if (profile.rhythm === 'fast') {
        // Shorter scenes for fast pace
        duration = Math.max(2, profile.averageSceneDuration * 0.8);
      } else if (profile.rhythm === 'slow') {
        // Longer scenes for slow pace
        duration = profile.averageSceneDuration * 1.2;
      }
      
      // Ensure we don't exceed total duration
      if (currentTime + duration > totalDuration) {
        duration = totalDuration - currentTime;
      }
      
      optimizedScenes.push({
        ...scene,
        startTime: currentTime,
        duration: Math.max(1, duration) // Minimum 1 second
      });
      
      currentTime += duration;
    });
    
    return optimizedScenes;
  }
  
  /**
   * Add camera perspectives and POV changes to scenes
   */
  private addCameraPerspectives(
    scenes: PlannedScene[],
    arc: NarrativeArc
  ): PlannedScene[] {
    
    return scenes.map((scene, index) => {
      // Determine appropriate perspective based on narrative position
      let perspective: CameraPerspective;
      
      if (arc.hook.includes(scene)) {
        // Hook: dramatic, attention-grabbing perspectives
        perspective = index % 2 === 0
          ? this.createPerspective('dramatic')
          : this.createPerspective('close-up');
          
      } else if (arc.setup.includes(scene)) {
        // Setup: establishing shots
        perspective = this.createPerspective('wide');
        
      } else if (arc.build.includes(scene)) {
        // Build: vary perspectives for interest
        const perspectives: CameraPerspective['type'][] = ['default', 'close-up', 'birds-eye', 'first-person'];
        const perspectiveType = perspectives[index % perspectives.length];
        perspective = this.createPerspective(perspectiveType);
        
      } else if (arc.climax.includes(scene)) {
        // Climax: dramatic, immersive perspectives
        perspective = index % 2 === 0
          ? this.createPerspective('inside')
          : this.createPerspective('first-person');
          
      } else {
        // Resolution: return to stable perspective
        perspective = this.createPerspective('default');
      }
      
      // Add perspective data to scene metadata
      return {
        ...scene,
        elements: scene.elements.map(el => ({
          ...el,
          style: {
            ...el.style,
            perspective: perspective.type,
            perspectiveOrigin: `${perspective.focalPoint.x}% ${perspective.focalPoint.y}%`,
            zoom: perspective.zoom,
            rotation: perspective.rotation
          }
        }))
      };
    });
  }
  
  /**
   * Create camera perspective configuration
   */
  private createPerspective(type: CameraPerspective['type']): CameraPerspective {
    const perspectives: Record<CameraPerspective['type'], CameraPerspective> = {
      'default': {
        type: 'default',
        focalPoint: { x: 50, y: 50 },
        zoom: 1.0,
        rotation: 0,
        description: 'Standard centered view'
      },
      'close-up': {
        type: 'close-up',
        focalPoint: { x: 50, y: 40 },
        zoom: 1.3,
        rotation: 0,
        description: 'Zoomed in for detail and intimacy'
      },
      'wide': {
        type: 'wide',
        focalPoint: { x: 50, y: 50 },
        zoom: 0.8,
        rotation: 0,
        description: 'Pulled back establishing shot'
      },
      'birds-eye': {
        type: 'birds-eye',
        focalPoint: { x: 50, y: 30 },
        zoom: 0.9,
        rotation: -5,
        description: 'Overhead perspective'
      },
      'first-person': {
        type: 'first-person',
        focalPoint: { x: 50, y: 60 },
        zoom: 1.1,
        rotation: 2,
        description: 'Immersive viewer perspective'
      },
      'inside': {
        type: 'inside',
        focalPoint: { x: 50, y: 50 },
        zoom: 1.2,
        rotation: 0,
        description: 'Inside looking out (e.g., inside spaceship)'
      },
      'dramatic': {
        type: 'dramatic',
        focalPoint: { x: 40, y: 45 },
        zoom: 1.15,
        rotation: 3,
        description: 'Dutch angle for tension and drama'
      }
    };
    
    return perspectives[type];
  }
  
  /**
   * Choreograph transitions between scenes
   */
  private choreographTransitions(
    scenes: PlannedScene[],
    arc: NarrativeArc
  ): TransitionChoreography[] {
    
    const choreography: TransitionChoreography[] = [];
    
    for (let i = 0; i < scenes.length - 1; i++) {
      const fromScene = scenes[i];
      const toScene = scenes[i + 1];
      
      // Determine transition type based on narrative context
      let transitionType: TransitionPattern['type'];
      let duration: number;
      let reasoning: string;
      
      // Hook transitions: fast, energetic
      if (arc.hook.includes(fromScene)) {
        transitionType = 'cut';
        duration = 0.2;
        reasoning = 'Fast cut to maintain hook energy';
        
      // Setup transitions: smooth, establishing
      } else if (arc.setup.includes(fromScene)) {
        transitionType = 'fade';
        duration = 0.5;
        reasoning = 'Fade for smooth setup flow';
        
      // Build transitions: varied for visual interest
      } else if (arc.build.includes(fromScene)) {
        const transitions: TransitionPattern['type'][] = ['slide', 'wipe', 'zoom', 'fade'];
        transitionType = transitions[i % transitions.length];
        duration = 0.4;
        reasoning = 'Varied transition to maintain interest';
        
      // Climax transitions: dramatic
      } else if (arc.climax.includes(fromScene)) {
        transitionType = i % 2 === 0 ? 'zoom' : 'wipe';
        duration = 0.6;
        reasoning = 'Dramatic transition for climax impact';
        
      // Resolution transitions: gentle
      } else {
        transitionType = 'fade';
        duration = 0.7;
        reasoning = 'Gentle fade for resolution';
      }
      
      choreography.push({
        from: fromScene.id,
        to: toScene.id,
        transition: {
          type: transitionType,
          duration
        },
        reasoning
      });
    }
    
    return choreography;
  }
  
  /**
   * Apply transition choreography to scenes
   */
  private applyTransitionChoreography(
    scenes: PlannedScene[],
    choreography: TransitionChoreography[]
  ): PlannedScene[] {
    
    return scenes.map((scene, index) => {
      // Find choreography for this scene
      const sceneChoreography = choreography.find(c => c.from === scene.id);
      
      return {
        ...scene,
        transition: sceneChoreography?.transition || scene.transition
      };
    });
  }
  
  /**
   * Analyze scene composition
   */
  analyzeSceneComposition(scene: PlannedScene): SceneCompositionAnalysis {
    const elements = scene.elements;
    
    // Count elements by layer
    const layerDistribution: Record<number, number> = {};
    elements.forEach(el => {
      const z = el.position.z;
      layerDistribution[z] = (layerDistribution[z] || 0) + 1;
    });
    
    // Calculate visual weight (more elements = higher weight)
    const visualWeight = elements.length * 10;
    
    // Determine balance
    const leftElements = elements.filter(el => el.position.x < 50).length;
    const rightElements = elements.filter(el => el.position.x > 50).length;
    const centerElements = elements.length - leftElements - rightElements;
    
    let balance: SceneCompositionAnalysis['balance'];
    if (Math.abs(leftElements - rightElements) <= 1) {
      balance = 'balanced';
    } else if (leftElements > rightElements) {
      balance = 'left';
    } else if (rightElements > leftElements) {
      balance = 'right';
    } else {
      balance = 'center';
    }
    
    // Determine density
    let density: SceneCompositionAnalysis['density'];
    if (elements.length <= 2) {
      density = 'sparse';
    } else if (elements.length <= 5) {
      density = 'balanced';
    } else if (elements.length <= 8) {
      density = 'dense';
    } else {
      density = 'overcrowded';
    }
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (density === 'overcrowded') {
      recommendations.push('Consider reducing element count for clarity');
    }
    if (balance === 'left' || balance === 'right') {
      recommendations.push('Rebalance elements for better composition');
    }
    if (Object.keys(layerDistribution).length === 1) {
      recommendations.push('Add depth by using multiple z-layers');
    }
    
    return {
      elementCount: elements.length,
      layerDistribution,
      visualWeight,
      balance,
      density,
      recommendations
    };
  }
  
  /**
   * Optimize scene composition
   */
  private optimizeSceneComposition(scenes: PlannedScene[]): PlannedScene[] {
    return scenes.map(scene => {
      const analysis = this.analyzeSceneComposition(scene);
      
      // If overcrowded, prioritize key elements
      if (analysis.density === 'overcrowded') {
        const prioritizedElements = scene.elements
          .sort((a, b) => b.position.z - a.position.z) // Sort by z-index
          .slice(0, 6); // Keep top 6 elements
        
        return {
          ...scene,
          elements: prioritizedElements
        };
      }
      
      // If unbalanced, adjust positions slightly
      if (analysis.balance === 'left') {
        return {
          ...scene,
          elements: scene.elements.map(el => {
            if (el.position.x < 50) {
              return {
                ...el,
                position: {
                  ...el.position,
                  x: Math.min(el.position.x + 5, 50)
                }
              };
            }
            return el;
          })
        };
      }
      
      if (analysis.balance === 'right') {
        return {
          ...scene,
          elements: scene.elements.map(el => {
            if (el.position.x > 50) {
              return {
                ...el,
                position: {
                  ...el.position,
                  x: Math.max(el.position.x - 5, 50)
                }
              };
            }
            return el;
          })
        };
      }
      
      return scene;
    });
  }
  
  /**
   * Enhance the hook (opening) for maximum impact
   */
  private enhanceHook(scenes: PlannedScene[], totalDuration: number): PlannedScene[] {
    // Constants for hook enhancement
    const HOOK_DURATION_RATIO = 0.15; // First 15% of video
    const HOOK_ANIMATION_MAX_DURATION = 0.4; // Max 0.4s for energetic feel
    
    // Hook is first 15% of video
    const hookDuration = totalDuration * HOOK_DURATION_RATIO;
    
    return scenes.map((scene, index) => {
      // If this is a hook scene
      if (scene.startTime < hookDuration) {
        return {
          ...scene,
          // Add fast, energetic animations
          animations: scene.animations.map(anim => ({
            ...anim,
            duration: Math.min(anim.duration, HOOK_ANIMATION_MAX_DURATION), // Faster animations
            easing: 'spring' // Bouncy, energetic easing
          })),
          // Ensure elements have strong animations
          elements: scene.elements.map(el => {
            if (!el.animation) {
              const HOOK_ELEMENT_STAGGER_DELAY = 0.1; // Delay between element animations
              
              return {
                ...el,
                animation: {
                  name: 'ZoomIn',
                  type: 'scale',
                  duration: HOOK_ANIMATION_MAX_DURATION,
                  easing: 'spring',
                  delay: index * HOOK_ELEMENT_STAGGER_DELAY,
                  properties: {
                    from: { scale: 0.8, opacity: 0 },
                    to: { scale: 1, opacity: 1 }
                  }
                }
              };
            }
            return el;
          })
        };
      }
      
      return scene;
    });
  }
}

// Export singleton
export const advancedScenePlanner = new AdvancedScenePlanner();
