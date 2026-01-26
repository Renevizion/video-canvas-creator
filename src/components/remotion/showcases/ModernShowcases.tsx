import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring } from 'remotion';

/**
 * Modern, Clean Music Visualization
 * Professional quality matching Remotion showcase standards
 */
export const ModernMusicVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = 40; // Cleaner with fewer bars
  const barData = Array.from({ length: bars }, (_, i) => {
    const offset = i * 3;
    const height = Math.abs(Math.sin((frame + offset) / 15) * 0.5 + Math.sin((frame + offset) / 8) * 0.3);
    return height;
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff', // Clean white background
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title with modern typography */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          fontSize: 72,
          fontWeight: 700,
          color: '#0a0a0a',
          letterSpacing: '-0.03em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Audio Visualization
      </div>

      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          height: 300,
          gap: 8,
        }}
      >
        {barData.map((height, i) => {
          const progress = spring({
            frame: frame - i * 2,
            fps,
            config: {
              damping: 20,
            },
          });

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: `${height * 100}%`,
                backgroundColor: `hsl(${220 + i * 3}, 80%, 60%)`, // Subtle blue gradient
                borderRadius: 10,
                transform: `scaleY(${progress})`,
                transformOrigin: 'bottom',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            />
          );
        })}
      </div>

      {/* Subtle branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontSize: 14,
          fontWeight: 500,
          color: '#94a3b8',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Powered by Remotion
      </div>
    </AbsoluteFill>
  );
};

/**
 * Modern Captions with Clean Design
 */
export const ModernCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const text = 'Create stunning videos with modern typography';
  const words = text.split(' ');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fafafa', // Subtle off-white
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: '#0a0a0a',
          letterSpacing: '-0.04em',
          marginBottom: 60,
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        Modern Captions
      </div>

      {/* Animated words */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: '#475569',
          textAlign: 'center',
          maxWidth: 900,
          lineHeight: 1.5,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {words.map((word, i) => {
          const wordStart = i * 8;
          const wordProgress = spring({
            frame: frame - wordStart,
            fps,
            config: {
              damping: 100,
              mass: 0.5,
            },
          });

          const isActive = frame >= wordStart && frame < wordStart + 8;

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: 16,
                opacity: interpolate(wordProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(wordProgress, [0, 1], [20, 0])}px)`,
                color: isActive ? '#3b82f6' : '#475569',
                transition: 'color 0.3s ease',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Modern Year in Review with Clean Cards
 */
export const ModernYearInReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 12500, label: 'Videos Created', color: '#3b82f6' },
    { value: 850, label: 'Hours Saved', color: '#8b5cf6' },
    { value: 450, label: 'Happy Users', color: '#ec4899' },
    { value: 98, label: 'Satisfaction', suffix: '%', color: '#10b981' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Year */}
      <div
        style={{
          fontSize: 180,
          fontWeight: 900,
          color: '#f1f5f9',
          position: 'absolute',
          top: 100,
          letterSpacing: '-0.05em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        2024
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: '#0a0a0a',
          marginBottom: 80,
          letterSpacing: '-0.03em',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Year in Review
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 40,
          maxWidth: 900,
        }}
      >
        {stats.map((stat, i) => {
          const cardProgress = spring({
            frame: frame - i * 10,
            fps,
            config: {
              damping: 100,
            },
          });

          const countProgress = spring({
            frame: frame - i * 10 - 15,
            fps,
            config: {
              damping: 200,
            },
          });

          const currentValue = Math.floor(stat.value * countProgress);

          return (
            <div
              key={i}
              style={{
                backgroundColor: '#ffffff',
                padding: 48,
                borderRadius: 24,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                opacity: interpolate(cardProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(cardProgress, [0, 1], [40, 0])}px) scale(${interpolate(cardProgress, [0, 1], [0.9, 1])})`,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: 12,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {currentValue.toLocaleString()}{stat.suffix || ''}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#64748b',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Modern Screencast with Minimal Design
 */
export const ModernScreencast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const code = `export const Video = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill>
      <h1>Hello World</h1>
    </AbsoluteFill>
  );
};`;

  const typedLength = Math.floor((frame / 2) % (code.length + 30));
  const displayedCode = code.slice(0, typedLength);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          fontSize: 56,
          fontWeight: 800,
          color: '#0a0a0a',
          letterSpacing: '-0.03em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Code in Action
      </div>

      {/* Code editor mockup */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          padding: 40,
          maxWidth: 800,
          boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Editor header */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>

        {/* Code content */}
        <pre
          style={{
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: 18,
            lineHeight: 1.8,
            color: '#334155',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          <code>{displayedCode}</code>
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 24,
              backgroundColor: '#3b82f6',
              marginLeft: 2,
              animation: 'blink 1s infinite',
            }}
          />
        </pre>
      </div>

      {/* Branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          fontSize: 14,
          fontWeight: 600,
          color: '#94a3b8',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        TypeScript · React · Remotion
      </div>
    </AbsoluteFill>
  );
};

/**
 * Modern Render Progress with Glassmorphism
 */
export const ModernRenderProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Glassmorphic card */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          padding: 80,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          minWidth: 600,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 40,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Rendering Video
        </div>

        {/* Progress bar */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 100,
            height: 24,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              height: '100%',
              width: `${progress}%`,
              borderRadius: 100,
              transition: 'width 0.3s ease',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          />
        </div>

        {/* Percentage */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {Math.floor(progress)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};
