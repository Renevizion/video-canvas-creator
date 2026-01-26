/**
 * ULTIMATE MEGA VIDEO - EVERY FEATURE COMBINED
 * 
 * This video uses ABSOLUTELY EVERYTHING:
 * ✅ Music Visualization (from showcase)
 * ✅ TikTok Captions (from showcase)
 * ✅ Screencast with code typing (from showcase)
 * ✅ Year in Review stats (from showcase)
 * ✅ Real audio visualization (NEW)
 * ✅ Professional color grading (NEW)
 * ✅ Film grain + vignette + bloom (NEW)
 * ✅ Vertical aspect ratio (NEW)
 * ✅ Phone mockup
 * ✅ Logo grid
 * ✅ Data visualization
 * ✅ Remotion transitions
 * 
 * YOU CAN RENDER THIS and it has EVERYTHING!
 */

import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';

// NEW features
import { AudioVisualization } from '../elements/AudioVisualization';
import { ResponsiveContainer } from '../elements/AspectRatioSupport';
import { ColorGrading, FilmGrain, Vignette, Bloom } from '../elements/ColorGrading';

// Original showcases
import { MusicVisualization } from './MusicVisualization';
import { CaptionsShowcase } from './CaptionsShowcase';
import { ScreencastShowcase } from './ScreencastShowcase';
import { YearInReview } from './YearInReview';
import { CommunityPackagesShowcase } from './CommunityPackagesShowcase';

// Other elements
import { PhoneMockup } from '../elements/PhoneMockup';
import { LogoGrid } from '../elements/LogoGrid';
import { DataVisualization } from '../elements/DataVisualization';

export const UltimateMegaVideo: React.FC = () => {
  return (
    // Vertical format with professional color grading
    <ResponsiveContainer aspectRatio="vertical" safeArea backgroundColor="#000">
      <ColorGrading preset="cinematic">
        <TransitionSeries>
          {/* Scene 1: Title + Real Audio Viz (NEW) */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene1RealAudio />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 2: Music Visualization Showcase */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene2MusicShowcase />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 3: TikTok Captions Showcase */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene3CaptionsShowcase />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 4: Screencast Showcase */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene4ScreencastShowcase />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-top' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 5: Year in Review Stats */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene5YearInReview />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 6: Community Packages (Transitions, Lottie, Fonts) */}
          <TransitionSeries.Sequence durationInFrames={120}>
            <Scene6CommunityPackages />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-bottom' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 7: Phone Mockup */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene7PhoneMockup />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 8: Logo Grid */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene8LogoGrid />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: 20 })}
          />

          {/* Scene 9: Data Visualization */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene9DataViz />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 15 })}
          />

          {/* Scene 10: Grand Finale */}
          <TransitionSeries.Sequence durationInFrames={90}>
            <Scene10Finale />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Professional effects on ENTIRE video */}
        <FilmGrain intensity={0.15} />
        <Vignette intensity={0.25} color="black" />
        <Bloom intensity={0.2} />
      </ColorGrading>
    </ResponsiveContainer>
  );
};

/* Scene 1: NEW Real Audio Visualization */
function Scene1RealAudio() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        <h1 style={{ color: 'white', fontSize: 64, fontWeight: 'bold', margin: 0 }}>
          MEGA VIDEO
        </h1>
        <p style={{ color: '#3b82f6', fontSize: 32, marginTop: 16 }}>
          Every Feature Combined
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: 200, left: 0, right: 0, height: 400 }}>
        <AudioVisualization
          audioSrc={staticFile('audio-sample.mp3')}
          visualizationType="bars"
          numberOfSamples={32}
          color="#3b82f6"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [40, 60], [0, 1]),
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 24 }}>
          🎵 Real Audio Visualization
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* Scene 2: Music Visualization Showcase */
function Scene2MusicShowcase() {
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      {/* Scale down the 1920x1080 composition to fit 1080x1920 vertical */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.56)',
          transformOrigin: 'center',
        }}
      >
        <MusicVisualization />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '16px 32px',
            borderRadius: 50,
          }}
        >
          <p style={{ color: 'white', fontSize: 28, margin: 0, fontWeight: 'bold' }}>
            🎵 Music Visualization
          </p>
        </div>
      </div>
    </div>
  );
}

/* Scene 3: TikTok Captions Showcase */
function Scene3CaptionsShowcase() {
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.56)',
          transformOrigin: 'center',
        }}
      >
        <CaptionsShowcase />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '16px 32px',
            borderRadius: 50,
          }}
        >
          <p style={{ color: 'white', fontSize: 28, margin: 0, fontWeight: 'bold' }}>
            💬 TikTok-Style Captions
          </p>
        </div>
      </div>
    </div>
  );
}

/* Scene 4: Screencast Showcase */
function Scene4ScreencastShowcase() {
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.56)',
          transformOrigin: 'center',
        }}
      >
        <ScreencastShowcase />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '16px 32px',
            borderRadius: 50,
          }}
        >
          <p style={{ color: 'white', fontSize: 28, margin: 0, fontWeight: 'bold' }}>
            💻 Code Screencast
          </p>
        </div>
      </div>
    </div>
  );
}

/* Scene 5: Year in Review Stats */
function Scene5YearInReview() {
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.56)',
          transformOrigin: 'center',
        }}
      >
        <YearInReview />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '16px 32px',
            borderRadius: 50,
          }}
        >
          <p style={{ color: 'white', fontSize: 28, margin: 0, fontWeight: 'bold' }}>
            📊 Year in Review
          </p>
        </div>
      </div>
    </div>
  );
}

/* Scene 6: Community Packages (Transitions, Lottie, Fonts) */
function Scene6CommunityPackages() {
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.56)',
          transformOrigin: 'center',
        }}
      >
        <CommunityPackagesShowcase />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            padding: '16px 32px',
            borderRadius: 50,
          }}
        >
          <p style={{ color: 'white', fontSize: 28, margin: 0, fontWeight: 'bold' }}>
            🎁 Community Packages
          </p>
        </div>
      </div>
    </div>
  );
}

/* Scene 7: Phone Mockup */
function Scene7PhoneMockup() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #4338ca 0%, #2563eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ opacity: interpolate(frame, [0, 20], [0, 1]) }}>
        <PhoneMockup phoneType="iphone" />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'white', fontSize: 32, fontWeight: 'bold', margin: 0 }}>
          📱 iPhone Mockup
        </p>
      </div>
    </AbsoluteFill>
  );
}

/* Scene 8: Logo Grid */
function Scene8LogoGrid() {
  const frame = useCurrentFrame();

  const logos = [
    { url: 'https://logo.clearbit.com/apple.com', name: 'Apple' },
    { url: 'https://logo.clearbit.com/google.com', name: 'Google' },
    { url: 'https://logo.clearbit.com/microsoft.com', name: 'Microsoft' },
    { url: 'https://logo.clearbit.com/amazon.com', name: 'Amazon' },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #059669 0%, #10b981 100%)',
        padding: 60,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        <h2 style={{ color: 'white', fontSize: 56, fontWeight: 'bold', margin: 0 }}>
          Trusted By
        </h2>
      </div>

      <div style={{ opacity: interpolate(frame, [20, 40], [0, 1]) }}>
        <LogoGrid logos={logos} columns={2} animation="fade" />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 9: Data Visualization */
function Scene9DataViz() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #dc2626 0%, #f59e0b 100%)',
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: 40,
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        <h2 style={{ color: 'white', fontSize: 56, fontWeight: 'bold', margin: 0 }}>
          Performance
        </h2>
      </div>

      <div style={{ opacity: interpolate(frame, [20, 40], [0, 1]) }}>
        <DataVisualization
          chartType="bar"
          data={[
            { label: 'Q1', value: 45 },
            { label: 'Q2', value: 67 },
            { label: 'Q3', value: 82 },
            { label: 'Q4', value: 93 },
          ]}
          colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
        />
      </div>
    </AbsoluteFill>
  );
}

/* Scene 10: Grand Finale */
function Scene10Finale() {
  const frame = useCurrentFrame();

  const features = [
    '🎵 Audio Viz',
    '💬 Captions',
    '💻 Screencast',
    '📊 Stats',
    '🎁 Community',
    '📱 Mockups',
    '🎨 Grading',
    '✨ Effects',
    '🎬 Transitions',
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #7c3aed 0%, #ec4899 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: 72,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        All Features
        <br />
        In One Video
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 60,
        }}
      >
        {features.map((feature, i) => {
          const delay = i * 5;
          const scale = interpolate(frame - delay - 20, [0, 10], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: 20,
                transform: `scale(${scale})`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <p
                style={{
                  color: 'white',
                  fontSize: 28,
                  fontWeight: 'bold',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {feature}
              </p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          opacity: interpolate(frame, [60, 75], [0, 1]),
        }}
      >
        <div
          style={{
            background: 'white',
            color: '#7c3aed',
            padding: '24px 60px',
            borderRadius: 50,
            fontSize: 36,
            fontWeight: 'bold',
          }}
        >
          Ready to Use! 🚀
        </div>
      </div>
    </AbsoluteFill>
  );
}
