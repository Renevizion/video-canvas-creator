/**
 * ULTIMATE MEGA VIDEO - Professional Commercial Version
 * 
 * Transformed from a component demo into a polished commercial
 * with professional marketing copy and cinematic presentation.
 */

import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';

// NEW features
import { ResponsiveContainer } from '../elements/AspectRatioSupport';
import { ColorGrading, FilmGrain, Vignette, Bloom } from '../elements/ColorGrading';

// Commercial elements
import { PhoneMockup } from '../elements/PhoneMockup';
import { LogoGrid } from '../elements/LogoGrid';
import { DataVisualization } from '../elements/DataVisualization';
import { CodeEditor } from '../elements/CodeEditor';

// Brand colors for professional look
const BRAND = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#22d3ee',
  dark: '#0a0e17',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
};

export const UltimateMegaVideo: React.FC = () => {
  return (
    <ResponsiveContainer aspectRatio="vertical" safeArea backgroundColor={BRAND.dark}>
      <ColorGrading preset="cinematic">
        <TransitionSeries>
          {/* Scene 1: Hero Opening */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <HeroScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 2: Problem Statement */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <ProblemScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 3: Solution Introduction */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <SolutionScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 4: Developer Experience */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <DeveloperScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-top' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 5: Performance Metrics */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <MetricsScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 6: Mobile Experience */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <MobileScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-bottom' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 7: Social Proof */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <SocialProofScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 8: Growth Stats */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <GrowthScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 9: Features Grid */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <FeaturesScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 10: Call to Action */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <CTAScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Professional cinematic effects */}
        <FilmGrain intensity={0.12} />
        <Vignette intensity={0.2} color="black" />
        <Bloom intensity={0.15} />
      </ColorGrading>
    </ResponsiveContainer>
  );
};

/* Scene 1: Hero Opening */
function HeroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 60,
    }}>
      {/* Animated background glow */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        background: `radial-gradient(circle, ${BRAND.primary}40 0%, transparent 70%)`,
        filter: 'blur(80px)',
        transform: `scale(${1 + Math.sin(frame * 0.05) * 0.1})`,
      }} />

      <h1 style={{
        color: 'white',
        fontSize: 80,
        fontWeight: 800,
        textAlign: 'center',
        margin: 0,
        transform: `scale(${titleScale})`,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
        letterSpacing: '-2px',
      }}>
        Build Faster
      </h1>

      <p style={{
        color: BRAND.accent,
        fontSize: 36,
        fontWeight: 600,
        marginTop: 20,
        opacity: subtitleOpacity,
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Ship with confidence
      </p>

      <div style={{
        position: 'absolute',
        bottom: 120,
        display: 'flex',
        gap: 40,
        opacity: interpolate(frame, [50, 70], [0, 1]),
      }}>
        {['10x Faster', 'Zero Config', 'Production Ready'].map((text, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px 28px',
            borderRadius: 50,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 500 }}>{text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/* Scene 2: Problem Statement */
function ProblemScene() {
  const frame = useCurrentFrame();

  const painPoints = [
    'Endless configuration',
    'Slow build times', 
    'Complex deployments',
  ];

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #1f1f2e 0%, #0f0f1a 100%)',
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <h2 style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: 28,
        fontWeight: 500,
        marginBottom: 20,
        opacity: interpolate(frame, [0, 15], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        SOUND FAMILIAR?
      </h2>

      <div style={{ marginTop: 40 }}>
        {painPoints.map((point, i) => {
          const delay = i * 15;
          const opacity = interpolate(frame - delay, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
          const x = interpolate(frame - delay, [10, 25], [-50, 0], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity,
              transform: `translateX(${x}px)`,
              marginBottom: 30,
            }}>
              <span style={{
                color: '#ef4444',
                fontSize: 52,
                fontWeight: 700,
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
              }}>
                ✕ {point}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* Scene 3: Solution Introduction */
function SolutionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Background gradient orbs */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        background: `radial-gradient(circle, ${BRAND.primary}30 0%, transparent 70%)`,
        filter: 'blur(100px)',
        top: '20%',
        left: '20%',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        background: `radial-gradient(circle, ${BRAND.secondary}30 0%, transparent 70%)`,
        filter: 'blur(80px)',
        bottom: '20%',
        right: '20%',
      }} />

      <div style={{
        transform: `scale(${Math.max(0, scale)})`,
        textAlign: 'center',
      }}>
        <h2 style={{
          color: 'white',
          fontSize: 72,
          fontWeight: 800,
          margin: 0,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          There's a
        </h2>
        <h2 style={{
          background: BRAND.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 72,
          fontWeight: 800,
          margin: 0,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          better way
        </h2>
      </div>

      <p style={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: 28,
        marginTop: 40,
        opacity: interpolate(frame, [40, 60], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Modern tools for modern developers
      </p>
    </AbsoluteFill>
  );
}

/* Scene 4: Developer Experience with Code */
function DeveloperScene() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      padding: 60,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{
        color: 'white',
        fontSize: 48,
        fontWeight: 700,
        marginBottom: 20,
        opacity: interpolate(frame, [0, 20], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Developer First
      </h2>
      <p style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: 24,
        marginBottom: 40,
        opacity: interpolate(frame, [10, 30], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Write code that just works
      </p>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [20, 40], [0, 1]),
        transform: `translateY(${interpolate(frame, [20, 40], [30, 0])}px)`,
      }}>
        <CodeEditor
          element={{
            id: 'code',
            type: 'code-editor',
            content: '',
            position: { x: 50, y: 50, z: 1 },
            size: { width: 900, height: 500 },
            style: {},
          }}
          style={{}}
          colors={[BRAND.primary, BRAND.secondary]}
          sceneFrame={frame}
        />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 5: Performance Metrics */
function MetricsScene() {
  const frame = useCurrentFrame();

  const metrics = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Latency' },
    { value: '10M+', label: 'Requests/day' },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h2 style={{
        color: 'white',
        fontSize: 52,
        fontWeight: 700,
        marginBottom: 80,
        opacity: interpolate(frame, [0, 20], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Built for Scale
      </h2>

      <div style={{ display: 'flex', gap: 60 }}>
        {metrics.map((metric, i) => {
          const delay = i * 10;
          const scale = interpolate(frame - delay, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              textAlign: 'center',
              transform: `scale(${scale})`,
            }}>
              <div style={{
                color: BRAND.accent,
                fontSize: 72,
                fontWeight: 800,
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
              }}>
                {metric.value}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 24,
                marginTop: 10,
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
              }}>
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* Scene 6: Mobile Experience */
function MobileScene() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        textAlign: 'center',
        marginRight: 100,
        opacity: interpolate(frame, [0, 25], [0, 1]),
        transform: `translateX(${interpolate(frame, [0, 25], [-50, 0])}px)`,
      }}>
        <h2 style={{
          color: 'white',
          fontSize: 56,
          fontWeight: 700,
          margin: 0,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          Mobile Native
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: 24,
          marginTop: 20,
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          Seamless experience<br />across all devices
        </p>
      </div>

      <div style={{
        opacity: interpolate(frame, [15, 35], [0, 1]),
        transform: `translateY(${interpolate(frame, [15, 35], [50, 0])}px)`,
      }}>
        <PhoneMockup
          element={{
            id: 'phone',
            type: 'phone-mockup',
            content: '',
            position: { x: 50, y: 50, z: 1 },
            size: { width: 280, height: 560 },
            style: { phoneType: 'iphone' },
          }}
          style={{}}
          colors={[BRAND.primary, BRAND.secondary, BRAND.accent]}
          sceneFrame={frame}
        />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 7: Social Proof */
function SocialProofScene() {
  const frame = useCurrentFrame();

  const logos = [
    { url: 'https://logo.clearbit.com/stripe.com', name: 'Stripe' },
    { url: 'https://logo.clearbit.com/vercel.com', name: 'Vercel' },
    { url: 'https://logo.clearbit.com/notion.so', name: 'Notion' },
    { url: 'https://logo.clearbit.com/linear.app', name: 'Linear' },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2 style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: 24,
        fontWeight: 500,
        marginBottom: 60,
        letterSpacing: 4,
        opacity: interpolate(frame, [0, 20], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        TRUSTED BY INDUSTRY LEADERS
      </h2>

      <div style={{ opacity: interpolate(frame, [20, 40], [0, 1]) }}>
        <LogoGrid
          element={{
            id: 'logos',
            type: 'logo-grid',
            content: '',
            position: { x: 50, y: 50, z: 1 },
            size: { width: 800, height: 200 },
            style: { logos, columns: 4, animation: 'fade' },
          }}
          style={{}}
          colors={[BRAND.primary, BRAND.secondary]}
          sceneFrame={frame}
        />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 8: Growth Stats */
function GrowthScene() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2 style={{
        color: 'white',
        fontSize: 52,
        fontWeight: 700,
        marginBottom: 60,
        opacity: interpolate(frame, [0, 20], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Explosive Growth
      </h2>

      <div style={{ opacity: interpolate(frame, [20, 40], [0, 1]) }}>
        <DataVisualization
          element={{
            id: 'chart',
            type: 'data-viz',
            content: '',
            position: { x: 50, y: 50, z: 1 },
            size: { width: 700, height: 400 },
            style: {
              chartType: 'bar',
              data: [
                { label: '2021', value: 25 },
                { label: '2022', value: 48 },
                { label: '2023', value: 72 },
                { label: '2024', value: 95 },
              ],
            },
          }}
          style={{}}
          colors={['#ffffff', '#34d399']}
          sceneFrame={frame}
        />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 9: Features Grid */
function FeaturesScene() {
  const frame = useCurrentFrame();

  const features = [
    { icon: '⚡', title: 'Lightning Fast' },
    { icon: '🔒', title: 'Enterprise Security' },
    { icon: '🌍', title: 'Global CDN' },
    { icon: '🔄', title: 'Auto Scaling' },
    { icon: '📊', title: 'Real-time Analytics' },
    { icon: '🛠️', title: 'Developer Tools' },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a2e 100%)`,
      padding: 60,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2 style={{
        color: 'white',
        fontSize: 48,
        fontWeight: 700,
        marginBottom: 60,
        opacity: interpolate(frame, [0, 20], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Everything You Need
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 30,
      }}>
        {features.map((feature, i) => {
          const delay = i * 8;
          const scale = interpolate(frame - delay, [15, 28], [0, 1], { extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '30px 40px',
              textAlign: 'center',
              transform: `scale(${scale})`,
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 15 }}>{feature.icon}</div>
              <div style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
              }}>
                {feature.title}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* Scene 10: Call to Action */
function CTAScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 100 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 8 + i * 4,
          height: 8 + i * 4,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          left: `${15 + i * 15}%`,
          top: `${20 + Math.sin(frame * 0.03 + i) * 10}%`,
          transform: `translateY(${Math.sin(frame * 0.05 + i * 0.5) * 20}px)`,
        }} />
      ))}

      <h1 style={{
        color: 'white',
        fontSize: 72,
        fontWeight: 800,
        textAlign: 'center',
        margin: 0,
        opacity: interpolate(frame, [0, 25], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Start Building
        <br />
        Today
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.8)',
        fontSize: 28,
        marginTop: 30,
        marginBottom: 50,
        opacity: interpolate(frame, [15, 35], [0, 1]),
        fontFamily: 'SF Pro Display, system-ui, sans-serif',
      }}>
        Join thousands of developers worldwide
      </p>

      <div style={{
        transform: `scale(${Math.max(0, buttonScale)})`,
      }}>
        <div style={{
          background: 'white',
          color: BRAND.primary,
          padding: '24px 80px',
          borderRadius: 60,
          fontSize: 32,
          fontWeight: 700,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
        }}>
          Get Started Free →
        </div>
      </div>
    </AbsoluteFill>
  );
}
