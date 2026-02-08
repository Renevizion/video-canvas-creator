import React, { useMemo, forwardRef } from 'react';
import { Player } from '@remotion/player';
import { SophisticatedVideo } from './SophisticatedVideo';
import type { VideoPlan } from '@/types/video';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

interface RemotionPlayerWrapperProps {
  plan: VideoPlan | EnhancedVideoPlan;
  className?: string;
}

/**
 * Video player wrapper - ALWAYS uses SophisticatedVideo renderer
 * All videos are sophisticated by default - no tiers, no conditionals
 */
export const RemotionPlayerWrapper = forwardRef<HTMLDivElement, RemotionPlayerWrapperProps>(
  ({ plan, className }, ref) => {
    const durationInFrames = useMemo(() => {
      return Math.max(30, Math.round((plan.duration || 10) * 30));
    }, [plan.duration]);

    // ALWAYS use sophisticated video - if plan doesn't have sophisticated metadata, 
    // it means it came from old code and we'll render it with sophisticated renderer anyway
    const enhancedPlan = plan as EnhancedVideoPlan;

    // Log what we're rendering
    console.log('[RemotionPlayerWrapper] Rendering with SophisticatedVideo');
    if (enhancedPlan.sophisticatedMetadata) {
      console.log(`   Production Grade: ${enhancedPlan.sophisticatedMetadata.productionGrade}`);
      console.log(`   Camera Paths: ${enhancedPlan.sophisticatedMetadata.usesOrbitalCamera || enhancedPlan.sophisticatedMetadata.usesForwardTracking ? '✓' : '✗'}`);
      console.log(`   Curved Paths: ${enhancedPlan.sophisticatedMetadata.usesCurvedPaths ? '✓' : '✗'}`);
      console.log(`   Parallax: ${enhancedPlan.sophisticatedMetadata.usesParallax ? '✓' : '✗'}`);
      console.log(`   Color Grading: ${enhancedPlan.sophisticatedMetadata.usesColorGrading ? '✓' : '✗'}`);
    } else {
      console.log('   Note: Plan without sophisticated metadata - will render basic features only');
    }

    // Stop event propagation to prevent clicks from bubbling up to parent elements
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div ref={ref} className={className} onClick={handleClick} onPointerDown={handleClick}>
        <Player
          component={SophisticatedVideo}
          inputProps={{ videoPlan: enhancedPlan }}
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
