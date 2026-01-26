# Motion Graphics Support

## Overview

The video-canvas-creator system **fully supports motion graphics videos** using Remotion's `@remotion/shapes` library. You can create abstract, animated videos with geometric shapes, patterns, and dynamic movements.

## Supported Geometric Shapes

The system uses `@remotion/shapes` which provides:

1. **Circle** - Circular shapes and dots
2. **Rect** - Rectangles and squares
3. **Triangle** - Triangular shapes and arrows
4. **Star** - Star shapes with configurable points
5. **Polygon** - Multi-sided shapes (hexagons, octagons, etc.)

## How It Works

### 1. AI Recognition

When you request a **"motion graphics video"**, the AI will:
- Recognize it as a motion graphics request
- Use `type: "shape"` elements with geometric descriptions
- Apply dynamic animations (scale, rotate, translate)
- Create layered compositions with multiple shapes
- Use staggered timing for professional flow

### 2. Shape Detection

The rendering system automatically detects shape types from element content:

```typescript
// Content includes "circle" or "dot" → Renders Circle
// Content includes "rect" or "square" → Renders Rect
// Content includes "triangle" → Renders Triangle
// Content includes "star" → Renders Star
// Content includes "polygon" or "hexagon" → Renders Polygon
```

### 3. Example Video Plan

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
            "properties": { "scale": [0, 1] },
            "duration": 1.0,
            "easing": "spring"
          }
        },
        {
          "id": "triangle_1",
          "type": "shape",
          "content": "Rotating triangle",
          "position": { "x": 70, "y": 30, "z": 2 },
          "size": { "width": 80, "height": 80 },
          "style": { "color": "#8b5cf6" },
          "animation": { 
            "type": "rotate",
            "duration": 2.0
          }
        }
      ]
    }
  ]
}
```

## Prompt Examples

### Basic Motion Graphics
```
"Create a 10-second motion graphics video with colorful geometric shapes"
```

### Abstract Pattern
```
"Motion graphics video with hexagons forming a grid pattern"
```

### Logo Reveal
```
"Motion graphics logo reveal using circles and triangles"
```

### Explainer Style
```
"Motion graphics explainer video with animated icons and shapes"
```

### Technical/Tech
```
"Abstract motion graphics video with geometric patterns for a tech company"
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
- Create scenes with geometric shape elements
- Apply appropriate animations
- Use layered composition for depth

### Step 3: Preview in Remotion Studio
- Open Remotion Studio: `npm run dev:studio`
- View the generated composition
- See shapes animate in real-time
- Adjust timing and properties as needed

### Step 4: Export
- Use the export functionality
- Renders at 30fps with smooth animations
- All shapes are vector-based (crisp at any resolution)

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

**Our implementation provides the same capabilities:**
- ✅ AI-powered generation
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

The video-canvas-creator system **fully supports motion graphics** with:
- ✅ AI-powered generation
- ✅ 5 geometric shape types
- ✅ Dynamic animations
- ✅ Professional results
- ✅ Easy to use

**Just ask for a "motion graphics video" and the AI will handle the rest!**
