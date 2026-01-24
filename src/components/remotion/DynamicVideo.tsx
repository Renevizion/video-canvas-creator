import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import type { VideoPlan, PlannedScene, PlannedElement, AnimationPattern } from '@/types/video';

interface DynamicVideoProps {
  plan: VideoPlan;
}

// Main dynamic video component that renders based on plan
export const DynamicVideo: React.FC<DynamicVideoProps> = ({ plan }) => {
  const { fps } = useVideoConfig();

  const globalBg = plan.style?.colorPalette?.[2] || '#1e293b';

  // Helpful: if a plan ever arrives without scenes, render an obvious placeholder.
  if (!plan?.scenes?.length) {
    return (
      <AbsoluteFill style={{ backgroundColor: globalBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontFamily: 'monospace', opacity: 0.7 }}>
          No scenes to preview
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: globalBg }}>
      <DebugOverlay />
      {plan.scenes.map((scene) => {
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

const DebugOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = (frame / fps).toFixed(2);
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 9999,
        padding: '6px 10px',
        borderRadius: 10,
        background: 'rgba(0,0,0,0.35)',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        lineHeight: 1.2,
        border: '1px solid rgba(255,255,255,0.08)',
        pointerEvents: 'none',
      }}
    >
      frame {frame} · {seconds}s
    </div>
  );
};

// Scene renderer component
const SceneRenderer: React.FC<{ scene: PlannedScene; globalStyle: VideoPlan['style'] }> = ({ scene, globalStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in
  const sceneOpacity = interpolate(frame, [0, Math.round(fps * 0.3)], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {scene.elements?.map((element) => (
        <ElementRenderer 
          key={element.id} 
          element={element} 
          globalStyle={globalStyle}
          sceneFrame={frame}
        />
      ))}
    </AbsoluteFill>
  );
};

// Get animation values based on element animation config
const useElementAnimation = (
  element: PlannedElement,
  sceneFrame: number,
  fps: number
) => {
  const anim = element.animation as AnimationPattern | undefined;
  
  if (!anim) {
    return { opacity: 1, translateX: 0, translateY: 0, scale: 1, rotate: 0 };
  }

  const delay = (anim.delay || 0) * fps;
  const duration = (anim.duration || 0.5) * fps;
  
  // Calculate animation progress
  const progress = interpolate(
    sceneFrame,
    [delay, delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  let opacity = 1;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  let rotate = 0;

  const animType = anim.type || anim.name;
  const props = anim.properties || {};

  switch (animType) {
    case 'fade':
    case 'fadeIn':
      opacity = progress;
      break;
      
    case 'slide':
    case 'slideIn':
      opacity = progress;
      if (props.y) {
        const [fromY, toY] = Array.isArray(props.y) ? props.y : [100, 0];
        translateY = interpolate(progress, [0, 1], [fromY as number, toY as number]);
      } else {
        translateY = interpolate(progress, [0, 1], [50, 0]);
      }
      if (props.x) {
        const [fromX, toX] = Array.isArray(props.x) ? props.x : [0, 0];
        translateX = interpolate(progress, [0, 1], [fromX as number, toX as number]);
      }
      break;
      
    case 'scale':
    case 'popIn':
    case 'zoomIn':
      opacity = progress;
      if (props.scale) {
        const [fromScale, toScale] = Array.isArray(props.scale) ? props.scale : [0.8, 1];
        scale = interpolate(progress, [0, 1], [fromScale as number, toScale as number]);
      } else {
        scale = interpolate(progress, [0, 1], [0.8, 1]);
      }
      break;
      
    case 'move':
    case 'moveAndClick':
      // For cursor movement - don't fade, just move
      if (props.x) {
        const [fromX, toX] = Array.isArray(props.x) ? props.x : [0, 0];
        translateX = interpolate(progress, [0, 1], [fromX as number - 50, toX as number - 50]) * 10;
      }
      if (props.y) {
        const [fromY, toY] = Array.isArray(props.y) ? props.y : [0, 0];
        translateY = interpolate(progress, [0, 1], [fromY as number - 50, toY as number - 50]) * 10;
      }
      break;
      
    case 'text':
    case 'typewriter':
      opacity = progress;
      break;
      
    case 'pulse':
      const pulseScale = Array.isArray(props.scale) ? props.scale : [1, 1.1];
      scale = interpolate(
        Math.sin(progress * Math.PI * 4),
        [-1, 1],
        [pulseScale[0] as number, pulseScale[1] as number]
      );
      break;

    case 'flash':
      opacity = progress;
      break;
      
    default:
      opacity = progress;
  }

  return { opacity, translateX, translateY, scale, rotate };
};

// Element renderer
const ElementRenderer: React.FC<{
  element: PlannedElement;
  globalStyle: VideoPlan['style'];
  sceneFrame: number;
}> = ({ element, globalStyle, sceneFrame }) => {
  const { fps } = useVideoConfig();
  
  const { opacity, translateX, translateY, scale, rotate } = useElementAnimation(
    element,
    sceneFrame,
    fps
  );

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position?.x || 50}%`,
    top: `${element.position?.y || 50}%`,
    transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    zIndex: element.position?.z || 1,
  };

  const resolveSize = (value?: number) => {
    if (value === undefined || value === null) return undefined;
    // Our plans typically use percentages (0-100). If it looks larger, treat as px.
    return value <= 100 ? `${value}%` : `${value}px`;
  };

  // Text element
  if (element.type === 'text') {
    const textStyle = element.style as Record<string, unknown>;
    return (
      <div
        style={{
          ...baseStyle,
          fontFamily: (textStyle.fontFamily as string) || globalStyle?.typography?.primary || 'Inter, system-ui, sans-serif',
          color: (textStyle.color as string) || globalStyle?.colorPalette?.[0] || '#ffffff',
          fontSize: (textStyle.fontSize as number) || 48,
          fontWeight: (textStyle.fontWeight as number) || 700,
          textAlign: 'center' as const,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        {element.content}
      </div>
    );
  }

  // Shape element
  if (element.type === 'shape') {
    const shapeStyle = element.style as Record<string, unknown>;
    const border = (shapeStyle.border as string) || '1px solid rgba(255,255,255,0.12)';
    const background = (shapeStyle.background as string) || 'rgba(255,255,255,0.1)';
    const borderRadius =
      (shapeStyle.borderRadius as number) ||
      (globalStyle?.borderRadius as number) ||
      16;
    const boxShadow =
      (shapeStyle.boxShadow as string) ||
      '0 10px 30px rgba(0,0,0,0.25)';

    return (
      <div
        style={{
          ...baseStyle,
          width: resolveSize(element.size?.width) || '200px',
          height: resolveSize(element.size?.height) || '200px',
          background,
          borderRadius,
          border,
          boxShadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Optional label to make “boxes” visibly identifiable in preview */}
        {typeof element.content === 'string' && element.content.trim().length > 0 ? (
          <span
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
              letterSpacing: 0.2,
              textTransform: 'uppercase',
              opacity: 0.7,
              userSelect: 'none',
            }}
          >
            {element.content}
          </span>
        ) : null}
      </div>
    );
  }

  // Image placeholder element
  if (element.type === 'image') {
    return (
      <div
        style={{
          ...baseStyle,
          width: element.size?.width ? `${element.size.width}%` : '200px',
          height: element.size?.height ? `${element.size.height}%` : '200px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }}>
          [{element.content}]
        </span>
      </div>
    );
  }

  // Cursor element with smooth animation
  if (element.type === 'cursor') {
    // Use spring for smoother cursor movement
    const cursorProgress = spring({
      fps,
      frame: sceneFrame,
      config: {
        damping: 50,
        stiffness: 100,
        mass: 0.5,
      },
    });

    const anim = element.animation as AnimationPattern | undefined;
    let cursorX = element.position?.x || 50;
    let cursorY = element.position?.y || 50;
    
    if (anim?.properties) {
      if (anim.properties.x && Array.isArray(anim.properties.x)) {
        cursorX = interpolate(cursorProgress, [0, 1], anim.properties.x as number[]);
      }
      if (anim.properties.y && Array.isArray(anim.properties.y)) {
        cursorY = interpolate(cursorProgress, [0, 1], anim.properties.y as number[]);
      }
    }

    // Click effect - pulse when near end of animation
    const clickProgress = interpolate(sceneFrame, [fps * 1.5, fps * 1.6, fps * 1.7], [1, 0.85, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          left: `${cursorX}%`,
          top: `${cursorY}%`,
          transform: `translate(-50%, -50%) scale(${clickProgress})`,
          zIndex: 100,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
