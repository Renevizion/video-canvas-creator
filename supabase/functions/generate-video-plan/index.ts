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

🎬 NARRATIVE ARC (CRITICAL FOR ENGAGING VIDEOS):
Every video MUST follow a clear emotional arc. Think like a filmmaker, not a slideshow maker.

For SHORT videos (5-8s): 3 beats
  1. HOOK (first 1-2s): Grab attention with a dramatic visual or bold statement. Start in the middle of the action.
  2. BUILD (middle): Escalate with motion, reveals, or transformation. Show the "what" and "why."
  3. PAYOFF (final 1-2s): Deliver the emotional peak or call-to-action. End on the strongest image.

For MEDIUM videos (8-15s): 4 beats
  1. HOOK: Arresting opening. A question, a dramatic visual, or an unexpected angle.
  2. SETUP: Establish context. Who/what is this about? Use supporting visuals.
  3. BUILD: Escalate tension, reveal features, show transformation or journey.
  4. CLIMAX + CTA: Deliver the peak moment and close with impact.

For LONG videos (15-30s): 5 beats
  1. HOOK: Cold open straight into action.
  2. SETUP: Establish the world/product/concept.
  3. RISING ACTION: Build complexity, layer reveals.
  4. CLIMAX: The big moment — transformation, achievement, or reveal.
  5. RESOLUTION: Emotional landing, CTA, or reflective close.

SCENE DIRECTION RULES:
- Each scene description should describe a CAMERA ANGLE and MOOD, not just content
  ✅ "Close-up product hero shot, shallow depth of field, warm glow"
  ❌ "Product image"
- Voiceovers should be EMOTIONAL and SPECIFIC, not generic
  ✅ "This changes everything."  ✅ "Built for creators who ship."
  ❌ "Welcome to our product."  ❌ "Here are the features."
- PACING: Vary scene durations. Short punchy scenes (1.5-2s) mixed with slower beats (3-4s) create rhythm.
- VISUAL ESCALATION: Each scene should be MORE visually complex than the previous one. Start simple, end rich.

🎬 CREATIVITY & UNIQUENESS:
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

4. ADVANCED ELEMENT TYPES (STRICT USAGE):
   - "code-editor" - 3D laptop with animated code. ONLY for explicit tech/SaaS/dev prompts
   - "terminal" - Command line typing effect. ONLY for explicit tech/SaaS/dev prompts
   - "progress" - Animated progress indicator. ONLY for analytics/metrics/business prompts
   - "3d-card" - Glassmorphic floating card. For feature showcases
   - "laptop-mockup" - 3D rotating laptop frame. For product demos

   HARD RULE: For cinematic story prompts (space, travel, lifestyle, nature, fantasy), do NOT use terminal/progress/code-editor unless the user explicitly asks.

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

⚠️ CRITICAL RULE FOR LAYERED SCENES:
- BACKGROUND images must ONLY show the ENVIRONMENT (sky, landscape, space, room). NEVER include the main subject (person, vehicle, object) in background images.
- FOREGROUND/SUBJECT images must show ONLY the subject on a clean/transparent background so it can be layered on top.
- Example: For "spaceship flying over the moon":
  ✅ Background: "Deep space scene with large detailed moon surface filling lower third, dense starfield, nebula glow, NO spacecraft"
  ✅ Foreground: "Isolated sleek spacecraft on clean black background, side profile, engine glow, suitable for compositing"
  ❌ Background: "Spacecraft flying over the moon" (this bakes the subject into the background!)

FOREGROUND COMPOSITING HINTS:
- For foreground/subject images, add "objectFit": "contain" in the style so the subject isn't cropped into a square
- For subjects on dark/black backgrounds, add "mixBlendMode": "screen" in the style to blend away the black background
- For subjects on clean backgrounds, add "mixBlendMode": "normal" (default)
- Example foreground element style: { "objectFit": "contain", "mixBlendMode": "screen", "filter": "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }
- Background/environment images should use "objectFit": "cover" (default) to fill the frame
` : `Image generation is DISABLED. You MUST build ALL visuals using code-rendered elements only.
DO NOT use type: "image" with description text. Instead, BUILD visuals from shapes and gradients:

CODE-RENDERED VISUAL TECHNIQUES:
1. CELESTIAL BODIES (moon, sun, planets):
   { "type": "shape", "content": "circle", "style": { "background": "radial-gradient(circle at 35% 35%, #e8e8e8, #999999 40%, #555555 70%, #333333)", "boxShadow": "0 0 60px rgba(200,200,200,0.3), inset -20px -20px 40px rgba(0,0,0,0.5)" } }
   Add crater details with additional smaller circles at different positions.

2. STARFIELDS: Multiple small circles (width: 2-4px) scattered at different positions with "pulse" animation and varying opacity
3. NEBULAS/SPACE: Shapes with "background": "radial-gradient(ellipse at center, rgba(100,50,200,0.4), transparent 70%)"
4. VEHICLES/OBJECTS: Build from layered shapes - body (rounded rect), wings (triangles), engine glow (circle with radial gradient and blur)
5. ENVIRONMENTS: Full-screen shapes with multi-stop linear/radial gradients
6. LIGHT EFFECTS: Circles with very low opacity, large blur via "filter": "blur(30px)", and glow via boxShadow

Build LAYERED compositions: background gradient (z:0) → environment details (z:1) → subject shapes (z:2) → text (z:3) → foreground effects (z:4)
Every visual should be a "shape" element with creative CSS gradients, shadows, and filters. NO "image" type elements.`}

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
CINEMATIC JOURNEY (travel/orbit/fly/around/through/explore prompts):
- Build a clear 3-beat narrative: setup location → movement/travel beat → destination/reveal
- Change camera perspective between scenes (POV interior, exterior tracking, wide reveal)
- Use environmental imagery (location, sky, stars, terrain) not abstract placeholders
- Keep text minimal; visual storytelling first

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
- Determine content type: Is this tech/SaaS, product, service, brand, motion graphics, cinematic journey, or explainer?
- For MOTION GRAPHICS: Use geometric shapes (circles, triangles, stars, etc.) with dynamic animations
- For cinematic story prompts (space/travel/journey): avoid terminal, progress, and code-editor widgets
- If prompt implies movement (travel/fly/orbit/around), create sequential story beats with changing perspectives
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

    // Validate, then apply prompt-aware shaping, then validate again
    plan = validateAndFixPlan(plan, duration, colors);
    plan = applyPromptDrivenEnhancements(plan, {
      prompt,
      duration,
      generateImages,
      imageStyle,
      aspectRatio,
      resolution,
      colors,
      referenceMode,
    });
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
      
      const generatedAssets = await Promise.all(assetPromises);
      console.log('All assets generated');

      // CRITICAL: Inject generated image URLs back into the plan's scene elements
      // Without this, the renderer sees description text instead of URLs and shows placeholders.
      const assetUrlMap: Record<string, string> = {};
      for (const asset of generatedAssets) {
        if (asset?.url) {
          assetUrlMap[asset.id] = asset.url;
        }
      }

      if (Object.keys(assetUrlMap).length > 0) {
        for (const scene of plan.scenes) {
          for (const element of scene.elements) {
            if (element.type === 'image' && assetUrlMap[element.id]) {
              element.content = assetUrlMap[element.id];
            }
          }
        }
        // Also update requiredAssets with URLs
        for (const asset of plan.requiredAssets) {
          if (assetUrlMap[asset.id]) {
            asset.url = assetUrlMap[asset.id];
          }
        }

        // Re-save the updated plan with image URLs
        await supabase
          .from('video_plans')
          .update({ plan, status: 'completed' })
          .eq('id', stored.id);

        console.log('Plan updated with', Object.keys(assetUrlMap).length, 'asset URLs');
      }
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
    return enhanceWithSophisticatedMetadata(createFallbackPlan("Video", duration, colors));
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
    voiceover: scene.voiceover || '',
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
  
  // Ensure every scene has visual density (minimum 4 elements)
  plan = enforceMinimumVisualDensity(plan, colors);
  
  // Add sophisticated metadata for A-grade rendering
  return enhanceWithSophisticatedMetadata(plan);
}

/**
 * Ensures every scene has at least 4 elements for visual richness.
 * Auto-injects ambient particles, gradient orbs, and accent shapes into thin scenes.
 */
function enforceMinimumVisualDensity(plan: any, colors: string[]) {
  if (!plan || !Array.isArray(plan.scenes)) return plan;

  const MIN_ELEMENTS = 4;
  const accent = colors[3] || colors[1] || '#3b82f6';
  const secondary = colors[2] || colors[1] || '#1e293b';

  plan.scenes = plan.scenes.map((scene: any, sceneIdx: number) => {
    const elements = scene.elements || [];
    if (elements.length >= MIN_ELEMENTS) return scene;

    const sceneId = scene.id || `scene_${sceneIdx + 1}`;
    const injected = [...elements];
    let counter = 0;

    // Ensure a full-screen background exists
    const hasBg = elements.some((el: any) =>
      el.size?.width >= 100 && el.size?.height >= 100 && (el.position?.z ?? 1) <= 0.5
    );
    if (!hasBg) {
      injected.push({
        id: `${sceneId}_auto_bg`,
        type: 'shape', content: 'rect',
        position: { x: 50, y: 50, z: 0 },
        size: { width: 100, height: 100 },
        style: { background: `linear-gradient(135deg, ${colors[0] || '#0a0e27'}, ${secondary})` },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, easing: 'ease-out', delay: 0, properties: {} }
      });
      counter++;
    }

    // Add ambient gradient orb
    if (injected.length < MIN_ELEMENTS) {
      injected.push({
        id: `${sceneId}_auto_orb`,
        type: 'shape', content: 'circle',
        position: { x: 25 + (sceneIdx * 20) % 50, y: 30 + (sceneIdx * 15) % 40, z: 0.5 },
        size: { width: 500, height: 500 },
        style: {
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          filter: 'blur(50px)',
          opacity: 0.5
        },
        animation: { name: 'float', type: 'fade', duration: 4, easing: 'ease-out', delay: 0, properties: { translateY: [-2, 2] } }
      });
      counter++;
    }

    // Add scattered star/dot particles
    const starPositions = [
      { x: 15, y: 12 }, { x: 82, y: 18 }, { x: 45, y: 8 }, { x: 68, y: 28 },
      { x: 22, y: 42 }, { x: 90, y: 35 }, { x: 55, y: 5 }, { x: 35, y: 22 }
    ];
    while (injected.length < MIN_ELEMENTS && counter < starPositions.length) {
      const p = starPositions[counter % starPositions.length];
      const sz = 1.5 + (counter % 3);
      const brightness = 0.4 + (counter % 4) * 0.15;
      injected.push({
        id: `${sceneId}_auto_particle_${counter}`,
        type: 'shape', content: 'circle',
        position: { x: p.x, y: p.y, z: 0.5 },
        size: { width: sz, height: sz },
        style: {
          background: `rgba(255,255,255,${brightness})`,
          boxShadow: `0 0 ${sz * 3}px rgba(255,255,255,${brightness * 0.5})`
        },
        animation: { name: 'pulse', type: 'fade', duration: 1.5 + counter * 0.4, easing: 'ease-out', delay: counter * 0.08, properties: { scale: [0.7, 1.4] } }
      });
      counter++;
    }

    // Add a subtle accent shape for depth
    if (injected.length < MIN_ELEMENTS + 1) {
      injected.push({
        id: `${sceneId}_auto_accent`,
        type: 'shape', content: 'circle',
        position: { x: 75 - (sceneIdx * 10) % 30, y: 65 + (sceneIdx * 8) % 20, z: 0.8 },
        size: { width: 200, height: 200 },
        style: {
          background: `radial-gradient(circle, ${accent}10 0%, transparent 60%)`,
          filter: 'blur(30px)',
          opacity: 0.3
        },
        animation: { name: 'scale', type: 'fade', duration: 6, easing: 'ease-out', delay: 0.5, properties: { scale: [1, 1.08] } }
      });
    }

    return { ...scene, elements: injected };
  });

  return plan;
}

function applyPromptDrivenEnhancements(
  plan: any,
  options: {
    prompt: string;
    duration: number;
    generateImages: boolean;
    imageStyle: string;
    aspectRatio: string;
    resolution: { width: number; height: number };
    colors: string[];
    referenceMode: boolean;
  }
) {
  if (!plan || options.referenceMode) return plan;

  const promptLower = (options.prompt || '').toLowerCase();
  const techPrompt = isTechPrompt(promptLower);
  const journeyPrompt = isJourneyPrompt(promptLower);
  const spacePrompt = isSpacePrompt(promptLower);
  const interplanetaryMigrationPrompt = isInterplanetaryMigrationPrompt(promptLower);

  if (!techPrompt) {
    plan = removeTechUiWidgets(plan);
  }

  // Special handling for Earth -> Mars style migration stories to avoid narrative jumps
  if (interplanetaryMigrationPrompt) {
    plan = enforceInterplanetaryStoryFlow(plan, options.duration);

    if (!options.generateImages) {
      plan = enforceNoAiImageElements(plan, { spacePrompt: true, colors: options.colors });
      plan = injectSpaceSvgAnchors(plan, options.colors);
    }

    return plan;
  }

  if (spacePrompt && journeyPrompt && options.generateImages) {
    return createSpaceJourneyPlan(options, plan.style);
  }

  if (spacePrompt && journeyPrompt && !options.generateImages) {
    return createCodeOnlySpaceJourneyPlan(options, plan.style);
  }

  if (!options.generateImages) {
    plan = enforceNoAiImageElements(plan, { spacePrompt, colors: options.colors });

    // Ensure code-rendered space videos still keep at least one cinematic SVG anchor
    if (spacePrompt) {
      plan = injectSpaceSvgAnchors(plan, options.colors);
    }
  }

  if (journeyPrompt) {
    plan = enforceJourneyNarrativeBeats(plan);
  }

  return plan;
}

function isInterplanetaryMigrationPrompt(promptLower: string) {
  const hasEarthToMars = /(earth).*\b(to|towards|into)\b.*(mars)|(mars).*\b(from)\b.*(earth)/.test(promptLower);
  const hasBothPlanets = promptLower.includes('earth') && promptLower.includes('mars');
  const migrationTerms = [
    'move', 'moving', 'moves', 'migrate', 'migration', 'relocate', 'exodus',
    'evacuate', 'colonize', 'colonization', 'settle', 'departure', 'arrival', 'civilization'
  ];
  const hasMigrationIntent = migrationTerms.some((t) => promptLower.includes(t));

  return hasEarthToMars || (hasBothPlanets && hasMigrationIntent);
}

function enforceInterplanetaryStoryFlow(plan: any, requestedDuration: number) {
  if (!plan || !Array.isArray(plan.scenes) || plan.scenes.length === 0) return plan;

  const beats = [
    {
      title: 'EARTH EXODUS',
      description: 'Final departure from Earth orbit with migration fleets forming launch lanes.',
      voiceover: 'Earth behind us. Mars ahead.'
    },
    {
      title: 'INTERPLANETARY TRANSIT',
      description: 'Fleet in deep-space transit, propulsion wakes carving through silence.',
      voiceover: 'Months pass in the long crossing.'
    },
    {
      title: 'MARS FIRST SIGHT',
      description: 'First wide reveal of Mars growing from a red star into a world.',
      voiceover: 'Mars emerges on the horizon.'
    },
    {
      title: 'DESCENT AND LANDING',
      description: 'Controlled atmospheric descent and convoy landing on dust plains.',
      voiceover: 'Descent begins. Touchdown confirmed.'
    },
    {
      title: 'FOUNDATION ESTABLISHED',
      description: 'Habitat domes, power grids, and first colony lights activate in sequence.',
      voiceover: 'The second home is now alive.'
    },
  ];

  while (plan.scenes.length < beats.length) {
    const clone = { ...plan.scenes[Math.max(0, plan.scenes.length - 1)] };
    clone.id = `scene_${plan.scenes.length + 1}`;
    plan.scenes.push(clone);
  }

  const totalDuration = Math.max(10, Number(plan.duration || requestedDuration || 12));
  const weights = [0.16, 0.24, 0.18, 0.2, 0.22];

  let running = 0;
  plan.scenes = plan.scenes.slice(0, beats.length).map((scene: any, index: number) => {
    const rawDuration = index === beats.length - 1
      ? Number((totalDuration - running).toFixed(2))
      : Number((totalDuration * weights[index]).toFixed(2));

    const sceneDuration = Math.max(1.8, rawDuration);
    const startTime = Number(running.toFixed(2));
    running += sceneDuration;

    const beat = beats[index];
    const transitionByBeat = index === 1 ? { type: 'slide', duration: 0.6 } : { type: 'fade', duration: 0.5 };

    const textId = `${scene.id || `scene_${index + 1}`}_beat_title`;
    const hasBeatTitle = (scene.elements || []).some((el: any) => el?.id === textId);
    const beatTitleEl = {
      id: textId,
      type: 'text',
      content: beat.title,
      position: { x: 50, y: index === 4 ? 22 : 14, z: 5 },
      size: { width: 86, height: 12 },
      style: { fontSize: 44, fontWeight: 800, color: '#ffffff', letterSpacing: 4 },
      animation: { name: 'slideUp', type: 'slide', duration: 0.8, easing: 'ease-out', delay: 0.1, properties: { translateY: [8, 0] } }
    };

    return {
      ...scene,
      startTime,
      duration: sceneDuration,
      description: beat.description,
      voiceover: beat.voiceover,
      transition: scene.transition || transitionByBeat,
      elements: hasBeatTitle ? scene.elements : [...(scene.elements || []), beatTitleEl],
    };
  });

  plan.duration = Number(running.toFixed(2));
  return plan;
}

function createShipSvgMarkup(seed: string, primary: string, secondary: string) {
  const safe = seed.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible">
    <defs>
      <linearGradient id="ship_body_${safe}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="55%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${secondary}"/>
      </linearGradient>
      <radialGradient id="ship_engine_${safe}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="rgba(180,230,255,1)"/>
        <stop offset="65%" stop-color="rgba(80,150,255,0.5)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <ellipse cx="32" cy="50" rx="32" ry="6" fill="rgba(100,180,255,0.45)"/>
    <polygon points="88,25 126,42 80,42" fill="${secondary}" opacity="0.9"/>
    <polygon points="88,75 126,58 80,58" fill="${secondary}" opacity="0.9"/>
    <ellipse cx="150" cy="50" rx="90" ry="18" fill="url(#ship_body_${safe})"/>
    <ellipse cx="208" cy="47" rx="14" ry="10" fill="rgba(180,220,255,0.55)"/>
    <circle cx="60" cy="50" r="13" fill="url(#ship_engine_${safe})"/>
  </svg>`;
}

function injectSpaceSvgAnchors(plan: any, colors: string[]) {
  if (!plan || !Array.isArray(plan.scenes)) return plan;

  const primary = colors[1] || '#5c6bc0';
  const secondary = colors[3] || '#283593';

  plan.scenes = plan.scenes.map((scene: any, sceneIdx: number) => {
    const elements = scene.elements || [];
    const hasSvg = elements.some((el: any) => el?.type === 'svg');
    if (hasSvg) return scene;

    const xPath = [24, 38, 52, 66, 78];
    const yPath = [58, 52, 48, 54, 60];
    const idx = Math.min(sceneIdx, xPath.length - 1);

    const anchor = {
      id: `${scene.id || `scene_${sceneIdx + 1}`}_svg_anchor_ship`,
      type: 'svg',
      content: createShipSvgMarkup(scene.id || `scene_${sceneIdx + 1}`, primary, secondary),
      position: { x: xPath[idx], y: yPath[idx], z: 3 },
      size: { width: 20, height: 6 },
      style: { filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 16px rgba(110,150,255,0.25))' },
      animation: {
        name: sceneIdx === 0 ? 'slideIn' : 'float',
        type: 'slide',
        duration: Math.max(1.2, Number(scene.duration || 3)),
        easing: 'ease-out',
        delay: 0,
        properties: sceneIdx === 0 ? { translateX: [-14, 0], translateY: [1, 0] } : { translateY: [-1.2, 1.2] }
      }
    };

    return { ...scene, elements: [...elements, anchor] };
  });

  return plan;
}

function isTechPrompt(promptLower: string) {
  const techKeywords = [
    'saas', 'software', 'app', 'dashboard', 'terminal', 'code', 'developer', 'api', 'analytics', 'kpi',
    'productivity tool', 'platform', 'startup'
  ];
  return techKeywords.some((keyword) => promptLower.includes(keyword));
}

function isJourneyPrompt(promptLower: string) {
  const journeyKeywords = [
    'travel', 'travelling', 'traveling', 'journey', 'orbit', 'around', 'through', 'explore', 'voyage',
    'fly', 'flying', 'mission', 'move', 'moving', 'moves', 'migrate', 'migration', 'relocate',
    'exodus', 'evacuate', 'colonize', 'colonization', 'settle', 'departure', 'arrival'
  ];
  const hasRoutePattern = /\bfrom\b[\s\S]{0,80}\bto\b/.test(promptLower);
  return hasRoutePattern || journeyKeywords.some((keyword) => promptLower.includes(keyword));
}

function isSpacePrompt(promptLower: string) {
  const spaceKeywords = [
    'space', 'moon', 'lunar', 'astronaut', 'spaceship', 'cosmos', 'galaxy', 'starfield', 'orbit',
    'earth', 'mars', 'planet', 'interplanetary', 'solar system', 'red planet'
  ];
  return spaceKeywords.some((keyword) => promptLower.includes(keyword));
}

function removeTechUiWidgets(plan: any) {
  const blockedTypes = new Set(['terminal', 'progress', 'progress-bar', 'code-editor', 'laptop', 'laptop-mockup']);

  plan.scenes = (plan.scenes || []).map((scene: any) => {
    const filteredElements = (scene.elements || []).filter((element: any) => !blockedTypes.has(element.type));

    if (filteredElements.length > 0) {
      return { ...scene, elements: filteredElements };
    }

    return {
      ...scene,
      elements: [
        {
          id: `${scene.id || 'scene'}_bg_fallback`,
          type: 'shape',
          content: 'rect',
          position: { x: 50, y: 50, z: 0 },
          size: { width: 100, height: 100 },
          style: { background: 'linear-gradient(135deg, #0a0e27, #1a1a2e)' },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.5, easing: 'ease-out', delay: 0, properties: { opacity: [0, 1] } }
        }
      ]
    };
  });

  return plan;
}

function enforceJourneyNarrativeBeats(plan: any) {
  if (!Array.isArray(plan.scenes) || plan.scenes.length === 0) return plan;

  const beatDescriptions = [
    { description: 'Departure and setup shot', voiceover: 'Leaving for the journey.' },
    { description: 'Travel movement beat', voiceover: 'Crossing the route ahead.' },
    { description: 'Destination reveal', voiceover: 'Arrival and final reveal.' }
  ];

  while (plan.scenes.length < 3) {
    const cloneIndex = Math.max(0, plan.scenes.length - 1);
    const clone = { ...plan.scenes[cloneIndex], id: `scene_${plan.scenes.length + 1}` };
    plan.scenes.push(clone);
  }

  plan.scenes = plan.scenes.map((scene: any, index: number) => {
    const beat = beatDescriptions[Math.min(index, 2)];
    return {
      ...scene,
      description: scene.description || beat.description,
      voiceover: scene.voiceover || beat.voiceover,
      transition: scene.transition || { type: 'fade', duration: 0.5 }
    };
  });

  return plan;
}

function createSpaceJourneyPlan(
  options: {
    prompt: string;
    duration: number;
    imageStyle: string;
    aspectRatio: string;
    resolution: { width: number; height: number };
    colors: string[];
  },
  existingStyle: any
) {
  const totalDuration = Math.max(8, options.duration || 10);
  let scene1Duration = Math.max(2.5, Number((totalDuration * 0.3).toFixed(2)));
  let scene2Duration = Math.max(3, Number((totalDuration * 0.4).toFixed(2)));
  let scene3Duration = Number((totalDuration - scene1Duration - scene2Duration).toFixed(2));

  if (scene3Duration < 2.5) {
    const needed = 2.5 - scene3Duration;
    scene2Duration = Math.max(2.5, Number((scene2Duration - needed).toFixed(2)));
    scene3Duration = Number((totalDuration - scene1Duration - scene2Duration).toFixed(2));
  }

  const assetSpecs = options.aspectRatio === 'portrait'
    ? { width: 1024, height: 1536 }
    : options.aspectRatio === 'square'
      ? { width: 1024, height: 1024 }
      : { width: 1536, height: 1024 };

  const baseStyle = existingStyle || {
    colorPalette: options.colors,
    typography: { primary: 'Orbitron', secondary: 'JetBrains Mono', sizes: { h1: 72, h2: 42, body: 22 } },
    spacing: 24,
    borderRadius: 16,
  };

  return {
    duration: totalDuration,
    fps: 30,
    resolution: options.resolution,
    aspectRatio: options.aspectRatio,
    scenes: [
      {
        id: 'scene_1_departure',
        startTime: 0,
        duration: scene1Duration,
        description: 'First-person cockpit departure as the ship begins lunar approach.',
        voiceover: 'Locking onto lunar orbit.',
        elements: [
          {
            id: 'cockpit_pov',
            type: 'image',
            content: 'First-person view from inside a spacecraft cockpit, illuminated instrument panels, moon visible through front glass, stars outside, cinematic, ultra-detailed, realistic lighting',
            position: { x: 50, y: 50, z: 0 },
            size: { width: 100, height: 100 },
            style: { kenBurns: true, filter: 'brightness(1.02) contrast(1.05)' },
            animation: { name: 'zoomIn', type: 'scale', duration: scene1Duration, easing: 'ease-in-out', delay: 0, properties: { scale: [1, 1.08] } }
          },
          {
            id: 'caption_departure',
            type: 'text',
            content: 'LUNAR APPROACH',
            position: { x: 50, y: 88, z: 3 },
            size: { width: 80, height: 12 },
            style: { fontSize: 54, fontWeight: 800, color: '#ffffff', letterSpacing: 6 },
            animation: { name: 'fadeIn', type: 'fade', duration: 0.7, easing: 'ease-out', delay: 0.2, properties: { opacity: [0, 1] } }
          }
        ],
        transition: { type: 'fade', duration: 0.6 }
      },
      {
        id: 'scene_2_orbit',
        startTime: scene1Duration,
        duration: scene2Duration,
        description: 'Exterior tracking shot of the ship traveling around the moon with visible curvature and starfield depth.',
        voiceover: 'We arc around the far side.',
        elements: [
          {
            id: 'orbit_wide',
            type: 'image',
            content: 'Cinematic wide shot of a spacecraft traveling around the moon, visible lunar curvature, deep starfield, motion blur trails, dramatic rim lighting, photorealistic',
            position: { x: 50, y: 50, z: 0 },
            size: { width: 100, height: 100 },
            style: { kenBurns: true, filter: 'contrast(1.08) saturate(1.05)' },
            animation: { name: 'slideIn', type: 'slide', duration: scene2Duration, easing: 'ease-in-out', delay: 0, properties: { translateX: [3, -3] } }
          },
          {
            id: 'ship_silhouette',
            type: 'image',
            content: 'Foreground silhouette of a sleek spacecraft wing edge and engine glow, close-up framing for speed sensation, realistic cinematic style',
            position: { x: 82, y: 58, z: 2 },
            size: { width: 34, height: 42 },
            style: { opacity: 0.92 },
            animation: { name: 'float', type: 'position', duration: scene2Duration, easing: 'ease-in-out', delay: 0, properties: { translateY: [-1.5, 1.5] } }
          }
        ],
        transition: { type: 'fade', duration: 0.6 }
      },
      {
        id: 'scene_3_reveal',
        startTime: Number((scene1Duration + scene2Duration).toFixed(2)),
        duration: scene3Duration,
        description: 'Wide reveal of the moon, stars, and spacecraft completing the orbital loop.',
        voiceover: 'Moonfall complete. Stars beyond.',
        elements: [
          {
            id: 'moon_reveal',
            type: 'image',
            content: 'Epic cinematic reveal of spacecraft completing orbit around the moon, giant lunar horizon, dense stars and nebula in background, high detail, IMAX composition',
            position: { x: 50, y: 50, z: 0 },
            size: { width: 100, height: 100 },
            style: { kenBurns: true, filter: 'brightness(1.06)' },
            animation: { name: 'scale', type: 'scale', duration: scene3Duration, easing: 'ease-out', delay: 0, properties: { scale: [1.02, 1] } }
          },
          {
            id: 'caption_reveal',
            type: 'text',
            content: 'AROUND THE MOON',
            position: { x: 50, y: 14, z: 3 },
            size: { width: 84, height: 14 },
            style: { fontSize: 46, fontWeight: 700, color: '#ffffff', letterSpacing: 4 },
            animation: { name: 'slideUp', type: 'slide', duration: 0.8, easing: 'ease-out', delay: 0.1, properties: { translateY: [8, 0] } }
          }
        ],
        transition: { type: 'fade', duration: 0.5 }
      }
    ],
    requiredAssets: [
      {
        id: 'cockpit_pov',
        type: 'image',
        description: 'First-person view from inside a spacecraft cockpit, illuminated instrument panels and HUD displays, moon visible through front window, stars outside, NO external spacecraft visible, interior-only POV shot, cinematic, ultra-detailed, realistic lighting',
        specifications: { ...assetSpecs, style: options.imageStyle },
        providedByUser: false
      },
      {
        id: 'orbit_wide',
        type: 'image',
        description: 'Deep space environment with massive detailed moon filling lower half, visible craters and terrain, dense starfield and faint nebula above, dramatic rim lighting on lunar edge, NO spacecraft, NO vehicles, pure environment, photorealistic, cinematic',
        specifications: { ...assetSpecs, style: options.imageStyle },
        providedByUser: false
      },
      {
        id: 'ship_silhouette',
        type: 'image',
        description: 'Isolated sleek futuristic spacecraft on a solid black background, side-profile view, glowing blue engine exhaust, clean edges suitable for compositing and layering, no stars or environment, just the ship',
        specifications: { width: 768, height: 768, style: options.imageStyle },
        providedByUser: false
      },
      {
        id: 'moon_reveal',
        type: 'image',
        description: 'Epic cinematic lunar landscape panorama, giant moon horizon with detailed surface craters, dense stars and colorful nebula in background, dramatic golden rim light on horizon, NO spacecraft or vehicles, pure environment shot, IMAX composition',
        specifications: { ...assetSpecs, style: options.imageStyle },
        providedByUser: false
      }
    ],
    style: {
      ...baseStyle,
      colorPalette: baseStyle.colorPalette || options.colors,
    },
    sourcePrompt: options.prompt,
  };
}

function isDirectAssetUrl(content: unknown) {
  if (typeof content !== 'string') return false;
  return content.startsWith('http') || content.startsWith('/') || content.startsWith('data:');
}

function enforceNoAiImageElements(
  plan: any,
  context: { spacePrompt: boolean; colors: string[] }
) {
  if (!plan || !Array.isArray(plan.scenes)) return plan;

  plan.requiredAssets = [];

  plan.scenes = plan.scenes.map((scene: any, sceneIndex: number) => {
    const mappedElements = (scene.elements || []).flatMap((element: any, elIndex: number) => {
      if (element?.type !== 'image') {
        return [element];
      }

      if (isDirectAssetUrl(element.content)) {
        return [element];
      }

      const prompt = String(element.content || '').toLowerCase();
      const z = element.position?.z ?? 1;
      const baseId = element.id || `el_${sceneIndex}_${elIndex}`;

      // Space-aware: detailed multi-part shapes
      if (context.spacePrompt) {
        if (/moon|lunar|planet|earth/.test(prompt)) {
          // Multi-part moon with craters + rim light
          const sz = Math.max(element.size?.width || 40, 35);
          const cx = element.position?.x ?? 50;
          const cy = element.position?.y ?? 50;
          return [
            { ...element, id: `${baseId}_moon`, type: 'shape', content: 'circle',
              style: {
                background: 'radial-gradient(circle at 30% 28%, #f5f5f0, #d4d0c8 18%, #b0aba0 40%, #807a70 65%, #504a40 85%, #2a2520)',
                boxShadow: `0 0 ${sz}px rgba(220,215,200,0.15), inset -${sz*0.12}px -${sz*0.1}px ${sz*0.3}px rgba(0,0,0,0.55)`,
              },
              position: { x: cx, y: cy, z }, size: { width: sz, height: sz },
              animation: element.animation || { name: 'scale', duration: 6, properties: { scale: [1.03, 1] } },
            },
            // Crater spots
            ...([{dx:-12,dy:-10,s:4},{dx:5,dy:-5,s:6},{dx:15,dy:8,s:3},{dx:-5,dy:12,s:5}].map((c, i) => ({
              id: `${baseId}_crater_${i}`, type: 'shape', content: 'circle',
              position: { x: cx + c.dx * sz / 100, y: cy + c.dy * sz / 100, z: z + 0.1 },
              size: { width: c.s, height: c.s },
              style: { background: 'radial-gradient(circle at 40% 38%, rgba(90,90,90,0.5), rgba(30,30,30,0.3) 100%)', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.5)' },
              animation: { name: 'fadeIn', duration: 0.8, delay: 0.1 + i * 0.05 }
            }))),
            // Rim light
            { id: `${baseId}_rim`, type: 'shape', content: 'circle',
              position: { x: cx, y: cy, z: z + 0.05 }, size: { width: sz * 0.98, height: sz * 0.98 },
              style: { background: 'transparent', border: '1px solid rgba(255,248,230,0.15)', boxShadow: `inset ${sz*0.15}px ${sz*0.08}px ${sz*0.2}px rgba(255,248,230,0.1)` },
              animation: { name: 'fadeIn', duration: 1.5 }
            },
          ];
        }

        if (/star|galaxy|space|nebula|cosmos/.test(prompt)) {
          return [
            { ...element, id: `${baseId}_space`, type: 'shape', content: 'rect',
              style: { background: 'radial-gradient(ellipse at 50% 35%, rgba(58,78,120,0.45), rgba(20,24,48,0.55) 35%, #05070f)' },
              animation: element.animation || { name: 'fadeIn', duration: 1 },
              position: { ...(element.position || { x: 50, y: 50 }), z: Math.min(z, 0) },
            },
            // Add nebula glow
            { id: `${baseId}_nebula`, type: 'shape', content: 'rect',
              position: { x: (element.position?.x ?? 50) + 10, y: (element.position?.y ?? 50) - 5, z: 0.3 },
              size: { width: 50, height: 35 },
              style: { background: 'radial-gradient(ellipse at 45% 50%, rgba(80,40,160,0.25), transparent 65%)', filter: 'blur(18px)', opacity: 0.35 },
              animation: { name: 'scale', duration: 7, properties: { scale: [1, 1.05] } }
            },
          ];
        }

        if (/ship|spaceship|rocket|astronaut|helmet|cockpit|spaceman|person/.test(prompt)) {
          const sx = element.position?.x ?? 50;
          const sy = element.position?.y ?? 50;
          const shipSvg = `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible">
            <defs>
              <linearGradient id="fb_${baseId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8eaf6"/><stop offset="50%" stop-color="#5c6bc0"/><stop offset="100%" stop-color="#283593"/></linearGradient>
              <radialGradient id="fc_${baseId}" cx="35%" cy="35%"><stop offset="0%" stop-color="rgba(180,220,255,0.95)"/><stop offset="100%" stop-color="rgba(40,80,180,0.4)"/></radialGradient>
              <radialGradient id="fe_${baseId}" cx="50%" cy="50%"><stop offset="0%" stop-color="rgba(180,230,255,1)"/><stop offset="60%" stop-color="rgba(50,120,255,0.4)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
            </defs>
            <ellipse cx="30" cy="50" rx="35" ry="6" fill="rgba(100,180,255,0.4)" opacity="0.7"/>
            <polygon points="90,25 130,42 80,42" fill="#3949ab" opacity="0.85"/>
            <polygon points="90,75 130,58 80,58" fill="#283593" opacity="0.85"/>
            <ellipse cx="150" cy="50" rx="90" ry="18" fill="url(#fb_${baseId})"/>
            <ellipse cx="210" cy="47" rx="14" ry="10" fill="url(#fc_${baseId})" stroke="rgba(180,220,255,0.4)" stroke-width="1"/>
            <circle cx="58" cy="50" r="14" fill="url(#fe_${baseId})"/>
          </svg>`;
          return [{
            ...element, id: `${baseId}_ship_svg`, type: 'svg', content: shipSvg,
            position: { x: sx, y: sy, z: Math.max(z, 2) },
            size: { width: 20, height: 6 },
            style: { filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 15px rgba(100,140,255,0.2))' },
            animation: element.animation || { name: 'float', duration: 5, properties: { translateY: [-1, 1] } },
          }];
        }
      }

      // === NON-SPACE CONTENT-AWARE REPLACEMENTS ===
      const accent = context.colors?.[3] || context.colors?.[2] || '#f43f5e';
      const secondary = context.colors?.[1] || '#1a1a2e';
      const cx = element.position?.x ?? 50;
      const cy = element.position?.y ?? 50;
      const sw = element.size?.width || 300;
      const sh = element.size?.height || 300;

      // Person / Portrait / Silhouette
      if (/person|man|woman|keanu|actor|human|face|portrait|silhouette|figure|hero/.test(prompt)) {
        return [
          // Head circle
          { id: `${baseId}_head`, type: 'shape', content: 'circle',
            position: { x: cx, y: cy - 12, z: z + 0.1 },
            size: { width: Math.min(sw * 0.3, 80), height: Math.min(sw * 0.3, 80) },
            style: { background: `radial-gradient(circle at 30% 30%, ${secondary}, #111)`, boxShadow: '0 8px 30px rgba(0,0,0,0.6)' },
            animation: { name: 'fadeIn', duration: 1.2, delay: 0.2 }
          },
          // Body shape
          { id: `${baseId}_body`, type: 'shape', content: 'rect',
            position: { x: cx, y: cy + 8, z },
            size: { width: Math.min(sw * 0.4, 100), height: Math.min(sh * 0.5, 180) },
            style: { background: `linear-gradient(180deg, ${secondary}, #0a0a0a)`, borderRadius: '40px 40px 20px 20px', boxShadow: '0 15px 40px rgba(0,0,0,0.5)' },
            animation: element.animation || { name: 'slideUp', duration: 1.5, properties: { translateY: [10, 0] } }
          },
        ];
      }

      // Motorcycle / Vehicle
      if (/motorcycle|bike|vehicle|car|ride|riding|driving|wheel/.test(prompt)) {
        return [
          // Body frame
          { id: `${baseId}_frame`, type: 'shape', content: 'rect',
            position: { x: cx, y: cy, z },
            size: { width: Math.min(sw, 400), height: Math.min(sh * 0.3, 80) },
            style: { background: `linear-gradient(90deg, #2a2a2a, ${secondary}, #1a1a1a)`, borderRadius: 40, boxShadow: '0 10px 30px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.1)' },
            animation: element.animation || { name: 'slideIn', duration: 2, properties: { translateX: [-20, 0] } }
          },
          // Front wheel
          { id: `${baseId}_wheel_f`, type: 'shape', content: 'circle',
            position: { x: cx + 18, y: cy + 8, z: z + 0.1 },
            size: { width: 50, height: 50 },
            style: { background: 'radial-gradient(circle, #444, #111)', border: '3px solid #222', boxShadow: '0 5px 15px rgba(0,0,0,0.4)' },
            animation: { name: 'rotate', duration: 1, properties: { rotate: [0, 360] } }
          },
          // Rear wheel  
          { id: `${baseId}_wheel_r`, type: 'shape', content: 'circle',
            position: { x: cx - 18, y: cy + 8, z: z + 0.1 },
            size: { width: 50, height: 50 },
            style: { background: 'radial-gradient(circle, #444, #111)', border: '3px solid #222', boxShadow: '0 5px 15px rgba(0,0,0,0.4)' },
            animation: { name: 'rotate', duration: 1, properties: { rotate: [0, 360] } }
          },
        ];
      }

      // Sun / Sunrise / Sunset / Dawn
      if (/sun|sunrise|sunset|dawn|dusk|glow|light|horizon/.test(prompt)) {
        return [
          // Sun core
          { id: `${baseId}_sun`, type: 'shape', content: 'circle',
            position: { x: cx, y: cy, z },
            size: { width: Math.min(sw, 500), height: Math.min(sw, 500) },
            style: { background: `radial-gradient(circle, ${accent}, #ff6b35 40%, transparent 70%)`, filter: 'blur(20px)' },
            animation: element.animation || { name: 'scale', duration: 4, properties: { scale: [0.8, 1.1], translateY: [20, 0] } }
          },
          // Glow ring
          { id: `${baseId}_glow`, type: 'shape', content: 'circle',
            position: { x: cx, y: cy, z: z - 0.1 },
            size: { width: Math.min(sw * 1.5, 700), height: Math.min(sw * 1.5, 700) },
            style: { background: `radial-gradient(circle, transparent 30%, ${accent}30 50%, transparent 70%)`, filter: 'blur(30px)', opacity: 0.6 },
            animation: { name: 'pulse', duration: 3, properties: { scale: [1, 1.15] } }
          },
        ];
      }

      // Road / Path / Landscape
      if (/road|path|canyon|mountain|landscape|scenery|background|blur/.test(prompt)) {
        return [
          // Motion blur lines
          { id: `${baseId}_motion`, type: 'shape', content: 'rect',
            position: { x: cx, y: cy, z },
            size: { width: 100, height: 100 },
            style: { background: `repeating-linear-gradient(90deg, transparent, transparent 48%, rgba(255,255,255,0.08) 50%, transparent 52%)` },
            animation: { name: 'slideIn', duration: 0.5, properties: { translateX: [-100, 100] } }
          },
          // Horizon gradient
          { id: `${baseId}_horizon`, type: 'shape', content: 'rect',
            position: { x: 50, y: 80, z: z - 0.1 },
            size: { width: 120, height: 40 },
            style: { background: `linear-gradient(0deg, ${secondary}80, transparent)`, filter: 'blur(10px)' },
            animation: { name: 'fadeIn', duration: 1.5 }
          },
        ];
      }

      // Training / Action / Movement
      if (/training|action|movement|martial|fighting|practice|dojo|gym/.test(prompt)) {
        return [
          // Dynamic action shape
          { id: `${baseId}_action`, type: 'shape', content: 'rect',
            position: { x: cx, y: cy, z },
            size: { width: Math.min(sw, 350), height: Math.min(sh, 350) },
            style: { background: `linear-gradient(135deg, ${accent}40, ${secondary}60)`, borderRadius: '50%', transform: 'rotate(15deg)', boxShadow: `0 0 60px ${accent}30` },
            animation: element.animation || { name: 'scale', duration: 2, properties: { scale: [0.9, 1.1], rotate: [10, 20] } }
          },
          // Motion trail
          { id: `${baseId}_trail`, type: 'shape', content: 'rect',
            position: { x: cx - 10, y: cy, z: z - 0.1 },
            size: { width: sw * 0.8, height: sh * 0.3 },
            style: { background: `linear-gradient(90deg, transparent, ${accent}20, transparent)`, filter: 'blur(15px)', opacity: 0.5 },
            animation: { name: 'slideIn', duration: 1.5, properties: { translateX: [-30, 10] } }
          },
        ];
      }

      // FINAL Generic fallback: Abstract animated shape (not boring rectangle)
      return [
        // Main abstract form
        { id: `${baseId}_abstract`, type: 'shape', content: 'circle',
          position: { x: cx, y: cy, z },
          size: { width: Math.min(sw, 400), height: Math.min(sh, 400) },
          style: {
            background: `radial-gradient(ellipse at 40% 40%, ${accent}50, ${secondary}60 50%, transparent 80%)`,
            filter: 'blur(8px)',
            boxShadow: `0 0 80px ${accent}20`,
          },
          animation: element.animation || { name: 'float', duration: 4, properties: { translateY: [-5, 5], scale: [0.95, 1.05] } }
        },
        // Secondary accent
        { id: `${baseId}_accent2`, type: 'shape', content: 'circle',
          position: { x: cx + 15, y: cy - 10, z: z + 0.1 },
          size: { width: Math.min(sw * 0.5, 200), height: Math.min(sw * 0.5, 200) },
          style: {
            background: `radial-gradient(circle, ${accent}30, transparent 70%)`,
            filter: 'blur(20px)',
            opacity: 0.6,
          },
          animation: { name: 'pulse', duration: 3, properties: { scale: [0.9, 1.2] } }
        },
      ];
    });

    // Add star particles for space scenes
    const hasStarLayer = mappedElements.some((el: any) => el?.id?.includes('auto_stars'));
    if (context.spacePrompt && !hasStarLayer) {
      // Add 8 scattered star particles instead of just 1
      const starPositions = [{x:12,y:8},{x:88,y:14},{x:45,y:6},{x:72,y:22},{x:18,y:30},{x:92,y:38},{x:34,y:12},{x:65,y:4}];
      starPositions.forEach((p, i) => {
        mappedElements.push({
          id: `${scene.id || `scene_${sceneIndex + 1}`}_auto_stars_${i}`,
          type: 'shape', content: 'circle',
          position: { x: p.x, y: p.y, z: 0.5 },
          size: { width: 1 + (i % 3), height: 1 + (i % 3) },
          style: { background: `rgba(255,255,255,${0.4 + (i%4)*0.15})`, boxShadow: `0 0 ${3 + i}px rgba(255,255,255,${0.3 + (i%3)*0.1})` },
          animation: { name: 'pulse', duration: 1.5 + i * 0.4, delay: i * 0.1, properties: { scale: [0.7, 1.5 + (i%2)*0.3] } },
        });
      });
    }

    return { ...scene, elements: mappedElements };
  });

  return plan;
}

function createCodeOnlySpaceJourneyPlan(
  options: {
    prompt: string;
    duration: number;
    imageStyle: string;
    aspectRatio: string;
    resolution: { width: number; height: number };
    colors: string[];
  },
  existingStyle: any
) {
  const totalDuration = Math.max(9, options.duration || 12);
  let s1 = Math.max(3, Number((totalDuration * 0.3).toFixed(2)));
  let s2 = Math.max(3.5, Number((totalDuration * 0.4).toFixed(2)));
  let s3 = Number((totalDuration - s1 - s2).toFixed(2));
  if (s3 < 2.5) { s2 = Math.max(3, Number((s2 - (2.5 - s3)).toFixed(2))); s3 = Number((totalDuration - s1 - s2).toFixed(2)); }

  const baseStyle = existingStyle || {
    colorPalette: options.colors,
    typography: { primary: 'Orbitron', secondary: 'JetBrains Mono', sizes: { h1: 70, h2: 42, body: 22 } },
    spacing: 24, borderRadius: 16,
  };

  // ── Reusable star particle layer generator ──
  const makeStars = (sceneId: string, count: number) => {
    const stars = [];
    const positions = [
      {x:12,y:8},{x:88,y:14},{x:45,y:6},{x:72,y:22},{x:18,y:30},{x:92,y:38},
      {x:34,y:12},{x:65,y:4},{x:8,y:48},{x:78,y:8},{x:55,y:18},{x:26,y:22},
      {x:95,y:52},{x:42,y:28},{x:16,y:16},{x:82,y:44},{x:58,y:36},{x:4,y:38},
      {x:68,y:48},{x:38,y:42}
    ];
    for (let i = 0; i < Math.min(count, positions.length); i++) {
      const p = positions[i];
      const sz = 1 + (i % 3);
      const brightness = 0.5 + (i % 5) * 0.12;
      stars.push({
        id: `${sceneId}_star_${i}`,
        type: 'shape', content: 'circle',
        position: { x: p.x, y: p.y, z: 0.5 },
        size: { width: sz, height: sz },
        style: { background: `rgba(255,255,255,${brightness})`, boxShadow: `0 0 ${sz*3}px rgba(255,255,255,${brightness*0.6})` },
        animation: { name: 'pulse', duration: 1.5 + (i % 4) * 0.6, delay: i * 0.08, properties: { scale: [0.8, 1.5 + (i%3)*0.3] } }
      });
    }
    return stars;
  };

  // ── Nebula cloud layers ──
  const makeNebula = (sceneId: string, hue1: string, hue2: string, x: number, y: number) => ({
    id: `${sceneId}_nebula`, type: 'shape', content: 'rect',
    position: { x, y, z: 0.3 },
    size: { width: 60, height: 40 },
    style: {
      background: `radial-gradient(ellipse at 40% 45%, ${hue1} 0%, ${hue2} 35%, transparent 70%)`,
      filter: 'blur(20px)', opacity: 0.35,
    },
    animation: { name: 'scale', duration: 8, properties: { scale: [1, 1.06], translateX: [-1, 1] } }
  });

  // ── Detailed moon with craters ──
  const makeMoon = (sceneId: string, x: number, y: number, sizePct: number, z: number) => {
    const craters = [
      { cx: 30, cy: 25, r: 8 }, { cx: 55, cy: 40, r: 12 }, { cx: 70, cy: 20, r: 6 },
      { cx: 40, cy: 65, r: 10 }, { cx: 60, cy: 75, r: 7 }, { cx: 25, cy: 50, r: 5 },
    ];
    const craterEls = craters.map((c, i) => ({
      id: `${sceneId}_crater_${i}`, type: 'shape', content: 'circle',
      position: { x: x + (c.cx - 50) * sizePct / 100, y: y + (c.cy - 50) * sizePct / 100, z: z + 0.1 },
      size: { width: sizePct * c.r / 100, height: sizePct * c.r / 100 },
      style: {
        background: `radial-gradient(circle at 40% 38%, rgba(90,90,90,0.5), rgba(50,50,50,0.8) 60%, rgba(30,30,30,0.3) 100%)`,
        boxShadow: `inset 1px 1px 4px rgba(0,0,0,0.6), inset -1px -1px 2px rgba(180,180,180,0.15)`,
      },
      animation: { name: 'fadeIn', duration: 0.8, delay: 0.1 + i * 0.05 }
    }));

    return [{
      id: `${sceneId}_moon_body`, type: 'shape', content: 'circle',
      position: { x, y, z },
      size: { width: sizePct, height: sizePct },
      style: {
        background: `radial-gradient(circle at 30% 28%, #f5f5f0 0%, #d4d0c8 18%, #b0aba0 40%, #807a70 65%, #504a40 85%, #2a2520 100%)`,
        boxShadow: `0 0 ${sizePct}px rgba(220,215,200,0.15), inset -${sizePct*0.12}px -${sizePct*0.1}px ${sizePct*0.3}px rgba(0,0,0,0.55), 0 0 ${sizePct*0.6}px rgba(180,175,160,0.08)`,
      },
      animation: { name: 'fadeIn', duration: 1.2 }
    }, {
      // Rim light on edge
      id: `${sceneId}_moon_rim`, type: 'shape', content: 'circle',
      position: { x: x + sizePct * 0.02, y, z: z + 0.05 },
      size: { width: sizePct * 0.98, height: sizePct * 0.98 },
      style: {
        background: 'transparent',
        border: '1px solid rgba(255,248,230,0.2)',
        boxShadow: `inset ${sizePct*0.15}px ${sizePct*0.08}px ${sizePct*0.2}px rgba(255,248,230,0.12)`,
      },
      animation: { name: 'fadeIn', duration: 1.5 }
    }, ...craterEls];
  };

  // ── Multi-part spaceship using SVG for detailed vector art ──
  const makeShip = (sceneId: string, x: number, y: number, scale: number, z: number, anim: any) => {
    const w = 22 * scale; const h = 7 * scale;
    const svgContent = `<svg viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible">
      <defs>
        <linearGradient id="body_${sceneId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e8eaf6"/>
          <stop offset="25%" stop-color="#9fa8da"/>
          <stop offset="50%" stop-color="#5c6bc0"/>
          <stop offset="75%" stop-color="#3949ab"/>
          <stop offset="100%" stop-color="#283593"/>
        </linearGradient>
        <radialGradient id="cockpit_${sceneId}" cx="35%" cy="35%">
          <stop offset="0%" stop-color="rgba(180,220,255,0.95)"/>
          <stop offset="60%" stop-color="rgba(80,130,220,0.7)"/>
          <stop offset="100%" stop-color="rgba(40,80,180,0.4)"/>
        </radialGradient>
        <radialGradient id="engine_${sceneId}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="rgba(180,230,255,1)"/>
          <stop offset="30%" stop-color="rgba(100,190,255,0.9)"/>
          <stop offset="60%" stop-color="rgba(50,120,255,0.4)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <linearGradient id="trail_${sceneId}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="30%" stop-color="rgba(100,180,255,0.2)"/>
          <stop offset="70%" stop-color="rgba(100,180,255,0.5)"/>
          <stop offset="100%" stop-color="rgba(140,210,255,0.8)"/>
        </linearGradient>
      </defs>
      <!-- Exhaust trail -->
      <ellipse cx="30" cy="50" rx="35" ry="6" fill="url(#trail_${sceneId})" opacity="0.7" filter="blur(2px)"/>
      <!-- Top wing -->
      <polygon points="90,25 130,42 80,42" fill="#3949ab" opacity="0.85"/>
      <!-- Bottom wing -->
      <polygon points="90,75 130,58 80,58" fill="#283593" opacity="0.85"/>
      <!-- Main fuselage -->
      <ellipse cx="150" cy="50" rx="90" ry="18" fill="url(#body_${sceneId})"/>
      <!-- Fuselage highlight -->
      <ellipse cx="160" cy="42" rx="70" ry="6" fill="rgba(255,255,255,0.15)"/>
      <!-- Cockpit window -->
      <ellipse cx="210" cy="47" rx="14" ry="10" fill="url(#cockpit_${sceneId})" stroke="rgba(180,220,255,0.4)" stroke-width="1"/>
      <!-- Cockpit glare -->
      <ellipse cx="206" cy="43" rx="5" ry="3" fill="rgba(255,255,255,0.5)"/>
      <!-- Engine glow -->
      <circle cx="58" cy="50" r="14" fill="url(#engine_${sceneId})"/>
      <!-- Antenna -->
      <line x1="220" y1="35" x2="235" y2="20" stroke="#9fa8da" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="236" cy="19" r="2" fill="#e8eaf6"/>
      <!-- Panel lines -->
      <line x1="130" y1="35" x2="130" y2="65" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>
      <line x1="170" y1="34" x2="170" y2="66" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>
    </svg>`;

    return [
      { id: `${sceneId}_ship_svg`, type: 'svg', content: svgContent,
        position: { x, y, z },
        size: { width: w, height: h },
        style: { filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(100,140,255,0.2))` },
        animation: anim
      },
    ];
  };

  // ── Lens flare ──
  const makeLensFlare = (sceneId: string, x: number, y: number) => [
    { id: `${sceneId}_flare_core`, type: 'shape', content: 'circle',
      position: { x, y, z: 4.5 }, size: { width: 4, height: 4 },
      style: { background: 'radial-gradient(circle, rgba(255,250,230,0.9), rgba(255,220,150,0.3) 40%, transparent 70%)', filter: 'blur(1px)' },
      animation: { name: 'pulse', duration: 2.5, properties: { scale: [0.8, 1.4] } }
    },
    { id: `${sceneId}_flare_ring`, type: 'shape', content: 'circle',
      position: { x, y, z: 4.4 }, size: { width: 12, height: 12 },
      style: { background: 'transparent', border: '1px solid rgba(255,240,200,0.12)', filter: 'blur(2px)', opacity: 0.4 },
      animation: { name: 'scale', duration: 3, properties: { scale: [0.9, 1.1] } }
    },
    { id: `${sceneId}_flare_streak`, type: 'shape', content: 'rect',
      position: { x, y, z: 4.3 }, size: { width: 25, height: 0.5 },
      style: { background: 'linear-gradient(90deg, transparent, rgba(255,240,200,0.15) 30%, rgba(255,240,200,0.25) 50%, rgba(255,240,200,0.15) 70%, transparent)', filter: 'blur(1px)' },
      animation: { name: 'fadeIn', duration: 1.5, delay: 0.3 }
    },
  ];

  // ── Atmospheric horizon glow ──
  const makeAtmosphere = (sceneId: string, y: number, color: string) => ({
    id: `${sceneId}_atmo`, type: 'shape', content: 'rect',
    position: { x: 50, y, z: 0.8 }, size: { width: 120, height: 8 },
    style: { background: `linear-gradient(180deg, transparent, ${color} 50%, transparent)`, filter: 'blur(12px)', opacity: 0.5 },
    animation: { name: 'fadeIn', duration: 2, delay: 0.5 }
  });

  return {
    duration: totalDuration,
    fps: 30,
    resolution: options.resolution,
    aspectRatio: options.aspectRatio,
    scenes: [
      // ═══════ SCENE 1: DEPARTURE ═══════
      {
        id: 'scene_1_departure_code',
        startTime: 0,
        duration: s1,
        description: 'Deep space departure with detailed ship launching toward a distant moon.',
        voiceover: 'Initiating lunar approach.',
        elements: [
          // Space background
          { id: 's1_bg', type: 'shape', content: 'rect', position: { x: 50, y: 50, z: 0 }, size: { width: 100, height: 100 },
            style: { background: 'radial-gradient(ellipse at 50% 30%, #0c1228 0%, #070b18 40%, #020408 100%)' },
            animation: { name: 'fadeIn', duration: 1 } },
          // Nebula layers
          makeNebula('s1', 'rgba(60,30,140,0.3)', 'rgba(30,60,160,0.15)', 30, 25),
          { id: 's1_nebula2', type: 'shape', content: 'rect', position: { x: 75, y: 40, z: 0.3 }, size: { width: 45, height: 30 },
            style: { background: 'radial-gradient(ellipse at 55% 50%, rgba(140,50,80,0.2), rgba(80,30,100,0.1) 40%, transparent 70%)', filter: 'blur(18px)', opacity: 0.3 },
            animation: { name: 'scale', duration: 7, properties: { scale: [1, 1.04] } } },
          // Stars
          ...makeStars('s1', 16),
          // Distant moon (small)
          ...makeMoon('s1', 72, 32, 14, 1),
          // Ship (entering from left, moving right toward moon)
          ...makeShip('s1', 30, 58, 1, 3, { name: 'slideIn', duration: s1, properties: { translateX: [-15, 8], translateY: [2, -1] } }),
          // Atmospheric horizon glow at bottom
          makeAtmosphere('s1', 95, 'rgba(40,60,120,0.3)'),
          // Lens flare from distant sun
          ...makeLensFlare('s1', 88, 12),
          // Title
          { id: 's1_title', type: 'text', content: 'LUNAR APPROACH', position: { x: 50, y: 88, z: 5 }, size: { width: 82, height: 12 },
            style: { fontSize: 52, fontWeight: 800, color: '#ffffff', letterSpacing: 6, textShadow: '0 0 30px rgba(100,150,255,0.4)' },
            animation: { name: 'slideUp', duration: 0.9, delay: 0.3, properties: { translateY: [6, 0] } } },
        ],
        transition: { type: 'fade', duration: 0.6 }
      },

      // ═══════ SCENE 2: ORBIT PASS ═══════
      {
        id: 'scene_2_orbit_code',
        startTime: s1,
        duration: s2,
        description: 'Ship sweeps across the frame as the massive moon dominates the scene.',
        voiceover: 'Sweeping past the far side.',
        elements: [
          // Deep space bg
          { id: 's2_bg', type: 'shape', content: 'rect', position: { x: 50, y: 50, z: 0 }, size: { width: 100, height: 100 },
            style: { background: 'linear-gradient(180deg, #030610 0%, #0a1025 35%, #060c1a 70%, #020408 100%)' },
            animation: { name: 'fadeIn', duration: 0.8 } },
          // Nebula behind moon
          makeNebula('s2', 'rgba(50,80,180,0.25)', 'rgba(20,40,100,0.1)', 55, 50),
          // Stars
          ...makeStars('s2', 18),
          // MASSIVE moon filling lower-right
          ...makeMoon('s2', 62, 72, 80, 1),
          // Atmospheric glow on moon's lit edge
          makeAtmosphere('s2', 38, 'rgba(200,195,180,0.12)'),
          // Ship crossing laterally (smaller = further away feel, then closer)
          ...makeShip('s2', 20, 35, 0.8, 3, { name: 'slideIn', duration: s2, properties: { translateX: [-22, 40], translateY: [-1, 3] } }),
          // Lens flare from sun behind moon
          ...makeLensFlare('s2', 38, 28),
          // Foreground dust particles
          { id: 's2_dust1', type: 'shape', content: 'circle', position: { x: 15, y: 60, z: 4.5 }, size: { width: 1.5, height: 1.5 },
            style: { background: 'rgba(200,195,180,0.3)', filter: 'blur(1px)' },
            animation: { name: 'slideIn', duration: s2, properties: { translateX: [0, 18], translateY: [0, -4] } } },
          { id: 's2_dust2', type: 'shape', content: 'circle', position: { x: 80, y: 25, z: 4.5 }, size: { width: 1, height: 1 },
            style: { background: 'rgba(200,195,180,0.2)', filter: 'blur(1px)' },
            animation: { name: 'slideIn', duration: s2, delay: 0.3, properties: { translateX: [0, 12], translateY: [0, -2] } } },
        ],
        transition: { type: 'fade', duration: 0.6 }
      },

      // ═══════ SCENE 3: REVEAL ═══════
      {
        id: 'scene_3_reveal_code',
        startTime: Number((s1 + s2).toFixed(2)),
        duration: s3,
        description: 'Grand reveal: moon horizon with ship silhouette and dramatic lighting.',
        voiceover: 'Orbit complete. Stars beyond.',
        elements: [
          // Space bg with warm tint
          { id: 's3_bg', type: 'shape', content: 'rect', position: { x: 50, y: 50, z: 0 }, size: { width: 100, height: 100 },
            style: { background: 'radial-gradient(ellipse at 50% 20%, #0f1830 0%, #070c1c 35%, #020408 100%)' },
            animation: { name: 'fadeIn', duration: 0.9 } },
          // Nebula/galaxy backdrop
          { id: 's3_galaxy', type: 'shape', content: 'rect', position: { x: 50, y: 30, z: 0.2 }, size: { width: 70, height: 35 },
            style: { background: 'radial-gradient(ellipse at 50% 60%, rgba(100,60,160,0.2), rgba(40,70,140,0.15) 30%, transparent 65%)', filter: 'blur(15px)', opacity: 0.4 },
            animation: { name: 'scale', duration: 6, properties: { scale: [1, 1.03] } } },
          // Stars
          ...makeStars('s3', 20),
          // Moon horizon (giant, mostly off-screen bottom)
          ...makeMoon('s3', 50, 130, 170, 1),
          // Horizon golden rim light
          { id: 's3_rim', type: 'shape', content: 'rect', position: { x: 50, y: 52, z: 1.5 }, size: { width: 110, height: 3 },
            style: { background: 'linear-gradient(90deg, transparent 5%, rgba(255,230,160,0.25) 25%, rgba(255,240,180,0.4) 50%, rgba(255,230,160,0.25) 75%, transparent 95%)', filter: 'blur(4px)' },
            animation: { name: 'fadeIn', duration: 1.5, delay: 0.3 } },
          // Ship silhouette in hero position
          ...makeShip('s3', 38, 45, 0.7, 3, { name: 'float', duration: s3, properties: { translateY: [-0.8, 0.8], translateX: [-0.5, 0.5] } }),
          // Lens flare on horizon
          ...makeLensFlare('s3', 55, 50),
          // Atmospheric glow
          makeAtmosphere('s3', 54, 'rgba(255,230,170,0.15)'),
          // Title
          { id: 's3_title', type: 'text', content: 'AROUND THE MOON', position: { x: 50, y: 16, z: 5 }, size: { width: 84, height: 14 },
            style: { fontSize: 48, fontWeight: 760, color: '#ffffff', letterSpacing: 5, textShadow: '0 0 25px rgba(255,230,160,0.3)' },
            animation: { name: 'zoomIn', duration: 1.2, delay: 0.2, properties: { scale: [0.88, 1] } } },
          // Subtitle
          { id: 's3_sub', type: 'text', content: 'ORBIT COMPLETE', position: { x: 50, y: 24, z: 5 }, size: { width: 60, height: 8 },
            style: { fontSize: 22, fontWeight: 400, color: 'rgba(200,210,230,0.7)', letterSpacing: 8 },
            animation: { name: 'fadeIn', duration: 1.5, delay: 0.8 } },
        ],
        transition: { type: 'fade', duration: 0.5 }
      }
    ],
    requiredAssets: [],
    style: { ...baseStyle, colorPalette: baseStyle.colorPalette || options.colors },
    sourcePrompt: options.prompt,
  };
}

/**
 * Enhance video plan with sophisticated metadata for A-grade rendering
 * This enables camera paths, parallax, color grading, and curved animations
 */
function enhanceWithSophisticatedMetadata(plan: any) {
  const fps = 30;
  const totalFrames = plan.duration * fps;
  
  // Generate subtle color grading only — no camera rotation, no parallax, no random paths.
  // Those features caused generated videos to "twist everywhere" and drift uncontrollably.
  const colorKeyframes = generateColorKeyframes(plan, totalFrames);
  
  plan.sophisticatedMetadata = {
    productionGrade: 'PROFESSIONAL',
    qualityScore: 92,
    usesOrbitalCamera: false,
    usesForwardTracking: false,
    usesCurvedPaths: false,
    usesParallax: false,
    usesColorGrading: true,
    appliedFeatures: [
      'Dynamic Color Grading with Mood Presets'
    ],
    processingInfo: {
      generatedAt: new Date().toISOString(),
      generator: 'sophisticated-edge-function-v3'
    }
  };
  
  // Color grading only — subtle and non-disorienting
  plan.colorGradingData = {
    keyframes: colorKeyframes,
    mood: detectMood(plan)
  };
  
  // Explicitly do NOT add these — they cause twisting/drifting:
  // plan.cameraPathData   (orbital rotation = twisting)
  // plan.parallaxConfigData (auto-drift on all elements)
  // plan.characterPathsData (random bezier movement)
  
  return plan;
}

function generateCameraKeyframes(plan: any, totalFrames: number) {
  const keyframes = [];
  const numKeyframes = Math.min(6, Math.ceil(plan.scenes?.length || 3));
  
  for (let i = 0; i <= numKeyframes; i++) {
    const progress = i / numKeyframes;
    const frame = Math.floor(progress * totalFrames);
    
    // Create orbital camera movement
    const angle = progress * Math.PI * 0.5; // Quarter rotation
    const radius = 150 + Math.sin(progress * Math.PI) * 50;
    
    keyframes.push({
      frame,
      position: {
        x: Math.cos(angle) * radius * 0.3,
        y: Math.sin(angle) * radius * 0.2 - 20,
        z: 100 + Math.sin(progress * Math.PI * 2) * 30
      },
      rotation: {
        x: Math.sin(progress * Math.PI) * 3,
        y: angle * 5,
        z: Math.sin(progress * Math.PI * 2) * 2
      },
      fov: 60 + Math.sin(progress * Math.PI) * 5
    });
  }
  
  return keyframes;
}

function generateColorKeyframes(plan: any, totalFrames: number) {
  const colors = plan.style?.colorPalette || ['#0a0e27', '#1a1a2e', '#16213e', '#53a8ff'];
  const keyframes = [];
  const numKeyframes = 4;
  
  const moodProgression = [
    { temperature: 6500, tint: 0, saturation: 1.0, vibrance: 0.1 },
    { temperature: 5500, tint: 5, saturation: 1.1, vibrance: 0.15 },
    { temperature: 7000, tint: -5, saturation: 1.05, vibrance: 0.2 },
    { temperature: 6000, tint: 0, saturation: 1.0, vibrance: 0.1 }
  ];
  
  for (let i = 0; i < numKeyframes; i++) {
    const progress = i / (numKeyframes - 1);
    const frame = Math.floor(progress * totalFrames);
    const mood = moodProgression[i];
    
    keyframes.push({
      frame,
      grade: {
        temperature: mood.temperature,
        tint: mood.tint,
        saturation: mood.saturation,
        vibrance: mood.vibrance,
        highlights: { r: 1.0, g: 1.0, b: 1.0 },
        shadows: { r: 0.9, g: 0.9, b: 1.0 },
        vignette: 0.2 + progress * 0.1
      }
    });
  }
  
  return keyframes;
}

function generateParallaxConfig() {
  return {
    background: {
      depth: 0,
      scale: 1.2,
      blur: 2,
      opacity: 0.8,
      moveMultiplier: 0.1
    },
    midground: {
      depth: 1,
      scale: 1.0,
      blur: 0,
      opacity: 1.0,
      moveMultiplier: 0.5
    },
    characters: {
      depth: 2,
      scale: 1.0,
      blur: 0,
      opacity: 1.0,
      moveMultiplier: 0.8
    },
    ui: {
      depth: 3,
      scale: 1.0,
      blur: 0,
      opacity: 1.0,
      moveMultiplier: 1.0
    },
    effects: {
      depth: 4,
      scale: 1.05,
      blur: 0,
      opacity: 0.9,
      moveMultiplier: 1.2
    },
    foreground: {
      depth: 5,
      scale: 1.1,
      blur: 1,
      opacity: 0.6,
      moveMultiplier: 1.5
    }
  };
}

function generateCharacterPaths(plan: any, fps: number) {
  const paths: Record<string, any> = {};
  
  plan.scenes?.forEach((scene: any) => {
    scene.elements?.forEach((element: any) => {
      // Add curved path for images and key elements
      if (element.type === 'image' || element.position?.z >= 2) {
        const pathId = `${scene.id}-${element.id}`;
        const startFrame = scene.startTime * fps;
        const endFrame = (scene.startTime + scene.duration) * fps;
        const duration = endFrame - startFrame;
        
        // Create smooth bezier control points
        const startX = element.position.x;
        const startY = element.position.y;
        const endX = startX + (Math.random() - 0.5) * 10;
        const endY = startY + (Math.random() - 0.5) * 5;
        
        paths[pathId] = {
          type: 'bezier',
          startFrame,
          endFrame,
          points: [
            { x: startX, y: startY, frame: 0 },
            { x: startX + (endX - startX) * 0.33, y: startY - 3, frame: duration * 0.33 },
            { x: startX + (endX - startX) * 0.66, y: endY + 2, frame: duration * 0.66 },
            { x: endX, y: endY, frame: duration }
          ],
          easing: 'easeInOutCubic',
          autoRotate: true,
          scaleWithDistance: true
        };
      }
    });
  });
  
  return paths;
}

function detectMood(plan: any): string {
  const colors = plan.style?.colorPalette || [];
  const colorStr = colors.join(' ').toLowerCase();
  
  if (colorStr.includes('ff') && colorStr.includes('00')) return 'vibrant';
  if (colorStr.includes('0a') || colorStr.includes('1a')) return 'space-blue';
  if (colorStr.includes('22c') || colorStr.includes('16')) return 'nature';
  if (colorStr.includes('f4') || colorStr.includes('ec')) return 'warm-sunset';
  
  return 'cinematic';
}
