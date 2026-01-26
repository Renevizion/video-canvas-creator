/**
 * Advanced Camera Path System
 * 
 * Implements sophisticated camera movements seen in professional 3D animated videos:
 * - Continuous camera paths (single-take illusion)
 * - Orbital movements
 * - Forward tracking with variable speed
 * - Smooth easing and transitions
 * - 3D perspective transforms
 * 
 * Based on analysis of "Animated Video I love.mov" showing:
 * - 83-second continuous shot
 * - Camera orbit (frames 1-20)
 * - Forward dolly movement (frames 100-497)
 * - Speed variations for dramatic effect
 */

import { interpolate, spring, Easing } from 'remotion';
import type { SpringConfig } from 'remotion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraRotation {
  pitch: number; // X-axis rotation (up/down)
  yaw: number;   // Y-axis rotation (left/right)
  roll: number;  // Z-axis rotation (tilt)
}

export interface CameraState {
  position: CameraPosition;
  rotation: CameraRotation;
  fov: number; // Field of view
}

export interface CameraKeyframe {
  frame: number;
  position: CameraPosition;
  rotation?: CameraRotation;
  fov?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
}

export interface CameraPathOptions {
  keyframes: CameraKeyframe[];
  smoothness?: number; // 0-1, higher = smoother interpolation
  fps?: number;
}

// ============================================================================
// CAMERA PATH SYSTEM
// ============================================================================

export class AdvancedCameraPath {
  private keyframes: CameraKeyframe[];
  private fps: number;
  private smoothness: number;
  
  constructor(options: CameraPathOptions) {
    this.keyframes = options.keyframes.sort((a, b) => a.frame - b.frame);
    this.fps = options.fps || 30;
    this.smoothness = options.smoothness || 0.5;
  }
  
  /**
   * Get camera state at a specific frame
   */
  getCameraState(frame: number): CameraState {
    // Find surrounding keyframes
    const { prev, next } = this.findSurroundingKeyframes(frame);
    
    if (!next) {
      // After last keyframe, use last keyframe values
      return this.keyframeToState(prev);
    }
    
    if (!prev) {
      // Before first keyframe, use first keyframe values
      return this.keyframeToState(next);
    }
    
    // Interpolate between keyframes
    const progress = (frame - prev.frame) / (next.frame - prev.frame);
    const easedProgress = this.applyEasing(progress, next.easing || 'easeInOut');
    
    return {
      position: {
        x: interpolate(easedProgress, [0, 1], [prev.position.x, next.position.x]),
        y: interpolate(easedProgress, [0, 1], [prev.position.y, next.position.y]),
        z: interpolate(easedProgress, [0, 1], [prev.position.z, next.position.z])
      },
      rotation: {
        pitch: interpolate(
          easedProgress,
          [0, 1],
          [prev.rotation?.pitch || 0, next.rotation?.pitch || 0]
        ),
        yaw: interpolate(
          easedProgress,
          [0, 1],
          [prev.rotation?.yaw || 0, next.rotation?.yaw || 0]
        ),
        roll: interpolate(
          easedProgress,
          [0, 1],
          [prev.rotation?.roll || 0, next.rotation?.roll || 0]
        )
      },
      fov: interpolate(
        easedProgress,
        [0, 1],
        [prev.fov || 60, next.fov || 60]
      )
    };
  }
  
  /**
   * Find keyframes surrounding a given frame
   */
  private findSurroundingKeyframes(frame: number): {
    prev: CameraKeyframe | null;
    next: CameraKeyframe | null;
  } {
    let prev: CameraKeyframe | null = null;
    let next: CameraKeyframe | null = null;
    
    for (let i = 0; i < this.keyframes.length; i++) {
      if (this.keyframes[i].frame <= frame) {
        prev = this.keyframes[i];
      }
      if (this.keyframes[i].frame > frame && !next) {
        next = this.keyframes[i];
        break;
      }
    }
    
    return { prev, next };
  }
  
  /**
   * Apply easing function to progress value
   */
  private applyEasing(progress: number, easing: CameraKeyframe['easing']): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'easeIn':
        return Easing.in(Easing.cubic)(progress);
      case 'easeOut':
        return Easing.out(Easing.cubic)(progress);
      case 'easeInOut':
        return Easing.inOut(Easing.ease)(progress);
      case 'spring':
        // Spring easing approximation
        return 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2);
      default:
        return Easing.inOut(Easing.ease)(progress);
    }
  }
  
  /**
   * Convert keyframe to full camera state
   */
  private keyframeToState(keyframe: CameraKeyframe): CameraState {
    return {
      position: keyframe.position,
      rotation: keyframe.rotation || { pitch: 0, yaw: 0, roll: 0 },
      fov: keyframe.fov || 60
    };
  }
  
  /**
   * Get CSS transform for camera state
   */
  getCameraTransform(state: CameraState): string {
    return `
      perspective(1000px)
      translateZ(${state.position.z}px)
      translateX(${state.position.x}px)
      translateY(${state.position.y}px)
      rotateX(${state.rotation.pitch}deg)
      rotateY(${state.rotation.yaw}deg)
      rotateZ(${state.rotation.roll}deg)
    `.trim().replace(/\s+/g, ' ');
  }
}

// ============================================================================
// PRESET CAMERA PATHS
// ============================================================================

/**
 * Orbital camera movement (like opening of reference video)
 * Circles around a point, revealing subject from all angles
 */
export function createOrbitalPath(options: {
  center: CameraPosition;
  radius: number;
  startAngle?: number;
  endAngle?: number;
  duration: number; // in frames
  fps?: number;
}): AdvancedCameraPath {
  const { center, radius, duration, fps = 30 } = options;
  const startAngle = options.startAngle || 180;
  const endAngle = options.endAngle || 270;
  
  const keyframes: CameraKeyframe[] = [
    {
      frame: 0,
      position: {
        x: center.x + Math.cos((startAngle * Math.PI) / 180) * radius,
        y: center.y,
        z: center.z + Math.sin((startAngle * Math.PI) / 180) * radius
      },
      rotation: {
        pitch: 0,
        yaw: -startAngle,
        roll: 0
      },
      easing: 'easeOut'
    },
    {
      frame: duration,
      position: {
        x: center.x + Math.cos((endAngle * Math.PI) / 180) * radius,
        y: center.y,
        z: center.z + Math.sin((endAngle * Math.PI) / 180) * radius
      },
      rotation: {
        pitch: 0,
        yaw: -endAngle,
        roll: 0
      }
    }
  ];
  
  return new AdvancedCameraPath({ keyframes, fps });
}

/**
 * Forward tracking camera (like main section of reference video)
 * Moves forward through space with variable speed
 */
export function createForwardTrackingPath(options: {
  startZ: number;
  endZ: number;
  duration: number; // in frames
  speedVariations?: Array<{ frame: number; speedMultiplier: number }>;
  verticalMovement?: Array<{ frame: number; y: number }>;
  fps?: number;
}): AdvancedCameraPath {
  const { startZ, endZ, duration, fps = 30 } = options;
  const speedVariations = options.speedVariations || [];
  const verticalMovement = options.verticalMovement || [];
  
  // Create keyframes
  const keyframes: CameraKeyframe[] = [
    {
      frame: 0,
      position: { x: 0, y: 0, z: startZ },
      easing: 'easeInOut'
    }
  ];
  
  // Add speed variation keyframes
  speedVariations.forEach(variation => {
    const progress = variation.frame / duration;
    const z = startZ + (endZ - startZ) * progress;
    const y = verticalMovement.find(v => v.frame === variation.frame)?.y || 0;
    
    keyframes.push({
      frame: variation.frame,
      position: { x: 0, y, z },
      easing: variation.speedMultiplier > 1 ? 'easeIn' : 'easeOut'
    });
  });
  
  // Add end keyframe
  const finalY = verticalMovement.find(v => v.frame === duration)?.y || 0;
  keyframes.push({
    frame: duration,
    position: { x: 0, y: finalY, z: endZ }
  });
  
  return new AdvancedCameraPath({ keyframes, fps });
}

/**
 * Dolly zoom effect (Hitchcock zoom)
 * Creates unsettling or dramatic effect by zooming while moving
 */
export function createDollyZoomPath(options: {
  startZ: number;
  endZ: number;
  startFOV: number;
  endFOV: number;
  duration: number;
  fps?: number;
}): AdvancedCameraPath {
  const { startZ, endZ, startFOV, endFOV, duration, fps = 30 } = options;
  
  const keyframes: CameraKeyframe[] = [
    {
      frame: 0,
      position: { x: 0, y: 0, z: startZ },
      fov: startFOV,
      easing: 'easeInOut'
    },
    {
      frame: duration,
      position: { x: 0, y: 0, z: endZ },
      fov: endFOV
    }
  ];
  
  return new AdvancedCameraPath({ keyframes, fps });
}

// ============================================================================
// CAMERA SHAKE EFFECTS
// ============================================================================

/**
 * Add camera shake for impact moments
 */
export function applyCameraShake(
  basePosition: CameraPosition,
  frame: number,
  intensity: number,
  duration: number
): CameraPosition {
  if (frame > duration) {
    return basePosition;
  }
  
  const progress = frame / duration;
  const decay = 1 - Easing.out(Easing.cubic)(progress);
  const frequency = 20; // Shake frequency
  
  return {
    x: basePosition.x + Math.sin(frame * frequency) * intensity * decay,
    y: basePosition.y + Math.cos(frame * frequency * 1.3) * intensity * decay,
    z: basePosition.z + Math.sin(frame * frequency * 0.7) * intensity * decay * 0.5
  };
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export {
  type CameraPosition,
  type CameraRotation,
  type CameraState,
  type CameraKeyframe,
  type CameraPathOptions
};
