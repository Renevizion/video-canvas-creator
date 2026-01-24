import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import type { PlannedElement, VideoPlan } from '@/types/video';

interface Perspective3DCardProps {
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle?: VideoPlan['style'];
  colors: string[];
  sceneFrame: number;
}

export const Perspective3DCard: React.FC<Perspective3DCardProps> = ({ 
  element, 
  style, 
  colors, 
  sceneFrame 
}) => {
  const { fps } = useVideoConfig();
  
  const content = element.content || '';
  
  // Entry animation with 3D rotation
  const entrySpring = spring({
    fps,
    frame: sceneFrame,
    config: { damping: 25, stiffness: 70, mass: 1 },
  });
  
  // Parse rotation from element style or use defaults
  const cardStyle = element.style as Record<string, unknown>;
  const targetRotateX = (cardStyle.rotateX as number) || 8;
  const targetRotateY = (cardStyle.rotateY as number) || -15;
  const targetRotateZ = (cardStyle.rotateZ as number) || 0;
  
  const rotateX = interpolate(entrySpring, [0, 1], [targetRotateX + 20, targetRotateX]);
  const rotateY = interpolate(entrySpring, [0, 1], [targetRotateY - 30, targetRotateY]);
  const rotateZ = interpolate(entrySpring, [0, 1], [targetRotateZ + 5, targetRotateZ]);
  const translateZ = interpolate(entrySpring, [0, 1], [-200, 0]);
  const scale = interpolate(entrySpring, [0, 1], [0.7, 1]);
  
  // Hover-like floating animation
  const floatOffset = Math.sin(sceneFrame * 0.03) * 8;
  const floatRotate = Math.sin(sceneFrame * 0.02) * 2;
  
  const width = element.size?.width || 400;
  const height = element.size?.height || 280;
  const borderRadius = (cardStyle.borderRadius as number) || 24;

  return (
    <div
      style={{
        ...style,
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width,
          height,
          background: (cardStyle.background as string) || 
            `linear-gradient(145deg, ${colors[1]}25 0%, ${colors[2]}50 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: `
            0 50px 100px rgba(0,0,0,0.3),
            0 20px 50px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
          transform: `
            rotateX(${rotateX + floatRotate}deg) 
            rotateY(${rotateY}deg) 
            rotateZ(${rotateZ}deg) 
            translateZ(${translateZ}px)
            translateY(${floatOffset}px)
            scale(${scale})
          `,
          transformStyle: 'preserve-3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        {/* Card content */}
        {content && (
          <div
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 500,
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {content}
          </div>
        )}
        
        {/* Shine effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Edge highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
            pointerEvents: 'none',
          }}
        />
      </div>
      
      {/* Card shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: `translateX(-50%) rotateX(90deg) scale(${entrySpring})`,
          width: width * 0.7,
          height: 60,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />
    </div>
  );
};

export default Perspective3DCard;
