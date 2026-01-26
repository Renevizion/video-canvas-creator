# Motion Graphics Support

## Status Update (January 26, 2026)

✅ **requiredAssets Processing Fixed:**  
The critical bug where `plan.requiredAssets` were never processed has been resolved. The system now properly:
- Extracts AI-specified asset requirements from video plans
- Prioritizes detailed specifications (width, height, style)
- Generates all required assets before rendering
- Ensures motion graphics videos get custom textures and icons

✅ **Comprehensive Testing Added:**  
30 tests verify correct behavior of asset processing and content detection.

✅ **Content Type Detection:**  
New utility helps detect motion graphics prompts and provides helpful guidance.

See `VERIFICATION_REPORT.md` for complete analysis and testing results.

---

## Overview

The video-canvas-creator system **fully supports motion graphics videos** using:
1. **Remotion's `@remotion/shapes`** - Geometric shapes (Circle, Rect, Triangle, Star, Polygon)
2. **AI-Generated Assets** - Custom illustrations, icons, textures, and abstract elements via Gemini 2.5 Flash Image

You can create abstract, animated videos with geometric shapes, AI-generated elements, patterns, and dynamic movements.

## Two Approaches to Motion Graphics

### Approach 1: Geometric Shapes (Built-in)

Use `@remotion/shapes` for pure geometric motion graphics:

**Supported Shapes:**
1. **Circle** - Circular shapes and dots
2. **Rect** - Rectangles and squares
3. **Triangle** - Triangular shapes and arrows
4. **Star** - Star shapes with configurable points
5. **Polygon** - Multi-sided shapes (hexagons, octagons, etc.)

**Best for:**
- Pure geometric patterns
- Abstract backgrounds
- Technical/minimalist aesthetics
- Fast rendering (no asset generation delay)

### Approach 2: AI-Generated Assets (Custom)

Use AI image generation for custom motion graphics elements:

**Supported Types:**
- Abstract shapes and blobs
- Custom icons and illustrations
- Textures and patterns
- Stylized elements
- Particle effects
- Gradient backgrounds

**Best for:**
- Unique, branded visuals
- Complex illustrations
- Organic/fluid shapes
- Rich, detailed graphics
- Custom style requirements

### Hybrid Approach (Recommended)

**Combine both** for maximum visual impact:
- Geometric shapes for structure and patterns
- AI-generated assets for hero elements and custom visuals
- Result: Professional, unique motion graphics

## How It Works

### 1. Geometric Shapes (Approach 1)

**AI Recognition:**
When you request a **"motion graphics video"**, the AI will:
- Use `type: "shape"` elements with geometric descriptions
- Apply dynamic animations (scale, rotate, translate)
- Create layered compositions
- Use staggered timing for professional flow

**Shape Detection:**
The rendering system automatically detects shape types:

```typescript
// Content includes "circle" or "dot" → Renders Circle
// Content includes "rect" or "square" → Renders Rect
// Content includes "triangle" → Renders Triangle
// Content includes "star" → Renders Star
// Content includes "polygon" or "hexagon" → Renders Polygon
```

### 2. AI-Generated Assets (Approach 2)

**Asset Request Process:**

1. **AI identifies need** - During video plan generation, AI determines which elements need custom assets
2. **Adds to requiredAssets** - Creates asset specifications with descriptions
3. **Asset generation** - System calls `generate-asset` function with Gemini 2.5 Flash Image
4. **Upload to Supabase** - Generated images stored in Supabase Storage
5. **Inject into video** - URLs added to element `content` or `style.src`

**Asset Specification:**
```json
{
  "requiredAssets": [
    {
      "id": "hero_icon",
      "type": "image",
      "description": "Abstract fluid gradient blob in cyan and purple",
      "specifications": {
        "width": 512,
        "height": 512,
        "style": "abstract"
      }
    }
  ]
}
```

### 3. Example Video Plans

#### Pure Geometric (Fast)
```json
{
  "scenes": [
    {
      "id": "intro",
      "elements": [
        {
          "id": "circle_1",
          "type": "shape",
          "content": "Animated circle expanding",
          "position": { "x": 50, "y": 50, "z": 1 },
          "size": { "width": 100, "height": 100 },
          "style": { "color": "#06b6d4" },
          "animation": { 
            "type": "scale", 
            "duration": 1.0,
            "easing": "spring"
          }
        }
      ]
    }
  ]
}
```

#### With AI-Generated Assets (Rich)
```json
{
  "scenes": [
    {
      "id": "intro",
      "elements": [
        {
          "id": "bg_texture",
          "type": "image",
          "content": "Abstract particle texture background",
          "position": { "x": 50, "y": 50, "z": 0 },
          "size": { "width": 100, "height": 100 },
          "animation": { 
            "type": "fade",
            "duration": 0.8
          }
        },
        {
          "id": "hero_icon",
          "type": "image",
          "content": "Stylized rocket ship icon in flat style",
          "position": { "x": 50, "y": 40, "z": 2 },
          "size": { "width": 30, "height": 30 },
          "animation": { 
            "type": "scale",
            "properties": { "scale": [0, 1] },
            "duration": 1.2,
            "easing": "spring"
          }
        }
      ]
    }
  ],
  "requiredAssets": [
    {
      "id": "bg_texture",
      "type": "image",
      "description": "Abstract particle texture background",
      "specifications": { "width": 1920, "height": 1080, "style": "abstract" }
    },
    {
      "id": "hero_icon",
      "type": "image",
      "description": "Stylized rocket ship icon in flat style",
      "specifications": { "width": 512, "height": 512, "style": "illustration" }
    }
  ]
}
```

## Prompt Examples

### Geometric Only (Fast Rendering)
```
"Create a 10-second motion graphics video with colorful geometric shapes"
→ Uses built-in Circle, Rect, Triangle shapes
→ No asset generation delay
```

### With AI Assets (Rich Visuals)
```
"Motion graphics video with custom abstract icons and fluid shapes"
→ AI generates custom icons, abstract shapes
→ Combines with geometric elements
→ Richer, unique visuals
```

### Hybrid Examples

**Abstract Pattern:**
```
"Motion graphics video with hexagons and AI-generated gradient blobs"
→ Hexagons: Built-in Polygon shapes
→ Gradient blobs: AI-generated abstract images
```

**Logo Reveal:**
```
"Motion graphics logo reveal with circles, triangles, and custom brand icon"
→ Circles/Triangles: Built-in shapes
→ Brand icon: AI-generated based on description
```

**Explainer Style:**
```
"Motion graphics explainer video with geometric backgrounds and AI-generated icons for each feature"
→ Backgrounds: Built-in geometric shapes
→ Feature icons: AI-generated illustrations
```

**Tech/SaaS:**
```
"Abstract motion graphics video with geometric patterns and AI-generated tech icons"
→ Patterns: Built-in shapes
→ Tech icons: AI-generated custom graphics
```

**Product Showcase:**
```
"Motion graphics showcasing app features with custom UI elements and geometric transitions"
→ Transitions: Built-in shapes
→ UI elements: AI-generated mockups/screenshots
```

## Animation Capabilities

Motion graphics elements support all standard animations:

- **Scale**: Grow/shrink shapes
- **Rotate**: Spin continuously or to specific angles
- **Translate**: Move shapes across the screen
- **Fade**: Opacity changes
- **Pulse**: Breathing/pulsing effect using `noise3D()`
- **Float**: Organic up/down motion

### Example Animations

```javascript
// Pulsing circle
const pulseScale = 1 + noise3D('pulse-' + element.id, frame * 0.15, 0, 0) * 0.05;

// Floating motion
const floatY = noise3D('float-' + element.id, 0, 0, frame * 0.02) * 15;

// Rotation
const rotation = interpolate(frame, [0, 90], [0, 360]);
```

## Creating Motion Graphics Videos

### Step 1: Request the Video
In the video creation interface, use prompts like:
- "Motion graphics video about..."
- "Abstract animated shapes for..."
- "Geometric pattern video..."

### Step 2: AI Generates the Plan
The AI will:
- Recognize the motion graphics intent
- Determine if custom assets are needed
- Create scenes with geometric shapes and/or AI-generated elements
- Add asset specifications to `requiredAssets` array
- Apply appropriate animations
- Use layered composition for depth

**For AI-Generated Assets:**
The system automatically:
1. Identifies elements needing custom graphics
2. Generates assets using Gemini 2.5 Flash Image model
3. Uploads to Supabase Storage
4. Injects URLs into video plan

### Step 3: Asset Generation (if applicable)
If video uses AI-generated assets:
- System calls `generate-asset` function
- AI creates custom images based on descriptions
- Images optimized for motion graphics:
  - Vibrant colors for abstract elements
  - Clean lines for icons
  - Seamless patterns for textures
  - Transparent backgrounds when appropriate
- Processing time: ~3-10 seconds per asset

### Step 4: Preview in Remotion Studio
- Open Remotion Studio: `npm run dev:studio`
- View the generated composition
- See shapes and AI assets animate in real-time
- Adjust timing and properties as needed

### Step 5: Export
- Use the export functionality
- Renders at 30fps with smooth animations
- Geometric shapes: vector-based (crisp at any resolution)
- AI assets: high-quality raster images

## AI Asset Generation Details

### Supported Asset Types

1. **Abstract Shapes**
   - Fluid blobs and organic forms
   - Gradient overlays
   - Particle effects
   - Examples: "Abstract fluid gradient blob", "Organic shape with smooth curves"

2. **Icons & Illustrations**
   - Flat design icons
   - Line art illustrations
   - Stylized graphics
   - Examples: "Rocket ship icon in flat style", "Shopping cart illustration"

3. **Patterns & Textures**
   - Repeatable backgrounds
   - Grid patterns
   - Noise textures
   - Examples: "Hexagonal grid pattern", "Abstract particle texture"

4. **Custom Elements**
   - Branded graphics
   - Product visuals
   - UI mockups
   - Examples: "App interface screenshot", "Product packaging mockup"

### Asset Generation Model

**Model:** Google Gemini 2.5 Flash Image  
**Capabilities:**
- High-quality image generation
- Multiple styles (photorealistic, illustration, abstract, icon)
- Custom dimensions
- Fast generation (~3-5 seconds)
- Suitable for commercial use

**Generation Process:**
```typescript
// System automatically calls this for each required asset
generateAsset({
  description: "Abstract fluid gradient blob in cyan and purple",
  width: 512,
  height: 512,
  style: "abstract"
})
→ Returns: Supabase Storage URL
```

### Optimization Tips

**For Fast Rendering:**
- Use geometric shapes when possible
- Limit AI assets to 2-3 key elements per video
- Use appropriate dimensions (512x512 for icons, 1920x1080 for backgrounds)

**For Rich Visuals:**
- Request specific styles ("flat design", "abstract", "illustration")
- Describe colors to match brand palette
- Mix AI assets with geometric shapes for depth

**For Best Results:**
- Be specific in asset descriptions
- Request transparent backgrounds for icons
- Use consistent style across all assets
- Consider animation timing with asset complexity

## Technical Details

### Implementation

**File**: `src/components/remotion/DynamicVideo.tsx`

The system detects shape types and renders them:

```typescript
import { Circle, Rect, Triangle, Star, Polygon } from '@remotion/shapes';

// Shape detection
const isCircle = content.toLowerCase().includes('circle') || 
                 content.toLowerCase().includes('dot');
const isRect = content.toLowerCase().includes('rect') || 
               content.toLowerCase().includes('square');
const isTriangle = content.toLowerCase().includes('triangle');
const isStar = content.toLowerCase().includes('star');
const isPolygon = content.toLowerCase().includes('polygon') || 
                  content.toLowerCase().includes('hexagon');

// Rendering
if (isCircle) {
  return (
    <Circle
      radius={size / 2}
      fill={color}
      stroke={strokeColor}
      strokeWidth={2}
    />
  );
}
```

### AI Prompt Configuration

**File**: `supabase/functions/generate-video-plan/index.ts`

The AI system prompt includes:

```
MOTION GRAPHICS ELEMENTS (FOR ABSTRACT/ANIMATED CONTENT):
For motion graphics videos, use type: "shape" with these geometric elements:
- "circle" or "dot" - Animated circles/dots with scale, pulse, bounce
- "rect" or "square" - Rectangles for grid patterns, transitions
- "triangle" - Triangles for directional elements, arrows
- "star" - Star shapes for emphasis, sparkles
- "polygon" or "hexagon" - Polygons for technical patterns

Motion Graphics Tips:
- Combine multiple geometric shapes with staggered animations
- Use scale, rotate, and translate animations for dynamic movement
- Layer shapes with different sizes, colors, and opacities
- Create patterns by duplicating shapes with varied positions
```

## Best Practices

### 1. Layering
- Use z-index to create depth
- Background shapes (z: 0)
- Middle layer shapes (z: 1-2)
- Foreground elements (z: 3+)

### 2. Animation Timing
- Stagger animations by 0.15-0.3 seconds
- Use spring easing for organic feel
- Vary animation durations for interest

### 3. Color Harmony
- Use the color palette provided
- Create contrast between shapes
- Consider opacity for layering

### 4. Pattern Creation
- Duplicate shapes with different positions
- Vary sizes for visual hierarchy
- Use symmetry or asymmetry intentionally

### 5. Performance
- Keep element count reasonable (4-8 per scene)
- Use simple shapes for complex patterns
- Leverage Remotion's efficient rendering

## Comparison to Remotion Template

The referenced template (https://www.remotion.dev/templates/prompt-to-motion-graphics) uses:
- AI generation for motion graphics
- Geometric shapes and patterns
- Dynamic animations

**Our implementation provides the same capabilities PLUS MORE:**
- ✅ AI-powered generation
- ✅ Geometric shapes (Circle, Rect, Triangle, Star, Polygon)
- ✅ Dynamic animations (scale, rotate, translate, pulse, float)
- ✅ Layered compositions
- ✅ Staggered timing
- ✅ Professional motion graphics output
- ✅ **AI-generated custom assets** (icons, illustrations, textures) 🆕
- ✅ **Hybrid approach** (geometric + custom assets) 🆕
- ✅ **Brand integration** with color extraction 🆕

**Additional advantages:**
- ✅ Integrated with full video creation suite
- ✅ Mix motion graphics with other content types (text, code, 3D)
- ✅ Brand color integration via Firecrawl
- ✅ Multiple export options
- ✅ Real-time preview in Remotion Studio
- ✅ Custom asset generation with Gemini 2.5 Flash Image
- ✅ Supabase storage for generated assets
- ✅ Template-free, unique outputs every time
- ✅ Geometric shapes (Circle, Rect, Triangle, Star, Polygon)
- ✅ Dynamic animations (scale, rotate, translate, pulse, float)
- ✅ Layered compositions
- ✅ Staggered timing
- ✅ Professional motion graphics output

**Additional advantages:**
- ✅ Integrated with full video creation suite
- ✅ Mix motion graphics with other content types
- ✅ Brand color integration
- ✅ Multiple export options
- ✅ Real-time preview in Remotion Studio

## Examples

### Example 1: Abstract Intro
```
Prompt: "Create a 5-second motion graphics intro with circles and triangles"

Result:
- Multiple animated circles scaling in
- Triangles rotating into view
- Staggered timing for dynamic feel
- Vibrant color palette
```

### Example 2: Geometric Pattern
```
Prompt: "Motion graphics video with hexagonal grid pattern"

Result:
- Hexagons forming a grid
- Wave-like appearance animation
- Each hexagon with slight delay
- Professional geometric aesthetic
```

### Example 3: Logo Reveal
```
Prompt: "Motion graphics logo reveal using geometric shapes"

Result:
- Shapes converge to form logo outline
- Scale and rotate animations
- Final logo text appearance
- Clean, modern reveal
```

## Troubleshooting

### Issue: Shapes Not Appearing
**Solution**: Ensure element `type: "shape"` and content includes shape keywords (circle, triangle, etc.)

### Issue: Animations Too Fast/Slow
**Solution**: Adjust `animation.duration` in the video plan (0.5-2.0 seconds typical)

### Issue: Colors Not Right
**Solution**: Specify color palette in the prompt or use brand extraction

### Issue: Too Many Elements
**Solution**: Keep 4-8 elements per scene for best performance

## Summary

The video-canvas-creator system **fully supports motion graphics** with two powerful approaches:

### Approach 1: Pure Geometric (Built-in Shapes)
- ✅ 5 geometric shape types (Circle, Rect, Triangle, Star, Polygon)
- ✅ Instant rendering (no asset generation)
- ✅ Vector-based (crisp at any resolution)
- ✅ Perfect for abstract patterns and minimal aesthetics

### Approach 2: AI-Generated Assets (Custom Graphics)
- ✅ Unlimited custom illustrations, icons, textures
- ✅ AI-powered with Gemini 2.5 Flash Image
- ✅ Automatic Supabase storage
- ✅ Perfect for branded, unique visuals

### Hybrid Approach (Best of Both)
- ✅ Combine geometric shapes with AI assets
- ✅ Rich, professional motion graphics
- ✅ Unique output every time
- ✅ Brand-aware color palettes

**Features:**
- ✅ AI-powered generation
- ✅ Dynamic animations (scale, rotate, translate, pulse, float)
- ✅ Layered compositions
- ✅ Staggered timing
- ✅ Professional, commercial-quality results
- ✅ Real-time preview in Remotion Studio
- ✅ Easy to use

**Just ask for a "motion graphics video" and the AI will handle the rest!**

Whether you want:
- Fast geometric patterns → Use built-in shapes
- Custom branded elements → Use AI-generated assets
- Rich, unique visuals → Use hybrid approach

The system automatically determines the best approach based on your prompt.
