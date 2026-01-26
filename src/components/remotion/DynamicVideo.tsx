import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Series, Easing, Img, delayRender, continueRender, random } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { noise3D } from '@remotion/noise';
import { Audio } from '@remotion/media';
import { OffthreadVideo } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { loadFont } from '@remotion/google-fonts/Inter';
import { Trail } from '@remotion/motion-blur';
import { Circle, Rect, Triangle, Star, Polygon } from '@remotion/shapes';
import type { VideoPlan, PlannedScene, PlannedElement, AnimationPattern } from '@/types/video';
import { CodeEditor, ProgressBar, Laptop3D, Terminal, Perspective3DCard } from './elements';

interface DynamicVideoProps {
  plan: VideoPlan;
}

// ============================================================================
// RANDOMNESS UTILITIES - Deterministic and Non-Deterministic Random Values
// ============================================================================
// Following Remotion best practices for using randomness:
// - https://www.remotion.dev/docs/using-randomness
// - https://www.remotion.dev/docs/random#accessing-true-randomness

/**
 * Get a deterministic random value based on a seed.
 * Same seed always produces the same value - critical for consistent renders.
 * 
 * @example
 * const offset = random('particle-1') * 100; // Always same value for this seed
 * const color = colors[Math.floor(random('color-choice') * colors.length)];
 */
export const getSeededRandom = (seed: string): number => {
  return random(seed);
};

/**
 * Get a truly random value (non-deterministic).
 * Use this ONLY when you explicitly want different values on each render,
 * such as for the "Reevaluate" button in Remotion Studio.
 * 
 * @example
 * const truelyRandomValue = random(null); // Different every time
 */
export const getTrueRandom = (): number => {
  return random(null);
};

/**
 * NEVER use Math.random() in Remotion components!
 * It will cause flickering and non-deterministic renders.
 * 
 * ❌ BAD:  const x = Math.random() * 100;
 * ✅ GOOD: const x = random('seed') * 100;
 * ✅ GOOD: const x = noise3D('seed', frame, 0, 0) * 100;
 */

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
      
      {/* Render scenes with TransitionSeries */}
      <TransitionSeries>
        {plan.scenes.flatMap((scene, index) => {
          const durationFrames = Math.round(scene.duration * fps);
          
          // Determine transition based on scene.transition property
          const transitionType = scene.transition?.type || 'fade';
          const transitionDuration = scene.transition?.duration || 0.3;
          
          let transition;
          switch (transitionType) {
            case 'slide':
              transition = slide({ direction: 'from-right' });
              break;
            case 'wipe':
              transition = wipe({ direction: 'from-right' });
              break;
            case 'zoom':
              transition = fade(); // Use fade for zoom (can be extended with custom transition)
              break;
            case 'cut':
              // For cut transitions, use very short fade
              transition = fade();
              break;
            default:
              transition = fade();
          }

          const elements: React.ReactNode[] = [
            <TransitionSeries.Sequence 
              key={scene.id}
              durationInFrames={durationFrames}
            >
              <SceneRenderer 
                scene={scene} 
                globalStyle={plan.style} 
                sceneIndex={index}
                totalScenes={plan.scenes.length}
              />
            </TransitionSeries.Sequence>
          ];

          // Add transition AFTER the sequence (between scenes)
          if (index < plan.scenes.length - 1) {
            const nextScene = plan.scenes[index + 1];
            const nextDurationFrames = Math.round(nextScene.duration * fps);
            
            // Calculate transition duration in frames
            let transitionDurationFrames = transitionType === 'cut' 
              ? Math.round(fps * 0.1) // Very quick for cuts
              : Math.round(fps * transitionDuration);
            
            // Ensure transition doesn't exceed either adjacent sequence duration
            // Rule: Transition must be <= min(current sequence, next sequence)
            const maxAllowedDuration = Math.min(durationFrames, nextDurationFrames);
            transitionDurationFrames = Math.min(transitionDurationFrames, Math.floor(maxAllowedDuration * 0.9)); // Use 90% to be safe
            
            const timing = transitionType === 'cut' 
              ? linearTiming({ durationInFrames: transitionDurationFrames })
              : springTiming({ 
                  config: { damping: 200, stiffness: 100 },
                  durationInFrames: transitionDurationFrames
                });
            
            elements.push(
              <TransitionSeries.Transition
                key={`${scene.id}-transition`}
                presentation={transition}
                timing={timing}
              />
            );
          }

          return elements;
        })}
      </TransitionSeries>
      
      {/* Subtle vignette overlay */}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============================================================================
// ANIMATED BACKGROUND - Organic gradient with noise3D motion
// ============================================================================
const AnimatedBackground: React.FC<{ colors: string[] }> = React.memo(({ colors }) => {
  const frame = useCurrentFrame();
  const primary = colors[1] || '#06b6d4';
  const secondary = colors[2] || '#1e293b';
  
  // Use noise3D for smooth organic motion of orbs
  const orb1X = 60 + noise3D('orb1-x', frame * 0.01, 0, 0) * 20;
  const orb1Y = 20 + noise3D('orb1-y', 0, frame * 0.01, 0) * 15;
  const orb1Rotation = noise3D('orb1-rot', frame * 0.005, 0, 0) * 30;
  
  const orb2X = 30 + noise3D('orb2-x', frame * 0.008, 0, 0) * 15;
  const orb2Y = 70 + noise3D('orb2-y', 0, frame * 0.008, 0) * 20;
  const orb2Rotation = noise3D('orb2-rot', frame * 0.006, 0, 0) * 25;
  
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
      
      {/* Animated orbs with noise3D motion */}
      <div
        style={{
          position: 'absolute',
          top: `${orb1Y}%`,
          left: `${orb1X}%`,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}20 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) rotate(${orb1Rotation}deg)`,
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: `${orb2Y}%`,
          left: `${orb2X}%`,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #8b5cf620 0%, transparent 70%)',
          transform: `translate(-50%, -50%) rotate(${orb2Rotation}deg)`,
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
  const exit = spring({
    fps,
    frame,
    config: { damping: 40, stiffness: 100, mass: 0.8 },
    durationInFrames: Math.round(fps * 0.5),
    delay: durationFrames - Math.round(fps * 0.5),
  });
  const combinedProgress = Math.min(entryProgress, 1 - exit);

  const combinedOpacity = combinedProgress;
  const entryScale = interpolate(entryProgress, [0, 1], [0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        opacity: combinedOpacity,
        transform: `scale(${entryScale})`,
      }}
    >
      {/* Scene background effects based on description */}
      <SceneBackground description={scene.description} />
      
      {/* Render elements - each with its own staggered timing */}
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
const SceneBackground: React.FC<{ description: string }> = React.memo(({ description }) => {
  const frame = useCurrentFrame();
  const desc = description.toLowerCase();
  
  // Detect scene type from description
  const isIntro = desc.includes('intro') || desc.includes('opening') || desc.includes('hero');
  const isFeature = desc.includes('feature') || desc.includes('showcase') || desc.includes('demo');
  const isEnding = desc.includes('outro') || desc.includes('closing') || desc.includes('cta') || desc.includes('end');
  
  if (isIntro) {
    // Throttle rotation to every 4th frame for performance
    const throttledFrame = Math.floor(frame / 4) * 4;
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
            transform: `translate(-50%, -50%) rotate(${throttledFrame * 0.5}deg)`,
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
});

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

  const opacity = springProgress;
  let translateX = 0;
  let translateY = interpolate(springProgress, [0, 1], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  let scale = interpolate(springProgress, [0, 1], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  let rotate = 0;
  const blur = interpolate(springProgress, [0, 0.3], [4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
        translateY = interpolate(springProgress, [0, 1], [fromY as number, toY as number], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }
      if (props.x) {
        const [fromX, toX] = Array.isArray(props.x) ? props.x : [0, 0];
        translateX = interpolate(springProgress, [0, 1], [fromX as number, toX as number], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }
      break;
      
    case 'scale':
    case 'popIn':
    case 'zoomIn':
    case 'pop':
      if (props.scale) {
        const [fromScale, toScale] = Array.isArray(props.scale) ? props.scale : [0.5, 1];
        scale = interpolate(springProgress, [0, 1], [fromScale as number, toScale as number], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      } else {
        scale = interpolate(springProgress, [0, 1], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }
      translateY = interpolate(springProgress, [0, 1], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      break;
      
    case 'rotate':
    case 'spin':
      rotate = interpolate(linearProgress, [0, 1], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      break;
      
    case 'pulse': {
      const pulseScale = 1 + noise3D('pulse-' + element.id, sceneFrame * 0.15, 0, 0) * 0.05;
      scale = pulseScale;
      break;
    }
      
    case 'float':
      translateY = noise3D('float-' + element.id, 0, 0, sceneFrame * 0.02) * 15;
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

  // Determine if element needs motion blur (fast animations)
  const animation = element.animation;
  const needsMotionBlur = animation && [
    'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown',
    'rotate', 'spin'
  ].includes(animation.name || '');
  
  // Wrapper function to optionally add motion blur
  // Trail requires: layers (number of ghost layers), lagInFrames (delay between layers), trailOpacity (0-1)
  const wrapWithMotionBlur = (content: React.ReactNode) => {
    if (needsMotionBlur) {
      return <Trail layers={5} lagInFrames={2} trailOpacity={0.5}>{content}</Trail>;
    }
    return content;
  };

  // Check for advanced element types in content/style
  const content = element.content?.toLowerCase() || '';
  const styleType = (element.style as Record<string, unknown>)?.elementType as string;

  // Heuristics: some plans use shape placeholders like "Cursor" or "Arrow".
  // Treat those as real elements to avoid giant blocks + label text.
  if (element.type === 'shape' && content.includes('cursor')) {
    return wrapWithMotionBlur(<CursorElement element={element} style={baseStyle} sceneFrame={sceneFrame} fps={fps} />);
  }

  if (element.type === 'shape' && content.includes('arrow')) {
    return wrapWithMotionBlur(<ArrowElement element={element} style={baseStyle} colors={colors} />);
  }
  
  // Route to advanced elements based on content keywords or explicit type
  if (styleType === 'code-editor' || content.includes('code') || content.includes('editor') || content.includes('syntax')) {
    return wrapWithMotionBlur(<CodeEditor element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
  }
  
  if (styleType === 'progress' || content.includes('progress') || content.includes('render') || content.includes('loading')) {
    return wrapWithMotionBlur(<ProgressBar element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
  }
  
  if (styleType === 'terminal' || content.includes('terminal') || content.includes('command') || content.includes('cli')) {
    return wrapWithMotionBlur(<Terminal element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
  }
  
  if (styleType === 'laptop' || content.includes('laptop') || content.includes('macbook')) {
    return wrapWithMotionBlur(<Laptop3D element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
  }
  
  if (styleType === '3d-card' || content.includes('3d card') || content.includes('perspective card')) {
    return wrapWithMotionBlur(<Perspective3DCard element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
  }

  // Render based on element type
  switch (element.type) {
    case 'text':
      return wrapWithMotionBlur(<TextElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} />);
    case 'shape':
      return wrapWithMotionBlur(<ShapeElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} sceneFrame={sceneFrame} />);
    case 'image':
      return wrapWithMotionBlur(<ImageElement element={element} style={baseStyle} globalStyle={globalStyle} colors={colors} />);
    case 'audio':
      return <AudioElement element={element} />;
    case 'video':
      return wrapWithMotionBlur(<VideoElement element={element} style={baseStyle} />);
    case 'cursor':
      return wrapWithMotionBlur(<CursorElement element={element} style={baseStyle} sceneFrame={sceneFrame} fps={fps} />);
    default:
      return null;
  }
};

// ============================================================================
// AUDIO ELEMENT - Renders audio with volume control
// ============================================================================
const AudioElement: React.FC<{
  element: PlannedElement;
}> = ({ element }) => {
  const audioStyle = element.style as Record<string, unknown>;
  const content = element.content || '';
  
  // Get audio source from content or style
  const audioSrc = content.startsWith('http') || content.startsWith('data:') 
    ? content 
    : (audioStyle?.src as string) || '';
  
  if (!audioSrc) return null;
  
  return (
    <Audio 
      src={audioSrc} 
      volume={typeof audioStyle?.volume === 'number' ? audioStyle.volume : 1}
    />
  );
};

// ============================================================================
// VIDEO ELEMENT - Renders video using OffthreadVideo
// ============================================================================
const VideoElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
}> = ({ element, style }) => {
  const videoStyle = element.style as Record<string, unknown>;
  const content = element.content || '';
  
  // Get video source from content or style
  const videoSrc = content.startsWith('http') || content.startsWith('data:') 
    ? content 
    : (videoStyle?.src as string) || '';
  
  if (!videoSrc) return null;
  
  const width = element.size?.width ? (element.size.width <= 100 ? `${element.size.width}%` : `${element.size.width}px`) : '640px';
  const height = element.size?.height ? (element.size.height <= 100 ? `${element.size.height}%` : `${element.size.height}px`) : '360px';
  
  return (
    <div
      style={{
        ...style,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <OffthreadVideo
        src={videoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: (videoStyle?.borderRadius as number) || 12,
        }}
      />
    </div>
  );
};

// ============================================================================
// TEXT ELEMENT - Kinetic typography with gradients and font loading
// ============================================================================
const TextElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
}> = React.memo(({ element, style, globalStyle, colors }) => {
  const textStyle = element.style as Record<string, unknown>;
  const content = element.content || '';
  
  // Load Inter font
  const { fontFamily } = loadFont();
  const [handle] = React.useState(() => delayRender());
  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    // Font loading is handled by @remotion/google-fonts automatically
    // We just need to mark rendering as ready
    setFontLoaded(true);
    continueRender(handle);
  }, [handle]);
  
  // Detect if this is a headline or subtext
  const fontSize = (textStyle.fontSize as number) || 48;
  const isHeadline = fontSize >= 48;
  
  // Calculate text dimensions if size constraints exist
  const maxWidth = element.size?.width 
    ? (element.size.width <= 100 ? window.innerWidth * (element.size.width / 100) : element.size.width)
    : window.innerWidth * 0.8;
  
  let adjustedFontSize = fontSize;
  
  if (fontLoaded && content) {
    try {
      const measurement = measureText({
        text: content,
        fontFamily: (textStyle.fontFamily as string) || fontFamily || 'Inter, system-ui, sans-serif',
        fontSize,
        fontWeight: String((textStyle.fontWeight as number) || (isHeadline ? 800 : 500)),
      });
      
      // Scale down if text is too wide
      if (measurement.width > maxWidth) {
        adjustedFontSize = fontSize * (maxWidth / measurement.width) * 0.95;
      }
    } catch (e) {
      // Fallback if measureText fails
      console.warn('measureText failed:', e);
    }
  }
  
  // Gradient text for headlines
  const useGradient = isHeadline && !textStyle.color;
  
  return (
    <div
      style={{
        ...style,
        fontFamily: (textStyle.fontFamily as string) || fontFamily || globalStyle?.typography?.primary || 'Inter, system-ui, sans-serif',
        fontSize: adjustedFontSize,
        fontWeight: (textStyle.fontWeight as number) || (isHeadline ? 800 : 500),
        letterSpacing: isHeadline ? '-0.02em' : '0',
        lineHeight: 1.1,
        textAlign: 'center',
        maxWidth: `${maxWidth}px`,
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
});

// ============================================================================
// SHAPE ELEMENT - Glassmorphic cards and UI elements
// ============================================================================
const ShapeElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
  sceneFrame: number;
}> = React.memo(({ element, style, globalStyle, colors, sceneFrame }) => {
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
  
  // New: Detect @remotion/shapes types
  const isCircle = content.toLowerCase().includes('circle') || content.toLowerCase().includes('dot');
  const isRect = content.toLowerCase().includes('rect') || content.toLowerCase().includes('square');
  const isTriangle = content.toLowerCase().includes('triangle') || content.toLowerCase().includes('arrow');
  const isStar = content.toLowerCase().includes('star');
  const isPolygon = content.toLowerCase().includes('polygon') || content.toLowerCase().includes('hexagon');
  
  const width = element.size?.width ? (element.size.width <= 100 ? `${element.size.width}%` : `${element.size.width}px`) : '300px';
  const height = element.size?.height ? (element.size.height <= 100 ? `${element.size.height}%` : `${element.size.height}px`) : '200px';
  const borderRadius = (shapeStyle.borderRadius as number) || (globalStyle?.borderRadius) || 24;
  const shapeSize = typeof element.size?.width === 'number' ? element.size.width : 200;
  const shapeColor = (shapeStyle.color as string) || colors[1] || '#06b6d4';
  
  // Render using @remotion/shapes for geometric shapes with MOTION GRAPHICS FLOW
  // Using noise3D for organic, choreographed motion like prompt-to-motion-graphics template
  
  if (isCircle) {
    // Motion graphics: Add organic pulse and drift for "flow"
    const pulse = 1 + noise3D('circle-pulse-' + element.id, sceneFrame * 0.08, 0, 0) * 0.15;
    const driftX = noise3D('circle-drift-x-' + element.id, sceneFrame * 0.02, 0, 0) * 20;
    const driftY = noise3D('circle-drift-y-' + element.id, 0, sceneFrame * 0.02, 0) * 15;
    const rotateZ = noise3D('circle-rot-' + element.id, sceneFrame * 0.01, 0, 0) * 10;
    
    return (
      <div style={{
        ...style,
        transform: `${style.transform} translateX(${driftX}px) translateY(${driftY}px) scale(${pulse}) rotate(${rotateZ}deg)`,
      }}>
        <Circle
          radius={shapeSize / 2}
          fill={shapeColor}
          stroke={colors[0] || '#ffffff'}
          strokeWidth={2}
        />
      </div>
    );
  }
  
  if (isRect) {
    // Motion graphics: Rotating and scaling with organic feel
    const pulse = 1 + noise3D('rect-pulse-' + element.id, sceneFrame * 0.06, 0, 0) * 0.1;
    const rotateZ = noise3D('rect-rot-' + element.id, sceneFrame * 0.015, 0, 0) * 15;
    
    return (
      <div style={{
        ...style,
        transform: `${style.transform} scale(${pulse}) rotate(${rotateZ}deg)`,
      }}>
        <Rect
          width={shapeSize}
          height={shapeSize}
          fill={shapeColor}
          stroke={colors[0] || '#ffffff'}
          strokeWidth={2}
          cornerRadius={borderRadius}
        />
      </div>
    );
  }
  
  if (isTriangle) {
    // Motion graphics: Floating triangle with rotation
    const floatY = noise3D('tri-float-' + element.id, 0, 0, sceneFrame * 0.025) * 25;
    const rotateZ = noise3D('tri-rot-' + element.id, sceneFrame * 0.02, 0, 0) * 20;
    
    return (
      <div style={{
        ...style,
        transform: `${style.transform} translateY(${floatY}px) rotate(${rotateZ}deg)`,
      }}>
        <Triangle
          length={shapeSize}
          fill={shapeColor}
          stroke={colors[0] || '#ffffff'}
          strokeWidth={2}
          direction="up"
        />
      </div>
    );
  }
  
  if (isStar) {
    // Motion graphics: Pulsing, spinning star
    const pulse = 1 + noise3D('star-pulse-' + element.id, sceneFrame * 0.1, 0, 0) * 0.2;
    const spin = (sceneFrame * 0.5) % 360; // Continuous slow spin
    const glow = 0.5 + noise3D('star-glow-' + element.id, sceneFrame * 0.05, 0, 0) * 0.3;
    
    return (
      <div style={{
        ...style,
        transform: `${style.transform} scale(${pulse}) rotate(${spin}deg)`,
        filter: `drop-shadow(0 0 ${20 * glow}px ${shapeColor})`,
      }}>
        <Star
          points={5}
          innerRadius={shapeSize * 0.4}
          outerRadius={shapeSize}
          fill={shapeColor}
          stroke={colors[0] || '#ffffff'}
          strokeWidth={2}
        />
      </div>
    );
  }
  
  if (isPolygon) {
    // Motion graphics: Slow rotating polygon with breathing effect
    const breathe = 1 + noise3D('poly-breathe-' + element.id, sceneFrame * 0.04, 0, 0) * 0.12;
    const rotateZ = (sceneFrame * 0.3) % 360;
    
    return (
      <div style={{
        ...style,
        transform: `${style.transform} scale(${breathe}) rotate(${rotateZ}deg)`,
      }}>
        <Polygon
          points={6}
          radius={shapeSize / 2}
          fill={shapeColor}
          stroke={colors[0] || '#ffffff'}
          strokeWidth={2}
        />
      </div>
    );
  }
  
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
    // Throttle rotation to every 4th frame for performance
    const throttledFrame = Math.floor(sceneFrame / 4) * 4;
    const rotation = throttledFrame * 0.5;
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
});

// ============================================================================
// ARROW ELEMENT - Render a proper arrow icon instead of a label block
// ============================================================================
const ArrowElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  colors: string[];
}> = React.memo(({ element, style, colors }) => {
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
});

// ============================================================================
// IMAGE ELEMENT - Renders actual images from URLs
// ============================================================================
const ImageElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle: VideoPlan['style'];
  colors: string[];
}> = React.memo(({ element, style, colors }) => {
  const content = element.content || '';
  const imageStyle = element.style as Record<string, unknown>;
  
  // Detect if content is a URL
  const isUrl = content.startsWith('http') || content.startsWith('data:');
  const imageUrl = isUrl ? content : (imageStyle?.src as string) || '';
  
  const width = element.size?.width ? (element.size.width <= 100 ? `${element.size.width}%` : `${element.size.width}px`) : '300px';
  const height = element.size?.height ? (element.size.height <= 100 ? `${element.size.height}%` : `${element.size.height}px`) : '200px';
  
  // If we have a valid image URL, render the actual image
  if (imageUrl) {
    return (
      <div
        style={{
          ...style,
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Img
          src={imageUrl}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: (imageStyle?.filter as string) || undefined,
            borderRadius: (imageStyle?.borderRadius as number) || 12,
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    );
  }
  
  // Fallback: placeholder if no URL
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
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
        <path d="M3 16l5-5 3 3 5-5 5 5v3a3 3 0 01-3 3H6a3 3 0 01-3-3v-1z" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
});

// ============================================================================
// CURSOR ELEMENT - Animated cursor with click effect
// ============================================================================
const CursorElement: React.FC<{
  element: PlannedElement;
  style: React.CSSProperties;
  sceneFrame: number;
  fps: number;
}> = React.memo(({ element, style, sceneFrame, fps }) => {
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
      const xValues = anim.properties.x as number[];
      // Ensure we only use 2 values for interpolation (start and end)
      const xRange = xValues.length >= 2 ? [xValues[0], xValues[xValues.length - 1]] : xValues;
      cursorX = interpolate(moveProgress, [0, 1], xRange);
    }
    if (anim.properties.y && Array.isArray(anim.properties.y)) {
      const yValues = anim.properties.y as number[];
      // Ensure we only use 2 values for interpolation (start and end)
      const yRange = yValues.length >= 2 ? [yValues[0], yValues[yValues.length - 1]] : yValues;
      cursorY = interpolate(moveProgress, [0, 1], yRange);
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
});

export default DynamicVideo;
