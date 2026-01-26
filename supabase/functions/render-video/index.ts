import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompositionConfig {
  compositionId: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}

interface VideoPlan {
  duration?: number;
  fps?: number;
  resolution?: { width?: number; height?: number };
  scenes?: Scene[];
  style?: {
    colorPalette?: string[];
    typography?: { primary?: string };
  };
}

interface Scene {
  id: string;
  startTime: number;
  duration: number;
  description?: string;
  elements?: Element[];
}

interface Element {
  id: string;
  type: string;
  content?: string;
  position?: { x?: number; y?: number; z?: number };
  size?: { width?: number; height?: number };
  style?: Record<string, unknown>;
  animation?: {
    name?: string;
    type?: string;
    delay?: number;
    duration?: number;
  };
}

/**
 * Generate deterministic Remotion code from a video plan.
 * This avoids AI generation which can produce unreliable code.
 */
function generateRemotionCode(plan: VideoPlan, config: CompositionConfig): string {
  const { width, height, fps, durationInFrames } = config;
  const colors = plan.style?.colorPalette || ['#ffffff', '#06b6d4', '#1e293b', '#0f172a'];
  const fontFamily = plan.style?.typography?.primary || 'Inter';
  const scenes = plan.scenes || [];

  const sceneCode = scenes.map((scene, idx) => {
    const startFrame = Math.round(scene.startTime * fps);
    const sceneDuration = Math.round(scene.duration * fps);
    
    const elementsCode = (scene.elements || []).map((el, elIdx) => {
      const delay = (el.animation?.delay || 0) + elIdx * 0.1;
      const delayFrames = Math.round(delay * fps);
      
      const posX = el.position?.x ?? 50;
      const posY = el.position?.y ?? 50;
      const zIndex = el.position?.z ?? elIdx;
      
      const elStyle = el.style || {};
      const fontSize = (elStyle.fontSize as number) || 48;
      const fontWeight = (elStyle.fontWeight as number) || 600;
      const color = (elStyle.color as string) || colors[0];
      const background = (elStyle.background as string) || '';
      
      if (el.type === 'text') {
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${textSpring_${idx}_${elIdx}})\`,
              opacity: textSpring_${idx}_${elIdx},
              zIndex: ${zIndex},
              fontFamily: '${(elStyle.fontFamily as string) || fontFamily}, system-ui, sans-serif',
              fontSize: ${fontSize},
              fontWeight: ${fontWeight},
              color: '${color}',
              textAlign: 'center',
              maxWidth: '80%',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            ${JSON.stringify(el.content || '')}
          </div>`;
      }
      
      if (el.type === 'image' && el.content?.startsWith('http')) {
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${textSpring_${idx}_${elIdx}})\`,
              opacity: textSpring_${idx}_${elIdx},
              zIndex: ${zIndex},
            }}
          >
            <img
              src="${el.content}"
              style={{
                maxWidth: '${el.size?.width || 200}px',
                maxHeight: '${el.size?.height || 200}px',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
              }}
            />
          </div>`;
      }
      
      if (el.type === 'shape') {
        const w = el.size?.width ? (el.size.width <= 100 ? `${el.size.width}%` : `${el.size.width}px`) : '100%';
        const h = el.size?.height ? (el.size.height <= 100 ? `${el.size.height}%` : `${el.size.height}px`) : '100%';
        const borderRadius = (elStyle.borderRadius as number) || 0;
        const filter = (elStyle.filter as string) || '';
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: 'translate(-50%, -50%)',
              width: '${w}',
              height: '${h}',
              background: '${background}',
              borderRadius: ${borderRadius},
              filter: '${filter}',
              opacity: ${elStyle.opacity || 1},
              zIndex: ${zIndex},
            }}
          />`;
      }
      
      return '';
    }).join('\n');

    // Generate spring variables for this scene's elements
    const springVars = (scene.elements || []).map((el, elIdx) => {
      const delay = (el.animation?.delay || 0) + elIdx * 0.1;
      const delayFrames = Math.round(delay * fps);
      return `const textSpring_${idx}_${elIdx} = spring({ fps, frame: Math.max(0, sceneFrame - ${delayFrames}), config: { damping: 30, stiffness: 120, mass: 0.5 } });`;
    }).join('\n    ');

    return `
      {/* Scene ${idx + 1}: ${scene.description || ''} */}
      <Sequence from={${startFrame}} durationInFrames={${sceneDuration}}>
        {(() => {
          const sceneFrame = frame - ${startFrame};
          ${springVars}
          return (
            <AbsoluteFill>
              ${elementsCode}
            </AbsoluteFill>
          );
        })()}
      </Sequence>`;
  }).join('\n');

  return `import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Composition, registerRoot } from 'remotion';

const DynamicVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '${colors[3] || colors[2] || '#0f172a'}', overflow: 'hidden' }}>
      {/* Animated background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, ${colors[2] || '#1e293b'} 0%, ${colors[3] || '#0f172a'} 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '60%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, ${colors[1] || '#06b6d4'}20 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Scenes */}
      ${sceneCode}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DynamicVideo"
      component={DynamicVideo}
      durationInFrames={${durationInFrames}}
      fps={${fps}}
      width={${width}}
      height={${height}}
    />
  );
};

registerRoot(RemotionRoot);
`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId } = await req.json();
    
    if (!planId) {
      throw new Error("planId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const railwayUrl = Deno.env.get("RAILWAY_RENDER_URL");
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting video render for plan:', planId);

    // Get the video plan
    const { data: planData, error: planError } = await supabase
      .from('video_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !planData) {
      throw new Error("Video plan not found");
    }

    const plan = planData.plan as VideoPlan;
    const duration = plan?.duration || 10;
    const fps = plan?.fps || 30;
    const width = plan?.resolution?.width || 1920;
    const height = plan?.resolution?.height || 1080;
    const durationInFrames = duration * fps;

    // Generate deterministic Remotion code from the plan
    const remotionCode = generateRemotionCode(plan, {
      compositionId: 'DynamicVideo',
      width,
      height,
      fps,
      durationInFrames,
    });

    console.log('Generated Remotion code for rendering');

    // Update status to rendering
    await supabase
      .from('video_plans')
      .update({ status: 'rendering' })
      .eq('id', planId);

    // If Railway URL is configured, send job to Railway
    if (railwayUrl) {
      console.log('Sending render job to Railway:', railwayUrl);
      
      const webhookUrl = `${supabaseUrl}/functions/v1/render-webhook`;
      
      const renderPayload = {
        planId,
        code: remotionCode,
        plan: planData.plan,
        composition: {
          id: 'DynamicVideo',
          width,
          height,
          fps,
          durationInFrames,
        },
        webhookUrl,
      };

      // Fire-and-forget: send to Railway
      const sendToRailway = async () => {
        try {
          const response = await fetch(`${railwayUrl}/render`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(renderPayload),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Railway render request failed:', response.status, errorText);
            await supabase
              .from('video_plans')
              .update({ 
                status: 'failed',
                error: `Railway error: ${response.status} - ${errorText}`,
              })
              .eq('id', planId);
          } else {
            console.log('Railway render job accepted');
            await response.text();
          }
        } catch (error) {
          console.error('Failed to reach Railway:', error);
          await supabase
            .from('video_plans')
            .update({ 
              status: 'failed',
              error: `Failed to connect to render server: ${(error as Error).message}`,
            })
            .eq('id', planId);
        }
      };

      if (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis) {
        (globalThis as unknown as { EdgeRuntime: { waitUntil: (p: Promise<void>) => void } }).EdgeRuntime.waitUntil(sendToRailway());
      } else {
        sendToRailway();
      }

      return new Response(JSON.stringify({
        success: true,
        planId,
        status: 'rendering',
        message: 'Video render job sent to cloud renderer.',
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: No Railway configured
    return new Response(JSON.stringify({
      success: false,
      error: 'No cloud renderer configured. Set RAILWAY_RENDER_URL.',
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in render-video:", error);
    
    try {
      const body = await req.clone().json().catch(() => ({}));
      const planId = body?.planId;
      if (planId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('video_plans')
          .update({ 
            status: 'failed',
            error: error instanceof Error ? error.message : "Unknown error"
          })
          .eq('id', planId);
      }
    } catch (e) {
      console.error("Failed to update error status:", e);
    }
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
