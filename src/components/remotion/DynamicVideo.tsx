import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Easing } from 'remotion';
import type { VideoPlan, PlannedScene, PlannedElement, AnimationPattern } from '@/types/video';
import { CodeEditor, ProgressBar, Laptop3D, Terminal, Perspective3DCard } from './elements';

interface DynamicVideoProps {
  plan: VideoPlan;
}

// ============================================================================
// MAIN DYNAMIC VIDEO COMPONENT - Cinematic Quality Renderer
// ============================================================================
export const DynamicVideo: React.FC<DynamicVideoProps> = ({ plan }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Extract global colors
  const colors = plan.style?.colorPalette || ['#ffffff', '#06b6d4', '#1e293b', '#0f172a'];
  const globalBg = colors[3] || colors[2] || '#0f172a';

  // No scenes placeholder
  if (!plan?.scenes?.length) {
    return (
      <AbsoluteFill style={{ backgroundColor: globalBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', opacity: 0.5, fontSize: 18 }}>
          No scenes to preview
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: globalBg, overflow: 'hidden' }}>
      {/* Animated background gradient */}
      <AnimatedBackground colors={colors} />
      
      {/* Render each scene */}
      {plan.scenes.map((scene, index) => {
        const startFrame = Math.round(scene.startTime * fps);
        const durationFrames = Math.round(scene.duration * fps);

        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <SceneRenderer 
              scene={scene} 
              globalStyle={plan.style} 
              sceneIndex={index}
              totalScenes={plan.scenes.length}
            />
          </Sequence>
        );
      })}
      
      {/* Subtle vignette overlay */}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============================================================================
// ANIMATED BACKGROUND - Static gradient (optimized for performance)
// ============================================================================
const AnimatedBackground: React.FC<{ colors: string[] }> = React.memo(({ colors }) => {
  const primary = colors[1] || '#06b6d4';
  const secondary = colors[2] || '#1e293b';
  
  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${secondary} 0%, ${colors[3] || '#0f172a'} 100%)`,
        }}
      />
      
      {/* Static orbs - no per-frame animation */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '60%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}20 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: '30%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #8b5cf620 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(80px)',
        }}
      />
    </AbsoluteFill>
  );
});

// ============================================================================
// VIGNETTE OVERLAY
// ============================================================================
const Vignette: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ============================================================================
// SCENE RENDERER - Handles individual scenes with transitions
// ============================================================================
const SceneRenderer: React.FC<{
  scene: PlannedScene;
  globalStyle: VideoPlan['style'];
  sceneIndex: number;
  totalScenes: number;
}> = ({ scene, globalStyle, sceneIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = Math.round(scene.duration * fps);

  // Scene entry animation
  const entryProgress = spring({
    fps,
    frame,
    config: { damping: 40, stiffness: 100, mass: 0.8 },
  });

  // Scene exit animation
  const exitStart = durationFrames - fps * 0.5;
  const exitProgress = interpolate(
    frame,
    [exitStart, durationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const combinedOpacity = Math.min(entryProgress, exitProgress);
  const entryScale = interpolate(entryProgress, [0, 1], [0.95, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity: combinedOpacity,
        transform: `scale(${entryScale})`,
      }}
    >
      {/* Scene background effects based on description */}
      <SceneBackground description={scene.description} />
      
      {/* Render elements with staggered animations */}
      {scene.elements?.map((element, idx) => (
        <ElementRenderer
          key={element.id}
          element={element}
          globalStyle={globalStyle}
          sceneFrame={frame}
          elementIndex={idx}
          totalElements={scene.elements?.length || 1}
        />
      ))}
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE BACKGROUND - Contextual backgrounds based on scene description
// ============================================================================
const SceneBackground: React.FC<{ description: string }> = ({ description }) => {
  const frame = useCurrentFrame();
  const desc = description.toLowerCase();
  
  // Detect scene type from description
  const isIntro = desc.includes('intro') || desc.includes('opening') || desc.includes('hero');
  const isFeature = desc.includes('feature') || desc.includes('showcase') || desc.includes('demo');
  const isEnding = desc.includes('outro') || desc.includes('closing') || desc.includes('cta') || desc.includes('end');
  
  if (isIntro) {
    return (
      <AbsoluteFill>
        {/* Starburst effect for intros */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 1200,
            height: 1200,
            transform: `translate(-50%, -50%) rotate(${frame * 0.5}deg)`,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.03) 10deg, transparent 20deg)',
            borderRadius: '50%',
          }}
        />
      </AbsoluteFill>
    );
  }
  
  if (isEnding) {
    // Static sparkle effect for endings (no per-frame animation)
    return (
      <AbsoluteFill>
        {[...Array(4)].map((_, i) => {
          const positions = [
            { x: 20, y: 25 },
            { x: 80, y: 20 },
            { x: 15, y: 70 },
            { x: 85, y: 65 },
          ];
          return (
            <Sparkle key={i} x={positions[i].x} y={positions[i].y} scale={0.8} />
          );
        })}
      </AbsoluteFill>
    );
  }
  
  return null;
};

// ============================================================================
// SPARKLE ELEMENT - For decorative stars
// ============================================================================
const Sparkle: React.FC<{ x: number; y: number; scale: number }> = React.memo(({ x, y, scale }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%) scale(${scale})`,
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 0L22.5 17.5L40 20L22.5 22.5L20 40L17.5 22.5L0 20L17.5 17.5L20 0Z"
        fill="white"
        opacity="0.8"
      />
    </svg>
  </div>
));

// ============================================================================
// ELEMENT ANIMATION HOOK
// ============================================================================
const useElementAnimation = (
  element: PlannedElement,
  sceneFrame: number,
  fps: number,
  elementIndex: number
) => {
  const anim = element.animation as AnimationPattern | undefined;
  
  // Stagger delay based on element index
  const staggerDelay = elementIndex * 0.1;
  
  const baseDelay = ((anim?.delay || 0) + staggerDelay) * fps;
  const duration = (anim?.duration || 0.6) * fps;
  
  // Spring-based entry for smoother motion
  const springProgress = spring({
    fps,
    frame: Math.max(0, sceneFrame - baseDelay),
    config: { damping: 30, stiffness: 120, mass: 0.5 },
  });
  
  // Linear progress for specific animations
  const linearProgress = interpolate(
    sceneFrame,
    [baseDelay, baseDelay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  let opacity = springProgress;
  let translateX = 0;
  let translateY = interpolate(springProgress, [0, 1], [30, 0]);
  let scale = interpolate(springProgress, [0, 1], [0.9, 1]);
  let rotate = 0;
  let blur = interpolate(springProgress, [0, 0.3], [4, 0], { extrapolateRight: 'clamp' });

  const animType = anim?.type || anim?.name || 'fade';
  const props = anim?.properties || {};

  switch (animType) {
    case 'fade':
    case 'fadeIn':
      translateY = 0;
      scale = 1;
      break;
      
    case 'slide':
    case 'slideIn':
    case 'slideUp':
      if (props.y) {
        const [fromY, toY] = Array.isArray(props.y) ? props.y : [60, 0];
        translateY = interpolate(springProgress, [0, 1], [fromY as number, toY as number]);
      }
      if (props.x) {
        const [fromX, toX] = Array.isArray(props.x) ? props.x : [0, 0];
        translateX = interpolate(springProgress, [0, 1], [fromX as number, toX as number]);
      }
      break;
      
    case 'scale':
    case 'popIn':
    case 'zoomIn':
    case 'pop':
      if (props.scale) {
        const [fromScale, toScale] = Array.isArray(props.scale) ? props.scale : [0.5, 1];
        scale = interpolate(springProgress, [0, 1], [fromScale as number, toScale as number]);
      } else {
        scale = interpolate(springProgress, [0, 1], [0.5, 1]);
      }
      translateY = interpolate(springProgress, [0, 1], [20, 0]);
      break;
      
    case 'rotate':
    case 'spin':
      rotate = interpolate(linearProgress, [0, 1], [0, 360]);
      break;
      
    case 'pulse':
      const pulseScale = 1 + Math.sin(sceneFrame * 0.15) * 0.05;
      scale = pulseScale;
      break;
      
    case 'float':
      translateY = Math.sin(sceneFrame * 0.08) * 15;
      break;
      
    case 'glow':
      // Handled in element rendering
      break;
  }

  return { opacity, translateX, translateY, scale, rotate, blur };
};

// ============================================================================
// ELEMENT RENDERER - Renders individual elements with proper styling
// ============================================================================
const ElementRenderer: React.FC<{
  element: PlannedElement;
  globalStyle: VideoPlan['style'];
  sceneFrame: number;
  elementIndex: number;
  totalElements: number;
}> = ({ element, globalStyle, sceneFrame, elementIndex }) => {
  const { fps } = useVideoConfig();
  
  const { opacity, translateX, translateY, scale, rotate, blur } = useElementAnimation(
    element,
    sceneFrame,
    fps,
    elementIndex
  );

  const colors = globalStyle?.colorPalette || ['#ffffff', '#06b6d4', '#1e293b'];
  
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position?.x ?? 50}%`,
    top: `${element.position?.y ?? 50}%`,
    transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
    opacity,
    zIndex: element.position?.z || 1,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
  };

  // Check for advanced element types in content/style
  const content = element.content?.toLowerCase() || '';
  const styleType = (element.style as Record<string, unknown>)?.elementType as string;

  // Heuristics: some plans use shape placeholders like "Cursor" or "Arrow".
  // Treat those as real elements to avoid giant blocks + label text.
  if (element.type === 'shape' && content.includes('cursor')) {
    return <CursorElement element={element} style={baseStyle} sceneFrame={sceneFrame} fps={fps} />;
  }

  if (element.type === 'shape' && content.includes('arrow')) {
    return <ArrowElement element={element} style={baseStyle} colors={colors} />;
  }
  
  // Route to advanced elements based on content keywords or explicit type
  if (styleType === 'code-editor' || content.includes('code') || content.includes('editor') || content.includes('syntax')) {
    return <CodeEditor element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
  }
  
  if (styleType === 'progress' || content.includes('progress') || content.includes('render') || content.includes('loading')) {
    return <ProgressBar element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
  }
  
  if (styleType === 'terminal' || content.includes('terminal') || content.includes('command') || content.includes('cli')) {
    return <Terminal element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
  }
  
  if (styleType === 'laptop' || content.includes('laptop') || content.includes('macbook')) {
    return <Laptop3D element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
  }
  
  if (styleType === '3d-card' || content.includes('3d card') || content.includes('perspective card')) {
    return <Perspective3DCard element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
  }

  // Render based on element type
  switch (element.type) {
    case 'text':
      return <TextElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} />;
    case 'shape':
      return <ShapeElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />;
    case 'image':
      return <ImageElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} />;
    case 'cursor':
      return <CursorElement element={element} style={baseStyle} sceneFrame={sceneFrame} fps={fps} />;
    default:
      return null;
  }
};

// ============================================================================
// TEXT ELEMENT - Kinetic typography with gradients
// ============================================================================
const TextElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
}> = ({ element, style, globalStyle, colors }) => {
  const textStyle = element.style as Record<string, unknown>;
  const content = element.content || '';
  
  // Detect if this is a headline or subtext
  const fontSize = (textStyle.fontSize as number) || 48;
  const isHeadline = fontSize >= 48;
  
  // Gradient text for headlines
  const useGradient = isHeadline && !textStyle.color;
  
  return (
    <div
      style={{
        ...style,
        fontFamily: (textStyle.fontFamily as string) || globalStyle?.typography?.primary || 'Inter, system-ui, sans-serif',
        fontSize,
        fontWeight: (textStyle.fontWeight as number) || (isHeadline ? 800 : 500),
        letterSpacing: isHeadline ? '-0.02em' : '0',
        lineHeight: 1.1,
        textAlign: 'center',
        maxWidth: '80%',
        ...(useGradient
          ? {
              background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }
          : {
              color: (textStyle.color as string) || colors[0] || '#ffffff',
              textShadow: isHeadline ? '0 4px 30px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.2)',
            }),
      }}
    >
      {content}
    </div>
  );
};

// ============================================================================
// SHAPE ELEMENT - Glassmorphic cards and UI elements
// ============================================================================
const ShapeElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
  sceneFrame: number;
}> = ({ element, style, globalStyle, colors, sceneFrame }) => {
  const shapeStyle = element.style as Record<string, unknown>;
  // NOTE: We intentionally do NOT render element.content as visible text for shapes.
  // Many plans use content as a semantic label (e.g. "Background", "Arrow", "UI Card")
  // which should not appear in the final video.
  const content = element.content || '';
  
  // Detect shape type from content/description
  const isCard = content.toLowerCase().includes('card') || content.toLowerCase().includes('ui');
  const isButton = content.toLowerCase().includes('button') || content.toLowerCase().includes('cta');
  const isDevice = content.toLowerCase().includes('phone') || content.toLowerCase().includes('device') || content.toLowerCase().includes('mockup');
  const isGlobe = content.toLowerCase().includes('globe') || content.toLowerCase().includes('world');
  
  const width = element.size?.width ? (element.size.width <= 100 ? `${element.size.width}%` : `${element.size.width}px`) : '300px';
  const height = element.size?.height ? (element.size.height <= 100 ? `${element.size.height}%` : `${element.size.height}px`) : '200px';
  const borderRadius = (shapeStyle.borderRadius as number) || (globalStyle?.borderRadius) || 24;
  
  // Glassmorphic card
  if (isCard) {
    return (
      <div
        style={{
          ...style,
          width,
          height,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        {/* intentionally no label text */}
      </div>
    );
  }
  
  // Button element
  if (isButton) {
    return (
      <div
        style={{
          ...style,
          padding: '16px 40px',
          background: `linear-gradient(135deg, ${colors[1]} 0%, ${colors[1]}dd 100%)`,
          borderRadius: 50,
          boxShadow: `0 10px 40px ${colors[1]}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          color: '#fff',
          fontSize: 18,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}>
          {content || 'Get Started'}
        </span>
      </div>
    );
  }
  
  // Device mockup (phone)
  if (isDevice) {
    return (
      <div
        style={{
          ...style,
          width: 280,
          height: 560,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderRadius: 40,
          border: '3px solid #3a3a3a',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Screen */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            fontFamily: 'monospace',
          }}>
            App Screen
          </span>
        </div>
      </div>
    );
  }
  
  // Globe/World element
  if (isGlobe) {
    const rotation = sceneFrame * 0.5;
    return (
      <div
        style={{
          ...style,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 30%, ${colors[1]}40 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${colors[1]}20 0%, transparent 50%),
            linear-gradient(135deg, #1e40af 0%, #0f172a 50%, #1e3a5f 100%)
          `,
          boxShadow: `
            0 0 100px ${colors[1]}30,
            inset -20px -20px 60px rgba(0,0,0,0.4),
            inset 20px 20px 60px rgba(255,255,255,0.1)
          `,
          transform: `${style.transform} rotateY(${rotation}deg)`,
        }}
      >
        {/* Grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          background: `
            repeating-linear-gradient(0deg, transparent 0px, transparent 39px, rgba(255,255,255,0.05) 40px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 39px, rgba(255,255,255,0.05) 40px)
          `,
        }} />
      </div>
    );
  }
  
  // Default shape - gradient filled
  const background = (shapeStyle.background as string) || 
    `linear-gradient(135deg, ${colors[1]}20 0%, ${colors[1]}10 100%)`;
  
  return (
    <div
      style={{
        ...style,
        width,
        height,
        background,
        borderRadius,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* intentionally no label text */}
    </div>
  );
};

// ============================================================================
// ARROW ELEMENT - Render a proper arrow icon instead of a label block
// ============================================================================
const ArrowElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  colors: string[];
}> = ({ element, style, colors }) => {
  const width = element.size?.width
    ? element.size.width <= 100
      ? `${element.size.width}%`
      : `${element.size.width}px`
    : '120px';
  const height = element.size?.height
    ? element.size.height <= 100
      ? `${element.size.height}%`
      : `${element.size.height}px`
    : '120px';

  const fill = ((element.style as Record<string, unknown>)?.background as string) || colors[1] || '#06b6d4';

  return (
    <div
      style={{
        ...style,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12h13"
          stroke={fill}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path
          d="M13 6l6 6-6 6"
          stroke={fill}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ============================================================================
// IMAGE ELEMENT - Stylized image placeholders
// ============================================================================
const ImageElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
}> = ({ element, style, colors }) => {
  const width = element.size?.width ? (element.size.width <= 100 ? `${element.size.width}%` : `${element.size.width}px`) : '300px';
  const height = element.size?.height ? (element.size.height <= 100 ? `${element.size.height}%` : `${element.size.height}px`) : '200px';
  
  return (
    <div
      style={{
        ...style,
        width,
        height,
        background: `linear-gradient(135deg, ${colors[1]}15 0%, ${colors[2]}30 100%)`,
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Image icon placeholder */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
        <path d="M3 16l5-5 3 3 5-5 5 5v3a3 3 0 01-3 3H6a3 3 0 01-3-3v-1z" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
};

// ============================================================================
// CURSOR ELEMENT - Animated cursor with click effect
// ============================================================================
const CursorElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  sceneFrame: number;
  fps: number;
}> = ({ element, style, sceneFrame, fps }) => {
  const anim = element.animation as AnimationPattern | undefined;
  
  // Smooth cursor movement using spring
  const moveProgress = spring({
    fps,
    frame: sceneFrame,
    config: { damping: 40, stiffness: 80, mass: 0.6 },
  });
  
  let cursorX = element.position?.x ?? 50;
  let cursorY = element.position?.y ?? 50;
  
  if (anim?.properties) {
    if (anim.properties.x && Array.isArray(anim.properties.x)) {
      cursorX = interpolate(moveProgress, [0, 1], anim.properties.x as number[]);
    }
    if (anim.properties.y && Array.isArray(anim.properties.y)) {
      cursorY = interpolate(moveProgress, [0, 1], anim.properties.y as number[]);
    }
  }
  
  // Click animation
  const clickFrame = fps * 1.5;
  const clickScale = interpolate(
    sceneFrame,
    [clickFrame, clickFrame + 5, clickFrame + 10],
    [1, 0.85, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const clickRipple = interpolate(
    sceneFrame,
    [clickFrame, clickFrame + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      {/* Click ripple effect */}
      {clickRipple > 0 && clickRipple < 1 && (
        <div
          style={{
            position: 'absolute',
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            width: 60 * clickRipple,
            height: 60 * clickRipple,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.5)',
            transform: 'translate(-50%, -50%)',
            opacity: 1 - clickRipple,
            zIndex: 99,
          }}
        />
      )}
      
      {/* Cursor */}
      <div
        style={{
          position: 'absolute',
          left: `${cursorX}%`,
          top: `${cursorY}%`,
          transform: `translate(-30%, -10%) scale(${clickScale})`,
          zIndex: 100,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
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
    </>
  );
};

export default DynamicVideo;
