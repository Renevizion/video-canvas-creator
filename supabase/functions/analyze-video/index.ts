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
    const { fileName, filePath } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get video URL from storage
    const { data: urlData } = supabase.storage
      .from('reference-videos')
      .getPublicUrl(filePath);

    const videoUrl = urlData.publicUrl;
    console.log('Analyzing video at:', videoUrl);

    const analysisPrompt = `You are a professional video analyst. Analyze this video description and create a reusable pattern.

The video is named: ${fileName}

Since I cannot directly view the video, analyze based on the filename and create a template pattern that would be typical for such a video.

Extract and generate:
1. Estimated duration and FPS
2. Typical scene structure for this type of video
3. Common animations and transitions
4. Color palette suggestions
5. Typography recommendations

Return ONLY valid JSON:
{
  "duration": number,
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "scenes": [
    {
      "id": "scene_1",
      "startTime": 0,
      "duration": 3,
      "description": "Scene description",
      "composition": {
        "layout": "center|split|grid|full",
        "layers": [
          {
            "type": "text|image|shape|video|cursor",
            "position": { "x": 50, "y": 50, "z": 1 },
            "size": { "width": 80, "height": 20 },
            "style": {}
          }
        ]
      },
      "animations": [
        {
          "name": "fadeIn",
          "type": "fade",
          "duration": 0.8,
          "easing": "ease-out",
          "delay": 0,
          "properties": { "opacity": [0, 1] }
        }
      ],
      "transition": { "type": "fade", "duration": 0.5 }
    }
  ],
  "globalStyles": {
    "colorPalette": ["#0a0e27", "#1a1a2e", "#53a8ff"],
    "typography": {
      "primary": "Inter",
      "secondary": "JetBrains Mono",
      "sizes": { "h1": 48, "h2": 32, "body": 16 }
    },
    "spacing": 24,
    "borderRadius": 12
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: analysisPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON
    let pattern;
    try {
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      pattern = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse pattern from AI response");
    }

    // Store pattern
    const { data: stored, error: dbError } = await supabase
      .from('video_patterns')
      .insert({
        name: fileName.replace(/\.[^/.]+$/, ''),
        pattern,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log('Pattern stored with ID:', stored.id);

    return new Response(JSON.stringify({
      success: true,
      patternId: stored.id,
      pattern,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-video:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
