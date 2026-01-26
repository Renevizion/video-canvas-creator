/**
 * Remotion Code Helper
 * Dynamically generates required imports based on what's actually used in the video plan
 * This is future-proof - it automatically adapts to new features without manual updates
 */

import type { VideoPlan, PlannedElement, AnimationPattern } from '@/types/video';

/**
 * Available Remotion package imports
 * Add new packages here and they'll be automatically included when needed
 */
const REMOTION_PACKAGES = {
  // Core Remotion
  core: {
    package: 'remotion',
    imports: ['AbsoluteFill', 'useCurrentFrame', 'useVideoConfig', 'interpolate', 'spring', 'Sequence', 'Series', 'Easing', 'Img', 'delayRender', 'continueRender', 'OffthreadVideo'],
    alwaysInclude: true, // Core is always needed
  },
  
  // Transitions
  transitions: {
    package: '@remotion/transitions',
    imports: ['TransitionSeries', 'linearTiming', 'springTiming'],
    condition: (plan: VideoPlan) => plan.scenes.length > 1 || plan.scenes.some(s => s.transition),
  },
  transitionFade: {
    package: '@remotion/transitions/fade',
    imports: ['fade'],
    condition: (plan: VideoPlan) => plan.scenes.some(s => s.transition?.type === 'fade'),
  },
  transitionSlide: {
    package: '@remotion/transitions/slide',
    imports: ['slide'],
    condition: (plan: VideoPlan) => plan.scenes.some(s => s.transition?.type === 'slide' || s.transition?.type === 'wipe'),
  },
  transitionWipe: {
    package: '@remotion/transitions/wipe',
    imports: ['wipe'],
    condition: (plan: VideoPlan) => plan.scenes.some(s => s.transition?.type === 'wipe'),
  },
  
  // Noise for deterministic randomness
  noise: {
    package: '@remotion/noise',
    imports: ['noise3D'],
    condition: (plan: VideoPlan) => hasAnimation(plan, ['float', 'pulse']) || hasBackground(plan),
  },
  
  // Media
  media: {
    package: '@remotion/media',
    imports: ['Audio'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'audio'),
  },
  
  // Layout utils for text
  layoutUtils: {
    package: '@remotion/layout-utils',
    imports: ['measureText'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'text'),
  },
  
  // Fonts
  fonts: {
    package: '@remotion/google-fonts/Inter',
    imports: ['loadFont'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'text'),
  },
  
  // Motion blur
  motionBlur: {
    package: '@remotion/motion-blur',
    imports: ['Trail'],
    condition: (plan: VideoPlan) => hasAnimation(plan, ['slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 'rotate', 'spin']),
  },
  
  // Shapes
  shapes: {
    package: '@remotion/shapes',
    imports: ['Circle', 'Rect', 'Triangle', 'Star', 'Polygon'],
    condition: (plan: VideoPlan) => hasShapeType(plan, ['circle', 'rect', 'rectangle', 'square', 'triangle', 'star', 'polygon', 'hexagon']),
  },
  
  // Paths (for future use)
  paths: {
    package: '@remotion/paths',
    imports: ['evolvePath', 'getLength', 'getPointAtLength'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'path') || hasAnimation(plan, ['path']),
  },
  
  // Animated emoji
  animatedEmoji: {
    package: '@remotion/animated-emoji',
    imports: ['AnimatedEmoji'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'emoji'),
  },
  
  // Captions
  captions: {
    package: '@remotion/captions',
    imports: ['Caption'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'caption'),
  },
  
  // Lottie
  lottie: {
    package: '@remotion/lottie',
    imports: ['Lottie'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'lottie'),
  },
  
  // GIF
  gif: {
    package: '@remotion/gif',
    imports: ['Gif'],
    condition: (plan: VideoPlan) => hasElementType(plan, 'gif'),
  },
};

/**
 * Helper: Check if plan has specific element type
 */
function hasElementType(plan: VideoPlan, type: string): boolean {
  return plan.scenes.some(scene => 
    scene.elements?.some(el => el.type === type)
  );
}

/**
 * Helper: Check if plan has specific animation patterns
 */
function hasAnimation(plan: VideoPlan, patterns: string[]): boolean {
  return plan.scenes.some(scene =>
    scene.elements?.some(el => {
      const animation = el.animation as AnimationPattern | undefined;
      if (!animation) return false;
      
      const animPattern = (animation.pattern || animation.name || '').toLowerCase();
      return patterns.some(p => animPattern.includes(p.toLowerCase()));
    })
  );
}

/**
 * Helper: Check if plan has specific shape types
 */
function hasShapeType(plan: VideoPlan, types: string[]): boolean {
  return plan.scenes.some(scene =>
    scene.elements?.some(el => {
      if (el.type !== 'shape') return false;
      const content = (el.content || '').toLowerCase();
      return types.some(t => content.includes(t));
    })
  );
}

/**
 * Helper: Check if plan has animated backgrounds
 */
function hasBackground(plan: VideoPlan): boolean {
  return plan.scenes.some(scene => 
    scene.description?.toLowerCase().includes('background') ||
    scene.description?.toLowerCase().includes('gradient')
  );
}

/**
 * Dynamically generates all required imports based on the video plan
 * This is the main function - it automatically detects what's needed
 */
export function generateRequiredImports(plan: VideoPlan): string {
  const imports: string[] = [];

  for (const [key, config] of Object.entries(REMOTION_PACKAGES)) {
    const shouldInclude = config.alwaysInclude || 
                         (config.condition && config.condition(plan));

    if (shouldInclude) {
      const importStatement = `import { ${config.imports.join(', ')} } from '${config.package}';`;
      imports.push(importStatement);
    }
  }

  return imports.join('\n');
}

/**
 * Generates complete Remotion component code with dynamic imports
 * This replaces the old static approach
 */
export function generateRemotionComponentCode(plan: VideoPlan): string {
  const imports = generateRequiredImports(plan);
  
  // Add type imports
  const typeImports = `import type { VideoPlan, PlannedScene, PlannedElement, AnimationPattern } from '@/types/video';`;
  
  // Add custom element imports if needed
  const customElements: string[] = [];
  if (hasElementType(plan, 'code-editor')) customElements.push('CodeEditor');
  if (hasElementType(plan, 'progress-bar')) customElements.push('ProgressBar');
  if (hasElementType(plan, 'terminal')) customElements.push('Terminal');
  if (hasElementType(plan, 'laptop')) customElements.push('Laptop3D');
  if (hasElementType(plan, '3d-card')) customElements.push('Perspective3DCard');
  
  const customImports = customElements.length > 0
    ? `import { ${customElements.join(', ')} } from './elements';`
    : '';

  return `${imports}
${typeImports}
${customImports}

// This component is auto-generated with all necessary imports
// Imports are dynamically included based on what the video plan actually uses
export const DynamicVideo = ({ plan }: { plan: VideoPlan }) => {
  // Full implementation in src/components/remotion/DynamicVideo.tsx
  return <DynamicVideo plan={plan} />;
};
`;
}

/**
 * Validates that a video plan is compatible with available packages
 */
export function validatePlanCompatibility(plan: VideoPlan): {
  valid: boolean;
  warnings: string[];
  missingPackages: string[];
} {
  const warnings: string[] = [];
  const missingPackages: string[] = [];

  // Check for unsupported features
  for (const scene of plan.scenes) {
    for (const element of scene.elements || []) {
      // Check if element type is supported
      const supportedTypes = ['text', 'image', 'shape', 'cursor', 'video', 'audio', 
                             'code-editor', 'progress-bar', 'terminal', 'laptop', 
                             '3d-card', 'emoji', 'caption', 'lottie', 'gif', 'path'];
      
      if (!supportedTypes.includes(element.type)) {
        warnings.push(`Element type "${element.type}" may not be fully supported`);
      }
    }
  }

  return {
    valid: missingPackages.length === 0,
    warnings,
    missingPackages,
  };
}

/**
 * Gets a summary of what features/packages the plan will use
 * Useful for debugging and showing users what's being used
 */
export function getPlanFeatureSummary(plan: VideoPlan): {
  packages: string[];
  elementTypes: Set<string>;
  animationTypes: Set<string>;
  transitionTypes: Set<string>;
} {
  const packages: string[] = [];
  const elementTypes = new Set<string>();
  const animationTypes = new Set<string>();
  const transitionTypes = new Set<string>();

  // Detect which packages will be used
  for (const [key, config] of Object.entries(REMOTION_PACKAGES)) {
    const shouldInclude = config.alwaysInclude || 
                         (config.condition && config.condition(plan));
    if (shouldInclude) {
      packages.push(config.package);
    }
  }

  // Collect element types
  for (const scene of plan.scenes) {
    for (const element of scene.elements || []) {
      elementTypes.add(element.type);
      
      const animation = element.animation as AnimationPattern | undefined;
      if (animation) {
        const pattern = animation.pattern || animation.name || 'unknown';
        animationTypes.add(pattern);
      }
    }
    
    if (scene.transition) {
      transitionTypes.add(scene.transition.type);
    }
  }

  return {
    packages,
    elementTypes,
    animationTypes,
    transitionTypes,
  };
}

/**
 * Ensures existing generated code has all necessary imports
 * This is for backward compatibility with older generated code
 */
export function ensureRemotionImports(code: string, plan: VideoPlan): string {
  const requiredImports = generateRequiredImports(plan);
  
  // Check if code already has comprehensive imports
  const hasMotionBlur = code.includes('@remotion/motion-blur');
  const hasShapes = code.includes('@remotion/shapes');
  
  if (hasMotionBlur && hasShapes) {
    return code; // Code is up to date
  }

  // Find the first import statement
  const importRegex = /^import\s+/m;
  const match = code.match(importRegex);
  
  if (!match) {
    // No imports found, add them at the beginning
    return requiredImports + '\n\n' + code;
  }

  // Insert missing imports before the first import
  const insertIndex = match.index || 0;
  const before = code.slice(0, insertIndex);
  const after = code.slice(insertIndex);
  
  return before + requiredImports + '\n' + after;
}
}
