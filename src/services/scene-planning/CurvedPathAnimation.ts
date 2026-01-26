/**
 * Curved Path Animation System
 * 
 * Implements Bézier curve path animations for characters and elements
 * following curved trajectories through space.
 * 
 * Based on analysis showing:
 * - Astronaut and fish following curved paths
 * - Smooth motion along Bézier curves
 * - Rotation aligned with movement direction
 * - Scale changes based on distance from camera
 */

import { interpolate, Easing } from 'remotion';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface BezierCurve {
  start: Point2D;
  controlPoint1: Point2D;
  controlPoint2: Point2D;
  end: Point2D;
}

export interface PathAnimationOptions {
  path: BezierCurve | string; // Bezier curve or SVG path string
  duration: number; // in frames
  startFrame: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  rotateToDirection?: boolean;
  scaleWithDistance?: boolean;
  minScale?: number;
  maxScale?: number;
}

export interface PathPoint {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  progress: number;
}

// ============================================================================
// BEZIER CURVE CALCULATIONS
// ============================================================================

/**
 * Calculate point on cubic Bézier curve at time t (0-1)
 */
export function cubicBezierPoint(
  t: number,
  start: Point2D,
  cp1: Point2D,
  cp2: Point2D,
  end: Point2D
): Point2D {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  
  return {
    x: uuu * start.x + 3 * uu * t * cp1.x + 3 * u * tt * cp2.x + ttt * end.x,
    y: uuu * start.y + 3 * uu * t * cp1.y + 3 * u * tt * cp2.y + ttt * end.y
  };
}

/**
 * Calculate tangent (derivative) of cubic Bézier curve at time t
 * Used to determine rotation angle
 */
export function cubicBezierTangent(
  t: number,
  start: Point2D,
  cp1: Point2D,
  cp2: Point2D,
  end: Point2D
): Point2D {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  
  return {
    x: 3 * uu * (cp1.x - start.x) + 6 * u * t * (cp2.x - cp1.x) + 3 * tt * (end.x - cp2.x),
    y: 3 * uu * (cp1.y - start.y) + 6 * u * t * (cp2.y - cp1.y) + 3 * tt * (end.y - cp2.y)
  };
}

/**
 * Get rotation angle from tangent vector
 */
export function getRotationFromTangent(tangent: Point2D): number {
  return (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
}

// ============================================================================
// PATH ANIMATION SYSTEM
// ============================================================================

export class CurvedPathAnimation {
  private options: Required<PathAnimationOptions>;
  private curve: BezierCurve;
  
  constructor(options: PathAnimationOptions) {
    this.options = {
      ...options,
      easing: options.easing || 'easeInOut',
      rotateToDirection: options.rotateToDirection !== false,
      scaleWithDistance: options.scaleWithDistance !== false,
      minScale: options.minScale || 0.5,
      maxScale: options.maxScale || 1.5
    };
    
    // Parse path
    if (typeof options.path === 'string') {
      this.curve = this.parseSVGPath(options.path);
    } else {
      this.curve = options.path;
    }
  }
  
  /**
   * Get position, rotation, and scale at a given frame
   */
  getStateAtFrame(frame: number): PathPoint {
    const localFrame = frame - this.options.startFrame;
    
    // Before animation starts
    if (localFrame < 0) {
      const point = cubicBezierPoint(0, this.curve.start, this.curve.controlPoint1, this.curve.controlPoint2, this.curve.end);
      return {
        ...point,
        rotation: 0,
        scale: this.options.minScale,
        progress: 0
      };
    }
    
    // After animation ends
    if (localFrame > this.options.duration) {
      const point = cubicBezierPoint(1, this.curve.start, this.curve.controlPoint1, this.curve.controlPoint2, this.curve.end);
      const tangent = cubicBezierTangent(1, this.curve.start, this.curve.controlPoint1, this.curve.controlPoint2, this.curve.end);
      return {
        ...point,
        rotation: this.options.rotateToDirection ? getRotationFromTangent(tangent) : 0,
        scale: this.options.maxScale,
        progress: 1
      };
    }
    
    // During animation
    const rawProgress = localFrame / this.options.duration;
    const easedProgress = this.applyEasing(rawProgress);
    
    // Get position on curve
    const point = cubicBezierPoint(
      easedProgress,
      this.curve.start,
      this.curve.controlPoint1,
      this.curve.controlPoint2,
      this.curve.end
    );
    
    // Get rotation from tangent
    let rotation = 0;
    if (this.options.rotateToDirection) {
      const tangent = cubicBezierTangent(
        easedProgress,
        this.curve.start,
        this.curve.controlPoint1,
        this.curve.controlPoint2,
        this.curve.end
      );
      rotation = getRotationFromTangent(tangent);
    }
    
    // Calculate scale based on progress (simulates depth)
    let scale = 1;
    if (this.options.scaleWithDistance) {
      // Scale up as moving forward (simulating coming closer to camera)
      scale = interpolate(
        easedProgress,
        [0, 1],
        [this.options.minScale, this.options.maxScale]
      );
    }
    
    return {
      ...point,
      rotation,
      scale,
      progress: easedProgress
    };
  }
  
  /**
   * Apply easing to progress
   */
  private applyEasing(progress: number): number {
    switch (this.options.easing) {
      case 'linear':
        return progress;
      case 'easeIn':
        return Easing.in(Easing.cubic)(progress);
      case 'easeOut':
        return Easing.out(Easing.cubic)(progress);
      case 'easeInOut':
        return Easing.inOut(Easing.ease)(progress);
      default:
        return progress;
    }
  }
  
  /**
   * Parse simple SVG path string (supports M, Q commands for cubic Bezier)
   * Format: "M x,y Q cx1,cy1 cx2,cy2 ex,ey" (8 values for cubic Bezier)
   */
  private parseSVGPath(pathString: string): BezierCurve {
    // Parser for cubic Bezier paths with 2 control points
    // Format: "M startX,startY Q cp1x,cp1y cp2x,cp2y endX,endY"
    const match = pathString.match(/M\s*([\d.]+)[,\s]+([\d.]+)\s*Q\s*([\d.]+)[,\s]+([\d.]+)\s*([\d.]+)[,\s]+([\d.]+)\s*([\d.]+)[,\s]+([\d.]+)/);
    
    if (match) {
      return {
        start: { x: parseFloat(match[1]), y: parseFloat(match[2]) },
        controlPoint1: { x: parseFloat(match[3]), y: parseFloat(match[4]) },
        controlPoint2: { x: parseFloat(match[5]), y: parseFloat(match[6]) },
        end: { x: parseFloat(match[7]), y: parseFloat(match[8]) }
      };
    }
    
    // Fallback to straight line
    return {
      start: { x: 0, y: 0 },
      controlPoint1: { x: 100, y: 0 },
      controlPoint2: { x: 200, y: 0 },
      end: { x: 300, y: 0 }
    };
  }
  
  /**
   * Get CSS transform string for element
   */
  getTransform(state: PathPoint): string {
    return `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg) scale(${state.scale})`;
  }
}

// ============================================================================
// PRESET PATH GENERATORS
// ============================================================================

/**
 * Create arc path (like character floating in an arc)
 */
export function createArcPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  height: number
): BezierCurve {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - height;
  
  return {
    start: { x: startX, y: startY },
    controlPoint1: { x: midX - (endX - startX) / 4, y: midY },
    controlPoint2: { x: midX + (endX - startX) / 4, y: midY },
    end: { x: endX, y: endY }
  };
}

/**
 * Create S-curve path (smooth winding path)
 */
export function createSCurvePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  amplitude: number
): BezierCurve {
  const dx = endX - startX;
  const dy = endY - startY;
  
  return {
    start: { x: startX, y: startY },
    controlPoint1: { x: startX + dx * 0.33, y: startY + amplitude },
    controlPoint2: { x: startX + dx * 0.66, y: endY - amplitude },
    end: { x: endX, y: endY }
  };
}

/**
 * Create circular orbit path
 */
export function createCircularPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number = 0,
  endAngle: number = 360
): BezierCurve {
  // Approximate circle with cubic Bezier
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const startX = centerX + Math.cos(startRad) * radius;
  const startY = centerY + Math.sin(startRad) * radius;
  const endX = centerX + Math.cos(endRad) * radius;
  const endY = centerY + Math.sin(endRad) * radius;
  
  // Control points for circular arc
  const controlDistance = radius * 0.552;
  const midAngle = (startRad + endRad) / 2;
  
  return {
    start: { x: startX, y: startY },
    controlPoint1: {
      x: startX + Math.cos(startRad + Math.PI / 2) * controlDistance,
      y: startY + Math.sin(startRad + Math.PI / 2) * controlDistance
    },
    controlPoint2: {
      x: endX + Math.cos(endRad - Math.PI / 2) * controlDistance,
      y: endY + Math.sin(endRad - Math.PI / 2) * controlDistance
    },
    end: { x: endX, y: endY }
  };
}

/**
 * Create wave path (sinusoidal movement)
 */
export function createWavePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  waves: number,
  amplitude: number
): BezierCurve {
  const dx = endX - startX;
  const waveLength = dx / waves;
  
  return {
    start: { x: startX, y: startY },
    controlPoint1: {
      x: startX + waveLength * 0.25,
      y: startY + amplitude
    },
    controlPoint2: {
      x: startX + waveLength * 0.75,
      y: startY - amplitude
    },
    end: { x: startX + waveLength, y: startY }
  };
}

// ============================================================================
// MULTI-PATH ORCHESTRATION
// ============================================================================

/**
 * Coordinate multiple path animations
 */
export class MultiPathOrchestrator {
  private paths: Map<string, CurvedPathAnimation> = new Map();
  
  addPath(id: string, animation: CurvedPathAnimation): void {
    this.paths.set(id, animation);
  }
  
  getStateAtFrame(id: string, frame: number): PathPoint | null {
    const animation = this.paths.get(id);
    return animation ? animation.getStateAtFrame(frame) : null;
  }
  
  getAllStatesAtFrame(frame: number): Map<string, PathPoint> {
    const states = new Map<string, PathPoint>();
    this.paths.forEach((animation, id) => {
      states.set(id, animation.getStateAtFrame(frame));
    });
    return states;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type Point2D,
  type Point3D,
  type BezierCurve,
  type PathAnimationOptions,
  type PathPoint
};
