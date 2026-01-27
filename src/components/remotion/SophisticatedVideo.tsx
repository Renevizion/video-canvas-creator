/**
 * Sophisticated Video Renderer (Remotion Component)
 * 
 * Renders enhanced video plans with all advanced systems:
 * - Camera paths (from serialized keyframes)
 * - Curved character animations  
 * - Parallax depth
 * - Color grading overlays
 * - Professional motion design
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

interface SophisticatedVideoProps {
  videoPlan: EnhancedVideoPlan;
}

export const SophisticatedVideo: React.FC<SophisticatedVideoProps> = ({ videoPlan }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Get camera state from serialized data OR live instance
  const cameraState = React.useMemo(() => {
    if (videoPlan.cameraPath?.getCameraState) {
      return videoPlan.cameraPath.getCameraState(frame);
    }
    if (videoPlan.cameraPathData?.keyframes) {
      return interpolateCameraKeyframes(videoPlan.cameraPathData.keyframes, frame);
    }
    return null;
  }, [videoPlan, frame]);
  
  // Calculate camera position with organic drift
  const cameraPosition = React.useMemo(() => {
    if (!cameraState) return { x: 0, y: 0, z: 100 };
    
    // Add subtle organic drift
    const driftX = Math.sin(frame * 0.02) * 3;
    const driftY = Math.cos(frame * 0.015) * 2;
    
    return {
      x: (cameraState.position?.x || 0) + driftX,
      y: (cameraState.position?.y || 0) + driftY,
      z: cameraState.position?.z || 100
    };
  }, [cameraState, frame]);
  
  // Get color grading from serialized data OR live instance
  const colorGrade = React.useMemo(() => {
    if (videoPlan.colorGrading?.getGradeAtFrame) {
      return videoPlan.colorGrading.getGradeAtFrame(frame);
    }
    if (videoPlan.colorGradingData?.keyframes) {
      return interpolateColorKeyframes(videoPlan.colorGradingData.keyframes, frame);
    }
    return null;
  }, [videoPlan, frame]);
  
  // Generate color filter string
  const colorFilter = React.useMemo(() => {
    if (!colorGrade) return '';
    // Handle both ColorGrade (live) and serialized format
    const grade = colorGrade as Record<string, any>;
    const saturation = grade.saturation != null ? (grade.saturation > 10 ? grade.saturation / 100 : grade.saturation) : 1;
    const vibrance = grade.vibrance ?? 0;
    const brightness = 1 + vibrance * 0.5;
    const temperature = grade.temperature ?? 6500;
    const hueRotate = ((temperature - 6500) / 1000) * 5;
    return `saturate(${saturation}) brightness(${brightness}) hue-rotate(${hueRotate}deg)`;
  }, [colorGrade]);
  
  // Get parallax config from serialized data OR live instance (cast to common shape)
  const parallaxConfig: Record<string, any> = videoPlan.parallaxConfigData || videoPlan.parallaxConfig || {};
  
  // Get character paths from serialized data OR live instance
  const characterPaths: Record<string, any> = videoPlan.characterPathsData || {};
  
  // Find current scene
  const currentScene = videoPlan.scenes.find(
    scene => frame >= scene.startTime * fps && frame < (scene.startTime + scene.duration) * fps
  );
  
  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }
  
  // Calculate scene progress for transitions
  const sceneStartFrame = currentScene.startTime * fps;
  const sceneDurationFrames = currentScene.duration * fps;
  const sceneProgress = (frame - sceneStartFrame) / sceneDurationFrames;
  
  // Scene transition opacity
  const transitionDuration = (currentScene.transition?.duration || 0.3) * fps;
  const enterOpacity = interpolate(
    frame - sceneStartFrame,
    [0, transitionDuration],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const exitOpacity = interpolate(
    frame - sceneStartFrame,
    [sceneDurationFrames - transitionDuration, sceneDurationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const sceneOpacity = Math.min(enterOpacity, exitOpacity);
  
  // Camera transform - handle both rotation formats
  const cameraTransform = cameraState ? (() => {
    const rotation = cameraState.rotation as Record<string, any> || {};
    const rotX = typeof rotation.x === 'number' ? rotation.x : (rotation.pitch ?? 0);
    const rotY = typeof rotation.y === 'number' ? rotation.y : (rotation.yaw ?? 0);
    return `
      perspective(1000px)
      translateX(${-cameraPosition.x * 0.5}px)
      translateY(${-cameraPosition.y * 0.5}px)
      rotateX(${rotX * 0.5}deg)
      rotateY(${rotY * 0.5}deg)
    `.replace(/\s+/g, ' ').trim();
  })() : 'none';
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* Main content with camera transform */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: cameraTransform,
          filter: colorFilter,
          transformStyle: 'preserve-3d',
          opacity: sceneOpacity
        }}
      >
        {/* Render scene elements with parallax */}
        {currentScene.elements.map((element, index) => {
          // Get parallax config for this element
          const parallaxKey = getParallaxKey(element.type);
          const layerConfig = parallaxConfig[parallaxKey] as Record<string, any> | undefined;
          
          // Calculate parallax offset - handle both ParallaxConfig and serialized format
          const moveMultiplier = layerConfig?.moveMultiplier ?? layerConfig?.speed ?? 1;
          const parallaxOffset = layerConfig ? {
            x: cameraPosition.x * moveMultiplier * 0.1,
            y: cameraPosition.y * moveMultiplier * 0.1,
            scale: layerConfig.scale ?? 1,
            blur: layerConfig.blur ?? 0,
            opacity: layerConfig.opacity ?? 1
          } : { x: 0, y: 0, scale: 1, blur: 0, opacity: 1 };
          
          // Get character path animation if exists
          const pathId = `${currentScene.id}-${element.id}`;
          const pathData = characterPaths[pathId];
          const pathState = pathData 
            ? interpolatePathKeyframes(pathData, frame - sceneStartFrame)
            : null;
          
          // Calculate element position
          const elementX = pathState ? pathState.x : element.position.x;
          const elementY = pathState ? pathState.y : element.position.y;
          const elementRotation = pathState ? pathState.rotation : 0;
          const elementScale = pathState ? pathState.scale : 1;
          
          // Apply element animation
          const animDelay = (element.animation?.delay || 0) * fps;
          const animDuration = (element.animation?.duration || 0.5) * fps;
          const animStartFrame = sceneStartFrame + animDelay;
          
          const animProgress = interpolate(
            frame,
            [animStartFrame, animStartFrame + animDuration],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          
          // Animation effects based on type
          let animOpacity = 1;
          let animScale = 1;
          let animTranslateY = 0;
          
          const animName = element.animation?.name || 'fadeIn';
          
          switch (animName) {
            case 'fadeIn':
              animOpacity = animProgress;
              break;
            case 'popIn':
            case 'scale':
            case 'zoomIn':
              animOpacity = animProgress;
              animScale = interpolate(animProgress, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' });
              break;
            case 'slideUp':
              animOpacity = animProgress;
              animTranslateY = interpolate(animProgress, [0, 1], [30, 0], { extrapolateRight: 'clamp' });
              break;
            case 'slideIn':
              animOpacity = animProgress;
              animTranslateY = interpolate(animProgress, [0, 1], [-30, 0], { extrapolateRight: 'clamp' });
              break;
            case 'float':
              animOpacity = animProgress;
              animTranslateY = Math.sin(frame * 0.05) * 5;
              break;
            case 'pulse':
              animOpacity = 0.8 + Math.sin(frame * 0.1) * 0.2;
              animScale = 1 + Math.sin(frame * 0.08) * 0.03;
              break;
            case 'rotate':
              animOpacity = animProgress;
              break;
            default:
              animOpacity = animProgress;
          }
          
          // Ken Burns effect for images
          let kenBurnsTransform = '';
          if (element.type === 'image' && element.style?.kenBurns) {
            const kbScale = interpolate(sceneProgress, [0, 1], [1, 1.1], { extrapolateRight: 'clamp' });
            const kbX = interpolate(sceneProgress, [0, 1], [0, -5], { extrapolateRight: 'clamp' });
            kenBurnsTransform = `scale(${kbScale}) translateX(${kbX}%)`;
          }
          
          // Element sizing
          const sizeWidth = typeof element.size.width === 'number' 
            ? (element.size.width > 100 ? element.size.width : `${element.size.width}%`)
            : element.size.width;
          const sizeHeight = element.size.height 
            ? (typeof element.size.height === 'number' 
              ? (element.size.height > 100 ? element.size.height : `${element.size.height}%`)
              : element.size.height)
            : 'auto';
          
          return (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: `${elementX + parallaxOffset.x}%`,
                top: `${elementY + parallaxOffset.y}%`,
                width: sizeWidth,
                height: sizeHeight,
                transform: `
                  translate(-50%, -50%)
                  rotate(${elementRotation}deg)
                  scale(${elementScale * animScale * parallaxOffset.scale})
                  translateY(${animTranslateY}px)
                  ${kenBurnsTransform}
                `.trim().replace(/\s+/g, ' '),
                opacity: animOpacity * parallaxOffset.opacity,
                filter: parallaxOffset.blur > 0 ? `blur(${parallaxOffset.blur}px)` : undefined,
                zIndex: element.position.z,
                transition: 'filter 0.3s ease'
              }}
            >
              <ElementRenderer element={element} frame={frame} sceneProgress={sceneProgress} />
            </div>
          );
        })}
      </div>
      
      {/* Color grading vignette overlay */}
      {colorGrade && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${colorGrade.vignette || 0.3}) 100%)`,
            pointerEvents: 'none',
            zIndex: 9998
          }}
        />
      )}
      
      {/* Production grade indicator (dev mode) */}
      {videoPlan.sophisticatedMetadata && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(139,92,246,0.9))',
            color: '#fff',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'monospace',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {videoPlan.sophisticatedMetadata.productionGrade} • Score: {videoPlan.sophisticatedMetadata.qualityScore}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// ELEMENT RENDERER
// ============================================================================

interface ElementRendererProps {
  element: any;
  frame: number;
  sceneProgress: number;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, frame, sceneProgress }) => {
  const baseStyle = element.style || {};
  
  switch (element.type) {
    case 'text':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: baseStyle.textAlign === 'left' ? 'flex-start' : 
                           baseStyle.textAlign === 'right' ? 'flex-end' : 'center',
            fontSize: baseStyle.fontSize || 48,
            fontWeight: baseStyle.fontWeight || 700,
            color: baseStyle.color || '#ffffff',
            textAlign: baseStyle.textAlign || 'center',
            fontFamily: baseStyle.fontFamily || 'Inter, system-ui, sans-serif',
            letterSpacing: baseStyle.letterSpacing || 0,
            lineHeight: 1.2,
            textShadow: baseStyle.textShadow || '0 2px 20px rgba(0,0,0,0.5)',
            whiteSpace: 'pre-wrap'
          }}
        >
          {element.content}
        </div>
      );
      
    case 'image':
      // Check if content is a URL or a description
      const isUrl = element.content?.startsWith('http') || element.content?.startsWith('/');
      if (isUrl) {
        return (
          <img
            src={element.content}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: baseStyle.borderRadius || 0,
              boxShadow: baseStyle.boxShadow || '0 20px 40px rgba(0,0,0,0.4)',
              filter: baseStyle.filter
            }}
          />
        );
      }
      // Placeholder for AI-generated image
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
            borderRadius: baseStyle.borderRadius || 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: baseStyle.boxShadow || '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', padding: 20 }}>
            {element.content?.slice(0, 50)}...
          </span>
        </div>
      );
      
    case 'shape':
      const shapeType = element.content?.toLowerCase() || 'rect';
      const shapeColor = baseStyle.color || baseStyle.fill || baseStyle.background || '#3b82f6';
      
      // Handle different shape types
      if (shapeType === 'circle') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: baseStyle.background || shapeColor,
              border: baseStyle.border,
              boxShadow: baseStyle.boxShadow
            }}
          />
        );
      }
      
      if (shapeType === 'triangle') {
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '50px solid transparent',
              borderRight: '50px solid transparent',
              borderBottom: `86px solid ${shapeColor}`
            }}
          />
        );
      }
      
      if (shapeType === 'star' || shapeType === 'hexagon') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: baseStyle.background || shapeColor,
              clipPath: shapeType === 'star' 
                ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              boxShadow: baseStyle.boxShadow
            }}
          />
        );
      }
      
      // Default rectangle
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: baseStyle.background || shapeColor,
            borderRadius: baseStyle.borderRadius || 0,
            border: baseStyle.border,
            boxShadow: baseStyle.boxShadow,
            backdropFilter: baseStyle.backdropFilter
          }}
        />
      );
      
    case '3d-card':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: baseStyle.background || 'rgba(255,255,255,0.1)',
            backdropFilter: baseStyle.backdropFilter || 'blur(20px)',
            borderRadius: baseStyle.borderRadius || 16,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 16,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}
        >
          {element.content}
        </div>
      );
      
    case 'code-editor':
    case 'terminal':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#1e1e2e',
            borderRadius: 12,
            padding: 16,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            color: '#a6e3a1',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ color: '#6c7086', marginBottom: 8 }}>
            {element.type === 'terminal' ? '$ ' : '// '}
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {element.content}
          </pre>
        </div>
      );
      
    case 'progress':
      const progress = interpolate(sceneProgress, [0, 1], [0, 100], { extrapolateRight: 'clamp' });
      return (
        <div
          style={{
            width: '100%',
            height: 8,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: 4,
              transition: 'width 0.1s ease'
            }}
          />
        </div>
      );
      
    default:
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(255,255,255,0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)'
          }}
        >
          {element.type}: {String(element.content).slice(0, 30)}
        </div>
      );
  }
};

// ============================================================================
// INTERPOLATION HELPERS
// ============================================================================

interface CameraKeyframe {
  frame: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  fov?: number;
}

function interpolateCameraKeyframes(keyframes: CameraKeyframe[], frame: number) {
  if (!keyframes || keyframes.length === 0) return null;
  if (keyframes.length === 1) return keyframes[0];
  
  // Find surrounding keyframes
  let prevKf = keyframes[0];
  let nextKf = keyframes[keyframes.length - 1];
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
      prevKf = keyframes[i];
      nextKf = keyframes[i + 1];
      break;
    }
  }
  
  const progress = nextKf.frame === prevKf.frame 
    ? 1 
    : (frame - prevKf.frame) / (nextKf.frame - prevKf.frame);
  
  const smoothProgress = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  
  return {
    position: {
      x: lerp(prevKf.position.x, nextKf.position.x, smoothProgress),
      y: lerp(prevKf.position.y, nextKf.position.y, smoothProgress),
      z: lerp(prevKf.position.z, nextKf.position.z, smoothProgress)
    },
    rotation: {
      x: lerp(prevKf.rotation.x, nextKf.rotation.x, smoothProgress),
      y: lerp(prevKf.rotation.y, nextKf.rotation.y, smoothProgress),
      z: lerp(prevKf.rotation?.z || 0, nextKf.rotation?.z || 0, smoothProgress)
    },
    fov: lerp(prevKf.fov || 60, nextKf.fov || 60, smoothProgress)
  };
}

interface ColorKeyframe {
  frame: number;
  grade: {
    temperature?: number;
    tint?: number;
    saturation?: number;
    vibrance?: number;
    vignette?: number;
  };
}

function interpolateColorKeyframes(keyframes: ColorKeyframe[], frame: number) {
  if (!keyframes || keyframes.length === 0) return null;
  if (keyframes.length === 1) return keyframes[0].grade;
  
  let prevKf = keyframes[0];
  let nextKf = keyframes[keyframes.length - 1];
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
      prevKf = keyframes[i];
      nextKf = keyframes[i + 1];
      break;
    }
  }
  
  const progress = nextKf.frame === prevKf.frame 
    ? 1 
    : (frame - prevKf.frame) / (nextKf.frame - prevKf.frame);
  
  const smoothProgress = easeInOutCubic(Math.max(0, Math.min(1, progress)));
  
  return {
    temperature: lerp(prevKf.grade.temperature || 6500, nextKf.grade.temperature || 6500, smoothProgress),
    tint: lerp(prevKf.grade.tint || 0, nextKf.grade.tint || 0, smoothProgress),
    saturation: lerp(prevKf.grade.saturation || 1, nextKf.grade.saturation || 1, smoothProgress),
    vibrance: lerp(prevKf.grade.vibrance || 0, nextKf.grade.vibrance || 0, smoothProgress),
    vignette: lerp(prevKf.grade.vignette || 0.2, nextKf.grade.vignette || 0.2, smoothProgress)
  };
}

interface PathKeyframe {
  x: number;
  y: number;
  frame: number;
}

function interpolatePathKeyframes(pathData: any, localFrame: number) {
  const points: PathKeyframe[] = pathData.points || [];
  if (points.length < 2) return null;
  
  // Find position on bezier curve
  const totalDuration = points[points.length - 1].frame;
  const t = Math.max(0, Math.min(1, localFrame / totalDuration));
  
  // Simple bezier interpolation
  const point = bezierPoint(points, t);
  
  return {
    x: point.x,
    y: point.y,
    rotation: pathData.autoRotate ? t * 5 : 0,
    scale: pathData.scaleWithDistance ? 1 + t * 0.05 : 1
  };
}

function bezierPoint(points: PathKeyframe[], t: number): { x: number; y: number } {
  if (points.length === 1) return { x: points[0].x, y: points[0].y };
  
  const newPoints: PathKeyframe[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push({
      x: lerp(points[i].x, points[i + 1].x, t),
      y: lerp(points[i].y, points[i + 1].y, t),
      frame: 0
    });
  }
  
  return bezierPoint(newPoints, t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getParallaxKey(elementType: string): string {
  const parallaxMapping: Record<string, string> = {
    'text': 'ui',
    'image': 'characters',
    'shape': 'background',
    'lottie': 'characters',
    'phone-mockup': 'characters',
    'laptop': 'characters',
    'particle-field': 'effects',
    'audio-visualization': 'effects',
    '3d-card': 'midground',
    'code-editor': 'characters',
    'terminal': 'characters',
    'progress': 'ui'
  };
  
  return parallaxMapping[elementType] || 'ui';
}

export default SophisticatedVideo;