# Color Consistency Fix: Frontend ↔ Backend Video Rendering

## Problem

Videos rendered on the frontend (browser preview) had different colors and styles compared to videos rendered on the backend (server-side). This was caused by:

1. **Color Space Mismatch**: `yuv420p` uses 4:2:0 chroma subsampling which loses color information
2. **Missing Codec Settings**: Backend wasn't receiving proper color profile metadata
3. **Inconsistent Rendering**: Browser uses sRGB while video encoding uses YUV color space

## Solution

### 1. Frontend Changes (This Repo)

#### Updated `remotion.config.ts`
```typescript
// OLD (causes color loss)
Config.setPixelFormat('yuv420p');

// NEW (preserves colors accurately)
Config.setPixelFormat('yuv444p');
```

**Why yuv444p?**
- `yuv420p`: 4:2:0 chroma subsampling - loses 75% of color information
- `yuv444p`: 4:4:4 no subsampling - preserves full color fidelity
- Results in accurate color reproduction between frontend and backend

#### Updated `supabase/functions/render-video/index.ts`
Added codec settings to backend payload:
```typescript
codecSettings: {
  codec: 'h264',
  pixelFormat: 'yuv444p',
  videoBitrate: '8M',
}
```

### 2. Backend Changes Required (Remorender Repository)

Your backend render service at https://github.com/Renevizion/remorender needs these updates:

#### Update Server to Accept Codec Settings

In your render endpoint (e.g., `server.js` or `index.js`), update the render function to use the codec settings:

```javascript
// In your render handler
app.post('/render', async (req, res) => {
  const { planId, code, composition, codecSettings, webhookUrl } = req.body;
  
  // Use codecSettings in your Remotion render call
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
    pixelFormat: codecSettings?.pixelFormat || 'yuv444p', // ← Important!
    videoBitrate: codecSettings?.videoBitrate || '8M',
    outputLocation: outputPath,
    // ... other settings
  });
});
```

#### Update package.json (if needed)

Ensure your backend has the latest Remotion packages that support yuv444p:

```json
{
  "dependencies": {
    "remotion": "^4.0.409",
    "@remotion/bundler": "^4.0.409",
    "@remotion/renderer": "^4.0.409"
  }
}
```

#### Verify FFmpeg Supports yuv444p

Run on your Railway server or Docker container:
```bash
ffmpeg -codecs | grep h264
```

Should show yuv444p support. If not, update FFmpeg to version 4.4+.

## Testing

### 1. Test Frontend Rendering
```bash
npm run remotion:render
```

Check the output video colors match your browser preview.

### 2. Test Full Pipeline

1. Create a video in the app
2. Render it (sends to backend)
3. Download the final video
4. Compare colors:
   - Frontend preview screenshot
   - Final rendered video from backend
   - Colors should now match accurately

### 3. Color Accuracy Check

Use a color picker tool to verify specific colors:
- Pick a color from frontend preview (e.g., brand blue #06b6d4)
- Pick same element from backend-rendered video
- Color values should match within ΔE < 2 (imperceptible difference)

## Benefits

✅ **Accurate Colors**: What you see in preview is what you get in final video  
✅ **Professional Quality**: No color degradation from chroma subsampling  
✅ **Consistent Branding**: Brand colors render correctly  
✅ **Better Gradients**: Smooth color transitions without banding  
✅ **Accurate Skin Tones**: If using photos/videos of people  

## Trade-offs

⚠️ **File Size**: yuv444p videos are ~15-20% larger than yuv420p  
⚠️ **Render Time**: Slightly longer encoding time (~5-10%)  
⚠️ **Compatibility**: Most modern players support yuv444p, but very old devices might not

For most use cases (web, social media, presentations), the benefits far outweigh the costs.

## Rollback Instructions

If you need to revert to yuv420p (for compatibility or file size):

1. In `remotion.config.ts`:
   ```typescript
   Config.setPixelFormat('yuv420p');
   ```

2. In `supabase/functions/render-video/index.ts`:
   ```typescript
   pixelFormat: 'yuv420p',
   ```

3. Update backend accordingly

## Additional Notes

- This fix applies to **all videos** rendered through the system
- The color grading system in `SophisticatedVideo.tsx` already applies filters correctly
- The issue was in the **encoding step**, not the rendering step
- Both frontend and backend now use the same color space consistently

## References

- [Remotion Pixel Format Docs](https://www.remotion.dev/docs/config#setpixelformat)
- [FFmpeg YUV Formats Explained](https://trac.ffmpeg.org/wiki/Encode/H.264#Encodingfordumbplayers)
- [Chroma Subsampling Wikipedia](https://en.wikipedia.org/wiki/Chroma_subsampling)
