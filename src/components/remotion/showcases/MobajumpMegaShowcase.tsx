/**
 * Mobajump Mega Showcase Video
 * Features EVERY animation from the Animation Playground
 * A comprehensive 60-second commercial for mobajump.com
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import { noise3D } from '@remotion/noise';

// Mobajump brand colors from their website
const MOBAJUMP_COLORS = {
  primary: '#F97316', // Orange
  secondary: '#22C55E', // Green  
  accent: '#EF4444', // Red for emphasis
  dark: '#1A1A1A',
  light: '#FAFAFA',
  cream: '#FFF7ED',
};

// ============================================================
// 1. TYPEWRITER TEXT EFFECT
// ============================================================
const TypewriterText: React.FC<{ text: string; startFrame: number; color?: string }> = ({ 
  text, 
  startFrame,
  color = MOBAJUMP_COLORS.dark 
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const visibleChars = Math.floor(interpolate(localFrame, [0, text.length * 3], [0, text.length], {
    extrapolateRight: 'clamp',
  }));
  
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
      <span style={{ color, fontSize: 48, fontWeight: 700 }}>
        {text.slice(0, visibleChars)}
      </span>
      <span style={{ 
        width: 4, 
        height: 50, 
        backgroundColor: MOBAJUMP_COLORS.primary,
        marginLeft: 4,
        opacity: cursorOpacity
      }} />
    </div>
  );
};

// ============================================================
// 2. GRADIENT TEXT ANIMATION
// ============================================================
const GradientText: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const progress = (localFrame % 90) / 90;
  
  return (
    <span style={{
      fontSize: 72,
      fontWeight: 800,
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      background: `linear-gradient(90deg, 
        ${MOBAJUMP_COLORS.primary}, 
        ${MOBAJUMP_COLORS.accent}, 
        ${MOBAJUMP_COLORS.secondary}, 
        ${MOBAJUMP_COLORS.primary}
      )`,
      backgroundSize: '300% 100%',
      backgroundPosition: `${progress * 200}% 0`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      {text}
    </span>
  );
};

// ============================================================
// 3. BOUNCING LETTERS
// ============================================================
const BouncingLetters: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {text.split('').map((char, i) => {
        const offset = Math.sin((localFrame + i * 5) * 0.15) * 15;
        const scale = 1 + Math.sin((localFrame + i * 5) * 0.15) * 0.1;
        
        return (
          <span
            key={i}
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: MOBAJUMP_COLORS.primary,
              transform: `translateY(${offset}px) scale(${scale})`,
              display: 'inline-block',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================
// 4. GLITCH TEXT EFFECT
// ============================================================
const GlitchText: React.FC<{ text: string; startFrame: number }> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const glitchX1 = noise3D('glitch1', localFrame * 0.3, 0, 0) * 8;
  const glitchX2 = noise3D('glitch2', localFrame * 0.3, 0, 0) * 8;
  
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        fontSize: 56,
        fontWeight: 800,
        color: '#ff0000',
        position: 'absolute',
        transform: `translateX(${glitchX1}px)`,
        opacity: 0.7,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        {text}
      </span>
      <span style={{
        fontSize: 56,
        fontWeight: 800,
        color: '#00ffff',
        position: 'absolute',
        transform: `translateX(${glitchX2}px)`,
        opacity: 0.7,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        {text}
      </span>
      <span style={{
        fontSize: 56,
        fontWeight: 800,
        color: MOBAJUMP_COLORS.dark,
        position: 'relative',
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        {text}
      </span>
    </div>
  );
};

// ============================================================
// 5. OUTLINE TEXT
// ============================================================
const OutlineText: React.FC<{ text: string }> = ({ text }) => (
  <span style={{
    fontSize: 72,
    fontWeight: 800,
    WebkitTextStroke: `3px ${MOBAJUMP_COLORS.primary}`,
    WebkitTextFillColor: 'transparent',
    fontFamily: 'SF Pro Display, system-ui, sans-serif',
  }}>
    {text}
  </span>
);

// ============================================================
// 6. ANIMATED GRADIENT BACKGROUND
// ============================================================
const GradientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = (frame % 120) / 120;
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${45 + progress * 360}deg, 
        ${MOBAJUMP_COLORS.cream}, 
        #FFE4CC,
        #FFF0E0,
        ${MOBAJUMP_COLORS.cream}
      )`,
    }} />
  );
};

// ============================================================
// 7. FLOATING PARTICLES
// ============================================================
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const frame = useCurrentFrame();
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const baseX = (i * 137.5) % 100;
        const speed = 0.5 + (i % 5) * 0.3;
        const y = ((frame * speed + i * 50) % 120) - 10;
        const opacity = interpolate(y, [0, 50, 100], [0, 0.6, 0]);
        const size = 4 + (i % 4) * 2;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${baseX}%`,
              bottom: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? MOBAJUMP_COLORS.primary : MOBAJUMP_COLORS.secondary,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// ============================================================
// 8. 3D PERSPECTIVE CARD
// ============================================================
const PerspectiveCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const rotateY = Math.sin(localFrame * 0.05) * 25;
  const rotateX = Math.cos(localFrame * 0.03) * 15;
  
  return (
    <div style={{ perspective: 1000 }}>
      <div style={{
        width: 350,
        height: 220,
        borderRadius: 24,
        background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        boxShadow: '0 40px 80px rgba(249, 115, 22, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 28,
        fontWeight: 700,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        📱 Ship to App Store
      </div>
    </div>
  );
};

// ============================================================
// 9. ROTATING 3D CUBE
// ============================================================
const RotatingCube: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const rotateX = localFrame * 2;
  const rotateY = localFrame * 3;
  
  const faces = [
    { transform: 'translateZ(40px)', bg: MOBAJUMP_COLORS.primary },
    { transform: 'rotateY(180deg) translateZ(40px)', bg: MOBAJUMP_COLORS.secondary },
    { transform: 'rotateY(-90deg) translateZ(40px)', bg: MOBAJUMP_COLORS.accent },
    { transform: 'rotateY(90deg) translateZ(40px)', bg: '#8B5CF6' },
    { transform: 'rotateX(90deg) translateZ(40px)', bg: '#EC4899' },
    { transform: 'rotateX(-90deg) translateZ(40px)', bg: '#3B82F6' },
  ];
  
  return (
    <div style={{ perspective: 500 }}>
      <div style={{
        width: 80,
        height: 80,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        position: 'relative',
      }}>
        {faces.map((face, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 80,
              height: 80,
              backgroundColor: face.bg,
              border: '2px solid rgba(255,255,255,0.3)',
              transform: face.transform,
              backfaceVisibility: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            🚀
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 10. FLOATING LAYERS (PARALLAX)
// ============================================================
const FloatingLayers: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const layers = [
    { color: MOBAJUMP_COLORS.primary, z: 30, size: 100 },
    { color: MOBAJUMP_COLORS.secondary, z: 60, size: 80 },
    { color: MOBAJUMP_COLORS.accent, z: 90, size: 60 },
  ];
  
  return (
    <div style={{ perspective: 1000, position: 'relative', width: 200, height: 200 }}>
      {layers.map((layer, i) => {
        const y = Math.sin((localFrame + i * 10) * 0.08) * 20;
        const rotateX = Math.cos((localFrame + i * 10) * 0.05) * 10;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: layer.size,
              height: layer.size,
              backgroundColor: layer.color,
              borderRadius: 16,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translateZ(${layer.z}px) translateY(${y}px) rotateX(${rotateX}deg)`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transformStyle: 'preserve-3d',
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================
// 11. PHONE MOCKUP WITH APP
// ============================================================
const PhoneMockup: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  const floatY = Math.sin(localFrame * 0.05) * 10;
  const scale = spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 100 } });
  
  return (
    <div style={{
      transform: `translateY(${floatY}px) scale(${scale})`,
    }}>
      <div style={{
        width: 180,
        height: 360,
        backgroundColor: '#1A1A1A',
        borderRadius: 36,
        border: '4px solid #333',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 20,
          backgroundColor: '#000',
          borderRadius: 10,
        }} />
        
        {/* Screen content */}
        <div style={{
          position: 'absolute',
          top: 35,
          left: 8,
          right: 8,
          bottom: 8,
          background: `linear-gradient(180deg, ${MOBAJUMP_COLORS.cream}, #FFF0E0)`,
          borderRadius: 28,
          padding: 12,
        }}>
          {/* App header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: MOBAJUMP_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}>
              M
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: MOBAJUMP_COLORS.dark }}>
              Mobajump
            </span>
          </div>
          
          {/* Stats */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['2 Apps', '100%', '5 Builds'].map((stat, i) => (
              <div key={i} style={{
                flex: 1,
                padding: 6,
                backgroundColor: 'white',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 8,
                color: MOBAJUMP_COLORS.dark,
                fontWeight: 500,
              }}>
                {stat}
              </div>
            ))}
          </div>
          
          {/* App list */}
          {['Grateful Garden', 'PitCrew AI'].map((app, i) => (
            <div key={i} style={{
              padding: 8,
              backgroundColor: 'white',
              borderRadius: 10,
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: i === 0 ? '#22C55E' : '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}>
                {i === 0 ? '🌱' : '🔧'}
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 600, color: MOBAJUMP_COLORS.dark }}>{app}</div>
                <div style={{ fontSize: 7, color: '#666' }}>v1.0.{i}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 12. CODE EDITOR WITH TYPING
// ============================================================
const CodeEditor: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const code = `npx mobajump init
✓ Detected React app
✓ Building for iOS...
✓ App Store ready!`;
  
  const visibleChars = Math.floor(interpolate(localFrame, [0, 90], [0, code.length], {
    extrapolateRight: 'clamp',
  }));
  
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;
  
  return (
    <div style={{
      width: 400,
      backgroundColor: '#1E1E1E',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: 12,
        backgroundColor: '#2D2D2D',
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F' }} />
      </div>
      
      {/* Code */}
      <div style={{
        padding: 20,
        fontFamily: 'SF Mono, monospace',
        fontSize: 14,
        lineHeight: 1.8,
      }}>
        <pre style={{ margin: 0, color: '#9CDCFE', whiteSpace: 'pre-wrap' }}>
          {code.slice(0, visibleChars)}
          <span style={{
            display: 'inline-block',
            width: 2,
            height: 16,
            backgroundColor: MOBAJUMP_COLORS.primary,
            marginLeft: 2,
            opacity: cursorOpacity,
          }} />
        </pre>
      </div>
    </div>
  );
};

// ============================================================
// 13. ANIMATED BAR CHART
// ============================================================
const AnimatedBarChart: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  const data = [
    { label: 'Setup', value: 85, color: MOBAJUMP_COLORS.primary },
    { label: 'Build', value: 95, color: MOBAJUMP_COLORS.secondary },
    { label: 'Submit', value: 100, color: MOBAJUMP_COLORS.accent },
  ];
  
  return (
    <div style={{ display: 'flex', gap: 30, alignItems: 'flex-end', height: 200 }}>
      {data.map((item, i) => {
        const progress = spring({ 
          frame: localFrame - i * 10, 
          fps, 
          config: { damping: 12, stiffness: 80 } 
        });
        const height = Math.max(0, item.value * 1.8 * progress);
        
        return (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              width: 60,
              height,
              backgroundColor: item.color,
              borderRadius: 8,
              boxShadow: `0 10px 30px ${item.color}40`,
            }} />
            <div style={{
              marginTop: 10,
              fontSize: 14,
              fontWeight: 600,
              color: MOBAJUMP_COLORS.dark,
            }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// 14. ANIMATED COUNTER
// ============================================================
const AnimatedCounter: React.FC<{ 
  target: number; 
  startFrame: number;
  suffix?: string;
  label: string;
}> = ({ target, startFrame, suffix = '', label }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const value = Math.floor(interpolate(localFrame, [0, 45], [0, target], {
    extrapolateRight: 'clamp',
  }));
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 72,
        fontWeight: 800,
        color: MOBAJUMP_COLORS.primary,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        {value.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontSize: 20,
        color: '#666',
        marginTop: 8,
      }}>
        {label}
      </div>
    </div>
  );
};

// ============================================================
// 15. DONUT CHART
// ============================================================
const DonutChart: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const segments = [
    { value: 40, color: MOBAJUMP_COLORS.primary },
    { value: 30, color: MOBAJUMP_COLORS.secondary },
    { value: 20, color: MOBAJUMP_COLORS.accent },
    { value: 10, color: '#8B5CF6' },
  ];
  
  let offset = 0;
  
  return (
    <svg viewBox="0 0 100 100" width={200} height={200}>
      {segments.map((segment, i) => {
        const progress = interpolate(localFrame - i * 8, [0, 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        
        const currentOffset = offset;
        offset += segment.value;
        
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="15"
            stroke={segment.color}
            strokeDasharray={`${segment.value * progress} 100`}
            strokeDashoffset={-currentOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        );
      })}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontWeight="bold"
        fill={MOBAJUMP_COLORS.dark}
      >
        100%
      </text>
    </svg>
  );
};

// ============================================================
// 16. AUDIO VISUALIZER BARS
// ============================================================
const AudioBars: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 4, 
      height: 100,
      padding: '0 20px',
    }}>
      {Array.from({ length: 24 }).map((_, i) => {
        const height = 20 + Math.abs(Math.sin((localFrame + i * 3) * 0.2)) * 60;
        
        return (
          <div
            key={i}
            style={{
              width: 8,
              height,
              borderRadius: 4,
              background: `linear-gradient(to top, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================
// 17. WAVEFORM
// ============================================================
const Waveform: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const points = Array.from({ length: 50 }).map((_, i) => {
    const x = i * 8;
    const y = 30 + Math.sin((localFrame + i * 2) * 0.15) * 25;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={400} height={60} viewBox="0 0 400 60">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MOBAJUMP_COLORS.primary} />
          <stop offset="50%" stopColor={MOBAJUMP_COLORS.accent} />
          <stop offset="100%" stopColor={MOBAJUMP_COLORS.secondary} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ============================================================
// 18. SPRING BOUNCE BALL
// ============================================================
const SpringBounceBall: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  const bounce = spring({
    frame: localFrame % 30,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  
  const y = (1 - bounce) * 80;
  const squash = 1 + (1 - bounce) * 0.3;
  
  return (
    <div style={{
      width: 60,
      height: 60 / squash,
      borderRadius: 30,
      background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
      transform: `translateY(${y}px) scaleX(${squash}) scaleY(${1 / squash})`,
      boxShadow: `0 ${30 - y * 0.3}px ${40 - y * 0.4}px ${MOBAJUMP_COLORS.primary}40`,
    }} />
  );
};

// ============================================================
// 19. ELASTIC STRETCH
// ============================================================
const ElasticStretch: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const scaleX = 1 + Math.sin(localFrame * 0.12) * 0.4;
  const scaleY = 1 + Math.sin(localFrame * 0.12 + Math.PI) * 0.4;
  
  return (
    <div style={{
      width: 80,
      height: 80,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.secondary}, #10B981)`,
      transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
    }} />
  );
};

// ============================================================
// 20. PARALLAX LANDSCAPE
// ============================================================
const ParallaxLandscape: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const layers = [
    { y: 80, speed: 0.2, color: '#86EFAC' },
    { y: 70, speed: 0.4, color: '#4ADE80' },
    { y: 60, speed: 0.6, color: '#22C55E' },
    { y: 50, speed: 0.8, color: '#16A34A' },
  ];
  
  return (
    <div style={{
      width: 300,
      height: 150,
      backgroundColor: '#87CEEB',
      borderRadius: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Sun */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 40,
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: MOBAJUMP_COLORS.primary,
        boxShadow: `0 0 30px ${MOBAJUMP_COLORS.primary}`,
      }} />
      
      {/* Mountains */}
      {layers.map((layer, i) => {
        const x = Math.sin(localFrame * 0.03) * 20 * layer.speed;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 0,
              left: -20 + x,
              right: -20 - x,
              height: `${100 - layer.y}%`,
              backgroundColor: layer.color,
              borderRadius: '100% 100% 0 0',
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================
// 21. DEPTH RINGS
// ============================================================
const DepthRings: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      {[1, 2, 3, 4, 5].map((ring) => {
        const scale = 1 + Math.sin((localFrame + ring * 8) * 0.08) * 0.1;
        const opacity = 0.2 + (6 - ring) * 0.15;
        
        return (
          <div
            key={ring}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: ring * 35,
              height: ring * 35,
              borderRadius: '50%',
              border: `2px solid ${MOBAJUMP_COLORS.primary}`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: MOBAJUMP_COLORS.primary,
        transform: 'translate(-50%, -50%)',
      }} />
    </div>
  );
};

// ============================================================
// 22. LOGO GRID
// ============================================================
const LogoGrid: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  const logos = ['🍎', '📱', '🚀', '⚡', '🎯', '💎', '🔥', '✨', '🌟'];
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
    }}>
      {logos.map((logo, i) => {
        const scale = spring({
          frame: localFrame - i * 4,
          fps,
          config: { damping: 12, stiffness: 100 },
        });
        
        return (
          <div
            key={i}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              transform: `scale(${Math.max(0, scale)})`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {logo}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// 23. FADE TRANSITION
// ============================================================
const FadeBox: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const opacity = interpolate(
    (localFrame % 60),
    [0, 20, 40, 60],
    [0, 1, 1, 0]
  );
  
  return (
    <div style={{
      width: 100,
      height: 100,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
      opacity,
    }} />
  );
};

// ============================================================
// 24. SLIDE TRANSITION
// ============================================================
const SlideBox: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const x = interpolate(
    (localFrame % 60),
    [0, 20, 40, 60],
    [-150, 0, 0, 150]
  );
  
  return (
    <div style={{
      width: 100,
      height: 100,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.secondary}, #10B981)`,
      transform: `translateX(${x}px)`,
    }} />
  );
};

// ============================================================
// 25. SCALE TRANSITION
// ============================================================
const ScaleBox: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const scale = interpolate(
    (localFrame % 60),
    [0, 20, 40, 60],
    [0, 1, 1, 0]
  );
  
  return (
    <div style={{
      width: 100,
      height: 100,
      borderRadius: 20,
      background: `linear-gradient(135deg, #8B5CF6, #EC4899)`,
      transform: `scale(${scale})`,
    }} />
  );
};

// ============================================================
// 26. 3D FLIP
// ============================================================
const FlipCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  
  const rotateY = interpolate(localFrame % 90, [0, 90], [0, 360]);
  
  return (
    <div style={{ perspective: 500 }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 20,
        background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
        transform: `rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }} />
    </div>
  );
};

// ============================================================
// 27. PROGRESS STEPPER
// ============================================================
const ProgressStepper: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  const steps = ['Connect', 'Configure', 'Assets', 'Validate', 'Build', 'Submit'];
  const activeStep = Math.min(Math.floor(localFrame / 20), steps.length - 1);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {steps.map((step, i) => {
        const isActive = i <= activeStep;
        const isCurrentStep = i === activeStep;
        
        const scale = spring({
          frame: localFrame - i * 20,
          fps,
          config: { damping: 15 },
        });
        
        return (
          <React.Fragment key={i}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isActive ? MOBAJUMP_COLORS.primary : '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? 'white' : '#9CA3AF',
              fontWeight: 600,
              fontSize: 14,
              transform: `scale(${isCurrentStep ? Math.max(0.5, scale) : 1})`,
              boxShadow: isActive ? `0 4px 15px ${MOBAJUMP_COLORS.primary}40` : 'none',
            }}>
              {isActive && i < activeStep ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 30,
                height: 3,
                backgroundColor: i < activeStep ? MOBAJUMP_COLORS.primary : '#E5E7EB',
                borderRadius: 2,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================
// SCENE COMPONENTS
// ============================================================

// Scene 1: Intro with Typewriter
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 15], [0, 1]);
  
  return (
    <AbsoluteFill style={{ 
      background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.cream} 0%, #FFE4CC 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <FloatingParticles count={40} />
      
      <div style={{ opacity, transform: `scale(${titleScale})`, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 30,
          background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.primary}, ${MOBAJUMP_COLORS.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 60,
          margin: '0 auto 30px',
          boxShadow: `0 30px 60px ${MOBAJUMP_COLORS.primary}40`,
        }}>
          M
        </div>
        
        <TypewriterText text="Mobajump" startFrame={15} />
        
        <div style={{
          marginTop: 20,
          fontSize: 28,
          color: '#666',
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          Web → App Store
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Hero Message
const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 30% 30%, ${MOBAJUMP_COLORS.cream}, #FFFFFF)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <GradientBackground />
      <FloatingParticles count={20} />
      
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <BouncingLetters text="Already built a React app?" startFrame={0} />
        
        <div style={{ marginTop: 30 }}>
          <GradientText text="Get it on the App Store" startFrame={30} />
        </div>
        
        <div style={{ marginTop: 20 }}>
          <OutlineText text="without Xcode." />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Features with 3D Cards
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{
      background: MOBAJUMP_COLORS.dark,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 80,
    }}>
      <FloatingParticles count={15} />
      
      <div style={{ textAlign: 'center' }}>
        <GlitchText text="No Xcode" startFrame={0} />
        <div style={{ marginTop: 20 }}>
          <PerspectiveCard startFrame={10} />
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <GlitchText text="No Mac" startFrame={20} />
        <div style={{ marginTop: 20 }}>
          <RotatingCube startFrame={30} />
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <GlitchText text="No Problem" startFrame={40} />
        <div style={{ marginTop: 20 }}>
          <FloatingLayers startFrame={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Phone Mockup Demo
const PhoneDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${MOBAJUMP_COLORS.cream} 0%, #FFF 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 100,
    }}>
      <PhoneMockup startFrame={0} />
      
      <div style={{ maxWidth: 500 }}>
        <TypewriterText text="Ship your app in days" startFrame={10} />
        <div style={{ marginTop: 30 }}>
          <AnimatedBarChart startFrame={30} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Code Demo
const CodeScene: React.FC = () => (
  <AbsoluteFill style={{
    background: MOBAJUMP_COLORS.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  }}>
    <CodeEditor startFrame={0} />
    
    <div>
      <div style={{ marginBottom: 40 }}>
        <AnimatedCounter target={5} suffix=" min" startFrame={30} label="Average Setup Time" />
      </div>
      <AudioBars startFrame={40} />
    </div>
  </AbsoluteFill>
);

// Scene 6: Data Visualization
const DataScene: React.FC = () => (
  <AbsoluteFill style={{
    background: `linear-gradient(135deg, ${MOBAJUMP_COLORS.cream}, #FFF0E0)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 100,
  }}>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ 
        fontSize: 36, 
        fontWeight: 700, 
        color: MOBAJUMP_COLORS.dark,
        marginBottom: 30,
      }}>
        Success Rate
      </h2>
      <DonutChart startFrame={0} />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ 
        fontSize: 36, 
        fontWeight: 700, 
        color: MOBAJUMP_COLORS.dark,
        marginBottom: 30,
      }}>
        Apps Shipped
      </h2>
      <AnimatedCounter target={1000} suffix="+" startFrame={20} label="Happy Developers" />
    </div>
  </AbsoluteFill>
);

// Scene 7: Seamless Integration - No demo labels
const TransitionsScene: React.FC = () => (
  <AbsoluteFill style={{
    background: MOBAJUMP_COLORS.dark,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  }}>
    <h2 style={{ 
      fontSize: 48, 
      fontWeight: 700, 
      color: 'white',
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
      textAlign: 'center',
    }}>
      Seamless Updates
    </h2>
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <FadeBox startFrame={0} />
      <SlideBox startFrame={15} />
      <ScaleBox startFrame={30} />
      <FlipCard startFrame={45} />
    </div>
    
    <p style={{ 
      fontSize: 28, 
      color: '#888',
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
    }}>
      Push changes instantly to your users
    </p>
  </AbsoluteFill>
);

// Scene 8: Powerful Performance - No demo labels
const PhysicsScene: React.FC = () => (
  <AbsoluteFill style={{
    background: `linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  }}>
    <h2 style={{ 
      fontSize: 48, 
      fontWeight: 700, 
      color: 'white',
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
    }}>
      Native Performance
    </h2>
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80 }}>
      <SpringBounceBall startFrame={0} />
      <ElasticStretch startFrame={20} />
      <DepthRings startFrame={40} />
    </div>
    
    <p style={{ 
      fontSize: 28, 
      color: '#888',
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
    }}>
      60fps animations, smooth scrolling, native gestures
    </p>
  </AbsoluteFill>
);

// Scene 9: Trusted by Developers - No demo labels
const ParallaxAudioScene: React.FC = () => (
  <AbsoluteFill style={{
    background: MOBAJUMP_COLORS.cream,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  }}>
    <h2 style={{ 
      fontSize: 42, 
      fontWeight: 700, 
      color: MOBAJUMP_COLORS.dark,
      fontFamily: 'SF Pro Display, system-ui, sans-serif',
    }}>
      Trusted by Developers
    </h2>
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      <ParallaxLandscape startFrame={0} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Waveform startFrame={0} />
        <LogoGrid startFrame={20} />
      </div>
    </div>
  </AbsoluteFill>
);

// Scene 10: Progress Stepper
const StepperScene: React.FC = () => (
  <AbsoluteFill style={{
    background: MOBAJUMP_COLORS.cream,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  }}>
    <h2 style={{ 
      fontSize: 42, 
      fontWeight: 700, 
      color: MOBAJUMP_COLORS.dark,
    }}>
      6 Simple Steps
    </h2>
    <ProgressStepper startFrame={0} />
    
    <div style={{ display: 'flex', gap: 40 }}>
      <AnimatedCounter target={2} suffix="" startFrame={60} label="Free Builds" />
      <AnimatedCounter target={5} suffix=" min" startFrame={70} label="Setup Time" />
      <AnimatedCounter target={0} suffix="" startFrame={80} label="Mac Required" />
    </div>
  </AbsoluteFill>
);

// Scene 11: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const buttonScale = spring({ 
    frame: frame - 30, 
    fps, 
    config: { damping: 10, stiffness: 150 } 
  });
  
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, ${MOBAJUMP_COLORS.cream}, #FFE4CC)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <FloatingParticles count={50} />
      
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <GradientText text="Start Building Free" startFrame={0} />
        
        <div style={{ marginTop: 50, transform: `scale(${Math.max(0, buttonScale)})` }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 48px',
            borderRadius: 60,
            background: MOBAJUMP_COLORS.primary,
            color: 'white',
            fontSize: 28,
            fontWeight: 700,
            boxShadow: `0 20px 60px ${MOBAJUMP_COLORS.primary}60`,
          }}>
            Get Started
            <span style={{ fontSize: 24 }}>→</span>
          </div>
        </div>
        
        <div style={{ marginTop: 30 }}>
          <BouncingLetters text="mobajump.com" startFrame={60} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================

export const MobajumpMegaShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: MOBAJUMP_COLORS.cream }}>
      {/* Scene 1: Intro - 0-90 frames (3s) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      
      {/* Scene 2: Hero Message - 90-210 frames (4s) */}
      <Sequence from={90} durationInFrames={120}>
        <HeroScene />
      </Sequence>
      
      {/* Scene 3: Features with 3D - 210-330 frames (4s) */}
      <Sequence from={210} durationInFrames={120}>
        <FeaturesScene />
      </Sequence>
      
      {/* Scene 4: Phone Demo - 330-450 frames (4s) */}
      <Sequence from={330} durationInFrames={120}>
        <PhoneDemoScene />
      </Sequence>
      
      {/* Scene 5: Code Demo - 450-570 frames (4s) */}
      <Sequence from={450} durationInFrames={120}>
        <CodeScene />
      </Sequence>
      
      {/* Scene 6: Data Viz - 570-690 frames (4s) */}
      <Sequence from={570} durationInFrames={120}>
        <DataScene />
      </Sequence>
      
      {/* Scene 7: Transitions - 690-810 frames (4s) */}
      <Sequence from={690} durationInFrames={120}>
        <TransitionsScene />
      </Sequence>
      
      {/* Scene 8: Physics - 810-930 frames (4s) */}
      <Sequence from={810} durationInFrames={120}>
        <PhysicsScene />
      </Sequence>
      
      {/* Scene 9: Parallax & Audio - 930-1050 frames (4s) */}
      <Sequence from={930} durationInFrames={120}>
        <ParallaxAudioScene />
      </Sequence>
      
      {/* Scene 10: Stepper - 1050-1170 frames (4s) */}
      <Sequence from={1050} durationInFrames={120}>
        <StepperScene />
      </Sequence>
      
      {/* Scene 11: CTA - 1170-1350 frames (6s) */}
      <Sequence from={1170} durationInFrames={180}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default MobajumpMegaShowcase;
