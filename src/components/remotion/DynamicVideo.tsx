import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import type { VideoPlan, PlannedScene, PlannedElement } from '@/types/video';

interface DynamicVideoProps {
  plan: VideoPlan;
}

// Main dynamic video component that renders based on plan
export const DynamicVideo: React.FC<DynamicVideoProps> = ({ plan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalBg = plan.style?.colorPalette?.[0] || '#0a0e27';

  return (
    <AbsoluteFill style={{ backgroundColor: globalBg }}>
      {plan.scenes.map((scene, index) => {
        const startFrame = Math.round(scene.startTime * fps);
        const durationFrames = Math.round(scene.duration * fps);

        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <SceneRenderer scene={scene} globalStyle={plan.style} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene renderer component
const SceneRenderer: React.FC<{ scene: PlannedScene; globalStyle: VideoPlan['style'] }> = ({ scene, globalStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {scene.elements?.map((element, index) => (
        <ElementRenderer 
          key={element.id} 
          element={element} 
          globalStyle={globalStyle}
          sceneFrame={frame}
        />
      ))}
      
      {/* Scene description as overlay for debugging */}
      {scene.description && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            padding: '16px 24px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            color: 'white',
            fontSize: 14,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {scene.description}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Element renderer
const ElementRenderer: React.FC<{
  element: PlannedElement;
  globalStyle: VideoPlan['style'];
  sceneFrame: number;
}> = ({ element, globalStyle, sceneFrame }) => {
  const { fps } = useVideoConfig();

  // Calculate animation
  const animDelay = (element.animation?.delay || 0) * fps;
  const animDuration = (element.animation?.duration || 0.5) * fps;
  
  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  if (element.animation) {
    const animProgress = interpolate(
      sceneFrame,
      [animDelay, animDelay + animDuration],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    switch (element.animation.type) {
      case 'fade':
        opacity = animProgress;
        break;
      case 'slide':
        opacity = animProgress;
        translateY = interpolate(animProgress, [0, 1], [50, 0]);
        break;
      case 'scale':
        scale = interpolate(animProgress, [0, 1], [0.8, 1]);
        opacity = animProgress;
        break;
    }
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position?.x || 50}%`,
    top: `${element.position?.y || 50}%`,
    transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
    opacity,
    width: element.size?.width ? `${element.size.width}%` : 'auto',
    ...element.style as React.CSSProperties,
  };

  if (element.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontFamily: globalStyle?.typography?.primary || 'Inter, system-ui, sans-serif',
          color: (element.style as any)?.color || globalStyle?.colorPalette?.[3] || '#53a8ff',
          fontSize: (element.style as any)?.fontSize || 48,
          fontWeight: (element.style as any)?.fontWeight || 700,
          textAlign: 'center' as const,
          textShadow: '0 0 30px rgba(83, 168, 255, 0.5)',
        }}
      >
        {element.content}
      </div>
    );
  }

  if (element.type === 'shape') {
    return (
      <div
        style={{
          ...style,
          background: (element.style as any)?.background || 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: (element.style as any)?.borderRadius || globalStyle?.borderRadius || 16,
          border: '1px solid rgba(83, 168, 255, 0.2)',
          boxShadow: '0 0 40px rgba(83, 168, 255, 0.1)',
          height: element.size?.height ? `${element.size.height}%` : '200px',
        }}
      />
    );
  }

  if (element.type === 'image') {
    return (
      <div
        style={{
          ...style,
          background: 'linear-gradient(135deg, #0a0e27, #1a1a2e)',
          borderRadius: 16,
          height: element.size?.height ? `${element.size.height}%` : '60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(83, 168, 255, 0.1)',
        }}
      >
        <span style={{ color: 'rgba(83, 168, 255, 0.5)', fontSize: 14 }}>
          {element.content}
        </span>
      </div>
    );
  }

  if (element.type === 'cursor') {
    const cursorX = interpolate(sceneFrame, [0, 60], [30, 70], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(sceneFrame, [0, 60], [40, 60], { extrapolateRight: 'clamp' });
    const clickScale = sceneFrame > 45 && sceneFrame < 50 ? 0.8 : 1;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${cursorX}%`,
          top: `${cursorY}%`,
          transform: `scale(${clickScale})`,
          transition: 'transform 0.1s',
          zIndex: 100,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  return null;
};

export default DynamicVideo;
