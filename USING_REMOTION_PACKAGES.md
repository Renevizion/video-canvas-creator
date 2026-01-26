# Using Remotion Official Packages Instead of Custom Components

## Overview

This guide explains how to use Remotion's official packages and community solutions instead of maintaining custom component implementations. This approach provides better maintenance, wider community support, and access to battle-tested solutions.

## Replaced Custom Components

The following custom components have been removed in favor of proven solutions:

1. **Terminal.tsx** - Custom terminal component
2. **Laptop3D.tsx** - Custom 3D laptop mockup
3. **Perspective3DCard.tsx** - Custom 3D card component

## Recommended Replacements

### 1. Terminal / Code Display

**Instead of:** Custom `Terminal.tsx` component

**Use:** Remotion's built-in components + standard libraries

#### Option A: Simple Code Display with Shapes
```tsx
import { Rect } from '@remotion/shapes';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const SimpleTerminal = ({ code }: { code: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, config: { damping: 30 } });
  
  return (
    <div style={{ transform: `scale(${scale})` }}>
      <Rect
        width={600}
        height={400}
        fill="#1e1e2e"
        cornerRadius={16}
      />
      <pre style={{
        position: 'absolute',
        padding: 20,
        fontFamily: 'monospace',
        color: '#4ade80',
      }}>
        {code}
      </pre>
    </div>
  );
};
```

#### Option B: Use React Syntax Highlighter
```bash
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter
```

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus}>
      {code}
    </SyntaxHighlighter>
  );
};
```

### 2. Laptop Mockup / Device Frames

**Instead of:** Custom `Laptop3D.tsx` component

**Use:** Community device mockup libraries

#### Option A: Use Remotion Templates
Visit [Remotion Templates](https://www.remotion.dev/templates) and search for device mockup templates.

#### Option B: Use Device Frames Library
```bash
npm install react-device-frameset
```

```tsx
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

const LaptopView = ({ children }: { children: React.ReactNode }) => {
  return (
    <DeviceFrameset device="MacBook Pro" color="gold">
      {children}
    </DeviceFrameset>
  );
};
```

#### Option C: Simple CSS-Based Mockup
```tsx
import { Rect } from '@remotion/shapes';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

const SimpleLaptop = ({ screenContent }: { screenContent: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const rotation = spring({
    frame,
    fps,
    config: { damping: 40, stiffness: 60 },
  });
  
  const rotateY = interpolate(rotation, [0, 1], [-30, -10]);
  
  return (
    <div style={{
      perspective: '2000px',
      transform: `rotateY(${rotateY}deg)`,
    }}>
      {/* Screen */}
      <Rect
        width={800}
        height={500}
        fill="#1a1a1a"
        cornerRadius={20}
      />
      <div style={{
        position: 'absolute',
        width: 800,
        height: 500,
        padding: 20,
      }}>
        {screenContent}
      </div>
      
      {/* Base */}
      <div style={{
        width: 840,
        height: 20,
        background: 'linear-gradient(180deg, #3a3a3a, #1a1a1a)',
        borderRadius: '0 0 8px 8px',
        marginTop: -10,
      }} />
    </div>
  );
};
```

### 3. 3D Cards / Perspective Elements

**Instead of:** Custom `Perspective3DCard.tsx` component

**Use:** Remotion shapes with CSS transforms

#### Option A: Using Remotion Shapes
```tsx
import { Rect } from '@remotion/shapes';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { noise3D } from '@remotion/noise';

const Simple3DCard = ({ content }: { content: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps });
  
  // Organic floating motion using noise
  const floatY = noise3D('float-y', 0, 0, frame * 0.02) * 10;
  const rotateY = noise3D('rotate-y', frame * 0.01, 0, 0) * 5;
  
  return (
    <div style={{
      perspective: '1500px',
      transform: `translateY(${floatY}px)`,
    }}>
      <div style={{
        transform: `rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}>
        <Rect
          width={400}
          height={280}
          fill="rgba(255,255,255,0.1)"
          cornerRadius={24}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
        }}>
          <p style={{ color: '#fff', fontSize: 18 }}>{content}</p>
        </div>
      </div>
    </div>
  );
};
```

#### Option B: Use Framer Motion (Already Installed)
```tsx
import { motion } from 'framer-motion';
import { useCurrentFrame } from 'remotion';

const FramerCard = ({ content }: { content: string }) => {
  const frame = useCurrentFrame();
  
  return (
    <motion.div
      style={{
        width: 400,
        height: 280,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={{
        rotateY: Math.sin(frame * 0.02) * 5,
        y: Math.sin(frame * 0.03) * 10,
      }}
    >
      <p style={{ color: '#fff' }}>{content}</p>
    </motion.div>
  );
};
```

## Keep Using: Animation Utilities

The `src/lib/animation-utils.ts` library remains valuable for custom animations. It provides:

- **Easing functions**: easeOutQuart, easeInOutCubic, easeOutExpo, easeInOutBack
- **Spring configs**: gentle, snappy, bouncy, slow, smooth
- **Animation helpers**: cursor effects, camera shake/zoom, lighting, motion, parallax

Example usage:
```tsx
import { 
  smoothCursorBlink, 
  floatingMotion, 
  springConfigs 
} from '@/lib/animation-utils';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const MyComponent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Use custom spring config
  const scale = spring({ 
    frame, 
    fps, 
    config: springConfigs.snappy 
  });
  
  // Use floating motion
  const floatY = floatingMotion(frame, 10, 0.02, 'my-float');
  
  return (
    <div style={{
      transform: `scale(${scale}) translateY(${floatY}px)`,
    }}>
      Content
    </div>
  );
};
```

## Benefits of This Approach

### 1. **Less Maintenance**
- No custom component code to maintain
- Community handles bug fixes and improvements
- Updates come through npm packages

### 2. **Better Quality**
- Battle-tested by thousands of users
- Professional polish out of the box
- Consistent with Remotion best practices

### 3. **More Flexibility**
- Easier to customize for specific needs
- Can mix and match different solutions
- Access to full ecosystem of React libraries

### 4. **Better Performance**
- Optimized by experts
- Smaller bundle sizes
- Faster render times

## Migration Guide

If you have existing videos using the removed components:

### Step 1: Identify Usage
Search your codebase for:
- `<Terminal`
- `<Laptop3D`
- `<Perspective3DCard`

### Step 2: Replace with Recommended Solutions
Choose the appropriate replacement from the options above based on your needs.

### Step 3: Test Rendering
```bash
npm run dev:studio
# Preview your changes in Remotion Studio
```

### Step 4: Update Backend Code Generation
If using backend rendering, update the code generation to use the new components.

## Available Remotion Packages

These official packages are already installed and ready to use:

```json
{
  "@remotion/shapes": "Circle, Rect, Triangle, Star, Polygon",
  "@remotion/motion-blur": "Trail component for smooth motion",
  "@remotion/noise": "noise3D for deterministic randomness",
  "@remotion/paths": "SVG path utilities",
  "@remotion/transitions": "Scene transition effects",
  "@remotion/media": "Audio/video components",
  "@remotion/layout-utils": "measureText and layout helpers",
  "@remotion/google-fonts": "Font loading",
  "@remotion/captions": "Subtitle support",
  "@remotion/animated-emoji": "Animated emoji"
}
```

## Examples in Action

### Complete Terminal Example
```tsx
import { Rect } from '@remotion/shapes';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { smoothCursorBlink } from '@/lib/animation-utils';

export const EnhancedTerminal = ({ commands }: { commands: string[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const entrySpring = spring({ frame, fps, config: { damping: 30 } });
  const cursorOpacity = smoothCursorBlink(frame);
  
  return (
    <div style={{ transform: `scale(${entrySpring})`, opacity: entrySpring }}>
      <Rect width={600} height={400} fill="#1e1e2e" cornerRadius={16} />
      <div style={{
        position: 'absolute',
        padding: 20,
        fontFamily: 'monospace',
        color: '#4ade80',
      }}>
        {commands.map((cmd, i) => (
          <div key={i}>$ {cmd}</div>
        ))}
        <span style={{ opacity: cursorOpacity }}>█</span>
      </div>
    </div>
  );
};
```

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Templates](https://www.remotion.dev/templates)
- [Remotion Shapes Docs](https://www.remotion.dev/docs/shapes)
- [Motion Blur Docs](https://www.remotion.dev/docs/motion-blur)
- [Animation Utils Reference](./src/lib/animation-utils.ts)

## Questions?

If you need help migrating or have questions about which solution to use for your specific case, refer to:
- The animation utilities documentation
- Remotion's official examples
- Community templates and showcase videos
