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
    const body = await req.json();
    const { planId, status, videoUrl, error: renderError } = body;
    
    console.log('Webhook received:', { planId, status, videoUrl, error: renderError });

    if (!planId) {
      throw new Error("planId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (status === 'completed' && videoUrl) {
      // Render succeeded - update with video URL
      const { error: updateError } = await supabase
        .from('video_plans')
        .update({
          status: 'completed',
          final_video_url: videoUrl,
          completed_at: new Date().toISOString(),
          error: null,
        })
        .eq('id', planId);

      if (updateError) {
        console.error('Failed to update plan with video URL:', updateError);
        throw updateError;
      }

      console.log('Video plan updated with final URL:', planId, videoUrl);
    } else if (status === 'failed') {
      // Render failed - update with error
      const { error: updateError } = await supabase
        .from('video_plans')
        .update({
          status: 'failed',
          error: renderError || 'Unknown render error',
          completed_at: new Date().toISOString(),
        })
        .eq('id', planId);

      if (updateError) {
        console.error('Failed to update plan with error:', updateError);
        throw updateError;
      }

      console.log('Video plan marked as failed:', planId);
    } else {
      throw new Error(`Invalid webhook payload: status=${status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in render-webhook:", error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
