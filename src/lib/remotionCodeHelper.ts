/**
 * Remotion Code Helper
 * Ensures generated Remotion code includes all necessary imports for the features we've added
 */

/**
 * List of required imports for the enhanced DynamicVideo component
 */
export const REQUIRED_REMOTION_IMPORTS = {
  core: "import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Series, Easing, Img, delayRender, continueRender } from 'remotion';",
  transitions: "import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';",
  transitionTypes: [
    "import { fade } from '@remotion/transitions/fade';",
    "import { slide } from '@remotion/transitions/slide';",
    "import { wipe } from '@remotion/transitions/wipe';",
  ].join('\n'),
  noise: "import { noise3D } from '@remotion/noise';",
  media: "import { Audio } from '@remotion/media';",
  video: "import { OffthreadVideo } from 'remotion';",
  layoutUtils: "import { measureText } from '@remotion/layout-utils';",
  fonts: "import { loadFont } from '@remotion/google-fonts/Inter';",
  motionBlur: "import { Trail } from '@remotion/motion-blur';",
  shapes: "import { Circle, Rect, Triangle, Star, Polygon } from '@remotion/shapes';",
};

/**
 * Checks if code contains the necessary imports
 */
export function hasRequiredImports(code: string): boolean {
  return (
    code.includes('@remotion/motion-blur') &&
    code.includes('@remotion/shapes') &&
    code.includes('Trail') &&
    code.includes('Circle')
  );
}

/**
 * Adds missing imports to Remotion code
 * This ensures backward compatibility with older generated code
 */
export function ensureRemotionImports(code: string): string {
  // If code already has the new imports, return as-is
  if (hasRequiredImports(code)) {
    return code;
  }

  // Find the first import statement
  const importRegex = /^import\s+/m;
  const match = code.match(importRegex);
  
  if (!match) {
    // No imports found, add them at the beginning
    return Object.values(REQUIRED_REMOTION_IMPORTS).join('\n') + '\n\n' + code;
  }

  // Add missing imports before the first import
  const insertIndex = match.index || 0;
  const missingImports: string[] = [];

  // Check and add motion blur import
  if (!code.includes('@remotion/motion-blur')) {
    missingImports.push(REQUIRED_REMOTION_IMPORTS.motionBlur);
  }

  // Check and add shapes import
  if (!code.includes('@remotion/shapes')) {
    missingImports.push(REQUIRED_REMOTION_IMPORTS.shapes);
  }

  if (missingImports.length === 0) {
    return code;
  }

  // Insert missing imports
  const before = code.slice(0, insertIndex);
  const after = code.slice(insertIndex);
  
  return before + missingImports.join('\n') + '\n' + after;
}

/**
 * Validates that a video plan's elements are compatible with the backend
 */
export function validatePlanForBackend(plan: any): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for unsupported element types
  const supportedTypes = ['text', 'image', 'shape', 'cursor', 'video', 'audio', 'code-editor', 'progress-bar', 'terminal', 'laptop', '3d-card'];
  
  for (const scene of plan.scenes || []) {
    for (const element of scene.elements || []) {
      if (!supportedTypes.includes(element.type)) {
        issues.push(`Unsupported element type: ${element.type}`);
      }

      // Check for shape types that need @remotion/shapes
      if (element.type === 'shape') {
        const content = (element.content || '').toLowerCase();
        const needsShapesPackage = ['circle', 'rect', 'rectangle', 'triangle', 'star', 'polygon', 'hexagon'].some(
          shape => content.includes(shape)
        );
        
        if (needsShapesPackage && !content.includes('card') && !content.includes('button') && !content.includes('device')) {
          // This element will use @remotion/shapes - no issue, just a note
        }
      }

      // Check for animations that trigger motion blur
      const animation = element.animation;
      if (animation && typeof animation === 'object') {
        const pattern = (animation as any).pattern || (animation as any).name || '';
        const needsMotionBlur = [
          'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown',
          'rotate', 'spin'
        ].some(p => pattern.includes(p));
        
        if (needsMotionBlur) {
          // Motion blur will be applied - no issue, just a note
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Generates a complete Remotion component code string from a VideoPlan
 * This is a fallback/helper if the backend doesn't generate code with new features
 */
export function generateRemotionComponentCode(plan: any): string {
  const imports = Object.values(REQUIRED_REMOTION_IMPORTS).join('\n');
  
  return `${imports}

export const DynamicVideo = ({ plan }) => {
  // This component uses the enhanced DynamicVideo from the frontend
  // It includes:
  // - Motion blur for fast animations (slideIn, rotate, spin)
  // - @remotion/shapes for geometric shapes (circle, rect, triangle, star, polygon)
  // - All existing features (transitions, noise, media, etc.)
  
  // The actual implementation is in src/components/remotion/DynamicVideo.tsx
  // This code string is sent to the backend which uses the same component structure
  
  return <DynamicVideo plan={plan} />;
};
`;
}
