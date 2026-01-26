/**
 * Parallax Depth System
 * 
 * Implements 6-layer parallax depth for creating realistic 3D space in 2D:
 * - Far background (stars) - 0.1x parallax
 * - Mid background (space) - 0.3x parallax  
 * - Environment (terrain) - 0.6x parallax
 * - Mid-ground (UI cards) - 0.8x parallax
 * - Subject (main elements) - 1.0x parallax
 * - Foreground (particles) - 1.5x parallax
 * 
 * Based on analysis showing sophisticated depth layering with
 * atmospheric perspective and parallax motion.
 */

import { interpolate } from 'remotion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ParallaxLayer = 
  | 'far-background'    // 0.1x - Stars, distant elements
  | 'mid-background'    // 0.3x - Space environment
  | 'environment'       // 0.6x - Planets, terrain
  | 'mid-ground'        // 0.8x - UI cards, floating elements
  | 'subject'           // 1.0x - Main characters, primary content
  | 'foreground';       // 1.5x - Close particles, effects

export interface ParallaxConfig {
  layer: ParallaxLayer;
  multiplier?: number; // Override default multiplier
  opacity?: number;    // Atmospheric fade for distant layers
  blur?: number;       // Atmospheric blur for distant layers
  colorShift?: string; // Blue-shift for distant layers
}

export interface ParallaxTransform {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  filter: string;
}

// ============================================================================
// LAYER MULTIPLIERS
// ============================================================================

const DEFAULT_MULTIPLIERS: Record<ParallaxLayer, number> = {
  'far-background': 0.1,
  'mid-background': 0.3,
  'environment': 0.6,
  'mid-ground': 0.8,
  'subject': 1.0,
  'foreground': 1.5
};

// Atmospheric perspective settings
const ATMOSPHERIC_CONFIG: Record<ParallaxLayer, {
  opacity: number;
  blur: number;
  colorShift: string;
}> = {
  'far-background': {
    opacity: 0.6,
    blur: 0,
    colorShift: 'hue-rotate(210deg) saturate(0.7)' // Blue shift
  },
  'mid-background': {
    opacity: 0.8,
    blur: 0,
    colorShift: 'hue-rotate(195deg) saturate(0.85)'
  },
  'environment': {
    opacity: 0.9,
    blur: 0,
    colorShift: 'saturate(0.95)'
  },
  'mid-ground': {
    opacity: 0.95,
    blur: 0,
    colorShift: 'saturate(1.0)'
  },
  'subject': {
    opacity: 1.0,
    blur: 0,
    colorShift: 'saturate(1.1)' // Slightly more saturated for pop
  },
  'foreground': {
    opacity: 1.0,
    blur: 0.5, // Slight blur for very close elements
    colorShift: 'saturate(1.15)'
  }
};

// ============================================================================
// PARALLAX SYSTEM
// ============================================================================

export class ParallaxDepthSystem {
  /**
   * Calculate parallax transform for a layer based on camera position
   */
  static getTransform(
    config: ParallaxConfig,
    cameraX: number,
    cameraY: number,
    cameraZ: number
  ): ParallaxTransform {
    const multiplier = config.multiplier ?? DEFAULT_MULTIPLIERS[config.layer];
    const atmospheric = ATMOSPHERIC_CONFIG[config.layer];
    
    // Calculate parallax offset
    const offsetX = cameraX * multiplier;
    const offsetY = cameraY * multiplier;
    const offsetZ = cameraZ * multiplier;
    
    // Calculate scale based on depth (further = smaller)
    // Layers further away scale down slightly for perspective
    const depthScale = 1 - (1 - multiplier) * 0.1;
    
    // Apply atmospheric perspective
    const opacity = config.opacity ?? atmospheric.opacity;
    const blur = config.blur ?? atmospheric.blur;
    const colorShift = config.colorShift ?? atmospheric.colorShift;
    
    // Build filter string
    const filters: string[] = [];
    if (blur > 0) {
      filters.push(`blur(${blur}px)`);
    }
    if (colorShift) {
      filters.push(colorShift);
    }
    
    return {
      x: offsetX,
      y: offsetY,
      z: offsetZ,
      scale: depthScale,
      opacity,
      filter: filters.join(' ')
    };
  }
  
  /**
   * Get CSS style object for parallax layer
   */
  static getLayerStyle(
    transform: ParallaxTransform,
    baseStyle: React.CSSProperties = {}
  ): React.CSSProperties {
    return {
      ...baseStyle,
      transform: `
        translate3d(${-transform.x}px, ${-transform.y}px, ${transform.z}px)
        scale(${transform.scale})
      `.trim().replace(/\s+/g, ' '),
      opacity: transform.opacity,
      filter: transform.filter,
      willChange: 'transform'
    };
  }
  
  /**
   * Create parallax container style
   */
  static getContainerStyle(): React.CSSProperties {
    return {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      perspective: '1000px',
      perspectiveOrigin: '50% 50%'
    };
  }
  
  /**
   * Calculate depth fog for very distant elements
   */
  static calculateDepthFog(
    layer: ParallaxLayer,
    fogColor: string = 'rgba(10, 14, 39, 0.3)'
  ): string {
    const multiplier = DEFAULT_MULTIPLIERS[layer];
    const fogIntensity = 1 - multiplier; // More fog for distant layers
    
    if (fogIntensity < 0.1) {
      return 'none';
    }
    
    return `linear-gradient(${fogColor} 0%, transparent 100%)`;
  }
}

// ============================================================================
// PRESET PARALLAX SCENES
// ============================================================================

/**
 * Space scene parallax configuration
 * Based on reference video space sections
 */
export function createSpaceParallaxScene() {
  return {
    farStars: {
      layer: 'far-background' as ParallaxLayer,
      opacity: 0.4,
      colorShift: 'hue-rotate(210deg) saturate(0.6) brightness(0.8)'
    },
    nebula: {
      layer: 'mid-background' as ParallaxLayer,
      opacity: 0.3,
      blur: 2,
      colorShift: 'hue-rotate(270deg) saturate(1.5) brightness(0.6)'
    },
    planets: {
      layer: 'environment' as ParallaxLayer,
      opacity: 0.9,
      colorShift: 'saturate(1.2)'
    },
    floatingCards: {
      layer: 'mid-ground' as ParallaxLayer,
      opacity: 0.95
    },
    mainCharacter: {
      layer: 'subject' as ParallaxLayer,
      opacity: 1.0
    },
    closeParticles: {
      layer: 'foreground' as ParallaxLayer,
      opacity: 0.6,
      blur: 0.5
    }
  };
}

/**
 * Landscape scene parallax configuration
 * For sections with planetary surfaces
 */
export function createLandscapeParallaxScene() {
  return {
    sky: {
      layer: 'far-background' as ParallaxLayer,
      opacity: 0.8
    },
    distantMountains: {
      layer: 'mid-background' as ParallaxLayer,
      opacity: 0.85,
      colorShift: 'hue-rotate(195deg) saturate(0.7) brightness(0.9)'
    },
    terrain: {
      layer: 'environment' as ParallaxLayer,
      opacity: 0.95
    },
    vegetation: {
      layer: 'mid-ground' as ParallaxLayer,
      opacity: 1.0
    },
    characters: {
      layer: 'subject' as ParallaxLayer,
      opacity: 1.0
    },
    foregroundGrass: {
      layer: 'foreground' as ParallaxLayer,
      opacity: 0.8,
      blur: 1
    }
  };
}

// ============================================================================
// DEPTH SORTING
// ============================================================================

/**
 * Sort elements by depth for proper rendering order
 */
export function sortByDepth<T extends { parallaxConfig: ParallaxConfig }>(
  elements: T[]
): T[] {
  const layerOrder: ParallaxLayer[] = [
    'far-background',
    'mid-background',
    'environment',
    'mid-ground',
    'subject',
    'foreground'
  ];
  
  return [...elements].sort((a, b) => {
    const aIndex = layerOrder.indexOf(a.parallaxConfig.layer);
    const bIndex = layerOrder.indexOf(b.parallaxConfig.layer);
    return aIndex - bIndex;
  });
}

// ============================================================================
// PARALLAX ANIMATION HELPERS
// ============================================================================

/**
 * Create smooth parallax motion over time
 */
export function createParallaxAnimation(
  frame: number,
  startFrame: number,
  endFrame: number,
  startZ: number,
  endZ: number
): {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
} {
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  return {
    cameraX: 0, // Horizontal movement if needed
    cameraY: 0, // Vertical movement if needed
    cameraZ: interpolate(progress, [0, 1], [startZ, endZ])
  };
}

/**
 * Create camera drift for organic feel
 * Adds subtle horizontal/vertical movement
 */
export function applyCameraDrift(
  baseX: number,
  baseY: number,
  frame: number,
  intensity: number = 5
): { x: number; y: number } {
  // Slow sinusoidal drift
  const driftX = Math.sin(frame * 0.02) * intensity;
  const driftY = Math.cos(frame * 0.015) * intensity * 0.6;
  
  return {
    x: baseX + driftX,
    y: baseY + driftY
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type ParallaxLayer,
  type ParallaxConfig,
  type ParallaxTransform
};
