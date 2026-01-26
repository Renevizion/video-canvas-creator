import React, { useMemo, forwardRef } from 'react';
import { Player } from '@remotion/player';
import { DynamicVideo } from './DynamicVideo';
import { SophisticatedVideo } from './SophisticatedVideo';
import type { VideoPlan } from '@/types/video';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

interface RemotionPlayerWrapperProps {
  plan: VideoPlan | EnhancedVideoPlan;
  className?: string;
}

/**
 * Intelligent video player wrapper that automatically selects the appropriate renderer:
 * - SophisticatedVideo for EnhancedVideoPlan (with camera paths, parallax, etc.)
 * - DynamicVideo for basic VideoPlan (fallback)
 */
export const RemotionPlayerWrapper = forwardRef<HTMLDivElement, RemotionPlayerWrapperProps>(
  ({ plan, className }, ref) => {
    const durationInFrames = useMemo(() => {
      return Math.max(30, Math.round((plan.duration || 10) * 30));
    }, [plan.duration]);

    // Detect if this is an enhanced sophisticated video plan
    const isSophisticated = useMemo(() => {
      return 'sophisticatedMetadata' in plan && plan.sophisticatedMetadata !== undefined;
    }, [plan]);

    // Select the appropriate component
    const VideoComponent = isSophisticated ? SophisticatedVideo : DynamicVideo;
    const inputProps = isSophisticated 
      ? { videoPlan: plan as EnhancedVideoPlan }
      : { plan: plan as VideoPlan };

    console.log(`[RemotionPlayerWrapper] Using ${isSophisticated ? 'SophisticatedVideo' : 'DynamicVideo'} renderer`);
    if (isSophisticated) {
      const enhanced = plan as EnhancedVideoPlan;
      console.log(`   Production Grade: ${enhanced.sophisticatedMetadata?.productionGrade || 'N/A'}`);
      console.log(`   Camera Paths: ${enhanced.sophisticatedMetadata?.usesOrbitalCamera || enhanced.sophisticatedMetadata?.usesForwardTracking ? '✓' : '✗'}`);
      console.log(`   Curved Paths: ${enhanced.sophisticatedMetadata?.usesCurvedPaths ? '✓' : '✗'}`);
      console.log(`   Parallax: ${enhanced.sophisticatedMetadata?.usesParallax ? '✓' : '✗'}`);
      console.log(`   Color Grading: ${enhanced.sophisticatedMetadata?.usesColorGrading ? '✓' : '✗'}`);
    }

    return (
      <div ref={ref} className={className}>
        <Player
          component={VideoComponent}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          controls
          autoPlay
          loop
          acknowledgeRemotionLicense={true}
        />
      </div>
    );
  }
);

RemotionPlayerWrapper.displayName = 'RemotionPlayerWrapper';

export default RemotionPlayerWrapper;
