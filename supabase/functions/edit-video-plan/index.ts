import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, instruction, currentPlan } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!planId || !instruction) {
      throw new Error("planId and instruction are required");
    }

    console.log('Editing video plan:', planId, 'Instruction:', instruction);

    const systemPrompt = `You are a video plan editor. You modify existing video plans based on user instructions.

CRITICAL: Return ONLY valid JSON - the complete modified plan. No markdown, no explanations.

Current plan structure includes:
- scenes: Array of scene objects with id, startTime, duration, description, elements, transition
- elements: Each scene has elements with id, type, content, position, size, style, animation
- style: Global style with colorPalette, typography, spacing, borderRadius
- duration, fps, resolution

Common edit operations:
- Change colors: Update style.colorPalette and element style.color/background values
- Change text: Update element.content for text elements
- Add/remove scenes: Modify scenes array
- Change animations: Update element.animation properties
- Change timing: Adjust scene duration/startTime
- Change fonts: Update style.typography

IMPORTANT:
1. Preserve ALL existing structure - only modify what's requested
2. Keep element IDs intact
3. Maintain scene timing consistency (startTime should be cumulative)
4. Return the COMPLETE modified plan, not just the changes`;

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
          { 
            role: "user", 
            content: `Here is the current video plan:\n\n${JSON.stringify(currentPlan, null, 2)}\n\nUser instruction: "${instruction}"\n\nReturn the complete modified plan as JSON.`
          },
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

    // Parse the modified plan
    let modifiedPlan;
    try {
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const cleanJson = jsonStr.trim().replace(/^\s*```json?\s*/, '').replace(/\s*```\s*$/, '');
      modifiedPlan = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse modified plan from AI response");
    }

    // Update in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('video_plans')
      .update({ 
        plan: modifiedPlan,
        generated_code: null, // Clear old code since plan changed
      })
      .eq('id', planId);

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log('Video plan updated successfully');

    return new Response(JSON.stringify({
      success: true,
      planId,
      plan: modifiedPlan,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in edit-video-plan:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
