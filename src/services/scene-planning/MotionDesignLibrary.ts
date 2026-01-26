/**
 * Motion Design Library Service
 * 
 * Provides professional motion design presets and animation systems:
 * - Animation presets for different styles (cinematic, tech, corporate, creative)
 * - Keyframe-based animation support
 * - Easing curves library
 * - Coordinated multi-element animations
 */

import type { AnimationPattern, PlannedElement, PlannedScene } from '@/types/video';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type MotionStyle = 'cinematic' | 'tech' | 'corporate' | 'creative' | 'social' | 'minimal';

export interface MotionPreset {
  style: MotionStyle;
  name: string;
  description: string;
  defaultDuration: number;
  easing: string;
  animations: AnimationPattern[];
}

export interface KeyframeAnimation {
  property: string;
  keyframes: Keyframe[];
}

export interface Keyframe {
  time: number; // 0-1 (percentage of animation duration)
  value: any;
  easing?: string;
}

export interface CoordinatedAnimation {
  elements: string[]; // element IDs
  choreography: 'sequential' | 'parallel' | 'staggered' | 'wave';
  delay: number;
  animations: AnimationPattern[];
}

export interface EasingCurve {
  name: string;
  cssValue: string;
  description: string;
  bezier?: [number, number, number, number];
}

// ============================================================================
// MOTION DESIGN LIBRARY
// ============================================================================

export class MotionDesignLibrary {
  
  /**
   * Get motion preset by style
   */
  getMotionPreset(style: MotionStyle): MotionPreset {
    const presets: Record<MotionStyle, MotionPreset> = {
      cinematic: {
        style: 'cinematic',
        name: 'Cinematic',
        description: 'Slow, dramatic movements with smooth easing',
        defaultDuration: 1.2,
        easing: 'easeInOut',
        animations: [
          {
            name: 'SlowReveal',
            type: 'fade',
            duration: 1.5,
            easing: 'easeInOut',
            delay: 0,
            properties: {
              from: { opacity: 0, y: -30 },
              to: { opacity: 1, y: 0 }
            }
          },
          {
            name: 'DramaticZoom',
            type: 'scale',
            duration: 2.0,
            easing: 'easeOut',
            delay: 0.5,
            properties: {
              from: { scale: 1.2 },
              to: { scale: 1.0 }
            }
          }
        ]
      },
      
      tech: {
        style: 'tech',
        name: 'Tech',
        description: 'Sharp, precise movements with quick easing',
        defaultDuration: 0.5,
        easing: 'easeOut',
        animations: [
          {
            name: 'DigitalSlide',
            type: 'slide',
            duration: 0.6,
            easing: 'easeOut',
            delay: 0,
            properties: {
              from: { x: -100, opacity: 0 },
              to: { x: 0, opacity: 1 }
            }
          },
          {
            name: 'TechGlitch',
            type: 'custom',
            duration: 0.3,
            easing: 'linear',
            delay: 0,
            properties: {
              glitchIntensity: 0.5,
              chromaShift: 3
            }
          }
        ]
      },
      
      corporate: {
        style: 'corporate',
        name: 'Corporate',
        description: 'Professional, smooth movements with medium pacing',
        defaultDuration: 0.8,
        easing: 'easeInOut',
        animations: [
          {
            name: 'ProfessionalFade',
            type: 'fade',
            duration: 0.8,
            easing: 'easeInOut',
            delay: 0,
            properties: {
              from: { opacity: 0 },
              to: { opacity: 1 }
            }
          },
          {
            name: 'SmoothSlide',
            type: 'slide',
            duration: 0.7,
            easing: 'easeInOut',
            delay: 0.2,
            properties: {
              from: { y: 20, opacity: 0 },
              to: { y: 0, opacity: 1 }
            }
          }
        ]
      },
      
      creative: {
        style: 'creative',
        name: 'Creative',
        description: 'Playful, bouncy movements with spring easing',
        defaultDuration: 0.6,
        easing: 'spring',
        animations: [
          {
            name: 'BouncyPop',
            type: 'scale',
            duration: 0.6,
            easing: 'spring',
            delay: 0,
            properties: {
              from: { scale: 0, rotation: -10 },
              to: { scale: 1, rotation: 0 }
            }
          },
          {
            name: 'PlayfulSpin',
            type: 'rotate',
            duration: 0.8,
            easing: 'spring',
            delay: 0,
            properties: {
              from: { rotation: 0 },
              to: { rotation: 360 }
            }
          }
        ]
      },
      
      social: {
        style: 'social',
        name: 'Social Media',
        description: 'Fast, energetic movements with punchy timing',
        defaultDuration: 0.3,
        easing: 'easeOut',
        animations: [
          {
            name: 'QuickPop',
            type: 'scale',
            duration: 0.3,
            easing: 'easeOut',
            delay: 0,
            properties: {
              from: { scale: 0.5, opacity: 0 },
              to: { scale: 1, opacity: 1 }
            }
          },
          {
            name: 'FastSlide',
            type: 'slide',
            duration: 0.25,
            easing: 'easeOut',
            delay: 0,
            properties: {
              from: { x: 50, opacity: 0 },
              to: { x: 0, opacity: 1 }
            }
          }
        ]
      },
      
      minimal: {
        style: 'minimal',
        name: 'Minimal',
        description: 'Subtle, understated movements focusing on content',
        defaultDuration: 0.5,
        easing: 'easeOut',
        animations: [
          {
            name: 'SubtleFade',
            type: 'fade',
            duration: 0.5,
            easing: 'easeOut',
            delay: 0,
            properties: {
              from: { opacity: 0 },
              to: { opacity: 1 }
            }
          },
          {
            name: 'GentleSlide',
            type: 'slide',
            duration: 0.6,
            easing: 'easeOut',
            delay: 0,
            properties: {
              from: { y: 10, opacity: 0 },
              to: { y: 0, opacity: 1 }
            }
          }
        ]
      }
    };
    
    return presets[style];
  }
  
  /**
   * Get easing curve by name
   */
  getEasingCurve(name: string): EasingCurve {
    const curves: Record<string, EasingCurve> = {
      linear: {
        name: 'linear',
        cssValue: 'linear',
        description: 'Constant speed throughout',
        bezier: [0, 0, 1, 1]
      },
      easeIn: {
        name: 'easeIn',
        cssValue: 'ease-in',
        description: 'Slow start, fast end',
        bezier: [0.42, 0, 1, 1]
      },
      easeOut: {
        name: 'easeOut',
        cssValue: 'ease-out',
        description: 'Fast start, slow end',
        bezier: [0, 0, 0.58, 1]
      },
      easeInOut: {
        name: 'easeInOut',
        cssValue: 'ease-in-out',
        description: 'Slow start and end, fast middle',
        bezier: [0.42, 0, 0.58, 1]
      },
      spring: {
        name: 'spring',
        cssValue: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        description: 'Bouncy, elastic movement',
        bezier: [0.68, -0.55, 0.265, 1.55]
      },
      bounce: {
        name: 'bounce',
        cssValue: 'cubic-bezier(0.68, -0.35, 0.265, 1.35)',
        description: 'Moderate bounce effect',
        bezier: [0.68, -0.35, 0.265, 1.35]
      },
      anticipate: {
        name: 'anticipate',
        cssValue: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
        description: 'Pulls back before moving forward',
        bezier: [0.36, 0, 0.66, -0.56]
      },
      overshoot: {
        name: 'overshoot',
        cssValue: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        description: 'Goes past target then settles',
        bezier: [0.34, 1.56, 0.64, 1]
      },
      decelerate: {
        name: 'decelerate',
        cssValue: 'cubic-bezier(0, 0, 0.2, 1)',
        description: 'Fast start with gradual slow down',
        bezier: [0, 0, 0.2, 1]
      },
      accelerate: {
        name: 'accelerate',
        cssValue: 'cubic-bezier(0.4, 0, 1, 1)',
        description: 'Gradual speed up',
        bezier: [0.4, 0, 1, 1]
      }
    };
    
    return curves[name] || curves.easeOut;
  }
  
  /**
   * Apply motion preset to scene
   */
  applyMotionPreset(scene: PlannedScene, style: MotionStyle): PlannedScene {
    const preset = this.getMotionPreset(style);
    
    return {
      ...scene,
      elements: scene.elements.map((element, index) => {
        // Select animation based on element position
        const animation = preset.animations[index % preset.animations.length];
        
        return {
          ...element,
          animation: {
            ...animation,
            delay: index * 0.1 // Stagger animations
          }
        };
      }),
      animations: preset.animations
    };
  }
  
  /**
   * Create coordinated animation for multiple elements
   */
  createCoordinatedAnimation(
    elements: PlannedElement[],
    choreography: CoordinatedAnimation['choreography'],
    baseAnimation: AnimationPattern
  ): PlannedElement[] {
    
    return elements.map((element, index) => {
      let delay = baseAnimation.delay || 0;
      
      switch (choreography) {
        case 'sequential':
          // One after another
          delay += index * baseAnimation.duration;
          break;
          
        case 'parallel':
          // All at once
          delay = baseAnimation.delay || 0;
          break;
          
        case 'staggered':
          // Slight delay between each
          delay += index * 0.1;
          break;
          
        case 'wave':
          // Wave effect (center first, then outwards)
          const middle = Math.floor(elements.length / 2);
          const distance = Math.abs(index - middle);
          delay += distance * 0.08;
          break;
      }
      
      return {
        ...element,
        animation: {
          ...baseAnimation,
          delay
        }
      };
    });
  }
  
  /**
   * Create keyframe animation
   */
  createKeyframeAnimation(
    property: string,
    keyframes: Keyframe[]
  ): KeyframeAnimation {
    return {
      property,
      keyframes: keyframes.sort((a, b) => a.time - b.time)
    };
  }
  
  /**
   * Generate entrance animation based on element type
   */
  generateEntranceAnimation(
    element: PlannedElement,
    style: MotionStyle
  ): AnimationPattern {
    
    const preset = this.getMotionPreset(style);
    
    // Select animation based on element type
    const animations: Record<string, AnimationPattern> = {
      text: {
        name: 'TextFadeIn',
        type: 'fade',
        duration: preset.defaultDuration,
        easing: preset.easing,
        delay: 0,
        properties: {
          from: { opacity: 0, y: 20 },
          to: { opacity: 1, y: 0 }
        }
      },
      image: {
        name: 'ImageZoom',
        type: 'scale',
        duration: preset.defaultDuration * 1.2,
        easing: preset.easing,
        delay: 0,
        properties: {
          from: { scale: 0.9, opacity: 0 },
          to: { scale: 1, opacity: 1 }
        }
      },
      shape: {
        name: 'ShapeExpand',
        type: 'scale',
        duration: preset.defaultDuration * 0.8,
        easing: 'spring',
        delay: 0,
        properties: {
          from: { scale: 0 },
          to: { scale: 1 }
        }
      },
      'phone-mockup': {
        name: 'PhoneRotateIn',
        type: 'custom',
        duration: preset.defaultDuration * 1.5,
        easing: preset.easing,
        delay: 0,
        properties: {
          from: { scale: 0.8, rotateY: -30, opacity: 0 },
          to: { scale: 1, rotateY: 0, opacity: 1 }
        }
      },
      'logo-grid': {
        name: 'LogoStagger',
        type: 'fade',
        duration: preset.defaultDuration,
        easing: preset.easing,
        delay: 0,
        properties: {
          from: { opacity: 0, scale: 0.8 },
          to: { opacity: 1, scale: 1 }
        }
      },
      'data-viz': {
        name: 'ChartDraw',
        type: 'custom',
        duration: preset.defaultDuration * 2,
        easing: 'easeOut',
        delay: 0,
        properties: {
          drawProgress: { from: 0, to: 1 }
        }
      },
      'stats-counter': {
        name: 'CountUp',
        type: 'custom',
        duration: preset.defaultDuration * 2.5,
        easing: 'easeOut',
        delay: 0,
        properties: {
          count: { from: 0, to: 1 }
        }
      }
    };
    
    return animations[element.type] || animations.text;
  }
  
  /**
   * Generate exit animation based on element type
   */
  generateExitAnimation(
    element: PlannedElement,
    style: MotionStyle
  ): AnimationPattern {
    
    const preset = this.getMotionPreset(style);
    
    const animations: Record<string, AnimationPattern> = {
      text: {
        name: 'TextFadeOut',
        type: 'fade',
        duration: preset.defaultDuration * 0.7,
        easing: 'easeIn',
        delay: 0,
        properties: {
          from: { opacity: 1, y: 0 },
          to: { opacity: 0, y: -20 }
        }
      },
      image: {
        name: 'ImageShrink',
        type: 'scale',
        duration: preset.defaultDuration * 0.8,
        easing: 'easeIn',
        delay: 0,
        properties: {
          from: { scale: 1, opacity: 1 },
          to: { scale: 0.8, opacity: 0 }
        }
      },
      default: {
        name: 'FadeOut',
        type: 'fade',
        duration: preset.defaultDuration * 0.6,
        easing: 'easeIn',
        delay: 0,
        properties: {
          from: { opacity: 1 },
          to: { opacity: 0 }
        }
      }
    };
    
    return animations[element.type] || animations.default;
  }
  
  /**
   * Create attention-grabbing animation for hook elements
   */
  createHookAnimation(element: PlannedElement): AnimationPattern {
    return {
      name: 'AttentionGrabber',
      type: 'scale',
      duration: 0.4,
      easing: 'spring',
      delay: 0,
      properties: {
        from: { scale: 0, rotation: -10, opacity: 0 },
        to: { scale: 1, rotation: 0, opacity: 1 }
      }
    };
  }
  
  /**
   * Create emphasis animation (for highlighting important content)
   */
  createEmphasisAnimation(): AnimationPattern {
    return {
      name: 'Emphasize',
      type: 'scale',
      duration: 0.3,
      easing: 'spring',
      delay: 0,
      properties: {
        from: { scale: 1 },
        to: { scale: 1.1 },
        keyframes: [
          { time: 0, value: 1 },
          { time: 0.5, value: 1.1 },
          { time: 1, value: 1 }
        ]
      }
    };
  }
  
  /**
   * Apply animation presets to all scenes based on style
   */
  applyAnimationPresets(
    scenes: PlannedScene[],
    style: MotionStyle
  ): PlannedScene[] {
    
    return scenes.map(scene => {
      return {
        ...scene,
        elements: scene.elements.map(element => {
          // Generate appropriate entrance animation
          const entranceAnimation = this.generateEntranceAnimation(element, style);
          
          return {
            ...element,
            animation: entranceAnimation
          };
        })
      };
    });
  }
}

// Export singleton
export const motionDesignLibrary = new MotionDesignLibrary();
