import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

/**
 * THREE-TIER REMOTION SHOWCASE SYSTEM
 * Based on professional Remotion workflows with increasing complexity
 * 
 * TIER 1: Basic - Simple animations, clean design
 * TIER 2: Intermediate - Data viz, transitions, effects
 * TIER 3: Advanced - Complex compositions, multi-scene workflows
 */

// ============================================================
// TIER 1: BASIC - Simple, Clean, Professional
// ============================================================

/**
 * Tier 1 Flow 1: Simple Text Animation
 * Clean typography with smooth entrance
 */
export const Tier1Flow1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.04em',
            margin: 0,
            opacity: progress,
            transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
          }}
        >
          Tier 1
        </h1>
        <p
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#64748b',
            margin: '24px 0 0 0',
            opacity: interpolate(frame, [20, 40], [0, 1]),
            transform: `translateY(${interpolate(frame, [20, 40], [30, 0])}px)`,
          }}
        >
          Simple & Clean
        </p>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 1 Flow 2: Fade Through Colors
 * Smooth color transitions with text
 */
export const Tier1Flow2: React.FC = () => {
  const frame = useCurrentFrame();
  
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  const colorIndex = Math.floor(frame / 30) % colors.length;
  const nextColorIndex = (colorIndex + 1) % colors.length;
  const colorProgress = (frame % 30) / 30;

  const currentColor = colors[colorIndex];
  const nextColor = colors[nextColorIndex];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${currentColor} 0%, ${nextColor} 100%)`,
        transition: 'background 0.5s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.05em',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Color Flow
        </h1>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 1 Flow 3: Minimal Card
 * Simple card with shadow and content
 */
export const Tier1Flow3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 200,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: 80,
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            opacity: cardSpring,
            transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
          }}
        >
          <h2
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Simple Card
          </h2>
          <p
            style={{
              fontSize: 24,
              color: '#64748b',
              marginTop: 16,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Clean & Professional
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// TIER 2: INTERMEDIATE - Data Viz, Transitions, Effects
// ============================================================

/**
 * Tier 2 Flow 1: Animated Bar Chart
 * Data visualization with smooth animations
 */
export const Tier2Flow1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = [
    { label: 'Q1', value: 45, color: '#3b82f6' },
    { label: 'Q2', value: 72, color: '#8b5cf6' },
    { label: 'Q3', value: 58, color: '#ec4899' },
    { label: 'Q4', value: 85, color: '#10b981' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: 80,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Sales Growth
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 40,
            height: 400,
          }}
        >
          {data.map((item, i) => {
            const barProgress = spring({
              frame: frame - i * 8,
              fps,
              config: {
                damping: 100,
              },
            });

            const height = (item.value / 100) * 400;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: item.color,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    opacity: interpolate(barProgress, [0, 1], [0, 1]),
                  }}
                >
                  {Math.floor(item.value * barProgress)}%
                </div>
                <div
                  style={{
                    width: 100,
                    height: height * barProgress,
                    backgroundColor: item.color,
                    borderRadius: 12,
                    boxShadow: `0 4px 20px ${item.color}33`,
                  }}
                />
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 2 Flow 2: Multi-Step Process
 * Shows sequential workflow steps
 */
export const Tier2Flow2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { title: 'Input', icon: '📝', color: '#3b82f6' },
    { title: 'Process', icon: '⚙️', color: '#8b5cf6' },
    { title: 'Output', icon: '✨', color: '#10b981' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
          {steps.map((step, i) => {
            const stepProgress = spring({
              frame: frame - i * 20,
              fps,
              config: {
                damping: 100,
              },
            });

            const isActive = frame >= i * 20 && frame < (i + 1) * 20 + 40;

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 24,
                    opacity: stepProgress,
                    transform: `scale(${interpolate(stepProgress, [0, 1], [0.8, 1])}) translateY(${interpolate(stepProgress, [0, 1], [40, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      backgroundColor: isActive ? step.color : '#1e293b',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 56,
                      boxShadow: isActive ? `0 0 40px ${step.color}80` : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: isActive ? '#ffffff' : '#64748b',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {step.title}
                  </div>
                </div>

                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 80,
                      height: 4,
                      backgroundColor: frame >= (i + 1) * 20 ? '#64748b' : '#1e293b',
                      borderRadius: 2,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 2 Flow 3: Split Screen Comparison
 * Before/After style comparison
 */
export const Tier2Flow3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const splitProgress = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 100,
    },
  });

  const splitPosition = interpolate(splitProgress, [0, 1], [0, width / 2]);

  return (
    <AbsoluteFill>
      {/* Before side */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#ef4444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Before
        </div>
      </div>

      {/* After side */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#10b981',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          After
        </div>
      </div>

      {/* Split line */}
      <div
        style={{
          position: 'absolute',
          left: splitPosition,
          top: 0,
          width: 4,
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// TIER 3: ADVANCED - Complex Multi-Scene Compositions
// ============================================================

/**
 * Tier 3 Flow 1: Complete Product Showcase
 * Multi-scene composition with transitions
 */
export const Tier3Flow1: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Hero */}
      <Sequence from={0} durationInFrames={90}>
        <Tier3Scene1Hero />
      </Sequence>

      {/* Scene 2: Features */}
      <Sequence from={90} durationInFrames={120}>
        <Tier3Scene2Features />
      </Sequence>

      {/* Scene 3: Stats */}
      <Sequence from={210} durationInFrames={90}>
        <Tier3Scene3Stats />
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={300} durationInFrames={60}>
        <Tier3Scene4CTA />
      </Sequence>
    </AbsoluteFill>
  );
};

const Tier3Scene1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            opacity: progress,
            transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Premium Product
        </h1>
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.9)',
            marginTop: 32,
            opacity: interpolate(frame, [20, 40], [0, 1]),
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          The future is here
        </p>
      </div>
    </AbsoluteFill>
  );
};

const Tier3Scene2Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: '10x faster performance' },
    { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
    { icon: '📱', title: 'Mobile Ready', desc: 'Works everywhere' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: 80,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Key Features
        </h2>

        <div style={{ display: 'flex', gap: 60 }}>
          {features.map((feature, i) => {
            const cardProgress = spring({
              frame: frame - i * 15,
              fps,
              config: {
                damping: 100,
              },
            });

            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 24,
                  padding: 48,
                  width: 300,
                  opacity: cardProgress,
                  transform: `translateY(${interpolate(cardProgress, [0, 1], [60, 0])}px)`,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 24 }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0 0 16px 0',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 20,
                    color: '#64748b',
                    margin: 0,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Tier3Scene3Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: 10000, label: 'Users', suffix: '+' },
    { value: 99, label: 'Uptime', suffix: '%' },
    { value: 24, label: 'Support', suffix: '/7' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 80,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          By the Numbers
        </h2>

        <div style={{ display: 'flex', gap: 80 }}>
          {stats.map((stat, i) => {
            const countProgress = spring({
              frame: frame - 20 - i * 10,
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 96,
                    fontWeight: 900,
                    color: '#3b82f6',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {currentValue.toLocaleString()}{stat.suffix}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Tier3Scene4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 100,
    },
  });

  const pulseScale = 1 + Math.sin(frame / 10) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            opacity: progress,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Get Started Today
        </h1>

        <div
          style={{
            marginTop: 60,
            backgroundColor: '#ffffff',
            color: '#667eea',
            fontSize: 32,
            fontWeight: 700,
            padding: '24px 80px',
            borderRadius: 16,
            cursor: 'pointer',
            transform: `scale(${interpolate(progress, [0, 1], [0.9, 1]) * pulseScale})`,
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Learn More →
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 3 Flow 2: Data Dashboard
 * Complex dashboard with multiple charts
 */
export const Tier3Flow2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', padding: 40 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 32,
          height: '100%',
        }}
      >
        {/* Top Left: Line Chart Placeholder */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 24,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Revenue Trend
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const height = 50 + Math.random() * 50;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    opacity: frame > i * 5 ? 1 : 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Top Right: Pie Chart Placeholder */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 24,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Distribution
          </h3>
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'conic-gradient(#3b82f6 0deg 120deg, #8b5cf6 120deg 240deg, #ec4899 240deg 360deg)',
              opacity: frame > 30 ? 1 : 0,
            }}
          />
        </div>

        {/* Bottom Left: Stats */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 24,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Key Metrics
          </h3>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#10b981', fontFamily: 'Inter, system-ui, sans-serif' }}>
            +247%
          </div>
          <div style={{ fontSize: 20, color: '#64748b', marginTop: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>
            Growth this quarter
          </div>
        </div>

        {/* Bottom Right: Activity */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 24,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['New user signup', 'Payment received', 'Feature launched'].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 18,
                  color: '#94a3b8',
                  opacity: frame > 60 + i * 10 ? 1 : 0,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                • {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Tier 3 Flow 3: Cinematic Title Sequence
 * Movie-style title reveal with particles
 */
export const Tier3Flow3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 100,
      stiffness: 50,
    },
  });

  // Generate particles
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const speed = 0.5 + Math.random() * 1.5;
    const size = 2 + Math.random() * 4;

    return {
      x: x + (frame * speed) % width,
      y,
      size,
      opacity: 0.3 + Math.random() * 0.5,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            opacity: particle.opacity,
          }}
        />
      ))}

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(titleProgress, [0, 1], [1.2, 1])})`,
          opacity: titleProgress,
        }}
      >
        <h1
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 0 60px rgba(255,255,255,0.5)',
          }}
        >
          EPIC
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: 24,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
            opacity: interpolate(frame, [60, 90], [0, 1]),
          }}
        >
          A Cinematic Experience
        </p>
      </div>

      {/* Lens flare effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          opacity: interpolate(titleProgress, [0, 1], [0, 0.5]),
        }}
      />
    </AbsoluteFill>
  );
};
