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
    const { prompt, duration, style, brandData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const styleColors: Record<string, string[]> = {
      'dark-web': ['#0a0e27', '#1a1a2e', '#16213e', '#53a8ff'],
      'corporate': ['#ffffff', '#f8fafc', '#1e293b', '#3b82f6'],
      'neon': ['#0d0d0d', '#1a1a1a', '#ff00ff', '#00ffff'],
      'minimal': ['#fafafa', '#f5f5f5', '#171717', '#737373'],
      'gradient': ['#1e1b4b', '#312e81', '#667eea', '#f43f5e'],
      'nature': ['#14532d', '#166534', '#22c55e', '#84cc16'],
    };

    // Use brand colors if provided, otherwise use style preset
    let colors = styleColors[style] || styleColors['dark-web'];
    let brandContext = '';
    
    if (brandData) {
      colors = [
        brandData.colors?.background || colors[0],
        brandData.colors?.secondary || colors[1],
        brandData.colors?.primary || colors[2],
        brandData.colors?.accent || colors[3],
      ];
      
      brandContext = `
BRAND CONTEXT (use this for the video):
- Company/Title: ${brandData.title || 'Unknown'}
- Primary Color: ${brandData.colors?.primary || '#3b82f6'}
- Secondary Color: ${brandData.colors?.secondary || '#1e293b'}
- Accent Color: ${brandData.colors?.accent || '#06b6d4'}
- Font: ${brandData.fonts?.primary || 'Inter'}
- Headlines: ${brandData.copywriting?.headlines?.slice(0, 3).join(' | ') || 'N/A'}
- CTAs: ${brandData.copywriting?.ctas?.slice(0, 2).join(' | ') || 'Get Started'}
- Logo URL: ${brandData.logo || 'none'}
- Screenshot available: ${brandData.screenshot ? 'yes' : 'no'}

Use these brand elements in the video. Match the color scheme exactly.
`;
    }

    const systemPrompt = `You are an expert video production planner specializing in CINEMATIC, high-quality commercial videos.
${brandContext}
CRITICAL: Return ONLY valid JSON, no markdown, no explanations.

STYLE REQUIREMENTS - Create visually STUNNING videos like professional motion graphics:
- Use dramatic entrances (scale from 0, slide from off-screen, fade with blur)
- Layer multiple elements with staggered timing for depth
- Include animated backgrounds with gradients and floating orbs
- Use 3D perspective elements for tech products
- Add micro-animations (pulse, float, glow) for visual interest
- Create smooth scene transitions

ADVANCED ELEMENT TYPES (USE THESE - not basic shapes):
1. "code-editor" - Animated code in a 3D laptop. styleType: "code-editor", content: code snippet
2. "terminal" - Command line with typing effect. styleType: "terminal", content: commands
3. "progress" - Animated progress bar. styleType: "progress", style.progress: 0-100
4. "3d-card" - Glassmorphic perspective card. styleType: "3d-card"
5. "laptop-mockup" - 3D laptop frame. styleType: "laptop-mockup"

JSON STRUCTURE:
{
  "duration": ${duration},
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "scenes": [
    {
      "id": "scene_1",
      "startTime": 0,
      "duration": 3,
      "description": "Cinematic opening with logo reveal",
      "elements": [
        {
          "id": "bg_1",
          "type": "shape",
          "content": "Animated gradient background",
          "position": { "x": 50, "y": 50, "z": 0 },
          "size": { "width": 100, "height": 100 },
          "style": { "background": "linear-gradient(135deg, ${colors[0]}, ${colors[1]})" },
          "animation": { "name": "fadeIn", "type": "fade", "duration": 1, "easing": "ease-out", "delay": 0, "properties": { "opacity": [0, 1] } }
        },
        {
          "id": "title_1",
          "type": "text",
          "content": "Your Headline",
          "position": { "x": 50, "y": 40, "z": 2 },
          "size": { "width": 80, "height": 20 },
          "style": { "fontSize": 72, "fontWeight": 800, "color": "${colors[3]}" },
          "animation": { "name": "popIn", "type": "scale", "duration": 0.8, "easing": "ease-out", "delay": 0.3, "properties": { "scale": [0.5, 1] } }
        }
      ],
      "animations": [],
      "transition": { "type": "fade", "duration": 0.3 }
    }
  ],
  "requiredAssets": [],
  "style": {
    "colorPalette": ${JSON.stringify(colors)},
    "typography": { "primary": "${brandData?.fonts?.primary || 'Inter'}", "secondary": "JetBrains Mono", "sizes": { "h1": 72, "h2": 48, "body": 18 } },
    "spacing": 24,
    "borderRadius": 16
  }
}

MANDATORY RULES:
1. Create ${Math.ceil(duration / 3)} to ${Math.ceil(duration / 2)} CINEMATIC scenes
2. Each scene: 2-4 seconds with DRAMATIC animations
3. ALWAYS use advanced elements (code-editor, terminal, 3d-card, progress) for tech demos
4. Use proper animation delays (0.2s stagger between elements)
5. Color palette: ${colors.join(', ')}
6. Scene 1: Hero intro with main headline and dramatic entrance
7. Final scene: Strong CTA with contact info or button
8. For SaaS/tech: Include at least one code-editor or terminal element
9. Text animations: Use "popIn" or "slideUp" with scale, never just fade
10. Background: Use gradient backgrounds, not solid colors`;

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
          { role: "user", content: `Create a ${duration}-second video for: "${prompt}"` },
        ],
        temperature: 0.4,
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
    console.log('AI Response:', JSON.stringify(aiData, null, 2));
    
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error("AI response missing content. Full response:", aiData);
      throw new Error(`No response from AI. Response structure: ${JSON.stringify(aiData)}`);
    }

    // Parse JSON from response
    let plan;
    try {
      // Try to extract JSON from markdown code block if present
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      // Clean up any potential issues
      const cleanJson = jsonStr.trim().replace(/^\s*```json?\s*/, '').replace(/\s*```\s*$/, '');
      plan = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Create a fallback plan
      plan = createFallbackPlan(prompt, duration, colors);
    }

    // Validate and fix the plan structure
    plan = validateAndFixPlan(plan, duration, colors);

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

function createFallbackPlan(prompt: string, duration: number, colors: string[]) {
  const numScenes = Math.ceil(duration / 3);
  const scenes = [];
  
  for (let i = 0; i < numScenes; i++) {
    const startTime = i * 3;
    const sceneDuration = Math.min(3, duration - startTime);
    
    scenes.push({
      id: `scene_${i + 1}`,
      startTime,
      duration: sceneDuration,
      description: i === 0 ? "Opening with title" : i === numScenes - 1 ? "Closing with CTA" : `Feature showcase ${i}`,
      elements: [
        {
          id: `bg_${i + 1}`,
          type: "shape",
          content: "Background",
          position: { x: 50, y: 50, z: 0 },
          size: { width: 100, height: 100 },
          style: { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` },
          animation: { name: "fadeIn", type: "fade", duration: 0.5, easing: "ease-out", delay: 0, properties: { opacity: [0, 1] } }
        },
        {
          id: `text_${i + 1}`,
          type: "text",
          content: i === 0 ? prompt.slice(0, 30) : i === numScenes - 1 ? "Get Started Today" : `Feature ${i}`,
          position: { x: 50, y: 40, z: 1 },
          size: { width: 80, height: 20 },
          style: { fontSize: 48, fontWeight: 700, color: colors[3] },
          animation: { name: "slideUp", type: "slide", duration: 0.8, easing: "ease-out", delay: 0.3, properties: {} }
        }
      ],
      animations: [],
      transition: { type: "fade", duration: 0.3 }
    });
  }
  
  return {
    duration,
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    scenes,
    requiredAssets: [],
    style: {
      colorPalette: colors,
      typography: { primary: "Inter", secondary: "JetBrains Mono", sizes: { h1: 64, h2: 48, body: 18 } },
      spacing: 24,
      borderRadius: 16
    }
  };
}

function validateAndFixPlan(plan: any, duration: number, colors: string[]) {
  if (!plan || typeof plan !== 'object') {
    return createFallbackPlan("Video", duration, colors);
  }
  
  // Ensure required fields exist
  plan.duration = plan.duration || duration;
  plan.fps = 30;
  plan.resolution = plan.resolution || { width: 1920, height: 1080 };
  plan.scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
  plan.requiredAssets = Array.isArray(plan.requiredAssets) ? plan.requiredAssets : [];
  plan.style = plan.style || {
    colorPalette: colors,
    typography: { primary: "Inter", secondary: "JetBrains Mono", sizes: { h1: 64, h2: 48, body: 18 } },
    spacing: 24,
    borderRadius: 16
  };
  
  // Fix each scene
  plan.scenes = plan.scenes.map((scene: any, index: number) => ({
    id: scene.id || `scene_${index + 1}`,
    startTime: scene.startTime ?? index * 3,
    duration: scene.duration || 3,
    description: scene.description || `Scene ${index + 1}`,
    elements: Array.isArray(scene.elements) ? scene.elements.map((el: any, elIndex: number) => ({
      id: el.id || `el_${index}_${elIndex}`,
      type: el.type || "text",
      content: el.content || "",
      position: el.position || { x: 50, y: 50, z: elIndex },
      size: el.size || { width: 80, height: 20 },
      style: el.style || {},
      animation: el.animation || { name: "fadeIn", type: "fade", duration: 0.5, easing: "ease-out", delay: 0, properties: {} }
    })) : [],
    animations: scene.animations || [],
    transition: scene.transition || { type: "fade", duration: 0.3 }
  }));
  
  // Ensure we have at least one scene
  if (plan.scenes.length === 0) {
    plan.scenes = createFallbackPlan("Video", duration, colors).scenes;
  }
  
  return plan;
}
