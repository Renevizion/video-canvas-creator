/**
 * Shared Animation Utilities for Remotion Components
 * 
 * This file contains reusable animation functions, easing curves, and helper utilities
 * for creating polished, professional animations in Remotion videos.
 */

import { noise3D } from '@remotion/noise';
import { interpolate } from 'remotion';

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

/**
 * Ease out quart - Fast start, slow end
 * Perfect for: Elements coming to rest
 */
export const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

/**
 * Ease in out cubic - Smooth acceleration and deceleration
 * Perfect for: Natural-feeling movements
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Ease out expo - Very fast start, very slow end
 * Perfect for: Dramatic entrances
 */
export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * Ease in out back - Slight overshoot for personality
 * Perfect for: Playful animations
 */
export const easeInOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const springConfigs = {
  /**
   * Gentle spring - Smooth, subtle motion
   * Use for: Background elements, ambient animations
   */
  gentle: {
    damping: 50,
    stiffness: 80,
    mass: 1,
  },
  
  /**
   * Snappy spring - Quick, responsive feel
   * Use for: UI interactions, button presses
   */
  snappy: {
    damping: 30,
    stiffness: 150,
    mass: 0.5,
  },
  
  /**
   * Bouncy spring - Playful overshoot
   * Use for: Attention-grabbing elements, playful UIs
   */
  bouncy: {
    damping: 15,
    stiffness: 120,
    mass: 1.2,
  },
  
  /**
   * Slow spring - Gradual, heavy motion
   * Use for: Large elements, dramatic effects
   */
  slow: {
    damping: 40,
    stiffness: 50,
    mass: 1.5,
  },
  
  /**
   * Smooth spring - Balanced, professional feel
   * Use for: General purpose animations
   */
  smooth: {
    damping: 35,
    stiffness: 100,
    mass: 0.8,
  },
};

// ============================================================================
// CURSOR ANIMATIONS
// ============================================================================

/**
 * Smooth cursor opacity for blinking effect
 * Creates a smooth fade in/out instead of harsh toggle
 * 
 * @param frame - Current frame number
 * @param blinkSpeed - Speed multiplier (default: 1, higher = faster)
 * @returns Opacity value between 0 and 1
 */
export const smoothCursorBlink = (frame: number, blinkSpeed: number = 1): number => {
  const cycle = ((frame * blinkSpeed) % 60) / 60;
  const sinValue = Math.sin(cycle * Math.PI * 2);
  return easeInOutCubic((sinValue + 1) / 2);
};

/**
 * Cursor glow intensity
 * Creates a pulsing glow effect around the cursor
 * 
 * @param frame - Current frame number
 * @param baseIntensity - Base glow strength (0-1)
 * @returns Glow intensity multiplier
 */
export const cursorGlowIntensity = (frame: number, baseIntensity: number = 0.5): number => {
  const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7;
  return baseIntensity * pulse;
};

// ============================================================================
// CAMERA EFFECTS
// ============================================================================

/**
 * Camera shake effect
 * Creates realistic camera shake using 3D noise
 * 
 * @param frame - Current frame number
 * @param intensity - Shake intensity (default: 5)
 * @param seed - Unique seed for this shake instance
 * @returns Object with x and y offset values
 */
export const cameraShake = (
  frame: number,
  intensity: number = 5,
  seed: string = 'shake'
): { x: number; y: number } => ({
  x: noise3D(`${seed}-x`, frame * 0.1, 0, 0) * intensity,
  y: noise3D(`${seed}-y`, 0, frame * 0.1, 0) * intensity,
});

/**
 * Smooth camera zoom
 * Creates a smooth zoom effect with easing
 * 
 * @param frame - Current frame number
 * @param startFrame - Frame to start zoom
 * @param endFrame - Frame to end zoom
 * @param startZoom - Initial zoom level (1 = normal)
 * @param endZoom - Final zoom level
 * @returns Current zoom scale
 */
export const smoothCameraZoom = (
  frame: number,
  startFrame: number,
  endFrame: number,
  startZoom: number = 1,
  endZoom: number = 1.2
): number => {
  return interpolate(
    frame,
    [startFrame, endFrame],
    [startZoom, endZoom],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeInOutCubic,
    }
  );
};

// ============================================================================
// LIGHTING EFFECTS
// ============================================================================

/**
 * Dynamic glow intensity
 * Creates a pulsing glow effect
 * 
 * @param frame - Current frame number
 * @param baseIntensity - Base glow strength
 * @param pulseSpeed - Speed of pulsing (default: 0.05)
 * @returns Glow intensity value
 */
export const dynamicGlowIntensity = (
  frame: number,
  baseIntensity: number,
  pulseSpeed: number = 0.05
): number => {
  const pulse = Math.sin(frame * pulseSpeed) * 0.3 + 0.7;
  return baseIntensity * pulse;
};

/**
 * Dynamic light source position
 * Creates a moving light source for realistic shadows
 * 
 * @param frame - Current frame number
 * @param radius - Movement radius
 * @param speed - Movement speed
 * @returns Object with x and y position
 */
export const dynamicLightPosition = (
  frame: number,
  radius: number = 100,
  speed: number = 0.02
): { x: number; y: number } => ({
  x: noise3D('light-x', frame * speed, 0, 0) * radius,
  y: noise3D('light-y', 0, frame * speed, 0) * radius,
});

// ============================================================================
// MOTION EFFECTS
// ============================================================================

/**
 * Floating motion
 * Creates organic up/down floating motion
 * 
 * @param frame - Current frame number
 * @param amplitude - Float distance (default: 10)
 * @param speed - Float speed (default: 0.02)
 * @param seed - Unique seed for this float instance
 * @returns Y offset value
 */
export const floatingMotion = (
  frame: number,
  amplitude: number = 10,
  speed: number = 0.02,
  seed: string = 'float'
): number => {
  return noise3D(seed, 0, 0, frame * speed) * amplitude;
};

/**
 * Bobbing motion (figure-8 pattern)
 * Creates a more complex floating motion
 * 
 * @param frame - Current frame number
 * @param xAmplitude - Horizontal amplitude
 * @param yAmplitude - Vertical amplitude
 * @param speed - Motion speed
 * @returns Object with x and y offsets
 */
export const bobbingMotion = (
  frame: number,
  xAmplitude: number = 8,
  yAmplitude: number = 12,
  speed: number = 0.03
): { x: number; y: number } => ({
  x: Math.sin(frame * speed) * xAmplitude,
  y: Math.sin(frame * speed * 0.5) * yAmplitude,
});

/**
 * Rotating motion with inertia
 * Creates realistic rotation that speeds up and slows down
 * 
 * @param frame - Current frame number
 * @param baseSpeed - Base rotation speed
 * @param seed - Unique seed for this rotation
 * @returns Rotation angle in degrees
 */
export const rotatingWithInertia = (
  frame: number,
  baseSpeed: number = 1,
  seed: string = 'rotate'
): number => {
  const speedVariation = noise3D(seed, frame * 0.01, 0, 0) * 0.5 + 1;
  return (frame * baseSpeed * speedVariation) % 360;
};

// ============================================================================
// PARALLAX EFFECTS
// ============================================================================

/**
 * Parallax layer offset
 * Creates depth through layered movement
 * 
 * @param frame - Current frame number
 * @param layerDepth - Depth of this layer (0 = foreground, 1 = background)
 * @param scrollSpeed - Base scroll speed
 * @returns X offset for parallax effect
 */
export const parallaxOffset = (
  frame: number,
  layerDepth: number,
  scrollSpeed: number = 1
): number => {
  return frame * scrollSpeed * (1 - layerDepth * 0.7);
};

// ============================================================================
// SCREEN EFFECTS
// ============================================================================

/**
 * CRT scan line effect
 * Creates retro screen scan lines
 * 
 * @param frame - Current frame number
 * @param lineSpeed - Speed of scan line movement
 * @returns Y position of scan line
 */
export const scanLinePosition = (
  frame: number,
  lineSpeed: number = 2
): number => {
  return (frame * lineSpeed) % 1080; // Assuming 1080p
};

/**
 * Screen flicker
 * Creates subtle screen flicker effect
 * 
 * @param frame - Current frame number
 * @param intensity - Flicker intensity (0-1)
 * @returns Opacity multiplier
 */
export const screenFlicker = (
  frame: number,
  intensity: number = 0.05
): number => {
  const flicker = noise3D('flicker', frame * 0.5, 0, 0);
  return 1 - (flicker * intensity);
};

// ============================================================================
// TYPING EFFECTS
// ============================================================================

/**
 * Variable typing speed
 * Creates realistic typing with variable character delays
 * 
 * @param charIndex - Current character index
 * @param prevChar - Previous character
 * @param currentChar - Current character
 * @returns Delay multiplier for this character
 */
export const typingSpeed = (
  charIndex: number,
  prevChar: string,
  currentChar: string
): number => {
  // Faster for repeated characters
  if (prevChar === currentChar) return 0.7;
  
  // Slower after punctuation
  if (['.', '!', '?', ','].includes(prevChar)) return 1.5;
  
  // Slower for capital letters
  if (currentChar === currentChar.toUpperCase() && currentChar !== currentChar.toLowerCase()) {
    return 1.2;
  }
  
  // Normal speed
  return 1.0;
};

// ============================================================================
// SCROLL EFFECTS
// ============================================================================

/**
 * Smooth scroll position
 * Creates smooth scrolling with easing
 * 
 * @param frame - Current frame number
 * @param startFrame - Frame to start scrolling
 * @param endFrame - Frame to end scrolling
 * @param startPos - Initial scroll position
 * @param endPos - Final scroll position
 * @returns Current scroll position
 */
export const smoothScrollPosition = (
  frame: number,
  startFrame: number,
  endFrame: number,
  startPos: number,
  endPos: number
): number => {
  return interpolate(
    frame,
    [startFrame, endFrame],
    [startPos, endPos],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easeOutQuart,
    }
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Staggered delay
 * Calculates delay for staggered animations
 * 
 * @param index - Item index
 * @param staggerAmount - Delay between items in frames
 * @returns Delay in frames
 */
export const staggeredDelay = (index: number, staggerAmount: number = 3): number => {
  return index * staggerAmount;
};

/**
 * Clamp value
 * Restricts value to min/max range
 * 
 * @param value - Input value
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation
 * Simple lerp between two values
 * 
 * @param start - Start value
 * @param end - End value
 * @param t - Progress (0-1)
 * @returns Interpolated value
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};
