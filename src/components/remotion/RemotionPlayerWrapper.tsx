import React, { useMemo, forwardRef } from 'react';
import { Player } from '@remotion/player';
import { DynamicVideo } from './DynamicVideo';
import type { VideoPlan } from '@/types/video';

interface RemotionPlayerWrapperProps {
  plan: VideoPlan;
  className?: string;
}

export const RemotionPlayerWrapper = forwardRef<HTMLDivElement, RemotionPlayerWrapperProps>(
  ({ plan, className }, ref) => {
    const durationInFrames = useMemo(() => {
      return Math.max(30, Math.round((plan.duration || 10) * 30));
    }, [plan.duration]);

    // Memoize the component to prevent unnecessary re-renders
    const VideoComponent = useMemo(() => {
      return () => <DynamicVideo plan={plan} />;
    }, [plan]);

    return (
      <div ref={ref} className={className}>
        <Player
          component={VideoComponent}
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
          autoPlay={false}
          loop
        />
      </div>
    );
  }
);

RemotionPlayerWrapper.displayName = 'RemotionPlayerWrapper';

export default RemotionPlayerWrapper;
