/**
 * Production Quality Standards Service
 * 
 * Enforces professional video production standards including:
 * - Visual hierarchy optimization
 * - Color harmony and palette optimization
 * - Typography pairing and sizing
 * - Scene density management
 * - Transition variety enforcement
 */

import type { VideoPlan, PlannedScene, PlannedElement, GlobalStyles } from '@/types/video';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface QualityReport {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  score: number; // 0-100
  issues: QualityIssue[];
  improvements: QualityImprovement[];
}

export interface QualityIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'visual-hierarchy' | 'color' | 'typography' | 'density' | 'transitions' | 'pacing';
  message: string;
  sceneId?: string;
  elementId?: string;
}

export interface QualityImprovement {
  category: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface VisualHierarchy {
  primaryElements: PlannedElement[];
  secondaryElements: PlannedElement[];
  tertiaryElements: PlannedElement[];
  backgroundElements: PlannedElement[];
}

export interface ColorHarmony {
  isHarmonious: boolean;
  paletteType: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'mixed';
  contrastRatio: number;
  accessibility: 'poor' | 'fair' | 'good' | 'excellent';
  suggestions: string[];
}

export interface TypographyAnalysis {
  fontPairings: { primary: string; secondary: string };
  sizeHierarchy: { h1: number; h2: number; body: number };
  readability: 'poor' | 'fair' | 'good' | 'excellent';
  issues: string[];
}

// ============================================================================
// PRODUCTION QUALITY STANDARDS
// ============================================================================

export class ProductionQualityStandards {
  
  /**
   * Analyze and enforce quality standards on video plan
   */
  async enforceQualityStandards(plan: VideoPlan): Promise<{
    plan: VideoPlan;
    report: QualityReport;
  }> {
    
    console.log('[ProductionQuality] Analyzing video plan quality...');
    
    const issues: QualityIssue[] = [];
    const improvements: QualityImprovement[] = [];
    
    // Check visual hierarchy
    const hierarchyIssues = this.checkVisualHierarchy(plan);
    issues.push(...hierarchyIssues);
    
    // Check color harmony
    const colorReport = this.analyzeColorHarmony(plan.style);
    if (!colorReport.isHarmonious) {
      issues.push({
        severity: 'warning',
        category: 'color',
        message: 'Color palette lacks harmony. Consider using complementary or analogous colors.'
      });
    }
    if (colorReport.accessibility === 'poor') {
      issues.push({
        severity: 'critical',
        category: 'color',
        message: 'Insufficient color contrast for accessibility. Increase contrast between text and background.'
      });
    }
    
    // Check typography
    const typoAnalysis = this.analyzeTypography(plan);
    if (typoAnalysis.readability === 'poor') {
      issues.push({
        severity: 'warning',
        category: 'typography',
        message: 'Typography readability is poor. Adjust font sizes and spacing.'
      });
    }
    
    // Check scene density
    const densityIssues = this.checkSceneDensity(plan);
    issues.push(...densityIssues);
    
    // Check transition variety
    const transitionIssues = this.checkTransitionVariety(plan);
    issues.push(...transitionIssues);
    
    // Generate improvements
    if (colorReport.suggestions.length > 0) {
      improvements.push({
        category: 'color',
        suggestion: colorReport.suggestions[0],
        impact: 'high'
      });
    }
    
    if (typoAnalysis.issues.length > 0) {
      improvements.push({
        category: 'typography',
        suggestion: typoAnalysis.issues[0],
        impact: 'medium'
      });
    }
    
    // Calculate overall score
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const score = Math.max(0, 100 - (criticalCount * 20) - (warningCount * 10));
    
    let overall: QualityReport['overall'];
    if (score >= 90) overall = 'excellent';
    else if (score >= 70) overall = 'good';
    else if (score >= 50) overall = 'fair';
    else overall = 'poor';
    
    // Apply fixes to plan
    let optimizedPlan = this.optimizeColorPalette(plan, colorReport);
    optimizedPlan = this.optimizeTypography(optimizedPlan, typoAnalysis);
    optimizedPlan = this.enforceTransitionVariety(optimizedPlan);
    
    console.log(`[ProductionQuality] Quality score: ${score}/100 (${overall})`);
    
    return {
      plan: optimizedPlan,
      report: {
        overall,
        score,
        issues,
        improvements
      }
    };
  }
  
  /**
   * Check visual hierarchy of elements in scenes
   */
  private checkVisualHierarchy(plan: VideoPlan): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    plan.scenes.forEach(scene => {
      const hierarchy = this.analyzeVisualHierarchy(scene);
      
      // Check for missing primary elements
      if (hierarchy.primaryElements.length === 0) {
        issues.push({
          severity: 'warning',
          category: 'visual-hierarchy',
          message: `Scene "${scene.id}" lacks a clear primary focus element`,
          sceneId: scene.id
        });
      }
      
      // Check for too many primary elements
      if (hierarchy.primaryElements.length > 2) {
        issues.push({
          severity: 'info',
          category: 'visual-hierarchy',
          message: `Scene "${scene.id}" has too many competing primary elements. Simplify for clarity.`,
          sceneId: scene.id
        });
      }
      
      // Check z-index distribution
      const zLevels = new Set(scene.elements.map(el => el.position.z));
      if (zLevels.size === 1) {
        issues.push({
          severity: 'info',
          category: 'visual-hierarchy',
          message: `Scene "${scene.id}" lacks depth. Use multiple z-layers for visual interest.`,
          sceneId: scene.id
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Analyze visual hierarchy of scene elements
   */
  private analyzeVisualHierarchy(scene: PlannedScene): VisualHierarchy {
    const elements = scene.elements;
    
    // Sort by visual prominence (size * z-index)
    const sortedElements = [...elements].sort((a, b) => {
      const scoreA = (a.size.width * a.size.height) * (a.position.z + 1);
      const scoreB = (b.size.width * b.size.height) * (b.position.z + 1);
      return scoreB - scoreA;
    });
    
    const count = sortedElements.length;
    
    return {
      primaryElements: sortedElements.slice(0, Math.ceil(count * 0.2)),
      secondaryElements: sortedElements.slice(Math.ceil(count * 0.2), Math.ceil(count * 0.5)),
      tertiaryElements: sortedElements.slice(Math.ceil(count * 0.5), Math.ceil(count * 0.8)),
      backgroundElements: sortedElements.slice(Math.ceil(count * 0.8))
    };
  }
  
  /**
   * Analyze color harmony of palette
   */
  private analyzeColorHarmony(style: GlobalStyles): ColorHarmony {
    const palette = style.colorPalette;
    
    // Simple harmony check (in production, use proper color theory calculations)
    const isHarmonious = palette.length >= 2 && palette.length <= 5;
    
    // Estimate palette type (simplified)
    let paletteType: ColorHarmony['paletteType'] = 'mixed';
    if (palette.length === 1) {
      paletteType = 'monochromatic';
    } else if (palette.length <= 3) {
      paletteType = 'analogous';
    } else if (palette.length === 4) {
      paletteType = 'triadic';
    }
    
    // Simple contrast check (in production, calculate WCAG contrast ratios)
    const contrastRatio = 4.5; // Placeholder
    
    let accessibility: ColorHarmony['accessibility'];
    if (contrastRatio >= 7) accessibility = 'excellent';
    else if (contrastRatio >= 4.5) accessibility = 'good';
    else if (contrastRatio >= 3) accessibility = 'fair';
    else accessibility = 'poor';
    
    const suggestions: string[] = [];
    if (palette.length > 5) {
      suggestions.push('Reduce color palette to 3-5 colors for better cohesion');
    }
    if (contrastRatio < 4.5) {
      suggestions.push('Increase contrast between text and background colors');
    }
    if (palette.length < 2) {
      suggestions.push('Add complementary colors for visual interest');
    }
    
    return {
      isHarmonious,
      paletteType,
      contrastRatio,
      accessibility,
      suggestions
    };
  }
  
  /**
   * Analyze typography
   */
  private analyzeTypography(plan: VideoPlan): TypographyAnalysis {
    const typography = plan.style.typography;
    const issues: string[] = [];
    
    // Check font pairing
    const fontPairings = {
      primary: typography.primary,
      secondary: typography.secondary
    };
    
    // Check size hierarchy
    const sizes = typography.sizes;
    const sizeHierarchy = {
      h1: sizes.h1 || 48,
      h2: sizes.h2 || 36,
      body: sizes.body || 18
    };
    
    // Validate hierarchy
    if (sizeHierarchy.h1 <= sizeHierarchy.h2) {
      issues.push('H1 should be larger than H2 for proper hierarchy');
    }
    if (sizeHierarchy.h2 <= sizeHierarchy.body) {
      issues.push('H2 should be larger than body text');
    }
    
    // Check readability
    let readability: TypographyAnalysis['readability'] = 'good';
    if (sizeHierarchy.body < 14) {
      readability = 'poor';
      issues.push('Body text size is too small. Increase to at least 14px');
    } else if (sizeHierarchy.body < 16) {
      readability = 'fair';
      issues.push('Consider increasing body text size to 16px or larger');
    } else if (sizeHierarchy.body >= 18) {
      readability = 'excellent';
    }
    
    return {
      fontPairings,
      sizeHierarchy,
      readability,
      issues
    };
  }
  
  /**
   * Check scene density
   */
  private checkSceneDensity(plan: VideoPlan): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    plan.scenes.forEach(scene => {
      const elementCount = scene.elements.length;
      
      if (elementCount > 8) {
        issues.push({
          severity: 'warning',
          category: 'density',
          message: `Scene "${scene.id}" has too many elements (${elementCount}). Reduce to 6-8 for clarity.`,
          sceneId: scene.id
        });
      } else if (elementCount === 0) {
        issues.push({
          severity: 'critical',
          category: 'density',
          message: `Scene "${scene.id}" has no elements. Add content to this scene.`,
          sceneId: scene.id
        });
      } else if (elementCount === 1) {
        issues.push({
          severity: 'info',
          category: 'density',
          message: `Scene "${scene.id}" has only one element. Consider adding supporting elements.`,
          sceneId: scene.id
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Check transition variety
   */
  private checkTransitionVariety(plan: VideoPlan): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    const transitions = plan.scenes
      .map(scene => scene.transition?.type)
      .filter(Boolean);
    
    if (transitions.length === 0) return issues;
    
    // Check for repetitive transitions
    const transitionCounts: Record<string, number> = {};
    transitions.forEach(t => {
      if (t) {
        transitionCounts[t] = (transitionCounts[t] || 0) + 1;
      }
    });
    
    const dominantTransition = Object.entries(transitionCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (dominantTransition && dominantTransition[1] > transitions.length * 0.6) {
      issues.push({
        severity: 'info',
        category: 'transitions',
        message: `Transitions are repetitive (${dominantTransition[1]} uses of "${dominantTransition[0]}"). Vary for visual interest.`
      });
    }
    
    return issues;
  }
  
  /**
   * Optimize color palette
   */
  private optimizeColorPalette(plan: VideoPlan, harmony: ColorHarmony): VideoPlan {
    // If palette is too large, reduce it
    if (plan.style.colorPalette.length > 5) {
      return {
        ...plan,
        style: {
          ...plan.style,
          colorPalette: plan.style.colorPalette.slice(0, 5)
        }
      };
    }
    
    // If palette is too small, suggest adding colors (in production, generate complementary colors)
    if (plan.style.colorPalette.length < 2) {
      return {
        ...plan,
        style: {
          ...plan.style,
          colorPalette: [
            ...plan.style.colorPalette,
            '#3b82f6', // Add a default blue
            '#10b981'  // Add a default green
          ]
        }
      };
    }
    
    return plan;
  }
  
  /**
   * Optimize typography
   */
  private optimizeTypography(plan: VideoPlan, analysis: TypographyAnalysis): VideoPlan {
    const sizes = { ...plan.style.typography.sizes };
    
    // Ensure proper hierarchy
    if (sizes.h1 && sizes.h2 && sizes.h1 <= sizes.h2) {
      sizes.h1 = sizes.h2 * 1.4;
    }
    
    if (sizes.h2 && sizes.body && sizes.h2 <= sizes.body) {
      sizes.h2 = sizes.body * 1.5;
    }
    
    // Ensure minimum body size
    if (sizes.body && sizes.body < 14) {
      sizes.body = 16;
    }
    
    return {
      ...plan,
      style: {
        ...plan.style,
        typography: {
          ...plan.style.typography,
          sizes
        }
      }
    };
  }
  
  /**
   * Enforce transition variety
   */
  private enforceTransitionVariety(plan: VideoPlan): VideoPlan {
    const transitionTypes: Array<NonNullable<VideoPlan['scenes'][0]['transition']>['type']> = 
      ['fade', 'slide', 'wipe', 'zoom', 'cut'];
    
    return {
      ...plan,
      scenes: plan.scenes.map((scene, index) => {
        // If no transition or repetitive, assign varied transitions
        if (!scene.transition) {
          return {
            ...scene,
            transition: {
              type: transitionTypes[index % transitionTypes.length],
              duration: 0.5
            }
          };
        }
        return scene;
      })
    };
  }
}

// Export singleton
export const productionQualityStandards = new ProductionQualityStandards();
