/**
 * Sophisticated Video Renderer (Remotion Component)
 * 
 * Renders enhanced video plans with all advanced systems:
 * - Camera paths
 * - Curved character animations  
 * - Parallax depth
 * - Color grading overlays
 * - Professional motion design
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';
import { ParallaxDepthSystem, applyCameraDrift } from '@/services/scene-planning';

interface SophisticatedVideoProps {
  videoPlan: EnhancedVideoPlan;
}

export const SophisticatedVideo: React.FC<SophisticatedVideoProps> = ({ videoPlan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Get camera state
  const cameraState = videoPlan.cameraPath?.getCameraState(frame);
  
  // Apply camera drift for organic feel
  const cameraPosition = cameraState ? applyCameraDrift(
    cameraState.position.x,
    cameraState.position.y,
    frame,
    5
  ) : { x: 0, y: 0 };
  
  // Get color grading for current frame
  const colorGrade = videoPlan.colorGrading?.getGradeAtFrame(frame);
  const colorFilter = colorGrade ? videoPlan.colorGrading!.getFilterString(colorGrade) : '';
  const colorOverlays = colorGrade ? videoPlan.colorGrading!.getOverlayStyles(colorGrade) : [];
  
  // Find current scene
  const currentScene = videoPlan.scenes.find(
    scene => frame >= scene.startTime * fps && frame < (scene.startTime + scene.duration) * fps
  );
  
  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }
  
  // Get camera Z for parallax
  const cameraZ = cameraState?.position.z || 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      {/* Main content with camera transform */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: cameraState ? videoPlan.cameraPath!.getCameraTransform(cameraState) : 'none',
          filter: colorFilter,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Render scene elements with parallax */}
        {currentScene.elements.map((element, index) => {
          // Get parallax config for this element
          const parallaxKey = getParallaxKey(element.type);
          const parallaxConfig = videoPlan.parallaxConfig?.[parallaxKey];
          
          // Calculate parallax transform
          const parallaxTransform = parallaxConfig
            ? ParallaxDepthSystem.getTransform(
                parallaxConfig,
                cameraPosition.x,
                cameraPosition.y,
                cameraZ
              )
            : null;
          
          // Get character path animation if exists
          const pathId = `${currentScene.id}-${element.id}`;
          const pathState = videoPlan.characterPaths?.get(pathId)?.getStateAtFrame(frame);
          
          // Calculate element position
          const elementX = pathState ? pathState.x : element.position.x;
          const elementY = pathState ? pathState.y : element.position.y;
          const elementRotation = pathState ? pathState.rotation : 0;
          const elementScale = pathState ? pathState.scale : 1;
          
          // Apply animation if exists
          const animProgress = element.animation 
            ? getAnimationProgress(frame, fps, element.animation.delay || 0, element.animation.duration)
            : 1;
          
          const animOpacity = element.animation
            ? interpolate(animProgress, [0, 1], [0, 1])
            : 1;
          
          const animScale = element.animation && element.animation.type === 'scale'
            ? interpolate(animProgress, [0, 1], [0.8, 1])
            : 1;
          
          // Combine all transforms
          const layerStyle = parallaxTransform
            ? ParallaxDepthSystem.getLayerStyle(parallaxTransform)
            : {};
          
          return (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: `${elementX}%`,
                top: `${elementY}%`,
                width: element.size.width,
                height: element.size.height,
                transform: `
                  translate(-50%, -50%)
                  rotate(${elementRotation}deg)
                  scale(${elementScale * animScale})
                `.trim().replace(/\s+/g, ' '),
                opacity: animOpacity * (parallaxTransform?.opacity || 1),
                filter: parallaxTransform?.filter,
                zIndex: element.position.z,
                ...layerStyle
              }}
            >
              <ElementRenderer element={element} />
            </div>
          );
        })}
      </div>
      
      {/* Color grading overlays */}
      {colorOverlays.map((overlayStyle, index) => (
        <div key={`overlay-${index}`} style={overlayStyle} />
      ))}
      
      {/* Production grade indicator (dev only) */}
      {videoPlan.sophisticatedMetadata && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'monospace',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          Grade: {videoPlan.sophisticatedMetadata.productionGrade.toUpperCase()}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// ELEMENT RENDERER
// ============================================================================

const ElementRenderer: React.FC<{ element: any }> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: element.style.fontSize,
            fontWeight: element.style.fontWeight,
            color: element.style.color || '#ffffff',
            textAlign: 'center',
            fontFamily: element.style.fontFamily || 'Inter, sans-serif'
          }}
        >
          {element.content}
        </div>
      );
      
    case 'image':
      return (
        <img
          src={element.content}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      );
      
    case 'shape':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: element.style.fill || '#3b82f6',
            borderRadius: element.style.borderRadius || 0
          }}
        />
      );
      
    default:
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px dashed rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          {element.type}
        </div>
      );
  }
};

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
    'audio-visualization': 'effects'
  };
  
  return parallaxMapping[elementType] || 'ui';
}

function getAnimationProgress(
  frame: number,
  fps: number,
  delay: number,
  duration: number
): number {
  const delayFrames = delay * fps;
  const durationFrames = duration * fps;
  const animFrame = frame - delayFrames;
  
  if (animFrame < 0) return 0;
  if (animFrame > durationFrames) return 1;
  
  return animFrame / durationFrames;
}

export default SophisticatedVideo;
