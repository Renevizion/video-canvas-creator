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
    const { prompt, duration, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a video production planner. Convert user requests into detailed scene-by-scene video plans.

Your job:
1. Break down the request into scenes with precise timing
2. Identify all visual elements needed (text, images, shapes, cursors, etc.)
3. Specify animations with easing and timing
4. List required assets that need to be generated
5. Define transitions between scenes

Return ONLY valid JSON matching this structure:
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
      "elements": [
        {
          "id": "element_id",
          "type": "text|image|shape",
          "content": "content or description",
          "position": { "x": 50, "y": 50, "z": 1 },
          "size": { "width": 80, "height": 20 },
          "style": { "fontSize": 48, "color": "#53a8ff" },
          "animation": {
            "name": "fadeIn",
            "type": "fade",
            "duration": 0.8,
            "easing": "ease-out",
            "delay": 0.5,
            "properties": { "opacity": [0, 1] }
          }
        }
      ],
      "animations": [],
      "transition": { "type": "fade", "duration": 0.3 }
    }
  ],
  "requiredAssets": [
    {
      "id": "asset_id",
      "type": "background|image|icon",
      "description": "Asset description",
      "specifications": {
        "width": 1920,
        "height": 1080,
        "style": "dark web, futuristic"
      },
      "providedByUser": false
    }
  ],
  "style": {
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

    const userPrompt = `Create a ${duration || 10}-second video:

"${prompt}"

Style preference: ${style || 'dark-web'}

Be specific about timing, animations, and list all assets needed.`;

    console.log('Generating video plan for:', prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
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

    // Parse JSON from response
    let plan;
    try {
      // Try to extract JSON from markdown code block if present
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      plan = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse video plan from AI response");
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: stored, error: dbError } = await supabase
      .from('video_plans')
      .insert({
        prompt,
        plan,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log('Video plan stored with ID:', stored.id);

    return new Response(JSON.stringify({
      success: true,
      planId: stored.id,
      plan,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-video-plan:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
