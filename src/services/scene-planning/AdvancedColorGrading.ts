/**
 * Advanced Color Grading System
 * 
 * Implements professional color grading seen in reference video:
 * - Color temperature shifts (blue → red/warm → green → dark → warm)
 * - Atmospheric color overlays
 * - Dynamic color transitions
 * - Mood-based color palettes
 * 
 * Based on analysis showing:
 * - Act 1: Deep blue space (R:17, G:22, B:33)
 * - Act 2: Warm red/orange (R:47, G:36, B:36) 
 * - Act 3: Green landscape (G:18 dominant)
 * - Act 4: Near-black dramatic (brightness: 0.1)
 * - Act 5: Warm finale (R:35-40)
 */

import { interpolate, interpolateColors } from 'remotion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ColorGrade {
  temperature: number; // Kelvin (2000-10000)
  tint: number;        // -100 to 100 (green to magenta)
  saturation: number;  // 0-200 (100 = normal)
  contrast: number;    // 0-200 (100 = normal)
  brightness: number;  // 0-200 (100 = normal)
  shadows: string;     // RGB for shadow tint
  midtones: string;    // RGB for midtone tint
  highlights: string;  // RGB for highlight tint
  vignette: number;    // 0-1 (0 = none)
}

export interface ColorGradeKeyframe {
  frame: number;
  grade: Partial<ColorGrade>;
}

export type MoodPreset =
  | 'space-blue'       // Professional, tech, space
  | 'warm-energy'      // Action, excitement
  | 'green-landscape'  // Growth, nature
  | 'dramatic-dark'    // Tension, mystery
  | 'warm-finale'      // Triumph, conclusion
  | 'neutral';         // Balanced

// ============================================================================
// COLOR TEMPERATURE CONVERSION
// ============================================================================

/**
 * Convert color temperature (Kelvin) to RGB values
 */
export function kelvinToRGB(kelvin: number): string {
  const temp = kelvin / 100;
  let r, g, b;
  
  // Calculate red
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(0, Math.min(255, r));
  }
  
  // Calculate green
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  g = Math.max(0, Math.min(255, g));
  
  // Calculate blue
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(0, Math.min(255, b));
  }
  
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// ============================================================================
// MOOD PRESETS
// ============================================================================

export const MOOD_PRESETS: Record<MoodPreset, ColorGrade> = {
  'space-blue': {
    temperature: 7000, // Cool blue
    tint: -10,
    saturation: 90,
    contrast: 110,
    brightness: 85,
    shadows: 'rgb(10, 14, 39)',
    midtones: 'rgb(17, 22, 33)',
    highlights: 'rgb(100, 150, 200)',
    vignette: 0.3
  },
  'warm-energy': {
    temperature: 3500, // Warm red/orange
    tint: 15,
    saturation: 120,
    contrast: 120,
    brightness: 110,
    shadows: 'rgb(20, 10, 5)',
    midtones: 'rgb(47, 36, 36)',
    highlights: 'rgb(255, 180, 100)',
    vignette: 0.2
  },
  'green-landscape': {
    temperature: 5500, // Neutral-cool
    tint: -20,
    saturation: 105,
    contrast: 100,
    brightness: 95,
    shadows: 'rgb(8, 12, 10)',
    midtones: 'rgb(10, 18, 15)',
    highlights: 'rgb(150, 200, 150)',
    vignette: 0.25
  },
  'dramatic-dark': {
    temperature: 7000, // Cool
    tint: 0,
    saturation: 70,
    contrast: 130,
    brightness: 30, // Very dark
    shadows: 'rgb(0, 0, 0)',
    midtones: 'rgb(5, 8, 12)',
    highlights: 'rgb(20, 30, 40)',
    vignette: 0.6
  },
  'warm-finale': {
    temperature: 4000, // Warm
    tint: 10,
    saturation: 110,
    contrast: 105,
    brightness: 105,
    shadows: 'rgb(15, 10, 10)',
    midtones: 'rgb(35, 28, 25)',
    highlights: 'rgb(255, 200, 150)',
    vignette: 0.15
  },
  'neutral': {
    temperature: 6500, // Daylight
    tint: 0,
    saturation: 100,
    contrast: 100,
    brightness: 100,
    shadows: 'rgb(0, 0, 0)',
    midtones: 'rgb(128, 128, 128)',
    highlights: 'rgb(255, 255, 255)',
    vignette: 0
  }
};

// ============================================================================
// COLOR GRADING SYSTEM
// ============================================================================

export class AdvancedColorGrading {
  private keyframes: ColorGradeKeyframe[];
  
  constructor(keyframes: ColorGradeKeyframe[] = []) {
    this.keyframes = keyframes.sort((a, b) => a.frame - b.frame);
  }
  
  /**
   * Add a color grade keyframe
   */
  addKeyframe(frame: number, grade: Partial<ColorGrade> | MoodPreset): void {
    const gradeConfig = typeof grade === 'string'
      ? MOOD_PRESETS[grade]
      : grade;
    
    this.keyframes.push({ frame, grade: gradeConfig });
    this.keyframes.sort((a, b) => a.frame - b.frame);
  }
  
  /**
   * Get color grade at specific frame
   */
  getGradeAtFrame(frame: number): ColorGrade {
    if (this.keyframes.length === 0) {
      return MOOD_PRESETS.neutral;
    }
    
    // Find surrounding keyframes
    let prev: ColorGradeKeyframe | null = null;
    let next: ColorGradeKeyframe | null = null;
    
    for (let i = 0; i < this.keyframes.length; i++) {
      if (this.keyframes[i].frame <= frame) {
        prev = this.keyframes[i];
      }
      if (this.keyframes[i].frame > frame && !next) {
        next = this.keyframes[i];
        break;
      }
    }
    
    // Before first keyframe
    if (!prev) {
      return { ...MOOD_PRESETS.neutral, ...next!.grade };
    }
    
    // After last keyframe
    if (!next) {
      return { ...MOOD_PRESETS.neutral, ...prev.grade };
    }
    
    // Interpolate between keyframes
    const progress = (frame - prev.frame) / (next.frame - prev.frame);
    
    return this.interpolateGrades(
      { ...MOOD_PRESETS.neutral, ...prev.grade },
      { ...MOOD_PRESETS.neutral, ...next.grade },
      progress
    );
  }
  
  /**
   * Interpolate between two color grades
   */
  private interpolateGrades(
    from: ColorGrade,
    to: ColorGrade,
    progress: number
  ): ColorGrade {
    return {
      temperature: interpolate(progress, [0, 1], [from.temperature, to.temperature]),
      tint: interpolate(progress, [0, 1], [from.tint, to.tint]),
      saturation: interpolate(progress, [0, 1], [from.saturation, to.saturation]),
      contrast: interpolate(progress, [0, 1], [from.contrast, to.contrast]),
      brightness: interpolate(progress, [0, 1], [from.brightness, to.brightness]),
      shadows: interpolateColors(progress, [0, 1], [from.shadows, to.shadows]),
      midtones: interpolateColors(progress, [0, 1], [from.midtones, to.midtones]),
      highlights: interpolateColors(progress, [0, 1], [from.highlights, to.highlights]),
      vignette: interpolate(progress, [0, 1], [from.vignette, to.vignette])
    };
  }
  
  /**
   * Get CSS filter string for color grade
   */
  getFilterString(grade: ColorGrade): string {
    const filters: string[] = [];
    
    // Brightness
    if (grade.brightness !== 100) {
      filters.push(`brightness(${grade.brightness / 100})`);
    }
    
    // Contrast
    if (grade.contrast !== 100) {
      filters.push(`contrast(${grade.contrast / 100})`);
    }
    
    // Saturation
    if (grade.saturation !== 100) {
      filters.push(`saturate(${grade.saturation / 100})`);
    }
    
    return filters.join(' ');
  }
  
  /**
   * Get overlay style objects for complex grading
   * Returns CSS properties for overlays (temperature, vignette)
   */
  getOverlayStyles(grade: ColorGrade): React.CSSProperties[] {
    const overlays: React.CSSProperties[] = [];
    
    // Temperature overlay
    const tempColor = kelvinToRGB(grade.temperature);
    overlays.push({
      position: 'absolute',
      inset: 0,
      backgroundColor: tempColor,
      mixBlendMode: 'overlay',
      opacity: 0.2,
      pointerEvents: 'none'
    });
    
    // Vignette
    if (grade.vignette > 0) {
      overlays.push({
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, transparent 30%, ${grade.shadows} 100%)`,
        opacity: grade.vignette,
        pointerEvents: 'none'
      });
    }
    
    return overlays;
  }
}

// ============================================================================
// PRESET COLOR GRADING TIMELINES
// ============================================================================

/**
 * Create color grading timeline based on reference video
 * Blue space → Warm launch → Green landscape → Dark drama → Warm finale
 */
export function createReferenceVideoColorGrading(totalDuration: number): AdvancedColorGrading {
  const grading = new AdvancedColorGrading();
  
  // Act 1: Opening - Space blue (0-9s)
  grading.addKeyframe(0, 'space-blue');
  grading.addKeyframe(Math.floor(totalDuration * 0.11), 'space-blue');
  
  // Act 2: Launch - Warm energy (9-24s)
  grading.addKeyframe(Math.floor(totalDuration * 0.11), 'warm-energy');
  grading.addKeyframe(Math.floor(totalDuration * 0.29), 'warm-energy');
  
  // Act 3: Journey - Green landscape (24-40s)
  grading.addKeyframe(Math.floor(totalDuration * 0.30), 'green-landscape');
  grading.addKeyframe(Math.floor(totalDuration * 0.48), 'green-landscape');
  
  // Act 4: Drama - Dark (40-72s)
  grading.addKeyframe(Math.floor(totalDuration * 0.48), 'space-blue');
  grading.addKeyframe(Math.floor(totalDuration * 0.72), 'dramatic-dark');
  
  // Act 5: Finale - Warm conclusion (72-83s)
  grading.addKeyframe(Math.floor(totalDuration * 0.87), 'warm-finale');
  grading.addKeyframe(totalDuration, 'warm-finale');
  
  return grading;
}

/**
 * Simple color temperature shift over time
 */
export function createSimpleTemperatureGrading(
  totalDuration: number,
  startTemp: number,
  endTemp: number
): AdvancedColorGrading {
  const grading = new AdvancedColorGrading();
  
  grading.addKeyframe(0, {
    ...MOOD_PRESETS.neutral,
    temperature: startTemp
  });
  
  grading.addKeyframe(totalDuration, {
    ...MOOD_PRESETS.neutral,
    temperature: endTemp
  });
  
  return grading;
}

// Types and MOOD_PRESETS are already exported at definition above
