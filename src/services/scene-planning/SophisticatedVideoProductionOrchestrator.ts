/**
 * Sophisticated Video Production Orchestrator
 * 
 * Central orchestration service that integrates all advanced planning systems:
 * - Advanced scene planning and structuring
 * - Production quality standards enforcement
 * - Motion design and animation
 * - Narrative structure optimization
 * 
 * This service bridges the gap between basic AI-generated plans and 
 * professional-grade video production demonstrated in reference videos.
 */

import type { VideoPlan } from '@/types/video';
import { advancedScenePlanner } from './AdvancedScenePlanner';
import { productionQualityStandards } from './ProductionQualityStandards';
import { motionDesignLibrary, type MotionStyle } from './MotionDesignLibrary';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ProductionOptions {
  // Scene planning
  emphasizeHook?: boolean;
  allowPOVChanges?: boolean;
  contentType?: string;
  targetPlatform?: 'youtube' | 'social' | 'presentation' | 'web';
  
  // Motion design
  motionStyle?: MotionStyle;
  animationIntensity?: 'subtle' | 'moderate' | 'bold';
  
  // Quality standards
  enforceQuality?: boolean;
  qualityThreshold?: number; // Minimum quality score (0-100)
  
  // Advanced features
  enableAutoComposition?: boolean;
  enableIntelligentPacing?: boolean;
  enableTransitionChoreography?: boolean;
}

export interface ProductionReport {
  planId: string;
  optimizationsApplied: string[];
  qualityScore: number;
  qualityImprovement: number;
  processingTime: number;
  warnings: string[];
  recommendations: string[];
}

// ============================================================================
// SOPHISTICATED VIDEO PRODUCTION ORCHESTRATOR
// ============================================================================

export class SophisticatedVideoProductionOrchestrator {
  
  /**
   * Main orchestration method - transforms basic video plan into 
   * production-ready professional video
   */
  async orchestrateProduction(
    videoPlan: VideoPlan,
    options: ProductionOptions = {}
  ): Promise<{
    plan: VideoPlan;
    report: ProductionReport;
  }> {
    
    const startTime = Date.now();
    const optimizationsApplied: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    console.log('[ProductionOrchestrator] Starting sophisticated video production pipeline...');
    console.log(`[ProductionOrchestrator] Input: ${videoPlan.scenes.length} scenes, ${videoPlan.duration}s duration`);
    
    // ========================================================================
    // PHASE 1: PRE-PRODUCTION ANALYSIS
    // ========================================================================
    
    console.log('[ProductionOrchestrator] Phase 1: Pre-production analysis');
    
    // Assess initial quality
    const initialQuality = await productionQualityStandards.enforceQualityStandards(videoPlan);
    const initialScore = initialQuality.report.score;
    
    console.log(`[ProductionOrchestrator] Initial quality score: ${initialScore}/100`);
    
    // Start with the input plan
    let optimizedPlan = videoPlan;
    
    // ========================================================================
    // PHASE 2: ADVANCED SCENE PLANNING & STRUCTURING
    // ========================================================================
    
    if (options.enableIntelligentPacing !== false) {
      console.log('[ProductionOrchestrator] Phase 2: Advanced scene planning');
      
      optimizedPlan = await advancedScenePlanner.optimizeVideoPlan(optimizedPlan, {
        contentType: options.contentType,
        emphasizeHook: options.emphasizeHook !== false,
        allowPOVChanges: options.allowPOVChanges !== false,
        targetPlatform: options.targetPlatform
      });
      
      optimizationsApplied.push('Advanced scene pacing and structure');
      optimizationsApplied.push('Narrative arc optimization');
      
      if (options.allowPOVChanges !== false) {
        optimizationsApplied.push('Camera perspective and POV changes');
      }
      
      if (options.enableTransitionChoreography !== false) {
        optimizationsApplied.push('Intelligent transition choreography');
      }
      
      console.log('[ProductionOrchestrator] Scene planning complete');
    }
    
    // ========================================================================
    // PHASE 3: MOTION DESIGN & ANIMATION
    // ========================================================================
    
    console.log('[ProductionOrchestrator] Phase 3: Motion design and animation');
    
    const motionStyle = options.motionStyle || this.inferMotionStyle(optimizedPlan, options);
    console.log(`[ProductionOrchestrator] Applying ${motionStyle} motion style`);
    
    // Apply motion presets to all scenes
    optimizedPlan = {
      ...optimizedPlan,
      scenes: motionDesignLibrary.applyAnimationPresets(optimizedPlan.scenes, motionStyle)
    };
    
    optimizationsApplied.push(`Professional ${motionStyle} motion design`);
    optimizationsApplied.push('Entrance and exit animations');
    
    // Apply coordinated animations for multi-element scenes
    optimizedPlan = {
      ...optimizedPlan,
      scenes: optimizedPlan.scenes.map(scene => {
        if (scene.elements.length > 1) {
          // Apply staggered animations for visual interest
          const preset = motionDesignLibrary.getMotionPreset(motionStyle);
          const baseAnimation = preset.animations[0];
          
          return {
            ...scene,
            elements: motionDesignLibrary.createCoordinatedAnimation(
              scene.elements,
              'staggered',
              baseAnimation
            )
          };
        }
        return scene;
      })
    };
    
    optimizationsApplied.push('Coordinated multi-element animations');
    
    console.log('[ProductionOrchestrator] Motion design complete');
    
    // ========================================================================
    // PHASE 4: PRODUCTION QUALITY STANDARDS
    // ========================================================================
    
    if (options.enforceQuality !== false) {
      console.log('[ProductionOrchestrator] Phase 4: Quality standards enforcement');
      
      const qualityResult = await productionQualityStandards.enforceQualityStandards(optimizedPlan);
      optimizedPlan = qualityResult.plan;
      
      // Collect warnings and recommendations
      qualityResult.report.issues.forEach(issue => {
        if (issue.severity === 'critical' || issue.severity === 'warning') {
          warnings.push(issue.message);
        }
      });
      
      qualityResult.report.improvements.forEach(improvement => {
        recommendations.push(improvement.suggestion);
      });
      
      optimizationsApplied.push('Visual hierarchy optimization');
      optimizationsApplied.push('Color harmony and palette optimization');
      optimizationsApplied.push('Typography hierarchy enforcement');
      optimizationsApplied.push('Transition variety optimization');
      
      console.log(`[ProductionOrchestrator] Final quality score: ${qualityResult.report.score}/100`);
      
      // Check if quality threshold is met
      const threshold = options.qualityThreshold || 70;
      if (qualityResult.report.score < threshold) {
        warnings.push(
          `Quality score (${qualityResult.report.score}) is below threshold (${threshold}). ` +
          `Consider manual review.`
        );
      }
      
      const finalScore = qualityResult.report.score;
      const improvement = finalScore - initialScore;
      
      console.log('[ProductionOrchestrator] Quality enforcement complete');
      
      // ========================================================================
      // PHASE 5: FINAL POLISH
      // ========================================================================
      
      console.log('[ProductionOrchestrator] Phase 5: Final polish');
      
      // Ensure all scenes have descriptions for context
      optimizedPlan = {
        ...optimizedPlan,
        scenes: optimizedPlan.scenes.map((scene, index) => ({
          ...scene,
          description: scene.description || `Scene ${index + 1}`,
        }))
      };
      
      // Add metadata for tracking
      const processingTime = Date.now() - startTime;
      
      console.log(`[ProductionOrchestrator] Production complete in ${processingTime}ms`);
      console.log(`[ProductionOrchestrator] Optimizations applied: ${optimizationsApplied.length}`);
      
      // ========================================================================
      // GENERATE REPORT
      // ========================================================================
      
      const report: ProductionReport = {
        planId: optimizedPlan.id,
        optimizationsApplied,
        qualityScore: finalScore,
        qualityImprovement: improvement,
        processingTime,
        warnings,
        recommendations
      };
      
      return {
        plan: optimizedPlan,
        report
      };
    }
    
    // If quality enforcement is disabled, return plan with basic report
    const processingTime = Date.now() - startTime;
    
    return {
      plan: optimizedPlan,
      report: {
        planId: optimizedPlan.id,
        optimizationsApplied,
        qualityScore: initialScore,
        qualityImprovement: 0,
        processingTime,
        warnings,
        recommendations
      }
    };
  }
  
  /**
   * Infer appropriate motion style from video plan
   */
  private inferMotionStyle(plan: VideoPlan, options: ProductionOptions): MotionStyle {
    // Check for explicit content type
    if (options.contentType) {
      const contentTypeMap: Record<string, MotionStyle> = {
        product: 'creative',
        saas: 'tech',
        lifestyle: 'social',
        tech: 'tech',
        corporate: 'corporate',
        social: 'social',
        cinematic: 'cinematic'
      };
      
      if (contentTypeMap[options.contentType]) {
        return contentTypeMap[options.contentType];
      }
    }
    
    // Infer from platform
    if (options.targetPlatform) {
      const platformMap: Record<string, MotionStyle> = {
        youtube: 'creative',
        social: 'social',
        presentation: 'corporate',
        web: 'tech'
      };
      
      if (platformMap[options.targetPlatform]) {
        return platformMap[options.targetPlatform];
      }
    }
    
    // Infer from video duration
    if (plan.duration < 30) {
      return 'social'; // Short videos are likely for social media
    }
    
    if (plan.duration > 90) {
      return 'cinematic'; // Longer videos benefit from cinematic style
    }
    
    // Infer from element types
    const hasTechElements = plan.scenes.some(scene =>
      scene.elements.some(el => ['code-editor', 'terminal', 'laptop'].includes(el.type))
    );
    if (hasTechElements) return 'tech';
    
    const hasDataViz = plan.scenes.some(scene =>
      scene.elements.some(el => ['data-viz', 'chart', 'stats-counter'].includes(el.type))
    );
    if (hasDataViz) return 'corporate';
    
    // Default to creative
    return 'creative';
  }
  
  /**
   * Quick optimize - applies essential optimizations only
   */
  async quickOptimize(videoPlan: VideoPlan): Promise<VideoPlan> {
    const result = await this.orchestrateProduction(videoPlan, {
      enforceQuality: true,
      enableIntelligentPacing: true,
      enableTransitionChoreography: true,
      qualityThreshold: 60
    });
    
    return result.plan;
  }
  
  /**
   * Full production optimize - applies all available optimizations
   */
  async fullProduction(
    videoPlan: VideoPlan,
    contentType?: string,
    targetPlatform?: 'youtube' | 'social' | 'presentation' | 'web'
  ): Promise<{
    plan: VideoPlan;
    report: ProductionReport;
  }> {
    
    return await this.orchestrateProduction(videoPlan, {
      contentType,
      targetPlatform,
      emphasizeHook: true,
      allowPOVChanges: true,
      enforceQuality: true,
      enableAutoComposition: true,
      enableIntelligentPacing: true,
      enableTransitionChoreography: true,
      qualityThreshold: 80,
      animationIntensity: 'moderate'
    });
  }
}

// Export singleton
export const sophisticatedVideoProduction = new SophisticatedVideoProductionOrchestrator();
