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

    // Use Gemini's vision capabilities with the VIDEO URL directly
    // Gemini can analyze video content from URLs
    const analysisPrompt = `You are an expert video analyst and cinematographer. I'm sharing a video with you.

ANALYZE THIS VIDEO IN DETAIL. Watch it carefully and extract:

1. **Content Analysis**:
   - What is actually happening in each scene?
   - What objects, people, products, or environments are shown?
   - What is the narrative or story being told?
   - What brand/product is being advertised (if commercial)?

2. **Visual Style**:
   - Lighting style (cinematic, bright, dark, neon, natural)
   - Color grading and dominant colors (extract actual hex codes if possible)
   - Visual effects used (CGI, 3D graphics, particles, lens flares, etc.)
   - Camera movements (pan, zoom, dolly, static, handheld)

3. **Scene Structure** (for each distinct scene):
   - What happens visually?
   - Duration estimate
   - Transition type between scenes (cut, fade, dissolve, wipe, or creative transitions)
   - Key visual elements on screen

4. **Technical Details**:
   - Estimated total duration
   - Aspect ratio (16:9, 9:16, 1:1)
   - Frame rate feel (smooth 30fps, cinematic 24fps, etc.)

5. **Mood & Tone**:
   - Overall emotional tone
   - Pacing (fast, slow, dynamic)
   - Music/sound design feel (if noticeable)

Return a DETAILED JSON pattern that captures the ACTUAL content of this video:

{
  "duration": <actual video duration in seconds>,
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "contentType": "<commercial|music-video|explainer|product-demo|social-media|cinematic|other>",
  "brand": "<brand name if identifiable>",
  "narrative": "<1-2 sentence summary of what happens in the video>",
  "visualStyle": {
    "lighting": "<description>",
    "colorGrade": "<warm|cool|neutral|stylized>",
    "vfx": ["<list of VFX used: CGI, 3D, particles, etc.>"],
    "cameraStyle": "<description of camera movement style>"
  },
  "scenes": [
    {
      "id": "scene_1",
      "startTime": 0,
      "duration": <seconds>,
      "description": "<DETAILED description of what ACTUALLY happens in this scene>",
      "visualElements": ["<list of key visual elements shown>"],
      "cameraMovement": "<pan-left|zoom-in|static|tracking|etc.>",
      "composition": {
        "layout": "center|split|grid|full",
        "layers": [
          {
            "type": "video|image|text|shape|3d-object",
            "description": "<what this layer shows>",
            "position": { "x": 50, "y": 50, "z": 1 },
            "size": { "width": 100, "height": 100 },
            "style": {
              "effect": "<glow|shadow|blur|none>",
              "animation": "<float|pulse|rotate|static>"
            }
          }
        ]
      },
      "animations": [
        {
          "name": "<descriptive name>",
          "type": "fade|slide|scale|rotate|custom",
          "duration": 0.8,
          "easing": "ease-out",
          "delay": 0,
          "properties": { "opacity": [0, 1] }
        }
      ],
      "transition": { 
        "type": "<cut|fade|dissolve|wipe|zoom|glitch|morph - only use if actually in video>", 
        "duration": 0.5 
      }
    }
  ],
  "globalStyles": {
    "colorPalette": ["<actual hex colors from the video>"],
    "typography": {
      "primary": "<font style observed>",
      "secondary": "<secondary font if any>",
      "sizes": { "h1": 64, "h2": 40, "body": 18 }
    },
    "spacing": 24,
    "borderRadius": 16
  },
  "keyTakeaways": [
    "<What makes this video effective?>",
    "<Notable techniques used?>",
    "<How to recreate this style?>"
  ]
}

IMPORTANT: 
- Describe what you ACTUALLY SEE, not what you guess
- If you see CGI food, say "CGI food"
- If you see a robot, describe the robot
- If you see UI mockups, describe them
- Extract REAL colors from the video
- Note ACTUAL transitions, not generic ones`;

    console.log('Sending video to Gemini Vision for analysis...');

    // Send video URL directly to Gemini - it can analyze video content
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro", // Use Pro for better video understanding
        messages: [
          { 
            role: "user", 
            content: [
              {
                type: "text",
                text: analysisPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: videoUrl
                }
              }
            ]
          },
        ],
        temperature: 0.3, // Lower for more accurate analysis
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
    console.log('Gemini Vision response received');
    
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", aiData);
      throw new Error("No response from AI vision model");
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
      // Try to extract any JSON-like structure
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
    console.log('Scenes analyzed:', pattern.scenes?.length || 0);

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
      }
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
