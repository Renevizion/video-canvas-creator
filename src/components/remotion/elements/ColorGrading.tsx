/**
 * Professional Color Grading & Video Effects
 * 
 * TEST THIS: Apply different looks to your videos instantly
 * - Film looks (vintage, cinematic, etc.)
 * - Color grading presets
 * - Professional effects (bloom, vignette, grain)
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { noise2D } from '@remotion/noise';

export type ColorGradingPreset =
  | 'cinematic' // Teal & orange, desaturated
  | 'vintage' // Faded, warm, film grain
  | 'vibrant' // High saturation, punchy
  | 'moody' // Dark, contrasty, blue tint
  | 'pastel' // Soft, desaturated, light
  | 'noir' // Black & white, high contrast
  | 'sunset' // Warm, golden hour
  | 'cool' // Blue/teal tint, modern
  | 'natural'; // Minimal grading

interface ColorGradingConfig {
  name: string;
  filters: string;
  description: string;
}

export const COLOR_PRESETS: Record<ColorGradingPreset, ColorGradingConfig> = {
  cinematic: {
    name: 'Cinematic',
    filters:
      'saturate(0.8) contrast(1.1) brightness(0.95) hue-rotate(-5deg) sepia(0.1)',
    description: 'Teal & orange Hollywood look',
  },
  vintage: {
    name: 'Vintage Film',
    filters:
      'saturate(0.7) contrast(0.9) brightness(1.1) sepia(0.3) hue-rotate(10deg)',
    description: 'Faded 70s film aesthetic',
  },
  vibrant: {
    name: 'Vibrant',
    filters: 'saturate(1.4) contrast(1.15) brightness(1.05)',
    description: 'Punchy, high saturation',
  },
  moody: {
    name: 'Moody',
    filters:
      'saturate(0.6) contrast(1.3) brightness(0.8) hue-rotate(200deg) sepia(0.15)',
    description: 'Dark, atmospheric, blue tint',
  },
  pastel: {
    name: 'Pastel',
    filters: 'saturate(0.5) contrast(0.85) brightness(1.2) hue-rotate(5deg)',
    description: 'Soft, light, dreamy',
  },
  noir: {
    name: 'Film Noir',
    filters: 'grayscale(1) contrast(1.4) brightness(0.9)',
    description: 'Black & white, dramatic',
  },
  sunset: {
    name: 'Golden Hour',
    filters:
      'saturate(1.2) contrast(1.05) brightness(1.05) hue-rotate(20deg) sepia(0.2)',
    description: 'Warm, golden tones',
  },
  cool: {
    name: 'Cool Modern',
    filters:
      'saturate(0.9) contrast(1.1) brightness(1) hue-rotate(180deg) sepia(0.05)',
    description: 'Blue/teal, clean look',
  },
  natural: {
    name: 'Natural',
    filters: 'saturate(1) contrast(1) brightness(1)',
    description: 'Minimal color correction',
  },
};

interface ColorGradingProps {
  children: React.ReactNode;
  preset: ColorGradingPreset;
  intensity?: number; // 0-1, default 1
}

/**
 * Apply color grading to content
 */
export function ColorGrading({
  children,
  preset,
  intensity = 1,
}: ColorGradingProps) {
  const config = COLOR_PRESETS[preset];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        filter: config.filters,
        opacity: intensity,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Film grain effect (analog film look)
 */
export function FilmGrain({ intensity = 0.3 }: { intensity?: number }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: intensity,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="filmGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${0.8 + (frame % 10) * 0.02}`}
            numOctaves="4"
            seed={frame}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#filmGrain)" />
      </svg>
    </div>
  );
}

/**
 * Vignette effect (darkened edges)
 */
export function Vignette({
  intensity = 0.5,
  color = 'black',
}: {
  intensity?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle at center, transparent 30%, ${color} 150%)`,
        opacity: intensity,
      }}
    />
  );
}

/**
 * Bloom/Glow effect
 */
export function Bloom({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        filter: `blur(${intensity * 20}px)`,
        mixBlendMode: 'screen',
        opacity: intensity * 0.5,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'white',
        }}
      />
    </div>
  );
}

/**
 * Chromatic Aberration (RGB split)
 */
export function ChromaticAberration({
  intensity = 5,
}: {
  intensity?: number;
}) {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="chromatic">
          <feOffset
            in="SourceGraphic"
            dx={intensity}
            dy="0"
            result="red"
          />
          <feOffset in="SourceGraphic" dx={-intensity} dy="0" result="blue" />
          <feBlend mode="screen" in="red" in2="blue" result="blend1" />
          <feBlend mode="screen" in="blend1" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Lens Distortion (barrel/pincushion)
 */
export function LensDistortion({
  amount = 0.2,
  type = 'barrel',
}: {
  amount?: number;
  type?: 'barrel' | 'pincushion';
}) {
  const distortAmount = type === 'barrel' ? amount : -amount;

  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="lensDistortion">
          <feDisplacementMap
            in="SourceGraphic"
            scale={distortAmount * 50}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Demo showing all color grading presets
 */
export const ColorGradingDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Sample content
  const SampleContent = () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
          transform: `rotate(${frame * 2}deg)`,
        }}
      />
      <h2
        style={{
          color: 'white',
          fontSize: 48,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        Sample Content
      </h2>
    </div>
  );

  const presets = Object.keys(COLOR_PRESETS) as ColorGradingPreset[];
  const currentPresetIndex = Math.floor(frame / 60) % presets.length;
  const currentPreset = presets[currentPresetIndex];
  const config = COLOR_PRESETS[currentPreset];

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <ColorGrading preset={currentPreset}>
        <SampleContent />
        <FilmGrain intensity={0.15} />
        <Vignette intensity={0.3} />
      </ColorGrading>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          background: 'rgba(0,0,0,0.8)',
          padding: '20px 40px',
          borderRadius: 12,
          opacity: interpolate((frame % 60), [0, 10, 50, 60], [0, 1, 1, 0]),
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: 48,
            margin: 0,
            marginBottom: 8,
          }}
        >
          {config.name}
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 24,
            margin: 0,
          }}
        >
          {config.description}
        </p>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Professional video effects stack
 */
export const EffectsStackDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <ColorGrading preset="cinematic">
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              transform: `scale(${interpolate(frame, [0, 30], [0.8, 1])})`,
            }}
          >
            CINEMATIC
          </div>
        </div>

        {/* Apply effects stack */}
        <FilmGrain intensity={0.2} />
        <Vignette intensity={0.4} color="black" />
        <Bloom intensity={0.3} />
      </ColorGrading>
    </AbsoluteFill>
  );
};

/**
 * Before/After comparison
 */
export const BeforeAfterDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const splitPosition = interpolate(frame, [30, 90], [0, 100], {
    extrapolateRight: 'clamp',
  });

  const SampleScene = () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'url(https://picsum.photos/1920/1080)',
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 80,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}
      >
        Color Grading
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Before (no grading) */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <SampleScene />
      </div>

      {/* After (with grading) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - splitPosition}% 0 0)`,
        }}
      >
        <ColorGrading preset="cinematic">
          <SampleScene />
          <FilmGrain intensity={0.15} />
          <Vignette intensity={0.3} />
        </ColorGrading>
      </div>

      {/* Split line */}
      <div
        style={{
          position: 'absolute',
          left: `${splitPosition}%`,
          top: 0,
          bottom: 0,
          width: 4,
          background: 'white',
          boxShadow: '0 0 20px rgba(255,255,255,0.5)',
        }}
      />

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        BEFORE
      </div>
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        AFTER
      </div>
    </AbsoluteFill>
  );
};
