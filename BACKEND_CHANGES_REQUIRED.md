# Backend Changes for Aspect Ratios & Captions Support

This file contains all the changes needed for your `Renevizion/remorender` backend to support:
- Different aspect ratios (landscape/portrait/square)
- TikTok-style captions
- AI image generation for all scenes

---

## 1. Update: supabase/functions/generate-video-plan/index.ts

### Add aspect ratio parameter and caption generation

Find this section (around line 15):
```typescript
const { prompt, duration, style, brandData } = await req.json();
```

**REPLACE WITH:**
```typescript
const { prompt, duration, style, brandData, aspectRatio = 'landscape' } = await req.json();
```

Find this section (around line 22-29 - the styleColors):
```typescript
const styleColors: Record<string, string[]> = {
  'dark-web': ['#0a0e27', '#1a1a2e', '#16213e', '#53a8ff'],
  // ... rest of colors
};
```

**ADD AFTER styleColors:**
```typescript
// Aspect ratio configurations
const aspectRatios: Record<string, { width: number; height: number }> = {
  'landscape': { width: 1920, height: 1080 },
  'portrait': { width: 1080, height: 1920 },
  'square': { width: 1080, height: 1080 },
};

const resolution = aspectRatios[aspectRatio] || aspectRatios.landscape;
```

Find this section (around line 79 - the MANDATORY JSON STRUCTURE):
```typescript
MANDATORY JSON STRUCTURE:
{
  "duration": ${duration},
```

**REPLACE WITH:**
```typescript
MANDATORY JSON STRUCTURE:
{
  "duration": ${duration},
  "fps": 30,
  "resolution": ${JSON.stringify(resolution)},
  "aspectRatio": "${aspectRatio}",
```

Find this section (around line 60 - the systemPrompt, right after CRITICAL:):
```typescript
const systemPrompt = `You are an expert video production planner creating CINEMATIC, broadcast-quality commercial videos.
${brandContext}
CRITICAL: Return ONLY valid JSON, no markdown, no explanations.

MANDATORY VISUAL QUALITY STANDARDS:
```

**ADD AFTER MANDATORY VISUAL QUALITY STANDARDS (before element types):**
```typescript
ASPECT RATIO OPTIMIZATION (IMPORTANT):
- Video aspect ratio: ${aspectRatio} (${resolution.width}x${resolution.height})
- FOR PORTRAIT (9:16 / TikTok/Reels): Place elements vertically, use full height, center horizontally
- FOR LANDSCAPE (16:9 / YouTube): Use wide horizontal layouts, cinematic framing
- FOR SQUARE (1:1 / Instagram): Balanced composition, center-focused
- Adjust element positions based on aspect ratio (portrait uses more vertical space)

CAPTIONS FOR SOCIAL MEDIA:
- Add "voiceover" field to each scene with spoken text
- Keep text concise and impactful (3-7 words per segment)
- TikTok-style: Short, punchy phrases that fit captions
- Example: "Check this out" → "Mind-blowing results" → "Get started today"
```

Find the scene structure (around line 95):
```typescript
"scenes": [
  {
    "id": "scene-1",
    "startTime": 0,
    "duration": 3,
    "description": "...",
```

**ADD "voiceover" field to each scene:**
```typescript
"scenes": [
  {
    "id": "scene-1",
    "startTime": 0,
    "duration": 3,
    "description": "...",
    "voiceover": "Short punchy text for captions",
    "elements": [
```

Find where the plan is saved to database (around line 250):
```typescript
const { error: insertError } = await supabase
  .from('video_plans')
  .insert({
    prompt,
    plan: planData,
    status: 'analyzing',
```

**ADD aspectRatio field:**
```typescript
const { error: insertError } = await supabase
  .from('video_plans')
  .insert({
    prompt,
    plan: {
      ...planData,
      aspectRatio: aspectRatio,
    },
    status: 'analyzing',
```

---

## 2. Update: supabase/functions/generate-remotion-code/index.ts

### Add caption and aspect ratio support to code generation

Find the systemPrompt (around line 41):
```typescript
const systemPrompt = `You are a Remotion expert. Generate a complete, working React component for a Remotion video.
```

**REPLACE WITH:**
```typescript
const systemPrompt = `You are a Remotion v4 expert. Generate PRODUCTION-READY React components with CAPTION support.

AVAILABLE REMOTION PACKAGES (use these strategically):
1. Core: remotion (AbsoluteFill, useCurrentFrame, interpolate, spring, Img)
2. Transitions: @remotion/transitions (TransitionSeries, fade, slide, wipe)
3. Motion Blur: @remotion/motion-blur (Trail - wrap fast animations)
4. Shapes: @remotion/shapes (Circle, Rect, Triangle, Star, Polygon)
5. Noise: @remotion/noise (noise3D - for organic motion)
6. Media: @remotion/media (Audio), @remotion/layout-utils (measureText)
7. Fonts: @remotion/google-fonts/Inter (loadFont)
8. Captions: @remotion/captions (Caption - for TikTok-style captions) ← NEW!

CAPTION IMPLEMENTATION (CRITICAL):
- Import: import { Caption } from '@remotion/captions';
- Use for social media videos with voiceover text
- Place at bottom 15% of frame for TikTok/Reels style
- Style with large bold text, stroke outline, word highlighting
- Example:
  <Caption
    text="Your caption text"
    startFrom={0}
    endAt={90}
    style={{
      fontSize: 48,
      fontWeight: 900,
      color: '#fff',
      WebkitTextStroke: '8px #000',
      textTransform: 'uppercase',
      textAlign: 'center',
    }}
  />

ASPECT RATIO HANDLING:
- Respect plan.resolution (width/height from plan)
- Adjust element positions for portrait vs landscape
- Portrait: Stack elements vertically, use full height
- Landscape: Wide horizontal layouts
- Square: Center-focused balanced composition

ANIMATION PATTERNS WITH MOTION BLUR:
- Use Trail component for: slideInLeft, slideInRight, slideInUp, slideInDown, rotate, spin
- Example: <Trail samples={5}><YourComponent /></Trail>

SHAPE USAGE:
- For "circle" content: <Circle radius={100} fill="#color" />
- For "star" content: <Star points={5} outerRadius={100} fill="#color" />
- For "rect" content: <Rect width={200} height={100} fill="#color" cornerRadius={10} />

CRITICAL REQUIREMENTS:
1. Include ALL necessary imports based on what's used
2. Wrap fast animations with Trail component
3. Use shape components for geometric shapes
4. All interpolate() must have: extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
5. Use TransitionSeries for scene transitions
6. Use noise3D() instead of Math.random() for deterministic animations
7. Use <Img> component (not <img>) for images
8. Add <Caption> components if plan has voiceover text in scenes
9. Export component named 'DynamicVideo'
10. Use plan.resolution for composition size

Return ONLY TypeScript/React code, no markdown, no explanations.`;
```

Find the userPrompt (around line 56):
```typescript
const userPrompt = `Generate Remotion code for this video plan:

${JSON.stringify(plan, null, 2)}
```

**REPLACE WITH:**
```typescript
const userPrompt = `Generate Remotion code for this video plan:

${JSON.stringify(plan, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Use resolution from plan: ${plan.resolution?.width || 1920}x${plan.resolution?.height || 1080}
2. Aspect ratio: ${plan.aspectRatio || 'landscape'}
3. If scenes have "voiceover" text, render captions at bottom using Caption component
4. For portrait videos: adjust element Y positions (use more vertical space)
5. Include all necessary imports (captions, motion-blur, shapes, etc.)
6. Make captions TikTok-style: bold, uppercase, white with black stroke
`;
```

---

## 3. Update: supabase/functions/generate-asset/index.ts

### Fix image generation to return REAL images instead of placeholders

Find this section (around line 65-77):
```typescript
const aiData = await response.json();

// For now, return a placeholder since image generation may need specific handling
// In production, you'd extract the generated image URL or base64
const imageUrl = aiData.choices?.[0]?.message?.content || null;

// ... (Supabase client setup)

// For MVP, we'll use a placeholder approach
const placeholderUrl = `https://placehold.co/${width}x${height}/...`;
```

**REPLACE WITH:**
```typescript
const aiData = await response.json();

// Extract generated image from AI response
let imageUrl = null;
const imageContent = aiData.choices?.[0]?.message?.content;

// Check if response contains base64 image data
if (imageContent) {
  if (imageContent.startsWith('data:image')) {
    // Base64 image - upload to Supabase Storage
    try {
      const base64Data = imageContent.split(',')[1];
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const fileName = `${assetId}-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-assets')
        .upload(fileName, buffer, {
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
  } else if (imageContent.startsWith('http')) {
    // Direct URL
    imageUrl = imageContent;
  } else {
    // Text response - use placeholder
    imageUrl = `https://placehold.co/${width}x${height}/1a1a2e/53a8ff?text=${encodeURIComponent(description.slice(0, 20))}`;
  }
} else {
  // No response - use placeholder
  imageUrl = `https://placehold.co/${width}x${height}/1a1a2e/53a8ff?text=${encodeURIComponent(description.slice(0, 20))}`;
}
```

**ALSO ADD** - Create the storage bucket if it doesn't exist:
1. Go to Supabase Dashboard → Storage
2. Create bucket named: `generated-assets`
3. Make it public or set appropriate policies

---

## 4. Database Migration (Run in Supabase SQL Editor)

```sql
-- Add aspectRatio column to video_plans table
ALTER TABLE video_plans 
ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT 'landscape';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_video_plans_aspect_ratio 
ON video_plans(aspect_ratio);

-- Update existing records to have default aspect ratio
UPDATE video_plans 
SET aspect_ratio = 'landscape' 
WHERE aspect_ratio IS NULL;
```

---

## 5. Frontend API Update (Already done in your frontend, but for reference)

The frontend now sends:
```typescript
await supabase.functions.invoke('generate-video-plan', {
  body: { 
    prompt, 
    duration, 
    style, 
    brandData,
    aspectRatio: 'portrait' // ← NEW parameter
  },
});
```

---

## 6. Test the Changes

### Test Aspect Ratios:
```bash
# Test portrait video (TikTok/Reels)
curl -X POST https://your-supabase-url/functions/v1/generate-video-plan \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a product demo",
    "duration": 15,
    "style": "dark-web",
    "aspectRatio": "portrait"
  }'

# Test landscape video (YouTube)
curl -X POST https://your-supabase-url/functions/v1/generate-video-plan \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a product demo",
    "duration": 15,
    "style": "dark-web",
    "aspectRatio": "landscape"
  }'
```

### Expected Plan Output:
```json
{
  "duration": 15,
  "fps": 30,
  "resolution": { "width": 1080, "height": 1920 },
  "aspectRatio": "portrait",
  "scenes": [
    {
      "id": "scene-1",
      "startTime": 0,
      "duration": 5,
      "description": "Opening shot",
      "voiceover": "Check this out",
      "elements": [...]
    }
  ]
}
```

---

## 7. Backend Render Service - Required npm Packages

### CRITICAL: Install @remotion/shapes and other Remotion packages

The backend render service (e.g., `Renevizion/remorender` or your Railway deployment) MUST have all required Remotion packages installed. The generated code imports from these packages, and if they're missing, you'll get **"Module not found"** errors.

**Update your backend render service's `package.json`:**

```json
{
  "dependencies": {
    "remotion": "^4.0.409",
    "@remotion/bundler": "^4.0.409",
    "@remotion/cli": "^4.0.409",
    "@remotion/renderer": "^4.0.409",
    "@remotion/player": "^4.0.409",
    "@remotion/shapes": "^4.0.409",
    "@remotion/transitions": "^4.0.409",
    "@remotion/motion-blur": "^4.0.409",
    "@remotion/noise": "^4.0.409",
    "@remotion/paths": "^4.0.409",
    "@remotion/media": "^4.0.409",
    "@remotion/media-utils": "^4.0.409",
    "@remotion/layout-utils": "^4.0.409",
    "@remotion/google-fonts": "^4.0.409",
    "@remotion/captions": "^4.0.409",
    "@remotion/animated-emoji": "^4.0.409",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

**After updating package.json, run:**
```bash
npm install
```

### Common Error Messages if Packages Are Missing:

```
❌ Module not found: Error: Can't resolve '@remotion/shapes'
❌ Module not found: Error: Can't resolve '@remotion/captions'
❌ Module not found: Error: Can't resolve '@remotion/motion-blur'
```

**Solution:** Install the missing package in your backend render service:
```bash
npm install @remotion/shapes@^4.0.409
npm install @remotion/captions@^4.0.409
npm install @remotion/motion-blur@^4.0.409
```

---

## Summary of Changes

**Files to Update in Backend:**
1. ✅ `supabase/functions/generate-video-plan/index.ts` - Add aspectRatio support & voiceover
2. ✅ `supabase/functions/generate-remotion-code/index.ts` - Add caption generation in prompts
3. ✅ `supabase/functions/generate-asset/index.ts` - Fix image generation (real images, not placeholders)
4. ✅ Supabase Storage - Create `generated-assets` bucket
5. ✅ Database - Run SQL migration for aspect_ratio column
6. ✅ **Backend Render Service `package.json`** - Install all required Remotion packages (CRITICAL!)

**What This Enables:**
- ✅ Portrait videos for TikTok/Instagram Reels
- ✅ Landscape videos for YouTube
- ✅ Square videos for Instagram Feed
- ✅ TikTok-style captions with word highlighting
- ✅ Voiceover text for each scene
- ✅ Real AI-generated images (not placeholders!)
- ✅ Proper element positioning for each aspect ratio

**User Workflow:**
1. User selects "Portrait" aspect ratio in frontend
2. User enters prompt: "Create a product demo"
3. Backend generates plan with 1080x1920 resolution
4. Backend generates images for all scenes
5. Backend generates captions from voiceover text
6. Video renders with captions at bottom
7. User records audio and posts to TikTok/Reels! 🎉
