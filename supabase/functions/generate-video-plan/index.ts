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
    const { prompt, duration, style, brandData, aspectRatio = 'landscape' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Aspect ratio configurations
    const aspectRatios: Record<string, { width: number; height: number }> = {
      'landscape': { width: 1920, height: 1080 },
      'portrait': { width: 1080, height: 1920 },
      'square': { width: 1080, height: 1080 },
    };
    const resolution = aspectRatios[aspectRatio] || aspectRatios.landscape;

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

    const systemPrompt = `You are an expert video production planner creating CINEMATIC, broadcast-quality commercial videos.
${brandContext}
CRITICAL: Return ONLY valid JSON, no markdown, no explanations.

ASPECT RATIO OPTIMIZATION (IMPORTANT):
- Video aspect ratio: ${aspectRatio} (${resolution.width}x${resolution.height})
- FOR PORTRAIT (9:16 / TikTok/Reels): Place elements vertically centered, use Y positions 20-80%, stack content
- FOR LANDSCAPE (16:9 / YouTube): Use wide horizontal layouts, cinematic framing
- FOR SQUARE (1:1 / Instagram): Balanced composition, center-focused

VOICEOVER & CAPTIONS:
- Add a "voiceover" field to EACH scene with short, punchy text (3-7 words)
- This text will be displayed as TikTok-style captions
- Examples: "Check this out" → "Mind-blowing results" → "Get started today"

MANDATORY VISUAL QUALITY STANDARDS:
- Every scene MUST have 4-8 layered elements for visual depth
- Use dramatic scale animations (0.3 → 1.0) with spring easing
- Stagger element delays by 0.15-0.3 seconds for professional flow
- Include floating accent elements (orbs, particles, glows)
- Add subtle parallax motion to backgrounds
- Use glassmorphism effects with backdrop-blur

ADVANCED ELEMENT TYPES (USE THESE):
1. "code-editor" - 3D laptop with animated code. styleType: "code-editor", content: multi-line code
2. "terminal" - Command line typing effect. styleType: "terminal", content: CLI commands
3. "progress" - Animated progress indicator. styleType: "progress", style.progress: 0-100
4. "3d-card" - Glassmorphic floating card. styleType: "3d-card" with perspective transforms
5. "laptop-mockup" - 3D rotating laptop frame. styleType: "laptop-mockup"

MANDATORY JSON STRUCTURE:
{
  "duration": ${duration},
  "fps": 30,
  "resolution": ${JSON.stringify(resolution)},
  "aspectRatio": "${aspectRatio}",
  "scenes": [
    {
      "id": "scene_1",
      "startTime": 0,
      "duration": 3,
      "description": "Cinematic opening",
      "voiceover": "Check this out",
      "elements": [
        {
          "id": "bg_gradient",
          "type": "shape",
          "content": "Animated gradient background with floating orbs",
          "position": { "x": 50, "y": 50, "z": 0 },
          "size": { "width": 100, "height": 100 },
          "style": { 
            "background": "linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)",
            "overflow": "hidden"
          },
          "animation": { "name": "fadeIn", "type": "fade", "duration": 0.5, "easing": "ease-out", "delay": 0, "properties": { "opacity": [0, 1] } }
        },
        {
          "id": "floating_orb_1",
          "type": "shape",
          "content": "Floating accent orb",
          "position": { "x": 20, "y": 30, "z": 1 },
          "size": { "width": 15, "height": 15 },
          "style": { 
            "background": "radial-gradient(circle, ${colors[3]}40 0%, transparent 70%)",
            "borderRadius": "50%",
            "filter": "blur(20px)"
          },
          "animation": { "name": "float", "type": "custom", "duration": 3, "easing": "ease-in-out", "delay": 0, "properties": { "y": [30, 35, 30] } }
        },
        {
          "id": "main_title",
          "type": "text",
          "content": "Your Headline Here",
          "position": { "x": 50, "y": 35, "z": 3 },
          "size": { "width": 80, "height": 20 },
          "style": { 
            "fontSize": 80, 
            "fontWeight": 800, 
            "color": "${colors[3]}",
            "textShadow": "0 4px 30px ${colors[3]}40"
          },
          "animation": { "name": "popIn", "type": "scale", "duration": 0.8, "easing": "spring", "delay": 0.2, "properties": { "scale": [0.3, 1], "opacity": [0, 1] } }
        },
        {
          "id": "subtitle",
          "type": "text",
          "content": "Supporting tagline with key benefit",
          "position": { "x": 50, "y": 55, "z": 3 },
          "size": { "width": 70, "height": 10 },
          "style": { 
            "fontSize": 28, 
            "fontWeight": 400, 
            "color": "${colors[3]}cc"
          },
          "animation": { "name": "slideUp", "type": "slide", "duration": 0.6, "easing": "ease-out", "delay": 0.5, "properties": { "y": [10, 0], "opacity": [0, 1] } }
        },
        {
          "id": "accent_line",
          "type": "shape",
          "content": "Decorative accent line",
          "position": { "x": 50, "y": 65, "z": 2 },
          "size": { "width": 20, "height": 0.5 },
          "style": { 
            "background": "linear-gradient(90deg, transparent, ${colors[3]}, transparent)"
          },
          "animation": { "name": "expandWidth", "type": "scale", "duration": 0.8, "easing": "ease-out", "delay": 0.7, "properties": { "scaleX": [0, 1] } }
        }
      ],
      "animations": [],
      "transition": { "type": "fade", "duration": 0.3 }
    }
  ],
  "requiredAssets": [],
  "style": {
    "colorPalette": ${JSON.stringify(colors)},
    "typography": { "primary": "${brandData?.fonts?.primary || 'Inter'}", "secondary": "JetBrains Mono", "sizes": { "h1": 80, "h2": 48, "body": 24 } },
    "spacing": 24,
    "borderRadius": 16
  }
}

SCENE PLANNING RULES (FOLLOW EXACTLY):
1. Create ${Math.ceil(duration / 2.5)} to ${Math.ceil(duration / 2)} scenes (more scenes = more dynamic)
2. Scene 1: HERO - Logo/title with dramatic entrance, animated background, floating elements
3. Middle scenes: Feature showcases with code-editor, terminal, or 3d-card elements
4. Final scene: Strong CTA with button, contact info, and memorable closing animation
5. EVERY scene needs: gradient background, 1-2 floating accent elements, main content, supporting text
6. For SaaS/tech: ALWAYS include code-editor or terminal showing real product usage
7. Animation delays: 0, 0.2, 0.4, 0.6, 0.8s stagger pattern
8. Use "popIn" (scale 0.3→1) for headlines, "slideUp" for subtitles, "fadeIn" for backgrounds
9. Include at least one element with "3d-card" styleType per feature scene
10. Color palette: ${colors.join(', ')} - use [0] for bg, [1] for secondary, [3] for accents/text`;

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
        plan: {
          ...plan,
          aspectRatio: aspectRatio,
        },
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
