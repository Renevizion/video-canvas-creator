# Using Showcase Components in Your Videos

This guide shows you how to use the new showcase components in your own video compositions.

## Available Showcase Element Types

### 1. Music Visualization Bars

**Element Type:** `music-visualization` or use keywords: `music visualization`, `audio bars`

**Example Usage:**

```typescript
{
  id: 'audio-viz',
  type: 'music-visualization',
  content: 'Music visualization bars',
  position: { x: 50, y: 50, z: 1 },
  size: { width: 1200, height: 300 },
  animation: {
    type: 'fade',
    name: 'fadeIn',
    duration: 1,
    delay: 0,
    easing: 'ease-out',
    properties: {}
  }
}
```

**Style Options:**
- `size.width`: Width of the visualization (default: 1920)
- `size.height`: Height of the bars (default: 300)

---

### 2. TikTok-Style Captions

**Element Type:** `tiktok-captions` or use keywords: `caption highlight`, `word captions`

**Example Usage:**

```typescript
{
  id: 'animated-caption',
  type: 'tiktok-captions',
  content: 'Welcome to my amazing video with word highlighting',
  position: { x: 50, y: 80, z: 1 },
  size: { width: 90, height: 20 },
  style: {
    fontSize: 48,  // Optional, default: 48
  },
  animation: {
    type: 'fade',
    name: 'fadeIn',
    duration: 0.5,
    delay: 0,
    easing: 'ease-out',
    properties: {}
  }
}
```

**Style Options:**
- `style.fontSize`: Font size (default: 48)
- Words will automatically highlight in gold/yellow as they "speak"
- Each word animates in with a stagger effect

---

### 3. Stats Counter (Year in Review)

**Element Type:** `stats-counter` or use keywords: `stats`, `counter`

**Example Usage:**

```typescript
{
  id: 'video-count',
  type: 'stats-counter',
  content: 'Videos Created',  // Used as label if not specified in style
  position: { x: 25, y: 40, z: 1 },
  size: { width: 400, height: 200 },
  style: {
    value: 1250,           // Number to count to
    label: 'Videos Created', // Label text (or use content)
    suffix: '',            // Optional suffix (e.g., 'h', '+', '%')
    delay: 30,             // Delay in frames before starting (default: 30)
  },
  animation: {
    type: 'fade',
    name: 'fadeIn',
    duration: 0.8,
    delay: 0,
    easing: 'ease-out',
    properties: {}
  }
}
```

**Style Options:**
- `style.value`: Target number (required)
- `style.label`: Label text below number
- `style.suffix`: Suffix after number (e.g., 'h', '+', '%')
- `style.delay`: Delay in frames before animation starts

---

### 4. Existing Advanced Elements (Already Supported)

These were already available and continue to work:

#### Code Editor
**Element Type:** `code` or keywords: `code`, `editor`, `syntax`
```typescript
{
  id: 'code-snippet',
  type: 'code',
  content: 'const video = new Video();',
  position: { x: 50, y: 50, z: 1 },
  size: { width: 800, height: 500 },
}
```

#### Progress Bar
**Element Type:** `progress` or keywords: `progress`, `render`, `loading`
```typescript
{
  id: 'render-progress',
  type: 'progress',
  content: 'video.mp4',
  position: { x: 50, y: 50, z: 1 },
  size: { width: 400, height: 150 },
}
```

#### Terminal
**Element Type:** `terminal` or keywords: `terminal`, `command`, `cli`
```typescript
{
  id: 'terminal-window',
  type: 'terminal',
  content: '$ npm run build\n✓ Build complete',
  position: { x: 50, y: 50, z: 1 },
  size: { width: 600, height: 400 },
}
```

#### Animated Text
**Element Type:** `text` with `style.animated: true` or keyword: `animated`
```typescript
{
  id: 'title',
  type: 'text',
  content: 'Amazing Title',
  position: { x: 50, y: 50, z: 1 },
  style: {
    animated: true,  // Triggers character-by-character animation
    fontSize: 72,
    fontWeight: 800,
  }
}
```

#### 3D Card
**Element Type:** Use keywords: `3d card`, `perspective card`
```typescript
{
  id: 'feature-card',
  type: 'shape',
  content: '3d card - Feature Showcase',
  position: { x: 50, y: 50, z: 1 },
  size: { width: 400, height: 280 },
  style: {
    elementType: '3d-card',
    rotateX: 8,
    rotateY: -15,
  }
}
```

---

## Complete Example: Year in Review Video

Here's a complete example showing how to create a "Year in Review" style video:

```typescript
const yearInReviewPlan: VideoPlan = {
  id: 'year-in-review-2024',
  duration: 12,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  requiredAssets: [],
  scenes: [
    {
      id: 'intro',
      startTime: 0,
      duration: 3,
      description: 'Animated year title',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'year-title',
          type: 'text',
          content: '2024',
          position: { x: 50, y: 30, z: 1 },
          style: {
            fontSize: 120,
            fontWeight: 900,
            color: '#fbbf24',
          },
          animation: {
            type: 'scale',
            name: 'scaleIn',
            duration: 1,
            delay: 0,
            easing: 'spring',
            properties: { scale: [0.5, 1] }
          }
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Year in Review',
          position: { x: 50, y: 45, z: 1 },
          style: {
            fontSize: 48,
            fontWeight: 700,
          }
        }
      ]
    },
    {
      id: 'stats',
      startTime: 3,
      duration: 6,
      description: 'Statistics display',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'stat-1',
          type: 'stats-counter',
          content: 'Videos Created',
          position: { x: 25, y: 35, z: 1 },
          size: { width: 400, height: 200 },
          style: {
            value: 1250,
            label: 'Videos Created',
            delay: 30,
          }
        },
        {
          id: 'stat-2',
          type: 'stats-counter',
          content: 'Hours Rendered',
          position: { x: 75, y: 35, z: 1 },
          size: { width: 400, height: 200 },
          style: {
            value: 480,
            label: 'Hours Rendered',
            suffix: 'h',
            delay: 45,
          }
        },
        {
          id: 'stat-3',
          type: 'stats-counter',
          content: 'Projects Completed',
          position: { x: 25, y: 65, z: 1 },
          size: { width: 400, height: 200 },
          style: {
            value: 89,
            label: 'Projects Completed',
            delay: 60,
          }
        },
        {
          id: 'stat-4',
          type: 'stats-counter',
          content: 'Team Members',
          position: { x: 75, y: 65, z: 1 },
          size: { width: 400, height: 200 },
          style: {
            value: 24,
            label: 'Team Members',
            delay: 75,
          }
        }
      ]
    },
    {
      id: 'outro',
      startTime: 9,
      duration: 3,
      description: 'Thank you message',
      animations: [],
      transition: { type: 'fade', duration: 0.5 },
      elements: [
        {
          id: 'thanks',
          type: 'tiktok-captions',
          content: 'Thank you for an amazing year',
          position: { x: 50, y: 50, z: 1 },
          style: {
            fontSize: 56,
          }
        }
      ]
    }
  ],
  style: {
    colorPalette: ['#ffffff', '#fbbf24', '#3b82f6', '#8b5cf6'],
    typography: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'SF Mono, monospace',
      sizes: { h1: 120, h2: 48, body: 24 },
    },
    borderRadius: 20,
    spacing: 40,
  },
};
```

---

## Complete Example: Music Showcase Video

```typescript
const musicShowcasePlan: VideoPlan = {
  id: 'music-showcase',
  duration: 10,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  requiredAssets: [],
  scenes: [
    {
      id: 'music-scene',
      startTime: 0,
      duration: 10,
      description: 'Music visualization with title',
      animations: [],
      transition: { type: 'fade', duration: 0.3 },
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Now Playing',
          position: { x: 50, y: 15, z: 2 },
          style: {
            fontSize: 72,
            fontWeight: 800,
          },
          animation: {
            type: 'fade',
            name: 'fadeIn',
            duration: 1,
            delay: 0,
            easing: 'ease-out',
            properties: { opacity: [0, 1] }
          }
        },
        {
          id: 'visualizer',
          type: 'music-visualization',
          content: 'Audio bars',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 1400, height: 300 },
          animation: {
            type: 'fade',
            name: 'fadeIn',
            duration: 1.5,
            delay: 0.5,
            easing: 'ease-out',
            properties: { opacity: [0, 1] }
          }
        },
        {
          id: 'song-name',
          type: 'tiktok-captions',
          content: 'Your favorite song playing now',
          position: { x: 50, y: 85, z: 2 },
          style: {
            fontSize: 36,
          },
          animation: {
            type: 'fade',
            name: 'fadeIn',
            duration: 0.8,
            delay: 1,
            easing: 'ease-out',
            properties: { opacity: [0, 1] }
          }
        }
      ]
    }
  ],
  style: {
    colorPalette: ['#ffffff', '#667eea', '#764ba2', '#f093fb'],
    typography: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'monospace',
      sizes: { h1: 72, h2: 48, body: 24 },
    },
    borderRadius: 16,
    spacing: 24,
  },
};
```

---

## Tips for Using Showcase Elements

1. **Combine Elements**: Mix showcase elements with regular text, shapes, and images for rich compositions

2. **Timing**: Use `animation.delay` to stagger elements for professional-looking reveals

3. **Positioning**: Use percentage-based positioning (x: 0-100, y: 0-100) for responsive layouts

4. **Colors**: Leverage the `style.colorPalette` in your VideoPlan for consistent theming

5. **Transitions**: Add smooth scene transitions with `transition: { type: 'fade', duration: 0.5 }`

6. **Performance**: Keep bar counts reasonable (64 bars is optimal for music visualization)

---

## Testing Your Video Plans

You can test these in the Remotion Studio:

```bash
npm run dev:studio
```

Or render directly:

```bash
npx remotion render src/remotion/index.ts DynamicVideo output/my-video.mp4
```

Make sure your video plan JSON is passed as `defaultProps` to the composition!
