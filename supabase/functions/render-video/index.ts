import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get the video plan with generated code
    const { data: planData, error: planError } = await supabase
      .from('video_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !planData) {
      throw new Error("Video plan not found");
    }

    if (!planData.generated_code) {
      throw new Error("No generated code found. Please generate code first.");
    }

    // Update status to rendering
    await supabase
      .from('video_plans')
      .update({ status: 'rendering' })
      .eq('id', planId);

    const plan = planData.plan as {
      duration?: number;
      fps?: number;
      resolution?: { width?: number; height?: number };
    };
    const duration = plan?.duration || 10;
    const fps = plan?.fps || 30;
    const width = plan?.resolution?.width || 1920;
    const height = plan?.resolution?.height || 1080;

    // If Railway URL is configured, send job to Railway
    if (railwayUrl) {
      console.log('Sending render job to Railway:', railwayUrl);
      
      // Build webhook callback URL
      const webhookUrl = `${supabaseUrl}/functions/v1/render-webhook`;
      
      // Send render request to Railway (fire-and-forget style)
      const renderPayload = {
        planId,
        code: planData.generated_code,
        plan: planData.plan,
        composition: {
          id: 'DynamicVideo',
          width,
          height,
          fps,
          durationInFrames: duration * fps,
        },
        webhookUrl,
      };

      // Fire-and-forget: send to Railway without blocking
      // Use globalThis.EdgeRuntime if available, otherwise just fire the promise
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
            await response.text(); // Consume response body
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

      // Check if EdgeRuntime is available (Supabase Edge Functions)
      if (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis) {
        (globalThis as unknown as { EdgeRuntime: { waitUntil: (p: Promise<void>) => void } }).EdgeRuntime.waitUntil(sendToRailway());
      } else {
        // Fallback: fire and don't await
        sendToRailway();
      }

      return new Response(JSON.stringify({
        success: true,
        planId,
        status: 'rendering',
        message: 'Video render job sent to cloud renderer. Check back for status updates.',
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: No Railway configured - provide local render instructions
    const filename = `video-${planId}-${Date.now()}.mp4`;
    
    const renderInfo = {
      status: 'ready_for_local_render',
      message: 'No cloud renderer configured. Download the code and run locally for full quality render.',
      code: planData.generated_code,
      settings: {
        duration,
        fps,
        width,
        height,
      },
      command: `npx remotion render src/Video.tsx MyVideo out/${filename} --props='${JSON.stringify({ plan: planData.plan })}'`,
    };

    // Update the plan with render info
    const { error: updateError } = await supabase
      .from('video_plans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        preview_url: JSON.stringify(renderInfo),
      })
      .eq('id', planId);

    if (updateError) {
      console.error('Failed to update plan:', updateError);
      throw updateError;
    }

    console.log('Render preparation completed for plan:', planId);

    return new Response(JSON.stringify({
      success: true,
      planId,
      renderInfo,
      message: 'Video render prepared. Download the code to render locally.',
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in render-video:", error);
    
    // Try to update status to failed
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
