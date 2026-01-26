# Randomness in Remotion - Best Practices Guide

This guide explains how to properly use randomness in Remotion video components to ensure deterministic, flicker-free rendering.

## Table of Contents

- [Why Randomness Matters](#why-randomness-matters)
- [The Three Types of Randomness](#the-three-types-of-randomness)
- [When to Use Each Type](#when-to-use-each-type)
- [Examples](#examples)
- [Common Pitfalls](#common-pitfalls)
- [References](#references)

## Why Randomness Matters

Remotion renders videos frame-by-frame, often rendering the same frame multiple times during:
- Preview in the player
- Rendering to video file
- Scrubbing through the timeline

If you use non-deterministic randomness (like `Math.random()`), the same frame will produce different results each time it renders, causing:
- ❌ Flickering animations
- ❌ Inconsistent exports
- ❌ Non-reproducible bugs
- ❌ Failed rendering

## The Three Types of Randomness

### 1. Seed-Based Random (`random(seed)`)

**Purpose:** Deterministic randomness - same seed always produces the same value.

```tsx
import { random } from 'remotion';

// Always returns the same value for the same seed
const particleX = random('particle-1-x') * 100;
const particleY = random('particle-1-y') * 100;

// Different seed = different value (but still deterministic)
const particle2X = random('particle-2-x') * 100;
```

**Key Features:**
- ✅ Same seed = same value every time
- ✅ Consistent across renders
- ✅ Reproducible results
- ✅ Perfect for animations, positions, colors

### 2. True Random (`random(null)`)

**Purpose:** Non-deterministic randomness - different value each time.

```tsx
import { random } from 'remotion';

// Returns different value on every render
const trueRandomValue = random(null);
```

**Key Features:**
- ⚠️ Different value every time
- ⚠️ Non-reproducible
- ✅ Useful for "Reevaluate Composition" in Remotion Studio
- ❌ Should NOT be used for animations or visual elements

**When to Use:**
Only use `random(null)` when you explicitly want unpredictable behavior, such as:
- Initial seed generation that you'll store
- Testing with random inputs (that get saved)
- Manual re-randomization via UI button

### 3. Noise Functions (`noise3D`)

**Purpose:** Smooth, organic animations with deterministic behavior.

```tsx
import { noise3D } from '@remotion/noise';
import { useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

// Smooth organic motion over time
const floatY = noise3D('float', 0, 0, frame * 0.02) * 15;
const rotation = noise3D('rotation', frame * 0.01, 0, 0) * 30;
```

**Key Features:**
- ✅ Smooth, continuous values
- ✅ Organic, natural-looking motion
- ✅ Deterministic (same seed + frame = same value)
- ✅ Perfect for floating, drifting, breathing animations

## When to Use Each Type

### Use `random(seed)` for:

- **Random positions:** Place elements at different spots
  ```tsx
  const x = random(`element-${id}-x`) * 1920;
  const y = random(`element-${id}-y`) * 1080;
  ```

- **Random colors:** Pick from a palette
  ```tsx
  const colorIndex = Math.floor(random(`color-${id}`) * colors.length);
  const color = colors[colorIndex];
  ```

- **Random timing:** Offset animations
  ```tsx
  const delay = random(`delay-${id}`) * 30; // Random delay up to 30 frames
  ```

- **Random properties:** Size, opacity, etc.
  ```tsx
  const size = 50 + random(`size-${id}`) * 100; // Size between 50-150
  const opacity = 0.5 + random(`opacity-${id}`) * 0.5; // Opacity 0.5-1.0
  ```

### Use `noise3D` for:

- **Floating animations:** Organic up/down motion
  ```tsx
  const floatY = noise3D('float', 0, 0, frame * 0.02) * 15;
  ```

- **Drifting motion:** Smooth side-to-side movement
  ```tsx
  const driftX = noise3D('drift-x', frame * 0.01, 0, 0) * 20;
  const driftY = noise3D('drift-y', 0, frame * 0.01, 0) * 20;
  ```

- **Pulsing/breathing:** Organic scale changes
  ```tsx
  const pulse = 1 + noise3D('pulse', frame * 0.15, 0, 0) * 0.05;
  ```

- **Camera shake:** Subtle vibration effects
  ```tsx
  const shakeX = noise3D('shake-x', frame * 0.5, 0, 0) * 2;
  const shakeY = noise3D('shake-y', 0, frame * 0.5, 0) * 2;
  ```

### Use `random(null)` for:

- **Manual re-randomization:** When user clicks "Randomize" button
  ```tsx
  const handleRandomize = () => {
    // Generate new seed that will be saved
    const newSeed = `seed-${Date.now()}-${random(null)}`;
    setSavedSeed(newSeed);
  };
  ```

- **Initial seed generation:**
  ```tsx
  const [seed] = useState(() => `initial-${random(null)}`);
  // Then use: random(seed) everywhere
  ```

## Examples

### Example 1: Particle System

```tsx
import { random } from 'remotion';
import { noise3D } from '@remotion/noise';
import { useCurrentFrame } from 'remotion';

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 20 }, (_, i) => {
    const id = `particle-${i}`;
    
    // Deterministic initial position (same every render)
    const startX = random(`${id}-x`) * 1920;
    const startY = random(`${id}-y`) * 1080;
    
    // Organic motion using noise
    const driftX = noise3D(`${id}-drift-x`, frame * 0.01, 0, 0) * 50;
    const driftY = noise3D(`${id}-drift-y`, 0, frame * 0.01, 0) * 50;
    
    return {
      x: startX + driftX,
      y: startY + driftY,
      color: `hsl(${random(`${id}-hue`) * 360}, 70%, 60%)`,
      size: 10 + random(`${id}-size`) * 20,
    };
  });

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
          }}
        />
      ))}
    </>
  );
};
```

### Example 2: Random Color Selection

```tsx
import { random } from 'remotion';

const RandomColorElement: React.FC<{ id: string }> = ({ id }) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8'];
  
  // Deterministically pick a color based on element ID
  const colorIndex = Math.floor(random(`color-${id}`) * colors.length);
  const color = colors[colorIndex];
  
  return (
    <div style={{ backgroundColor: color }}>
      Element {id}
    </div>
  );
};
```

### Example 3: Staggered Animations

```tsx
import { random, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const StaggeredElements: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const elements = Array.from({ length: 10 }, (_, i) => {
    // Each element gets a random delay (but consistent across renders)
    const delay = Math.floor(random(`delay-${i}`) * 20);
    
    const progress = spring({
      frame: frame - delay,
      fps,
      config: { damping: 200 },
    });
    
    return {
      id: i,
      delay,
      opacity: progress,
      translateY: (1 - progress) * 100,
    };
  });

  return (
    <>
      {elements.map(el => (
        <div
          key={el.id}
          style={{
            opacity: el.opacity,
            transform: `translateY(${el.translateY}px)`,
          }}
        >
          Element {el.id}
        </div>
      ))}
    </>
  );
};
```

### Example 4: Organic Background Motion

```tsx
import { noise3D } from '@remotion/noise';
import { useCurrentFrame } from 'remotion';

const OrganicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Multiple orbs with independent organic motion
  const orbs = [
    {
      x: 60 + noise3D('orb1-x', frame * 0.01, 0, 0) * 20,
      y: 20 + noise3D('orb1-y', 0, frame * 0.01, 0) * 15,
      rotation: noise3D('orb1-rot', frame * 0.005, 0, 0) * 30,
      color: '#06b6d4',
    },
    {
      x: 30 + noise3D('orb2-x', frame * 0.008, 0, 0) * 15,
      y: 70 + noise3D('orb2-y', 0, frame * 0.008, 0) * 20,
      rotation: noise3D('orb2-rot', frame * 0.006, 0, 0) * 25,
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: orb.color,
            opacity: 0.3,
            filter: 'blur(60px)',
            transform: `rotate(${orb.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};
```

## Common Pitfalls

### ❌ WRONG: Using Math.random()

```tsx
// This will flicker and cause inconsistent renders!
const x = Math.random() * 1920;
const y = Math.random() * 1080;
```

### ✅ CORRECT: Using random(seed)

```tsx
// Deterministic - same result every render
const x = random('particle-x') * 1920;
const y = random('particle-y') * 1080;
```

### ❌ WRONG: Using random(null) for animations

```tsx
// This will flicker because it changes every frame!
const opacity = random(null);
```

### ✅ CORRECT: Using noise3D for smooth animations

```tsx
// Smooth, organic animation
const opacity = 0.5 + noise3D('fade', frame * 0.02, 0, 0) * 0.5;
```

### ❌ WRONG: Calling random() inside render without seed

```tsx
// Each element gets random values that change every render!
{elements.map(el => (
  <div style={{ left: Math.random() * 100 }}>
    {el.name}
  </div>
))}
```

### ✅ CORRECT: Using element ID as part of seed

```tsx
// Each element gets consistent random values
{elements.map(el => (
  <div style={{ left: random(`pos-${el.id}`) * 100 }}>
    {el.name}
  </div>
))}
```

## Testing Your Randomness

### In Remotion Studio

1. Open Remotion Studio: `npm run dev:studio`
2. Scrub through the timeline
3. Watch the same frame multiple times
4. Look for flickering or changing values

**If values flicker:** You're using non-deterministic randomness incorrectly!

### Reevaluate Composition

In Remotion Studio, you can click "Reevaluate Composition" to test how your video responds to re-initialization. This simulates what happens when:
- Opening the composition fresh
- Rendering to video

If your video looks completely different after reevaluating, you might be using `random(null)` where you should use `random(seed)`.

## Quick Reference

| Use Case | Function | Example |
|----------|----------|---------|
| Random position | `random(seed)` | `random('pos-x') * 1920` |
| Random color | `random(seed)` | `colors[Math.floor(random('col') * colors.length)]` |
| Random timing | `random(seed)` | `random('delay') * 30` |
| Floating motion | `noise3D()` | `noise3D('float', 0, 0, frame * 0.02) * 15` |
| Drifting motion | `noise3D()` | `noise3D('drift-x', frame * 0.01, 0, 0) * 20` |
| Pulsing scale | `noise3D()` | `1 + noise3D('pulse', frame * 0.15, 0, 0) * 0.05` |
| True randomness | `random(null)` | `random(null)` (use sparingly!) |

## References

### Official Remotion Documentation

- [Using Randomness](https://www.remotion.dev/docs/using-randomness) - Core concepts
- [random() API](https://www.remotion.dev/docs/random) - Detailed API reference
- [Accessing True Randomness](https://www.remotion.dev/docs/random#accessing-true-randomness) - When to use `random(null)`
- [Reevaluate Composition](https://www.remotion.dev/docs/studio/reevaluate-composition) - Testing your randomness
- [noise3D Visualization](https://www.remotion.dev/docs/noise-visualization) - Understanding noise functions

### Implementation Files

- `src/components/remotion/DynamicVideo.tsx` - Main video component with randomness examples
- Current usage:
  - ✅ `noise3D()` for organic background motion
  - ✅ `noise3D()` for floating animations
  - ✅ `random()` imported and available for use

## Summary

1. **Never use `Math.random()` in Remotion components** - it causes flickering
2. **Use `random(seed)` for deterministic randomness** - consistent results
3. **Use `noise3D()` for smooth organic animations** - floating, drifting, pulsing
4. **Use `random(null)` sparingly** - only when you truly want non-deterministic behavior
5. **Always include element IDs in your seeds** - ensures each element has unique but consistent values
6. **Test in Remotion Studio** - scrub timeline and use "Reevaluate Composition" to verify determinism

By following these practices, your Remotion videos will render consistently, without flickering, and produce the same results every time! 🎬
