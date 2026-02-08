/**
 * Enhanced Scene Renderer - Claude-Style Compositions
 * 
 * This renderer creates professional-quality scenes with proper Remotion animations,
 * matching the quality of hand-crafted code like Claude's MobaJump example.
 * 
 * Features:
 * - Spring-based emoji/icon animations
 * - Proper text hierarchy with staggered reveals
 * - Professional backgrounds (gradients, colors)
 * - Dramatic timing and pacing
 * - Visual effects (shadows, glows)
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing
} from 'remotion';
import type { PlannedScene, PlannedElement } from '@/types/video';

interface EnhancedSceneProps {
  scene: PlannedScene;
  style?: any;
}

/**
 * Enhanced Scene Renderer with Claude-quality animations
 */
export const EnhancedSceneRenderer: React.FC<EnhancedSceneProps> = ({ scene, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Scene fade in/out
  const sceneOpacity = interpolate(
    frame,
    [0, 15, scene.duration * fps - 15, scene.duration * fps],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );
  
  // Get background style
  const background = getSceneBackground(scene, style);
  
  return (
    <AbsoluteFill style={{ ...background, opacity: sceneOpacity }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '40px',
          position: 'relative'
        }}
      >
        {scene.elements.map((element, index) => (
          <EnhancedElement
            key={element.id}
            element={element}
            index={index}
            frame={frame}
            fps={fps}
            sceneType={scene.description}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Enhanced Element Renderer with proper animations
 */
const EnhancedElement: React.FC<{
  element: PlannedElement;
  index: number;
  frame: number;
  fps: number;
  sceneType?: string;
}> = ({ element, index, frame, fps, sceneType }) => {
  const delay = element.animation?.delay || 0;
  const delayFrames = Math.floor(delay * fps);
  const elType = element.type as string;
  
  // Determine element type and render appropriately
  if (elType === 'emoji' || elType === 'icon') {
    return <AnimatedEmoji element={element} frame={frame} fps={fps} delayFrames={delayFrames} />;
  }
  
  if (elType === 'text' || elType === 'heading' || elType === 'title') {
    return <AnimatedText element={element} frame={frame} fps={fps} delayFrames={delayFrames} index={index} />;
  }
  
  if (elType === 'cta-button' || elType === 'button') {
    return <AnimatedButton element={element} frame={frame} fps={fps} delayFrames={delayFrames} />;
  }
  
  if (elType === 'list-item') {
    return <AnimatedListItem element={element} frame={frame} fps={fps} delayFrames={delayFrames} index={index} />;
  }
  
  // Default text rendering
  return <AnimatedText element={element} frame={frame} fps={fps} delayFrames={delayFrames} index={index} />;
};

/**
 * Animated Emoji with Spring Effect (Claude-style)
 */
const AnimatedEmoji: React.FC<{
  element: PlannedElement;
  frame: number;
  fps: number;
  delayFrames: number;
}> = ({ element, frame, fps, delayFrames }) => {
  // Spring animation for scale (like Claude's example)
  const scale = spring({
    frame: frame - delayFrames,
    fps,
    config: {
      damping: 20,
      mass: 1,
      stiffness: 100
    }
  });
  
  // Optional glow effect for special emojis
  const hasGlow = element.style?.glow || element.content?.includes('💡') || element.content?.includes('🚀');
  const glowColor = String(element.style?.glowColor || '#ffd700');
  
  return (
    <div
      style={{
        fontSize: Number(element.style?.fontSize) || 120,
        marginBottom: Number(element.style?.marginBottom) || 30,
        transform: `scale(${scale})`,
        filter: hasGlow ? `drop-shadow(0 0 30px ${glowColor})` : undefined,
        ...getPositionStyle(element)
      }}
    >
      {element.content}
    </div>
  );
};

/**
 * Animated Text with Fade and Optional Slide (Claude-style)
 */
const AnimatedText: React.FC<{
  element: PlannedElement;
  frame: number;
  fps: number;
  delayFrames: number;
  index: number;
}> = ({ element, frame, fps, delayFrames, index }) => {
  // Fade in animation
  const opacity = interpolate(
    frame,
    [delayFrames, delayFrames + 15],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease)
    }
  );
  
  const elType = element.type as string;
  
  // Optional slide animation for headlines
  const slideY = elType === 'heading' ? interpolate(
    frame,
    [delayFrames, delayFrames + 20],
    [10, 0],
    { extrapolateRight: 'clamp' }
  ) : 0;
  
  // Determine text styling based on type
  const fontWeightNum = Number(element.style?.fontWeight) || 500;
  const isHeadline = elType === 'heading' || elType === 'title' || fontWeightNum > 700;
  const isBody = elType === 'text' || elType === 'body';
  const isQuote = element.content?.includes('"') || element.content?.includes('"');
  
  let fontSize: number = Number(element.style?.fontSize) || 36;
  let fontWeight: number = fontWeightNum;
  let color: string = String(element.style?.color || '#fff');
  let marginBottom: number = Number(element.style?.marginBottom) || 20;
  
  if (isHeadline) {
    fontSize = Number(element.style?.fontSize) || 56;
    fontWeight = Number(element.style?.fontWeight) || 800;
    marginBottom = 20;
  } else if (isBody) {
    fontSize = Number(element.style?.fontSize) || 36;
    fontWeight = 500;
  } else if (isQuote) {
    fontSize = Number(element.style?.fontSize) || 32;
    fontWeight = 400;
    color = String(element.style?.color || '#ff6b6b');
  }
  
  return (
    <div
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign: 'center',
        marginBottom,
        fontFamily: String(element.style?.fontFamily || 'Arial, sans-serif'),
        lineHeight: '1.4',
        maxWidth: Number(element.style?.maxWidth) || 800,
        opacity,
        transform: `translateY(${slideY}px)`,
        textShadow: isHeadline ? '2px 2px 4px rgba(0,0,0,0.3)' : undefined,
        ...getPositionStyle(element)
      }}
    >
      {element.content}
    </div>
  );
};

/**
 * Animated Button with Spring Effect (Claude-style CTA)
 */
const AnimatedButton: React.FC<{
  element: PlannedElement;
  frame: number;
  fps: number;
  delayFrames: number;
}> = ({ element, frame, fps, delayFrames }) => {
  // Spring animation for scale
  const scale = spring({
    frame: frame - delayFrames,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 100
    }
  });
  
  return (
    <div
      style={{
        background: String(element.style?.background || '#fff'),
        color: String(element.style?.color || '#764ba2'),
        fontSize: Number(element.style?.fontSize) || 40,
        fontWeight: Number(element.style?.fontWeight) || 700,
        padding: String(element.style?.padding || '25px 60px'),
        borderRadius: Number(element.style?.borderRadius) || 50,
        fontFamily: 'Arial, sans-serif',
        transform: `scale(${scale})`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        ...getPositionStyle(element)
      }}
    >
      {element.content}
    </div>
  );
};

/**
 * Animated List Item with Stagger Effect (Claude-style)
 */
const AnimatedListItem: React.FC<{
  element: PlannedElement;
  frame: number;
  fps: number;
  delayFrames: number;
  index: number;
}> = ({ element, frame, fps, delayFrames, index }) => {
  // Stagger effect: each item delays by 20 frames
  const itemDelay = delayFrames + (index * 20);
  
  const opacity = interpolate(
    frame,
    [itemDelay, itemDelay + 15],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  const translateX = interpolate(
    frame,
    [itemDelay, itemDelay + 20],
    [-100, 0],
    { extrapolateRight: 'clamp' }
  );
  
  // Extract icon and text if format is "icon text"
  const parts = element.content?.split(' ') || [];
  const icon = parts[0];
  const text = parts.slice(1).join(' ');
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        opacity,
        transform: `translateX(${translateX}px)`,
        marginBottom: Number(element.style?.marginBottom) || 30,
        ...getPositionStyle(element)
      }}
    >
      {icon && (
        <span style={{ fontSize: Number(element.style?.iconSize) || 48 }}>
          {icon}
        </span>
      )}
      {text && (
        <span
          style={{
            color: String(element.style?.color || '#dfe6e9'),
            fontSize: Number(element.style?.fontSize) || 36,
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

/**
 * Get scene background styling (gradients, colors)
 */
function getSceneBackground(scene: PlannedScene, style?: any): React.CSSProperties {
  // Check for style in passed prop or scene description
  const sceneStyle = style || (scene as any).style;
  
  // Check for gradient in scene description or style
  if (sceneStyle?.background?.includes?.('gradient') || sceneStyle?.gradient) {
    return {
      background: String(sceneStyle.background || sceneStyle.gradient)
    };
  }
  
  // Check for solid color
  if (sceneStyle?.background || sceneStyle?.backgroundColor) {
    return {
      backgroundColor: String(sceneStyle.background || sceneStyle.backgroundColor)
    };
  }
  
  // Default based on scene type/description
  const description = scene.description?.toLowerCase() || '';
  
  if (description.includes('frustration') || description.includes('problem')) {
    return { backgroundColor: '#1a1a2e' };
  }
  
  if (description.includes('struggle') || description.includes('challenge')) {
    return { backgroundColor: '#2d3436' };
  }
  
  if (description.includes('discovery') || description.includes('aha') || description.includes('insight')) {
    return { background: 'linear-gradient(135deg, #0f4c75 0%, #1b262c 100%)' };
  }
  
  if (description.includes('solution') || description.includes('product') || description.includes('intro')) {
    return { backgroundColor: '#6c5ce7' };
  }
  
  if (description.includes('benefit') || description.includes('feature')) {
    return { backgroundColor: '#fd79a8' };
  }
  
  if (description.includes('success') || description.includes('happy') || description.includes('celebration')) {
    return { backgroundColor: '#55efc4' };
  }
  
  if (description.includes('cta') || description.includes('call to action') || description.includes('closing')) {
    return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
  }
  
  // Default gradient
  return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
}

/**
 * Get position styling for element
 */
function getPositionStyle(element: PlannedElement): React.CSSProperties {
  if (!element.position) return {};
  
  // If using percentage positions, convert to absolute
  if (element.position.x !== undefined && element.position.y !== undefined) {
    return {
      position: 'absolute',
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      transform: 'translate(-50%, -50%)'
    };
  }
  
  return {};
}
