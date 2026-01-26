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
    const { assetId, description, width, height, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Generating asset:', description);

    // Build a comprehensive prompt based on the style and description
    const styleGuides: Record<string, string> = {
      'illustration': 'Flat vector illustration style, clean lines, solid colors, modern and minimal, suitable for motion graphics',
      'isometric': 'Isometric 3D perspective, clean geometric shapes, vibrant colors, floating in space with subtle shadows',
      'realistic': 'Photorealistic, professional studio photography, perfect lighting, shallow depth of field, high-end commercial quality',
      'cartoon': 'Playful cartoon style, bold colors, fun and expressive, rounded shapes, friendly aesthetic',
      '3d-render': 'Polished 3D CGI render, soft global illumination, clean materials, floating in abstract space with reflections',
      'minimal': 'Ultra-minimal design, single focal element, lots of negative space, simple geometric shapes, elegant',
      'cinematic': 'Cinematic photography, dramatic lighting, moody atmosphere, film-like color grading, high contrast',
      'product': 'Product photography, clean white or dark background, professional studio lighting, sharp focus, commercial quality',
    };

    const styleGuide = styleGuides[style] || styleGuides['realistic'];

    const prompt = `Create a high-quality image for a premium commercial video:

SUBJECT: ${description}

STYLE REQUIREMENTS:
${styleGuide}

TECHNICAL SPECIFICATIONS:
- Dimensions: ${width}x${height} pixels
- NO TEXT OR WORDS in the image
- Sharp, high-resolution quality
- Professional commercial/advertising aesthetic
- Suitable for video production and motion graphics
- Clean composition with clear focal point

LIGHTING & ATMOSPHERE:
- Professional studio-quality lighting
- Subtle reflections and shadows for depth
- Rich, vibrant colors that pop on screen

OUTPUT: A single, stunning image that could be used in a high-budget commercial or advertisement.`;

    // Use the Nano banana image model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          { role: "user", content: prompt },
        ],
        modalities: ["image", "text"], // Required for image generation
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
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract generated image from AI response
    let imageUrl = null;
    const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (imageData?.startsWith('data:image')) {
      // Base64 image - upload to Supabase Storage
      try {
        const base64Data = imageData.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const fileName = `${assetId}-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generated-assets')
          .upload(fileName, bytes, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('generated-assets')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
        console.log('Image uploaded successfully:', publicUrl);
      } catch (err) {
        console.error('Failed to process base64 image:', err);
        // Fallback to placeholder if upload fails
        imageUrl = `https://placehold.co/${width}x${height}/1a1a2e/53a8ff?text=${encodeURIComponent(description.slice(0, 20))}`;
      }
    } else if (imageData?.startsWith('http')) {
      // Direct URL from AI
      imageUrl = imageData;
    } else {
      // No image in response - use placeholder
      console.log('No image in AI response, using placeholder');
      imageUrl = `https://placehold.co/${width}x${height}/1a1a2e/53a8ff?text=${encodeURIComponent(description.slice(0, 20))}`;
    }

    console.log('Asset generated:', assetId, imageUrl);

    return new Response(JSON.stringify({
      success: true,
      assetId,
      url: imageUrl,
      message: imageData ? "Asset generated with AI" : "Asset placeholder generated",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-asset:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
