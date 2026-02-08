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
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

// Import professional element components
import { PhoneMockup } from './elements/PhoneMockup';
import { DataVisualization } from './elements/DataVisualization';
import { LogoGrid } from './elements/LogoGrid';
import { CodeEditor } from './elements/CodeEditor';

interface SophisticatedVideoProps {
  videoPlan: EnhancedVideoPlan;
}

export const SophisticatedVideo: React.FC<SophisticatedVideoProps> = ({ videoPlan }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Camera rotation values coming from serialized data are typically in radians.
  // The renderer expects degrees for CSS transforms.
  const toDegrees = React.useCallback((value: number) => {
    // If it looks like radians (0..~6.3), convert. Otherwise assume already degrees.
    const abs = Math.abs(value);
    const looksLikeRadians = abs <= Math.PI * 2 + 0.001;
    return looksLikeRadians ? (value * 180) / Math.PI : value;
  }, []);
  
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
  // Even without cameraState, create subtle drift to show parallax effect
  const cameraPosition = React.useMemo(() => {
    // Create organic camera drift using multiple sine waves for natural movement
    const driftX = Math.sin(frame * 0.02) * 8 + Math.sin(frame * 0.007) * 5;
    const driftY = Math.cos(frame * 0.015) * 6 + Math.cos(frame * 0.01) * 4;
    
    if (cameraState) {
      return {
        x: (cameraState.position?.x || 0) + driftX,
        y: (cameraState.position?.y || 0) + driftY,
        z: cameraState.position?.z || 100
      };
    }
    
    // Default drift even without camera state - enables parallax for all videos
    return { x: driftX, y: driftY, z: 100 };
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
    const rotXRaw = typeof rotation.x === 'number' ? rotation.x : (rotation.pitch ?? 0);
    const rotYRaw = typeof rotation.y === 'number' ? rotation.y : (rotation.yaw ?? 0);

    // Convert radians -> degrees when applicable, then apply a subtle multiplier.
    // (The previous implementation effectively treated radians as degrees and/or scaled too aggressively.)
    const rotX = toDegrees(rotXRaw);
    const rotY = toDegrees(rotYRaw);
    const ROTATION_MULT = 0.08; // keep cinematic motion, avoid rotating the whole frame out of view

    return `
      perspective(1000px)
      translateX(${-cameraPosition.x * 0.5}px)
      translateY(${-cameraPosition.y * 0.5}px)
      rotateX(${rotX * ROTATION_MULT}deg)
      rotateY(${rotY * ROTATION_MULT}deg)
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
          
          // Calculate parallax based on z-position: lower z = slower movement (background), higher z = faster (foreground)
          // This creates the depth illusion even without explicit parallaxConfig
          const zDepth = element.position.z ?? 1;
          // Much stronger multipliers for visible parallax effect
          const autoMoveMultiplier = zDepth < 0.3 ? 0.15 : zDepth < 0.5 ? 0.3 : zDepth < 1 ? 0.6 : zDepth < 1.5 ? 1.2 : 2;
          
          // Use explicit config if available, otherwise use auto-calculated based on z
          const moveMultiplier = layerConfig?.moveMultiplier ?? layerConfig?.speed ?? autoMoveMultiplier;
          
          // Calculate parallax offset using camera drift - stronger multiplier for visible motion
          const parallaxOffset = {
            x: cameraPosition.x * moveMultiplier * 0.4, // Increased from 0.15 to 0.4
            y: cameraPosition.y * moveMultiplier * 0.4,
            scale: layerConfig?.scale ?? 1,
            blur: layerConfig?.blur ?? (zDepth < 0.3 ? 2 : 0), // stronger blur on far background
            opacity: layerConfig?.opacity ?? 1
          };
          
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
          
          // Element sizing - be consistent: if either dimension > 100, treat both as pixels
          const widthNum = typeof element.size.width === 'number' ? element.size.width : 100;
          const heightNum = typeof element.size.height === 'number' ? element.size.height : 100;
          const usePixels = widthNum > 100 || heightNum > 100;
          
          const sizeWidth = typeof element.size.width === 'number' 
            ? (usePixels ? `${element.size.width}px` : `${element.size.width}%`)
            : element.size.width;
          const sizeHeight = element.size.height 
            ? (typeof element.size.height === 'number' 
              ? (usePixels ? `${element.size.height}px` : `${element.size.height}%`)
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
      
      {/* (Removed on-canvas debug badge for a more polished preview) */}
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
      const isUrl =
        element.content?.startsWith('http') ||
        element.content?.startsWith('/') ||
        element.content?.startsWith('data:');
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
      // Placeholder for AI-generated image.
      // IMPORTANT: Never render the prompt text on-canvas (it looks like a bug to users).
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
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      );
      
    case 'shape':
      const shapeContent = element.content || '';
      const shapeType = shapeContent.toLowerCase();
      const shapeColor = baseStyle.color || baseStyle.fill || baseStyle.background || '#3b82f6';
      
      // Check if content is emoji or text that should be displayed
      const isEmoji = /^[\p{Emoji}]+$/u.test(shapeContent);
      const isShortText = shapeContent.length > 0 && shapeContent.length <= 50 && !['circle', 'rect', 'triangle', 'star', 'hexagon', ''].includes(shapeType);
      
      if (isEmoji || isShortText) {
        // Render as a styled container with text/emoji content
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: baseStyle.background || 'transparent',
              borderRadius: baseStyle.borderRadius || 0,
              border: baseStyle.border,
              boxShadow: baseStyle.boxShadow,
              backdropFilter: baseStyle.backdropFilter,
              filter: baseStyle.filter,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: baseStyle.fontSize || 48,
              fontWeight: baseStyle.fontWeight || 600,
              color: baseStyle.color || 'white',
              fontFamily: 'Inter, system-ui, sans-serif',
              opacity: baseStyle.opacity ?? 1,
            }}
          >
            {shapeContent}
          </div>
        );
      }
      
      // Handle pure shape types
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
      
      // Default rectangle (including empty shapes for gradients/nebulas)
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: baseStyle.background || shapeColor,
            borderRadius: baseStyle.borderRadius || 0,
            border: baseStyle.border,
            boxShadow: baseStyle.boxShadow,
            backdropFilter: baseStyle.backdropFilter,
            filter: baseStyle.filter,
            opacity: baseStyle.opacity ?? 1,
          }}
        />
      );
      
    case '3d-card':
      // Get 3D rotation values from style
      const rotateY = baseStyle.rotateY || 0;
      const rotateX = baseStyle.rotateX || 0;
      
      // Animate the rotation with spring physics
      const cardSpring = spring({
        fps: 30,
        frame,
        config: { damping: 20, stiffness: 80 },
      });
      
      const animatedRotateY = interpolate(cardSpring, [0, 1], [rotateY * 2, rotateY]);
      const animatedRotateX = interpolate(cardSpring, [0, 1], [rotateX * 2, rotateX]);
      
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: baseStyle.background || 'linear-gradient(145deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)',
            backdropFilter: baseStyle.backdropFilter || 'blur(20px)',
            borderRadius: baseStyle.borderRadius || 20,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: baseStyle.fontSize || 20,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            transform: `perspective(1000px) rotateY(${animatedRotateY}deg) rotateX(${animatedRotateX}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {element.content}
        </div>
      );
      
    case 'code-editor':
      return (
        <CodeEditor
          element={element}
          style={{}}
          colors={['#3b82f6', '#8b5cf6', '#22d3ee']}
          sceneFrame={frame}
        />
      );
      
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
          <div style={{ color: '#6c7086', marginBottom: 8 }}>$ </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {element.content}
          </pre>
        </div>
      );

    case 'phone-mockup':
      return (
        <PhoneMockup
          element={element}
          style={{}}
          colors={['#3b82f6', '#8b5cf6', '#22d3ee']}
          sceneFrame={frame}
        >
          {/* Render app screen content inside phone */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
          }}>
            {/* Status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>9:41</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 16, height: 10, background: 'white', borderRadius: 2 }} />
              </div>
            </div>
            {/* App header */}
            <div style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
              Dashboard
            </div>
            {/* Stats cards */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Users', value: '12.5K', color: '#3b82f6' },
                { label: 'Revenue', value: '$48K', color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: 1,
                  background: `${stat.color}22`,
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{stat.label}</div>
                  <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
                </div>
              ))}
            </div>
            {/* Chart placeholder */}
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'flex-end',
              padding: 16,
              gap: 8,
            }}>
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: 'linear-gradient(180deg, #3b82f6, #6366f1)',
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          </div>
        </PhoneMockup>
      );

    case 'data-viz':
      return (
        <DataVisualization
          element={element}
          style={{}}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']}
          sceneFrame={frame}
        />
      );

    case 'logo-grid':
      return (
        <LogoGrid
          element={element}
          style={{}}
          colors={['#ffffff', '#3b82f6']}
          sceneFrame={frame}
        />
      );

    case 'audio-visualization':
      // Inline audio visualization with animated bars
      const vizType = baseStyle.visualizationType || 'bars';
      const barCount = 32;
      const vizColor = baseStyle.color || '#3b82f6';
      
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 6,
            padding: 20,
          }}
        >
          {Array.from({ length: barCount }).map((_, i) => {
            // Simulate audio reactivity with sine waves at different frequencies
            const frequency = 0.05 + (i / barCount) * 0.12;
            const phase = i * 0.3;
            const amplitude = Math.sin(frame * frequency + phase) * 0.5 + 0.5;
            
            // Add spring-like entrance animation
            const entranceDelay = i * 0.5;
            const entranceProgress = interpolate(
              frame - entranceDelay,
              [0, 15],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            
            const barHeight = interpolate(amplitude, [0, 1], [15, 200]) * entranceProgress;
            
            // Color gradient based on position
            const hue = interpolate(i, [0, barCount], [210, 280]);
            
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: 20,
                  height: barHeight,
                  background: `linear-gradient(180deg, hsl(${hue}, 80%, 60%) 0%, hsl(${hue}, 70%, 45%) 100%)`,
                  borderRadius: 4,
                  boxShadow: `0 0 15px hsla(${hue}, 80%, 50%, 0.4)`,
                }}
              />
            );
          })}
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
      // For unknown types, render a nice gradient placeholder instead of showing type labels
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Show content if it's emoji or short text */}
          {element.content && element.content.length <= 4 && (
            <span style={{ fontSize: baseStyle.fontSize || 48 }}>{element.content}</span>
          )}
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