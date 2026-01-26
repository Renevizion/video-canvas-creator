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
    console.log('Video uploaded at:', videoUrl);

    // IMPORTANT: The AI gateway only supports image formats (PNG, JPEG, WebP, GIF)
    // For video analysis, we need to describe what we want instead of passing the video
    // Users should describe their reference video or upload screenshots/frames
    
    const analysisPrompt = `You are an expert video production designer helping create a video pattern template.

The user has uploaded a reference video: "${fileName}"

Since I cannot directly view video files, I'll create a professional video pattern template based on the filename and common commercial/marketing video styles.

Based on the filename "${fileName}", create a detailed video production pattern that would match what this video likely contains.

Return a DETAILED JSON pattern:

{
  "duration": 15,
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "contentType": "<commercial|music-video|explainer|product-demo|social-media|cinematic>",
  "brand": "<extract from filename if possible>",
  "narrative": "<educated guess of what this video shows based on the name>",
  "visualStyle": {
    "lighting": "cinematic studio lighting with dramatic highlights",
    "colorGrade": "stylized",
    "vfx": ["3D graphics", "motion graphics", "particle effects"],
    "cameraStyle": "dynamic with smooth transitions"
  },
  "scenes": [
    {
      "id": "scene_1",
      "startTime": 0,
      "duration": 3,
      "description": "Opening hook - dramatic reveal with brand elements",
      "visualElements": ["logo", "text overlay", "background graphics"],
      "cameraMovement": "zoom-in",
      "composition": {
        "layout": "center",
        "layers": [
          {
            "type": "shape",
            "description": "Animated background gradient",
            "position": { "x": 50, "y": 50, "z": 0 },
            "size": { "width": 100, "height": 100 },
            "style": { "effect": "glow", "animation": "pulse" }
          },
          {
            "type": "text",
            "description": "Main headline",
            "position": { "x": 50, "y": 40, "z": 2 },
            "size": { "width": 80, "height": 20 },
            "style": { "effect": "none", "animation": "slideUp" }
          }
        ]
      },
      "animations": [
        { "name": "fadeIn", "type": "fade", "duration": 0.8, "easing": "ease-out", "delay": 0, "properties": { "opacity": [0, 1] } }
      ],
      "transition": { "type": "fade", "duration": 0.5 }
    },
    {
      "id": "scene_2",
      "startTime": 3,
      "duration": 5,
      "description": "Main content - showcasing key features or product",
      "visualElements": ["product image", "feature callouts", "icons"],
      "cameraMovement": "pan-right",
      "composition": {
        "layout": "split",
        "layers": [
          {
            "type": "image",
            "description": "Hero product or feature visual",
            "position": { "x": 35, "y": 50, "z": 1 },
            "size": { "width": 50, "height": 70 },
            "style": { "effect": "shadow", "animation": "float" }
          },
          {
            "type": "text",
            "description": "Feature description",
            "position": { "x": 75, "y": 50, "z": 2 },
            "size": { "width": 40, "height": 50 },
            "style": { "effect": "none", "animation": "slideIn" }
          }
        ]
      },
      "animations": [
        { "name": "slideIn", "type": "slide", "duration": 0.6, "easing": "ease-out", "delay": 0.2, "properties": { "translateX": [-50, 0] } }
      ],
      "transition": { "type": "slide", "duration": 0.4 }
    },
    {
      "id": "scene_3",
      "startTime": 8,
      "duration": 4,
      "description": "Supporting content - benefits or social proof",
      "visualElements": ["icons", "statistics", "testimonials"],
      "cameraMovement": "static",
      "composition": {
        "layout": "grid",
        "layers": [
          {
            "type": "shape",
            "description": "Feature cards",
            "position": { "x": 50, "y": 50, "z": 1 },
            "size": { "width": 90, "height": 60 },
            "style": { "effect": "blur", "animation": "popIn" }
          }
        ]
      },
      "animations": [
        { "name": "popIn", "type": "scale", "duration": 0.5, "easing": "ease-out", "delay": 0, "properties": { "scale": [0.8, 1] } }
      ],
      "transition": { "type": "dissolve", "duration": 0.5 }
    },
    {
      "id": "scene_4",
      "startTime": 12,
      "duration": 3,
      "description": "Call to action - final message with brand reinforcement",
      "visualElements": ["logo", "CTA button", "tagline"],
      "cameraMovement": "zoom-out",
      "composition": {
        "layout": "center",
        "layers": [
          {
            "type": "image",
            "description": "Logo",
            "position": { "x": 50, "y": 35, "z": 2 },
            "size": { "width": 30, "height": 15 },
            "style": { "effect": "glow", "animation": "pulse" }
          },
          {
            "type": "shape",
            "description": "CTA button",
            "position": { "x": 50, "y": 60, "z": 3 },
            "size": { "width": 25, "height": 8 },
            "style": { "effect": "glow", "animation": "pulse" }
          },
          {
            "type": "text",
            "description": "CTA text",
            "position": { "x": 50, "y": 60, "z": 4 },
            "size": { "width": 20, "height": 6 },
            "style": { "effect": "none", "animation": "fadeIn" }
          }
        ]
      },
      "animations": [
        { "name": "pulse", "type": "scale", "duration": 1, "easing": "ease-in-out", "delay": 0.5, "properties": { "scale": [1, 1.05, 1] } }
      ],
      "transition": { "type": "fade", "duration": 0.5 }
    }
  ],
  "globalStyles": {
    "colorPalette": ["#0f172a", "#3b82f6", "#f97316", "#ffffff"],
    "typography": {
      "primary": "Inter",
      "secondary": "JetBrains Mono",
      "sizes": { "h1": 64, "h2": 40, "body": 18 }
    },
    "spacing": 24,
    "borderRadius": 16
  },
  "keyTakeaways": [
    "Professional commercial structure with 4 distinct scenes",
    "Dynamic transitions between scenes",
    "Strong call-to-action in finale"
  ]
}

Customize this pattern based on what "${fileName}" suggests about the video content.`;

    console.log('Generating pattern based on filename...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "user", 
            content: analysisPrompt
          },
        ],
        temperature: 0.5,
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
    console.log('AI response received');
    
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", aiData);
      throw new Error("No response from AI model");
    }

    console.log('AI Analysis result (first 500 chars):', content.substring(0, 500));

    // Parse JSON
    let pattern;
    try {
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const cleanJson = jsonStr.trim().replace(/^\s*```json?\s*/, '').replace(/\s*```\s*$/, '');
      pattern = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        try {
          pattern = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
        } catch {
          throw new Error("Failed to parse pattern from AI response");
        }
      } else {
        throw new Error("Failed to parse pattern from AI response");
      }
    }

    // Store pattern with enhanced metadata
    const patternName = pattern.brand 
      ? `${pattern.brand} - ${pattern.contentType || 'Commercial'}`
      : fileName.replace(/\.[^/.]+$/, '');

    const { data: stored, error: dbError } = await supabase
      .from('video_patterns')
      .insert({
        name: patternName,
        pattern,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log('Pattern stored with ID:', stored.id);
    console.log('Video narrative:', pattern.narrative);
    console.log('Scenes created:', pattern.scenes?.length || 0);

    return new Response(JSON.stringify({
      success: true,
      patternId: stored.id,
      pattern,
      summary: {
        name: patternName,
        narrative: pattern.narrative,
        sceneCount: pattern.scenes?.length || 0,
        contentType: pattern.contentType,
        keyTakeaways: pattern.keyTakeaways,
      },
      note: "Pattern generated based on filename. For more accurate patterns, describe your reference video in the Create page."
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
