import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Configuration
const AI_CONFIG = {
  model: "google/gemini-3-flash-preview",
  temperature: 0.7, // Higher = more creative. Range: 0.0-1.0. Adjust based on quality.
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, duration, style, brandData, aspectRatio = 'landscape', generateImages = false, imageStyle = 'illustration', referencePattern } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Generate images:', generateImages, 'Image style:', imageStyle);

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

    // Reference pattern context (from analyzed videos)
    let referenceContext = '';
    let referenceMode = false;
    if (referencePattern) {
      referenceMode = true;
      const refScenes = referencePattern.scenes || [];
      const refColors = referencePattern.globalStyles?.colorPalette || [];
      
      referenceContext = `
⚠️ REFERENCE PATTERN MODE - THIS IS MANDATORY, NOT OPTIONAL ⚠️

You MUST recreate the EXACT structure and style of this reference video, adapted for the new brand/content.

SCENE-BY-SCENE TEMPLATE (YOU MUST FOLLOW THIS STRUCTURE):
${refScenes.map((s: any, i: number) => `
SCENE ${i + 1} (Duration: ${s.duration}s, Start: ${s.startTime}s):
- Original: "${s.description}"
- YOUR TASK: Create the SAME type of scene but for "${prompt}"
- Transition to next: ${s.transition?.type || 'cut'} (${s.transition?.duration || 0.5}s)
- Animation style: ${s.animations?.[0]?.name || 'fadeIn'}
- Layer count: ${s.composition?.layers?.length || 3} layers
- Layer types: ${s.composition?.layers?.map((l: any) => l.type).join(', ') || 'video, text'}
`).join('\n')}

MANDATORY REQUIREMENTS:
1. Create EXACTLY ${refScenes.length} scenes (same as reference)
2. Use the SAME transition types: ${[...new Set(refScenes.map((s: any) => s.transition?.type).filter(Boolean))].join(', ')}
3. Match the scene durations: ${refScenes.map((s: any) => `${s.duration}s`).join(', ')}
4. Use the SAME animation styles: ${[...new Set(refScenes.flatMap((s: any) => s.animations?.map((a: any) => a.name) || []))].join(', ')}
5. Maintain the SAME visual complexity (layers per scene)

REFERENCE COLOR PALETTE (use similar tones adapted for new brand):
${refColors.join(', ')}

REFERENCE TYPOGRAPHY:
- Primary: ${referencePattern.globalStyles?.typography?.primary || 'Inter'}
- Secondary: ${referencePattern.globalStyles?.typography?.secondary || 'JetBrains Mono'}

CRITICAL: The output should feel like a REMAKE of the reference video with new content.
If reference has "Futuristic opening with liquid gold" → Your output should have "Futuristic opening with [brand-specific element]"
If reference has "Hyper-realistic food close-ups" → Your output should have "Hyper-realistic [product] close-ups"

DO NOT create a generic motion graphics video. RECREATE the reference's cinematic approach.
`;
    }

    // Generate a unique seed for variation per video (using timestamp + random for better uniqueness)
    const uniqueSeed = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const systemPrompt = `You are an expert video production planner creating CINEMATIC, broadcast-quality commercial videos.
${brandContext}
${referenceContext}
CRITICAL: Return ONLY valid JSON, no markdown, no explanations.

🎬 VIDEO PRODUCTION APPROACH:
This system creates rich visual content by combining:
1. AI-generated images for product shots, close-ups, and hero visuals
2. Geometric shapes with organic motion for motion graphics
3. Kinetic typography with advanced animations
4. Layered compositions with depth and parallax

🎬 CREATIVITY & UNIQUENESS (MOST IMPORTANT):
- ANALYZE THE PROMPT DEEPLY: Extract specific details, emotions, and unique aspects
- BE CREATIVE: Don't follow a template - make each video truly unique and tailored
- VARY YOUR APPROACH: Different prompts should result in COMPLETELY different video structures
- USE VARIETY: Mix different animation types, layouts, element types, transitions
- ADD PERSONALITY: Match the tone and style to the specific content being described
- Generation Seed: ${uniqueSeed} - Use this for creative variation

ASPECT RATIO OPTIMIZATION:
- Video aspect ratio: ${aspectRatio} (${resolution.width}x${resolution.height})
- FOR PORTRAIT (9:16 / TikTok/Reels): Place elements vertically centered, use Y positions 20-80%, stack content
- FOR LANDSCAPE (16:9 / YouTube): Use wide horizontal layouts, cinematic framing
- FOR SQUARE (1:1 / Instagram): Balanced composition, center-focused

VOICEOVER & CAPTIONS:
- Add a "voiceover" field to EACH scene with short, punchy text (3-7 words)
- Make voiceovers SPECIFIC to the content, not generic

🎬 CINEMATIC VISUAL TECHNIQUES:

1. AI-GENERATED IMAGES (Use type: "image" with descriptive content):
   When to use: Product shots, hero images, close-ups, lifestyle photos, brand visuals
   The system generates real AI images for these. Be DESCRIPTIVE:
   - "Photorealistic close-up of a premium ice cream cone with vanilla swirl, studio lighting"
   - "Isometric 3D render of a laptop with code on screen, floating in space"
   - "Minimalist product shot of smartphone on marble surface, soft shadows"
   - "Cinematic food close-up of burger with steam rising, dark background"
   
   Image element structure:
   {
     "id": "hero-product",
     "type": "image",
     "content": "[DETAILED description for AI generation - be specific about style, lighting, angle]",
     "position": { "x": 50, "y": 45, "z": 2 },
     "size": { "width": 400, "height": 400 },
     "style": { 
       "borderRadius": 20,
       "boxShadow": "0 30px 60px rgba(0,0,0,0.4)",
       "filter": "brightness(1.1) contrast(1.05)",
       "kenBurns": true  // Enables subtle zoom/pan for cinematic effect
     },
     "animation": { "name": "scale", "type": "scale", "duration": 1.2, "delay": 0.3, "properties": { "scale": [0.8, 1.05] } }
   }

2. MOTION GRAPHICS SHAPES (Use type: "shape"):
   The system automatically adds organic motion (drift, pulse, rotation) to shapes.
   Shape types: "circle", "triangle", "star", "hexagon", "polygon", "rect"
   Use for: Abstract backgrounds, particle effects, decorative elements
   
   Create DEPTH with layered shapes at different z-indexes:
   - z: 0-1 = Background layer (large, slow-moving, blurred)
   - z: 2-3 = Mid-ground layer (medium shapes)
   - z: 4-5 = Foreground layer (small accent shapes)

3. CINEMATIC COMPOSITIONS:
   For product/brand videos, layer elements like this:
   - Background: Gradient or animated shapes (z: 0)
   - Ambient: Floating particles, orbs, geometric accents (z: 1)
   - Hero image: AI-generated product shot (z: 2)
   - Text: Headlines, captions (z: 3-4)
   - Foreground: Sparkles, lens flares, accent shapes (z: 5)

4. ADVANCED ELEMENT TYPES:
   - "code-editor" - 3D laptop with animated code. For tech/SaaS content
   - "terminal" - Command line typing effect. For developer tools
   - "progress" - Animated progress indicator. For metrics/growth
   - "3d-card" - Glassmorphic floating card. For feature showcases
   - "laptop-mockup" - 3D rotating laptop frame. For product demos

5. ANIMATION VARIETY:
   Mix these animation types for visual interest:
   - "scale" / "popIn" / "zoomIn" - Dramatic entrances
   - "slideUp" / "slideIn" - Smooth reveals
   - "fadeIn" - Subtle appearances
   - "rotate" / "spin" - Dynamic motion
   - "float" - Gentle organic movement
   - "pulse" - Breathing/attention effects

🎨 REQUIRED ASSETS ARRAY:
${generateImages ? `
IMAGE GENERATION IS ENABLED with style: "${imageStyle}"
For EVERY image element, add a matching entry to "requiredAssets":
{
  "id": "[same as element id]",
  "type": "image",
  "description": "[DETAILED prompt for AI image generation - include style, lighting, angle, mood]",
  "specifications": {
    "width": 512,
    "height": 512,
    "style": "${imageStyle}"
  },
  "providedByUser": false
}

IMPORTANT: The description in requiredAssets controls AI image generation. Be SPECIFIC:
✅ GOOD: "A photorealistic close-up of artisan coffee beans with steam rising, moody studio lighting, dark wood background, shallow depth of field"
❌ BAD: "coffee beans"

✅ GOOD: "Isometric 3D render of a modern smartphone displaying an app interface, floating in space with soft glow, clean white background"
❌ BAD: "phone"
` : 'Image generation is disabled. Use geometric shapes, text, and the advanced element types listed above.'}

📐 SCENE STRUCTURE (EXAMPLE):
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
      "description": "[Describe the visual narrative of this scene]",
      "voiceover": "[Punchy 3-7 word caption]",
      "elements": [
        // Background layer
        { "id": "bg_gradient", "type": "shape", "content": "Background", "position": { "x": 50, "y": 50, "z": 0 }, "size": { "width": 100, "height": 100 }, "style": { "background": "linear-gradient(135deg, ${colors[0]}, ${colors[1]})" }, "animation": { "name": "fadeIn", "duration": 0.5 } },
        
        // Ambient shapes for depth
        { "id": "ambient_circle_1", "type": "shape", "content": "circle", "position": { "x": 75, "y": 25, "z": 1 }, "size": { "width": 150 }, "style": { "color": "${colors[3]}20" }, "animation": { "name": "popIn", "delay": 0.1 } },
        
        // Hero image (AI-generated)
        { "id": "hero_product", "type": "image", "content": "[Detailed AI image prompt]", "position": { "x": 50, "y": 45, "z": 2 }, "size": { "width": 350, "height": 350 }, "style": { "kenBurns": true, "borderRadius": 16 }, "animation": { "name": "scale", "delay": 0.2, "properties": { "scale": [0.9, 1] } } },
        
        // Text overlay
        { "id": "headline", "type": "text", "content": "[Compelling headline]", "position": { "x": 50, "y": 80, "z": 3 }, "size": { "width": 80 }, "style": { "fontSize": 56, "fontWeight": 800, "color": "#ffffff" }, "animation": { "name": "slideUp", "delay": 0.4 } }
      ],
      "transition": { "type": "fade", "duration": 0.4 }
    }
  ],
  "requiredAssets": [
    ${generateImages ? '{ "id": "hero_product", "type": "image", "description": "[Detailed description for AI generation]", "specifications": { "width": 512, "height": 512, "style": "' + imageStyle + '" } }' : ''}
  ],
  "style": {
    "colorPalette": ${JSON.stringify(colors)},
    "typography": { "primary": "${brandData?.fonts?.primary || 'Inter'}", "secondary": "JetBrains Mono", "sizes": { "h1": 80, "h2": 48, "body": 24 } },
    "spacing": 24,
    "borderRadius": 16
  }
}

🎬 CONTENT-AWARE PLANNING:
Based on the prompt, determine the video type and apply these approaches:

PRODUCT SHOWCASE: Use AI-generated product images as heroes, multiple angles, close-ups, floating in space with subtle rotation
BRAND/LIFESTYLE: Large AI-generated lifestyle photos with Ken Burns effect, emotional typography, atmospheric elements
TECH/SAAS: Code-editor, terminal, laptop mockups, data visualizations, metrics
MOTION GRAPHICS: Abstract geometric shapes, flowing particles, dynamic typography, no AI images
EXPLAINER: Mix of icons, illustrations, step-by-step reveals, clear hierarchy
FOOD/BEVERAGE: Close-up product shots, steam effects, appetite appeal, rich colors

NOW CREATE A ${duration}-SECOND VIDEO FOR: "${prompt}"
Be creative, unique, and match the content to what the prompt is actually asking for.`;

    console.log('Generating video plan for:', prompt, 'Reference mode:', referenceMode);

    // Build user prompt based on whether we have a reference
    const userPrompt = referenceMode 
      ? `RECREATE this reference video style for: "${prompt}"

YOU ARE IN REFERENCE MODE. You MUST:
1. Follow the EXACT scene structure from the reference pattern
2. Use the SAME transition types (morph, glitch, wipe, etc.)
3. Match the scene count and durations
4. Adapt the CONTENT for "${prompt}" but keep the CINEMATIC APPROACH identical
5. If reference shows "futuristic food close-ups", you show "futuristic [new product] close-ups"
6. If reference has "holographic menus", you have "holographic [relevant element]"

This is NOT a generic video. This is a REMAKE with new content.

Return ONLY the JSON structure, no other text.`
      : `Create a unique, creative ${duration}-second video for: "${prompt}"

IMPORTANT INSTRUCTIONS:
- Analyze this prompt carefully and extract specific details
- Determine content type: Is this tech/SaaS, product, service, brand, motion graphics, or explainer?
- For MOTION GRAPHICS: Use geometric shapes (circles, triangles, stars, etc.) with dynamic animations
- Create a video that REFLECTS THE UNIQUE ASPECTS of this prompt
- Don't use generic templates - tailor everything to this specific content
- Be creative with scene structures, animations, and element placement
- Make it visually distinct and memorable
- Use specific content from the prompt, not generic placeholders like "Your Headline Here"

Return ONLY the JSON structure, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: userPrompt
          },
        ],
        temperature: AI_CONFIG.temperature,
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

    // If image generation is enabled and there are required assets, generate them
    if (generateImages && plan.requiredAssets && plan.requiredAssets.length > 0) {
      console.log('Generating AI images for', plan.requiredAssets.length, 'assets...');
      
      // Generate assets in parallel
      const assetPromises = plan.requiredAssets.map(async (asset: any) => {
        try {
          const generateAssetResponse = await fetch(`${supabaseUrl}/functions/v1/generate-asset`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assetId: asset.id,
              description: asset.description,
              width: asset.specifications?.width || 512,
              height: asset.specifications?.height || 512,
              style: asset.specifications?.style || imageStyle,
            }),
          });
          
          if (generateAssetResponse.ok) {
            const assetData = await generateAssetResponse.json();
            console.log('Generated asset:', asset.id, assetData.url);
            
            // Store the generated asset
            await supabase.from('generated_assets').insert({
              plan_id: stored.id,
              requirement_id: asset.id,
              type: 'image',
              url: assetData.url,
              description: asset.description,
            });
            
            return { ...asset, url: assetData.url };
          }
        } catch (err) {
          console.error('Failed to generate asset:', asset.id, err);
        }
        return asset;
      });
      
      await Promise.all(assetPromises);
      console.log('All assets generated');
    }

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
