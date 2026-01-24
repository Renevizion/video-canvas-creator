import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import type { PlannedElement, VideoPlan } from '@/types/video';

interface Laptop3DProps {
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle?: VideoPlan['style'];
  colors: string[];
  sceneFrame: number;
  children?: React.ReactNode;
}

export const Laptop3D: React.FC<Laptop3DProps> = ({ 
  element, 
  style, 
  colors, 
  sceneFrame,
  children,
}) => {
  const { fps } = useVideoConfig();
  
  // Entry animation
  const entrySpring = spring({
    fps,
    frame: sceneFrame,
    config: { damping: 40, stiffness: 60, mass: 1.2 },
  });
  
  // 3D rotation
  const rotateY = interpolate(entrySpring, [0, 1], [-30, -15]);
  const rotateX = interpolate(entrySpring, [0, 1], [20, 10]);
  const translateY = interpolate(entrySpring, [0, 1], [100, 0]);
  const scale = interpolate(entrySpring, [0, 1], [0.8, 1]);
  
  const screenWidth = element.size?.width || 800;
  const screenHeight = element.size?.height || 500;

  return (
    <div
      style={{
        ...style,
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          transform: `
            rotateY(${rotateY}deg) 
            rotateX(${rotateX}deg) 
            translateY(${translateY}px) 
            scale(${scale})
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Laptop screen */}
        <div
          style={{
            width: screenWidth,
            height: screenHeight,
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            borderRadius: '20px 20px 4px 4px',
            padding: 15,
            boxShadow: `
              0 80px 160px rgba(0,0,0,0.4),
              0 40px 80px rgba(0,0,0,0.3),
              inset 0 0 0 3px #2a2a2a
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Screen bezel */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Camera notch */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#0a0a0a',
                boxShadow: 'inset 0 0 0 2px #1a1a1a',
              }}
            />
            
            {/* Screen content */}
            {children || (
              <div style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: 16,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                Screen Content
              </div>
            )}
          </div>
        </div>
        
        {/* Laptop base/keyboard */}
        <div
          style={{
            width: screenWidth * 1.05,
            height: 20,
            marginLeft: -screenWidth * 0.025,
            background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)',
            borderRadius: '0 0 8px 8px',
            transform: 'rotateX(-75deg)',
            transformOrigin: 'top center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Trackpad indication */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 10,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 4,
            }}
          />
        </div>
        
        {/* Shadow underneath */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: '50%',
            transform: 'translateX(-50%) rotateX(90deg)',
            width: screenWidth * 0.8,
            height: 100,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </div>
    </div>
  );
};

export default Laptop3D;
