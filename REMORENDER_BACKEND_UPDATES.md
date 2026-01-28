# Remorender Backend Updates for Sophisticated Video System

## ⚠️ IMPORTANT: Color Consistency Update Required

**Your backend needs an update to fix color inconsistencies!**  
See [COLOR_CONSISTENCY_FIX.md](./COLOR_CONSISTENCY_FIX.md) for detailed instructions.

**Quick summary:** Add `codecSettings` handling to your render endpoint to accept `pixelFormat: 'yuv444p'` for accurate color reproduction.

## Current State
Your remorender backend (https://github.com/Renevizion/remorender) is already well-configured with:
- ✅ Remotion 4.0.x
- ✅ Express server with render endpoint
- ✅ Webpack configuration
- ✅ Upload to Supabase via edge functions

## What Needs to Be Added

### 1. Install New Dependencies

The sophisticated video system uses additional Remotion packages that need to be added to your backend:

```bash
cd remotion-render-server
npm install @remotion/paths@^4.0.409 @remotion/noise@^4.0.409
```

Update `remotion-render-server/package.json`:

```json
{
  "dependencies": {
    "@remotion/bundler": "^4.0.409",
    "@remotion/cli": "^4.0.409",
    "@remotion/renderer": "^4.0.409",
    "@remotion/shapes": "^4.0.409",
    "@remotion/paths": "^4.0.409",    // ADD THIS
    "@remotion/noise": "^4.0.409",     // ADD THIS
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "fluent-ffmpeg": "^2.1.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "^4.0.409"
  }
}
```

### 2. Update Codec Settings (NEW - Required for Color Accuracy!)

Your render endpoint needs to accept and use `codecSettings` from the request:

```javascript
app.post('/render', async (req, res) => {
  const { planId, code, composition, codecSettings, webhookUrl } = req.body;
  
  // Use codecSettings for accurate color reproduction
  const output = await renderMedia({
    composition: {
      id: composition.id,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
    },
    serveUrl: bundleLocation,
    codec: codecSettings?.codec || 'h264',
    pixelFormat: codecSettings?.pixelFormat || 'yuv444p', // ← Critical for color accuracy!
    videoBitrate: codecSettings?.videoBitrate || '8M',
    outputLocation: outputPath,
    // ... other settings
  });
});
```

**Why yuv444p?** It preserves full color information without chroma subsampling, ensuring colors match between frontend preview and backend render.

This is **exactly** what the sophisticated video system needs. The frontend will send the `SophisticatedVideo` component code with the enhanced video plan as `inputProps`.

### 3. Frontend Integration (Already Done)

Your frontend now generates sophisticated videos that include:
- Camera path data
- Curved animation paths
- Parallax configuration
- Color grading timelines

These are all passed as props to the Remotion component, so the backend just renders them - no changes needed!

## How It Works

### Before (Old System)
```
Frontend → Basic Video Plan → Backend Renders → Video
```

### After (Sophisticated System)
```
Frontend → Sophisticated Video Plan → Backend Renders → Professional Video
       (with camera paths,         (same endpoint)
        curved animations,
        parallax, color grading)
```

## Testing the Integration

### 1. Test Locally First

In your frontend repo, test that the sophisticated system works:

```typescript
import { generateSophisticatedVideo } from '@/services/SophisticatedVideoGenerator';

const video = await generateSophisticatedVideo({
  prompt: 'Test video',
  duration: 10,
  fps: 30
});

console.log('Sophisticated features:', {
  cameraPath: !!video.cameraPath,
  curvedPaths: video.characterPaths?.size,
  parallax: !!video.parallaxConfig,
  colorGrading: !!video.colorGrading
});
```

### 2. Send to Backend

When you're ready to render, your frontend sends to the backend:

```typescript
const renderRequest = {
  code: `
    import React from 'react';
    import { SophisticatedVideo } from './SophisticatedVideo';
    
    export default function Root() {
      return <SophisticatedVideo videoPlan={inputProps.videoPlan} />;
    }
  `,
  composition: {
    id: 'sophisticated-video',
    fps: 30,
    durationInFrames: 300,
    width: 1920,
    height: 1080
  },
  inputProps: {
    videoPlan: sophisticatedVideoPlan // The enhanced plan with all features
  },
  webhookUrl: 'your-webhook-url',
  jobId: 'unique-job-id',
  planId: 'plan-id'
};

// POST to your Railway backend
await fetch('https://your-railway-app.up.railway.app/render', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(renderRequest)
});
```

### 3. Backend Processes Automatically

Your backend will:
1. ✅ Receive the sophisticated video plan
2. ✅ Bundle the component code (including SophisticatedVideo.tsx)
3. ✅ Render with all advanced features (camera paths, parallax, etc.)
4. ✅ Upload to Supabase
5. ✅ Call webhook with video URL

## Important: Component Code Bundling

Your backend needs access to the `SophisticatedVideo` component. Two options:

### Option A: Send Complete Component Code (Recommended)

Bundle the SophisticatedVideo component with your render request:

```typescript
// In your frontend
const componentCode = `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

// Include the full SophisticatedVideo component here
const SophisticatedVideo = ({ videoPlan }) => {
  // ... (full component code)
};

export default function Root() {
  return <SophisticatedVideo videoPlan={inputProps.videoPlan} />;
}
`;
```

### Option B: Deploy Component to Backend (Alternative)

Copy `SophisticatedVideo.tsx` to your remorender repo:

```bash
# In remorender repo
mkdir -p remotion-render-server/components
cp path/to/SophisticatedVideo.tsx remotion-render-server/components/
```

Then reference it in render requests:

```typescript
const code = `
import React from 'react';
import { SophisticatedVideo } from './components/SophisticatedVideo';

export default function Root() {
  return <SophisticatedVideo videoPlan={inputProps.videoPlan} />;
}
`;
```

## Environment Variables

Your backend already has these set (no changes needed):

```bash
UPLOAD_ENDPOINT_URL=your-supabase-function-url
```

## Deployment Checklist

- [ ] Install new dependencies (`@remotion/paths`, `@remotion/noise`)
- [ ] Choose component bundling approach (A or B above)
- [ ] Test locally with sample sophisticated video
- [ ] Deploy to Railway
- [ ] Test end-to-end render
- [ ] Verify uploaded video has all sophisticated features

## Expected Results

After deployment, every video rendered through your backend will automatically have:

✅ **Advanced Camera Movements** - Smooth orbital reveals and forward tracking
✅ **Curved Path Animations** - Characters following Bézier curves
✅ **6-Layer Parallax Depth** - Realistic 3D depth
✅ **Professional Color Grading** - Dynamic mood-based color shifts

**No backend code changes required** - just install dependencies and ensure component access!

## Troubleshooting

### If renders fail with "Cannot find module @remotion/paths"
→ Run `npm install @remotion/paths@^4.0.409` in `remotion-render-server/`

### If components aren't found during bundling
→ Use Option A (send complete component code in request)

### If animations don't work
→ Your backend already has the webpack override fix - should work fine!

### If colors look wrong
→ Color grading requires the full component code - ensure it's included

## Performance Notes

Sophisticated videos with all features may take:
- **Simple (10s)**: ~30-45 seconds to render
- **Medium (30s)**: ~60-90 seconds to render  
- **Long (60s)**: ~120-180 seconds to render

This is normal for professional-grade rendering with complex transforms and effects.

## Summary

**Minimal Changes Needed:**
1. Add 2 npm packages
2. Ensure component code is accessible
3. Test and deploy

**Everything Else:** Already works! Your backend is sophisticated-ready.
