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
 * Handles all element types with proper sizing and positioning.
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
      const delay = (el.animation?.delay || 0) + elIdx * 0.08;
      const delayFrames = Math.round(delay * fps);
      
      const posX = el.position?.x ?? 50;
      const posY = el.position?.y ?? 50;
      const zIndex = el.position?.z ?? elIdx;
      
      const elStyle = el.style || {};
      const fontSize = (elStyle.fontSize as number) || 48;
      const fontWeight = (elStyle.fontWeight as number) || 600;
      const color = (elStyle.color as string) || colors[0] || '#ffffff';
      const background = (elStyle.background as string) || '';
      
      // Convert size - if <= 100, treat as percentage of viewport, otherwise pixels
      const getSize = (val: number | undefined, defaultVal: number, isPercentage: boolean = true) => {
        if (!val) return isPercentage ? `${defaultVal}%` : `${defaultVal}px`;
        if (val <= 100) return `${val}%`;
        return `${val}px`;
      };

      // TEXT ELEMENT
      if (el.type === 'text') {
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
              fontFamily: '${(elStyle.fontFamily as string) || fontFamily}, system-ui, sans-serif',
              fontSize: ${fontSize},
              fontWeight: ${fontWeight},
              color: '${color}',
              textAlign: 'center',
              maxWidth: '85%',
              lineHeight: 1.2,
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
            }}
          >
            {${JSON.stringify(el.content || '')}}
          </div>`;
      }
      
      // IMAGE ELEMENT (logos, screenshots)
      if (el.type === 'image') {
        const imgSrc = el.content || (elStyle.src as string) || '';
        if (!imgSrc || !imgSrc.startsWith('http')) {
          return ''; // Skip invalid images
        }
        // For images, use pixel sizes scaled to viewport
        const imgWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 15 : el.size.width) : 200;
        const imgHeight = el.size?.height ? (el.size.height <= 100 ? el.size.height * 10 : el.size.height) : 150;
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
            }}
          >
            <img
              src="${imgSrc}"
              style={{
                width: ${imgWidth},
                height: 'auto',
                maxHeight: ${imgHeight},
                objectFit: 'contain',
                borderRadius: ${(elStyle.borderRadius as number) || 12},
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              }}
            />
          </div>`;
      }
      
      // TERMINAL ELEMENT
      if (el.type === 'terminal') {
        const content = el.content || '';
        const termWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 10 : el.size.width) : 600;
        const termHeight = el.size?.height ? (el.size.height <= 100 ? el.size.height * 6 : el.size.height) : 350;
        // Escape content for safe embedding
        const safeContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
              width: ${termWidth},
              height: ${termHeight},
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
              borderRadius: 16,
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              padding: 20,
              fontFamily: 'JetBrains Mono, Monaco, monospace',
              fontSize: 14,
              color: '#4ade80',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27ca40' }} />
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>${JSON.stringify(content)}</pre>
          </div>`;
      }
      
      // CODE EDITOR ELEMENT
      if (el.type === 'code-editor') {
        const content = el.content || '';
        const codeWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 10 : el.size.width) : 650;
        const codeHeight = el.size?.height ? (el.size.height <= 100 ? el.size.height * 6 : el.size.height) : 400;
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
              width: ${codeWidth},
              height: ${codeHeight},
              background: 'linear-gradient(180deg, #1e1e2e 0%, #11111b 100%)',
              borderRadius: 16,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: '#181825', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f38ba8' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f9e2af' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#a6e3a1' }} />
              </div>
              <span style={{ color: '#6c7086', fontSize: 12, marginLeft: 8 }}>App.tsx</span>
            </div>
            <pre style={{ margin: 0, padding: 20, fontFamily: 'JetBrains Mono, Monaco, monospace', fontSize: 14, color: '#cdd6f4', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>${JSON.stringify(content)}</pre>
          </div>`;
      }
      
      // LAPTOP MOCKUP ELEMENT
      if (el.type === 'laptop') {
        const screenContent = el.content || '';
        const laptopWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 12 : el.size.width) : 800;
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) perspective(1200px) rotateX(5deg) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
            }}
          >
            <div style={{
              width: ${laptopWidth},
              background: 'linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%)',
              borderRadius: 16,
              padding: 12,
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                background: '#0f172a',
                borderRadius: 8,
                height: ${laptopWidth * 0.56},
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                fontSize: 24,
              }}>
                {${JSON.stringify(screenContent || 'App Preview')}}
              </div>
            </div>
            <div style={{
              width: ${laptopWidth * 1.1},
              height: 16,
              background: 'linear-gradient(180deg, #3a3a4e 0%, #2a2a3e 100%)',
              borderRadius: '0 0 8px 8px',
              marginLeft: -${laptopWidth * 0.05},
            }} />
          </div>`;
      }
      
      // 3D CARD ELEMENT
      if (el.type === '3d-card') {
        const cardWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 8 : el.size.width) : 400;
        const cardHeight = el.size?.height ? (el.size.height <= 100 ? el.size.height * 5 : el.size.height) : 250;
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: \`translate(-50%, -50%) perspective(1000px) rotateY(\${interpolate(spring_${idx}_${elIdx}, [0, 1], [-15, 5])}deg) rotateX(5deg) scale(\${spring_${idx}_${elIdx}})\`,
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
              width: ${cardWidth},
              height: ${cardHeight},
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {${JSON.stringify(el.content || '')}}
          </div>`;
      }
      
      // PROGRESS BAR ELEMENT
      if (el.type === 'progress-bar' || el.type === 'progress') {
        const barWidth = el.size?.width ? (el.size.width <= 100 ? el.size.width * 6 : el.size.width) : 400;
        
        return `
          <div
            style={{
              position: 'absolute',
              left: '${posX}%',
              top: '${posY}%',
              transform: 'translate(-50%, -50%)',
              opacity: spring_${idx}_${elIdx},
              zIndex: ${zIndex},
              width: ${barWidth},
            }}
          >
            <div style={{ color: '#fff', fontSize: 16, marginBottom: 12, fontWeight: 600 }}>{${JSON.stringify(el.content || 'Building...')}}</div>
            <div style={{
              width: '100%',
              height: 8,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                width: \`\${interpolate(spring_${idx}_${elIdx}, [0, 1], [0, 100])}%\`,
                height: '100%',
                background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)',
                borderRadius: 4,
              }} />
            </div>
          </div>`;
      }
      
      // SHAPE ELEMENT (backgrounds, orbs, glows)
      if (el.type === 'shape') {
        const w = getSize(el.size?.width, 100, true);
        const h = getSize(el.size?.height, 100, true);
        const borderRadius = (elStyle.borderRadius as number) || 0;
        const filter = (elStyle.filter as string) || '';
        const opacity = (elStyle.opacity as number) ?? 1;
        
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
              opacity: ${opacity},
              zIndex: ${zIndex},
            }}
          />`;
      }
      
      return '';
    }).filter(Boolean).join('\n');

    // Generate spring variables for this scene's elements
    const springVars = (scene.elements || []).map((el, elIdx) => {
      const delay = (el.animation?.delay || 0) + elIdx * 0.08;
      const delayFrames = Math.round(delay * fps);
      return `const spring_${idx}_${elIdx} = spring({ fps, frame: Math.max(0, sceneFrame - ${delayFrames}), config: { damping: 25, stiffness: 100, mass: 0.6 } });`;
    }).join('\n    ');

    return `
      {/* Scene ${idx + 1}: ${scene.description || ''} */}
      <Sequence from={${startFrame}} durationInFrames={${sceneDuration}}>
        {(() => {
          const sceneFrame = frame - ${startFrame};
          ${springVars}
          return (
            <AbsoluteFill>
              ${elementsCode || '/* No elements in this scene */'}
            </AbsoluteFill>
          );
        })()}
      </Sequence>`;
  }).join('\n');

  // Extract accent color from plan or use default
  const accentColor = colors[1] || '#06b6d4';
  const bgDark = colors[3] || '#0f172a';
  const bgMid = colors[2] || '#1e293b';

  return `import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Composition, registerRoot } from 'remotion';

const DynamicVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '${bgDark}', overflow: 'hidden' }}>
      {/* Base background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, ${bgMid} 0%, ${bgDark} 100%)',
        }}
      />
      
      {/* Animated accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, ${accentColor}25 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: \`translateY(\${interpolate(frame, [0, ${durationInFrames}], [0, 30])}px)\`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, ${colors[0] || '#ffffff'}10 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Scenes */}
      ${sceneCode}

      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
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
