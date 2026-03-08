import React, { useMemo, forwardRef, useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { SophisticatedVideo } from './SophisticatedVideo';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

interface RemotionPlayerWrapperProps {
  plan: VideoPlan | EnhancedVideoPlan;
  className?: string;
}

/**
 * Video player wrapper - ALWAYS uses SophisticatedVideo renderer
 * Resolves generated asset URLs before rendering
 */
export const RemotionPlayerWrapper = forwardRef<HTMLDivElement, RemotionPlayerWrapperProps>(
  ({ plan, className }, ref) => {
    const [resolvedPlan, setResolvedPlan] = useState<EnhancedVideoPlan>(plan as EnhancedVideoPlan);

    // Resolve generated asset URLs for image elements that still have description text
    useEffect(() => {
      const resolvePlan = async () => {
        const enhanced = plan as EnhancedVideoPlan;
        
        // Find image elements that have description text instead of URLs
        const unresolvedIds: string[] = [];
        for (const scene of enhanced.scenes) {
          for (const el of scene.elements) {
            if (el.type === 'image' && el.content && !el.content.startsWith('http') && !el.content.startsWith('/') && !el.content.startsWith('data:')) {
              unresolvedIds.push(el.id);
            }
          }
        }

        if (unresolvedIds.length === 0) {
          setResolvedPlan(enhanced);
          return;
        }

        // Look up generated assets by requirement_id
        const planId = (enhanced as any).id;
        let assetMap: Record<string, string> = {};

        if (planId) {
          const { data } = await supabase
            .from('generated_assets')
            .select('requirement_id, url')
            .eq('plan_id', planId);

          if (data) {
            for (const row of data) {
              assetMap[row.requirement_id] = row.url;
            }
          }
        }

        // If no plan_id match, try matching by requirement_id directly
        if (Object.keys(assetMap).length === 0 && unresolvedIds.length > 0) {
          const { data } = await supabase
            .from('generated_assets')
            .select('requirement_id, url')
            .in('requirement_id', unresolvedIds)
            .order('created_at', { ascending: false });

          if (data) {
            for (const row of data) {
              if (!assetMap[row.requirement_id]) {
                assetMap[row.requirement_id] = row.url;
              }
            }
          }
        }

        if (Object.keys(assetMap).length > 0) {
          const updated = {
            ...enhanced,
            scenes: enhanced.scenes.map(scene => ({
              ...scene,
              elements: scene.elements.map(el => {
                if (el.type === 'image' && assetMap[el.id]) {
                  return { ...el, content: assetMap[el.id] };
                }
                return el;
              }),
            })),
          };
          console.log(`[RemotionPlayerWrapper] Resolved ${Object.keys(assetMap).length} asset URLs`);
          setResolvedPlan(updated);
        } else {
          setResolvedPlan(enhanced);
        }
      };

      resolvePlan();
    }, [plan]);

    const durationInFrames = useMemo(() => {
      return Math.max(30, Math.round((plan.duration || 10) * 30));
    }, [plan.duration]);

    // Log what we're rendering
    const meta = resolvedPlan.sophisticatedMetadata;
    if (meta) {
      console.log('[RemotionPlayerWrapper] Rendering with SophisticatedVideo');
      console.log(`   Production Grade: ${meta.productionGrade}`);
      console.log(`   Camera Paths: ${meta.usesOrbitalCamera || meta.usesForwardTracking ? '✓' : '✗'}`);
      console.log(`   Curved Paths: ${meta.usesCurvedPaths ? '✓' : '✗'}`);
      console.log(`   Parallax: ${meta.usesParallax ? '✓' : '✗'}`);
      console.log(`   Color Grading: ${meta.usesColorGrading ? '✓' : '✗'}`);
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div ref={ref} className={className} onClick={handleClick} onPointerDown={handleClick}>
        <Player
          component={SophisticatedVideo}
          inputProps={{ videoPlan: resolvedPlan }}
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
