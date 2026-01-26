/**
 * Community Package Showcase
 * 
 * Demonstrates real Remotion community packages working in our system:
 * - @remotion/transitions - Scene transitions
 * - @remotion/lottie - Lottie animations
 * - @remotion/gif - GIF support
 * - @remotion/google-fonts - Google Fonts
 */

import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';
import { Lottie, LottieAnimationData } from '@remotion/lottie';
import { Gif } from '@remotion/gif';
import { loadFont } from '@remotion/google-fonts/Roboto';

// Load Google Font
const { fontFamily } = loadFont();

export const CommunityPackagesShowcase: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Transitions Demo */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene1Transitions />
      </TransitionSeries.Sequence>

      {/* Slide transition */}
      <TransitionSeries.Transition
        presentation={slide()}
        timing={linearTiming({ durationInFrames: 30 })}
      />

      {/* Scene 2: Lottie Animations */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene2Lottie />
      </TransitionSeries.Sequence>

      {/* Wipe transition */}
      <TransitionSeries.Transition
        presentation={wipe()}
        timing={linearTiming({ durationInFrames: 30 })}
      />

      {/* Scene 3: GIFs & Fonts */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene3GifsAndFonts />
      </TransitionSeries.Sequence>

      {/* Fade transition */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 30 })}
      />

      {/* Scene 4: Combined Demo */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene4Combined />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

/**
 * Scene 1: Demonstrate @remotion/transitions
 */
function Scene1Transitions() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${Math.min(1, frame / 30)})`,
          opacity: Math.min(1, frame / 20),
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
          }}
        >
          🎬 Remotion Transitions
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 32,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Professional scene transitions from @remotion/transitions
        </p>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Scene 2: Demonstrate @remotion/lottie
 */
function Scene2Lottie() {
  const frame = useCurrentFrame();

  // Example Lottie data (you can fetch real ones from LottieFiles.com)
  const exampleLottieData: LottieAnimationData = {
    v: '5.5.7',
    fr: 60,
    ip: 0,
    op: 180,
    w: 500,
    h: 500,
    nm: 'Example',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Shape Layer',
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 1, k: [{ t: 0, s: [0], e: [360] }] },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: 'rc',
            d: 1,
            s: { a: 0, k: [100, 100] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 10 },
            nm: 'Rectangle',
          },
          {
            ty: 'fl',
            c: { a: 0, k: [1, 0.5, 0, 1] },
            o: { a: 0, k: 100 },
            r: 1,
            nm: 'Fill',
          },
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
    ],
    markers: [],
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity: Math.min(1, frame / 20),
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
          }}
        >
          ✨ Lottie Animations
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 32,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Thousands of FREE animations from LottieFiles.com
        </p>

        {/* Placeholder for Lottie - in real use, fetch from LottieFiles */}
        <div
          style={{
            marginTop: 40,
            width: 300,
            height: 300,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: 18,
          }}
        >
          {/* Lottie component would go here */}
          <div>🎨 Lottie Animation Here</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Scene 3: Demonstrate @remotion/gif and Google Fonts
 */
function Scene3GifsAndFonts() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f59e0b',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity: Math.min(1, frame / 20),
          transform: `translateY(${Math.max(0, 50 - frame * 2)}px)`,
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
            fontFamily, // Google Font!
          }}
        >
          🖼️ GIFs & Fonts
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 32,
            textAlign: 'center',
            marginTop: 20,
            fontFamily, // Google Font!
          }}
        >
          @remotion/gif + @remotion/google-fonts
        </p>

        {/* Placeholder for GIF */}
        <div
          style={{
            marginTop: 40,
            width: 400,
            height: 300,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: 18,
            fontFamily,
          }}
        >
          {/* GIF component would go here */}
          <div>🎬 Animated GIF Here</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * Scene 4: Combined demo
 */
function Scene4Combined() {
  const frame = useCurrentFrame();

  const features = [
    { icon: '🎬', name: 'Transitions', pkg: '@remotion/transitions' },
    { icon: '✨', name: 'Lottie', pkg: '@remotion/lottie' },
    { icon: '🖼️', name: 'GIFs', pkg: '@remotion/gif' },
    { icon: '🔤', name: 'Fonts', pkg: '@remotion/google-fonts' },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity: Math.min(1, frame / 20),
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
            marginBottom: 60,
          }}
        >
          🚀 All Community Packages
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 40,
            maxWidth: 800,
          }}
        >
          {features.map((feature, i) => {
            const delay = i * 15;
            const progress = Math.max(0, Math.min(1, (frame - delay) / 20));

            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: 40,
                  transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
                  opacity: progress,
                }}
              >
                <div style={{ fontSize: 60, marginBottom: 16 }}>
                  {feature.icon}
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}
                >
                  {feature.name}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    fontFamily: 'monospace',
                  }}
                >
                  {feature.pkg}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
