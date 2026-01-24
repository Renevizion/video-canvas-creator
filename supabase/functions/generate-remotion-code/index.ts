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
    const { planId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the video plan
    const { data: planData, error: planError } = await supabase
      .from('video_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !planData) {
      throw new Error("Video plan not found");
    }

    console.log('Generating Remotion code for plan:', planId);

    const plan = planData.plan;

    const systemPrompt = `You are a Remotion expert. Generate a complete, working React component for a Remotion video.

Requirements:
1. Use Remotion's <Composition>, <Sequence>, <AbsoluteFill>
2. Implement all animations using interpolate() and spring()
3. Use exact timing from the plan (convert seconds to frames at 30fps)
4. Apply all styles from the plan
5. Handle transitions between scenes
6. Make it production-ready with TypeScript
7. Export a single component that can be rendered

IMPORTANT: Return ONLY the TypeScript/React code, no markdown, no explanations.

The code should start with imports and end with the export.`;

    const userPrompt = `Generate Remotion code for this video plan:

${JSON.stringify(plan, null, 2)}

Create a complete, working component with:
- All scenes as Sequence components
- Proper frame-based timing (30fps)
- All animations using interpolate()
- Background colors and elements
- Text elements with proper styling`;

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
    let code = aiData.choices?.[0]?.message?.content;

    if (!code) {
      throw new Error("No code generated from AI");
    }

    // Clean up code - remove markdown if present
    const codeMatch = code.match(/```(?:tsx|typescript|ts|jsx)?\n?([\s\S]+?)\n?```/);
    if (codeMatch) {
      code = codeMatch[1];
    }

    // Update the plan with generated code
    const { error: updateError } = await supabase
      .from('video_plans')
      .update({
        generated_code: code,
        status: 'generating_code',
      })
      .eq('id', planId);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    console.log('Remotion code generated and saved for plan:', planId);

    return new Response(JSON.stringify({
      success: true,
      planId,
      code,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-remotion-code:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
