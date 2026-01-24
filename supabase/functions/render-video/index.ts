import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const plan = planData.plan;
    const duration = plan?.duration || 10;
    const fps = plan?.fps || 30;
    
    // For now, we'll simulate rendering by creating a placeholder
    // In production, this would call Remotion Lambda or similar service
    
    // Generate a unique filename
    const filename = `video-${planId}-${Date.now()}.mp4`;
    
    // Create a placeholder video info (in production, this would be actual render)
    // For MVP, we'll provide the code download as the "render" output
    const renderInfo = {
      status: 'ready_for_local_render',
      message: 'Video code is ready. Download the code and run locally for full quality render.',
      code: planData.generated_code,
      settings: {
        duration,
        fps,
        width: plan?.resolution?.width || 1920,
        height: plan?.resolution?.height || 1080,
      },
      command: `npx remotion render src/Video.tsx MyVideo out/${filename} --props='${JSON.stringify({ plan })}'`,
    };

    // Update the plan with render info
    const { error: updateError } = await supabase
      .from('video_plans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        // Store render info in a way that can be retrieved
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
      message: 'Video render prepared successfully. Download the code to render locally.',
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in render-video:", error);
    
    // Try to update status to failed
    try {
      const { planId } = await req.clone().json();
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
