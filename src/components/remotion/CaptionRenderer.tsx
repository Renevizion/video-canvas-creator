/**
 * Caption Component for Remotion Videos
 * Supports TikTok-style captions with word highlighting
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { CaptionData } from '@/types/video';
import { getCaptionAtTime, CAPTION_STYLES } from '@/lib/captionManager';

interface CaptionRendererProps {
  captions: CaptionData[];
  style?: 'tiktok' | 'simple' | 'minimal';
  position?: 'top' | 'center' | 'bottom';
}

export const CaptionRenderer: React.FC<CaptionRendererProps> = ({
  captions,
  style = 'tiktok',
  position = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const currentCaption = getCaptionAtTime(captions, time);
  
  if (!currentCaption) return null;

  const captionStyle = CAPTION_STYLES[style];
  
  // Calculate fade in/out
  const captionDuration = currentCaption.endTime - currentCaption.startTime;
  const captionProgress = (time - currentCaption.startTime) / captionDuration;
  
  // Fade in first 10%, fade out last 10%
  const opacity = interpolate(
    captionProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pop-in animation
  const scale = interpolate(
    captionProgress,
    [0, 0.15],
    [0.8, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const positionStyle = getPositionStyle(position);

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyle,
        width: '90%',
        maxWidth: 900,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {style === 'tiktok' ? (
        <TikTokStyleCaption
          text={currentCaption.text}
          style={captionStyle}
          progress={captionProgress}
        />
      ) : (
        <SimpleCaption text={currentCaption.text} style={captionStyle} />
      )}
    </div>
  );
};

const TikTokStyleCaption: React.FC<{
  text: string;
  style: typeof CAPTION_STYLES.tiktok;
  progress: number;
}> = ({ text, style, progress }) => {
  const words = text.split(' ');
  
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        padding: style.padding,
      }}
    >
      {words.map((word, index) => {
        // Highlight words progressively
        const wordProgress = index / words.length;
        const isHighlighted = progress > wordProgress;
        
        return (
          <span
            key={index}
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              textTransform: style.textTransform,
              color: isHighlighted ? '#FFD700' : style.color,
              WebkitTextStroke: `${style.strokeWidth}px ${style.stroke}`,
              letterSpacing: style.letterSpacing,
              fontFamily: 'Inter, system-ui, sans-serif',
              textAlign: 'center',
              transition: 'color 0.1s ease',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const SimpleCaption: React.FC<{
  text: string;
  style: typeof CAPTION_STYLES.simple | typeof CAPTION_STYLES.minimal;
}> = ({ text, style }) => {
  return (
    <div
      style={{
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        textTransform: style.textTransform,
        color: style.color,
        textAlign: style.textAlign,
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        borderRadius: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: style.letterSpacing,
        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
};

function getPositionStyle(position: 'top' | 'center' | 'bottom') {
  switch (position) {
    case 'top':
      return { top: '10%' };
    case 'center':
      return { top: '50%', transform: 'translateX(-50%) translateY(-50%)' };
    case 'bottom':
    default:
      return { bottom: '15%' };
  }
}
