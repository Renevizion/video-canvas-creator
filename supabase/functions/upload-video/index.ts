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
    const contentType = req.headers.get('content-type') || '';
    
    let planId: string;
    let videoData: Uint8Array;
    let fileName: string;

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data
      const formData = await req.formData();
      planId = formData.get('planId') as string;
      const file = formData.get('video') as File;
      
      if (!planId || !file) {
        throw new Error('planId and video file are required');
      }
      
      fileName = `${planId}-${Date.now()}.mp4`;
      videoData = new Uint8Array(await file.arrayBuffer());
    } else {
      // Handle JSON with base64 encoded video
      const body = await req.json();
      planId = body.planId;
      const base64Video = body.videoBase64;
      
      if (!planId) {
        throw new Error('planId is required');
      }
      
      if (!base64Video) {
        throw new Error('videoBase64 is required');
      }
      
      fileName = `${planId}-${Date.now()}.mp4`;
      
      // Decode base64 to binary
      const binaryString = atob(base64Video);
      videoData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        videoData[i] = binaryString.charCodeAt(i);
      }
    }

    console.log('Uploading video for plan:', planId, 'Size:', videoData.length, 'bytes');

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('rendered-videos')
      .upload(fileName, videoData, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('rendered-videos')
      .getPublicUrl(fileName);

    const videoUrl = urlData.publicUrl;
    console.log('Video URL:', videoUrl);

    // Update the video plan with the final URL
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
      console.error('Failed to update plan:', updateError);
      throw updateError;
    }

    console.log('Video plan updated successfully');

    return new Response(JSON.stringify({
      success: true,
      videoUrl,
      planId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in upload-video:", error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
