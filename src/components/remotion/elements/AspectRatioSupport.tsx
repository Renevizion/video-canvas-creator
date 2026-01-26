/**
 * Multi-Aspect Ratio Support
 * 
 * TEST THIS: Switch between landscape, vertical, square in Remotion Studio
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type AspectRatio =
  | 'landscape' // 16:9 - YouTube, standard
  | 'vertical' // 9:16 - TikTok, Reels, Shorts
  | 'square' // 1:1 - Instagram, Facebook
  | 'ultrawide' // 21:9 - Cinematic
  | 'portrait' // 4:5 - Instagram portrait
  | 'story'; // 9:16 - Instagram Stories

export interface AspectRatioConfig {
  width: number;
  height: number;
  name: string;
  description: string;
  platforms: string[];
}

export const ASPECT_RATIOS: Record<AspectRatio, AspectRatioConfig> = {
  landscape: {
    width: 1920,
    height: 1080,
    name: 'Landscape (16:9)',
    description: 'Standard YouTube, desktop viewing',
    platforms: ['YouTube', 'Vimeo', 'Desktop'],
  },
  vertical: {
    width: 1080,
    height: 1920,
    name: 'Vertical (9:16)',
    description: 'TikTok, Instagram Reels, YouTube Shorts',
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Snapchat'],
  },
  square: {
    width: 1080,
    height: 1080,
    name: 'Square (1:1)',
    description: 'Instagram feed, Facebook',
    platforms: ['Instagram Feed', 'Facebook', 'LinkedIn'],
  },
  ultrawide: {
    width: 2560,
    height: 1080,
    name: 'Ultra-wide (21:9)',
    description: 'Cinematic, ultra-wide monitors',
    platforms: ['Cinema', 'Ultra-wide displays'],
  },
  portrait: {
    width: 1080,
    height: 1350,
    name: 'Portrait (4:5)',
    description: 'Instagram portrait posts',
    platforms: ['Instagram Portrait'],
  },
  story: {
    width: 1080,
    height: 1920,
    name: 'Story (9:16)',
    description: 'Instagram/Facebook Stories',
    platforms: ['Instagram Stories', 'Facebook Stories'],
  },
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  aspectRatio?: AspectRatio;
  safeArea?: boolean; // Add safe areas for mobile
  backgroundColor?: string;
}

/**
 * Container that adapts content to different aspect ratios
 */
export function ResponsiveContainer({
  children,
  aspectRatio = 'landscape',
  safeArea = false,
  backgroundColor = '#000',
}: ResponsiveContainerProps) {
  const config = ASPECT_RATIOS[aspectRatio];

  // Safe areas for mobile devices (notch, buttons, etc.)
  const safeAreaPadding = safeArea
    ? {
        top: aspectRatio === 'vertical' || aspectRatio === 'story' ? 60 : 0,
        bottom: aspectRatio === 'vertical' || aspectRatio === 'story' ? 80 : 0,
        left: 40,
        right: 40,
      }
    : { top: 0, bottom: 0, left: 0, right: 0 };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: `${safeAreaPadding.top}px ${safeAreaPadding.right}px ${safeAreaPadding.bottom}px ${safeAreaPadding.left}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

/**
 * Demo showing all aspect ratios side by side
 */
export const AspectRatioDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a1a', padding: 40 }}>
      <h1
        style={{
          color: 'white',
          fontSize: 48,
          marginBottom: 40,
          textAlign: 'center',
        }}
      >
        Aspect Ratio Support - All Platforms
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 30,
          height: 'calc(100% - 120px)',
        }}
      >
        {(Object.entries(ASPECT_RATIOS) as [AspectRatio, AspectRatioConfig][]).map(
          ([ratio, config], i) => {
            const delay = i * 10;
            const scale = interpolate(frame - delay, [0, 20], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={ratio}
                style={{
                  background: '#2a2a2a',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: `${config.width}/${config.height}`,
                    maxHeight: 200,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 16,
                  }}
                >
                  {config.width} × {config.height}
                </div>

                <h3
                  style={{
                    color: 'white',
                    fontSize: 20,
                    margin: '0 0 8px 0',
                  }}
                >
                  {config.name}
                </h3>

                <p
                  style={{
                    color: '#888',
                    fontSize: 14,
                    margin: '0 0 12px 0',
                    textAlign: 'center',
                  }}
                >
                  {config.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  {config.platforms.map((platform) => (
                    <span
                      key={platform}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Vertical (TikTok/Reels) optimized layout
 */
export const VerticalVideoTemplate: React.FC<{
  title: string;
  subtitle: string;
  content: React.ReactNode;
}> = ({ title, subtitle, content }) => {
  const frame = useCurrentFrame();

  return (
    <ResponsiveContainer aspectRatio="vertical" safeArea backgroundColor="#000">
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top section - Title */}
        <div
          style={{
            padding: 20,
            opacity: interpolate(frame, [0, 20], [0, 1]),
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 24,
              margin: '8px 0 0 0',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Middle section - Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          {content}
        </div>

        {/* Bottom section - CTA */}
        <div
          style={{
            padding: 20,
            opacity: interpolate(frame, [40, 60], [0, 1]),
          }}
        >
          <button
            style={{
              width: '100%',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              fontSize: 24,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Tap to Learn More
          </button>
        </div>
      </AbsoluteFill>
    </ResponsiveContainer>
  );
};

/**
 * Square (Instagram) optimized layout
 */
export const SquareVideoTemplate: React.FC<{
  image: string;
  caption: string;
}> = ({ image, caption }) => {
  const frame = useCurrentFrame();

  return (
    <ResponsiveContainer aspectRatio="square" backgroundColor="#fff">
      <AbsoluteFill>
        {/* Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '80%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Caption overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'rgba(0,0,0,0.7)',
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${interpolate(frame, [20, 40], [100, 0], { extrapolateRight: 'clamp' })}%)`,
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: 24,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {caption}
          </p>
        </div>
      </AbsoluteFill>
    </ResponsiveContainer>
  );
};
