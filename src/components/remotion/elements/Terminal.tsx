import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { PlannedElement, VideoPlan } from '@/types/video';

interface TerminalProps {
  element: PlannedElement;
  style: React.CSSProperties;
  globalStyle?: VideoPlan['style'];
  colors: string[];
  sceneFrame: number;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  element, 
  style, 
  colors, 
  sceneFrame 
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  const commands = (element.content || '$ npx remotion render\n✓ Video rendered successfully').split('\n');
  
  // Typing animation
  const typingSpeed = 2;
  const lineDelay = fps * 0.8;
  
  // Calculate visible lines and characters
  const getVisibleContent = () => {
    const result: Array<{ text: string; isComplete: boolean }> = [];
    let currentFrame = sceneFrame;
    
    for (let i = 0; i < commands.length; i++) {
      const lineStartFrame = i * lineDelay;
      const line = commands[i];
      
      if (currentFrame < lineStartFrame) {
        break;
      }
      
      const framesIntoLine = currentFrame - lineStartFrame;
      const charsVisible = Math.floor(framesIntoLine * typingSpeed);
      const visibleText = line.slice(0, Math.min(charsVisible, line.length));
      const isComplete = charsVisible >= line.length;
      
      result.push({ text: visibleText, isComplete });
    }
    
    return result;
  };
  
  const visibleLines = getVisibleContent();
  
  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;
  
  // Entry animation
  const entrySpring = spring({
    fps,
    frame: sceneFrame,
    config: { damping: 30, stiffness: 100, mass: 0.8 },
  });
  
  const slideUp = interpolate(entrySpring, [0, 1], [40, 0]);
  
  const width = element.size?.width || 500;
  const height = element.size?.height || 280;

  return (
    <div
      style={{
        ...style,
        opacity: entrySpring,
        transform: `${style.transform} translateY(${slideUp}px)`,
      }}
    >
      <div
        style={{
          width,
          height,
          background: 'linear-gradient(180deg, #1e1e2e 0%, #11111b 100%)',
          borderRadius: 14,
          boxShadow: `
            0 40px 80px rgba(0,0,0,0.35),
            0 15px 35px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 36,
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          
          <span style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#6c7086',
            fontSize: 12,
            fontFamily: 'monospace',
          }}>
            Terminal
          </span>
        </div>
        
        {/* Terminal content */}
        <div
          style={{
            flex: 1,
            padding: 18,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 14,
            lineHeight: 1.8,
            overflow: 'hidden',
          }}
        >
          {visibleLines.map((line, i) => {
            const isCommand = line.text.startsWith('$');
            const isSuccess = line.text.includes('✓') || line.text.toLowerCase().includes('success');
            const isError = line.text.includes('✗') || line.text.toLowerCase().includes('error');
            
            let textColor = '#cdd6f4';
            if (isCommand) textColor = '#89b4fa';
            if (isSuccess) textColor = '#a6e3a1';
            if (isError) textColor = '#f38ba8';
            
            return (
              <div key={i} style={{ color: textColor, display: 'flex' }}>
                <span>{line.text}</span>
                {/* Show cursor at end of last incomplete line */}
                {i === visibleLines.length - 1 && !line.isComplete && (
                  <span 
                    style={{ 
                      width: 8,
                      height: 18,
                      background: '#89b4fa',
                      marginLeft: 2,
                      opacity: cursorOpacity,
                    }}
                  />
                )}
              </div>
            );
          })}
          
          {/* Cursor on new line when all complete */}
          {visibleLines.length > 0 && visibleLines[visibleLines.length - 1]?.isComplete && (
            <div style={{ color: '#89b4fa', display: 'flex', alignItems: 'center' }}>
              <span>$ </span>
              <span 
                style={{ 
                  width: 8,
                  height: 18,
                  background: '#89b4fa',
                  marginLeft: 2,
                  opacity: cursorOpacity,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
