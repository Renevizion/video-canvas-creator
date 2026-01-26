# Remotion Video Rendering Guide

This project is now properly set up for high-grade video creation using Remotion v4.

## Overview

Remotion allows you to create videos programmatically using React. This setup enables both:
- **Browser Preview**: Using `@remotion/player` for real-time editing
- **Server-Side Rendering**: Using `@remotion/cli` for high-quality video exports

## Quick Start

### 1. Preview Videos (Development)

Open the Remotion Studio to preview and develop your videos:

```bash
npm run remotion:preview
```

This will open an interactive studio in your browser where you can:
- Preview all compositions
- Adjust timings and animations
- Test different configurations
- Export videos directly from the UI

### 2. Render Videos (Production)

Render a video to an MP4 file:

```bash
npm run remotion:render
```

This will render the `DynamicVideo` composition to `out/video.mp4`.

### 3. List Available Compositions

See all available compositions:

```bash
npm run remotion:compositions
```

## Advanced Rendering Options

### Custom Output Path

```bash
npx remotion render src/remotion/index.ts DynamicVideo my-video.mp4
```

### High-Quality Settings

```bash
npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 \
  --codec=h264 \
  --quality=90 \
  --scale=1.5
```

### Render with Custom Props

Pass custom video plan data:

```bash
npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 \
  --props='{"plan": {"title": "My Custom Video", ...}}'
```

### Specify Frame Range

Render only a portion of the video:

```bash
npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 \
  --frames=0-150
```

### Image Sequence Export

Export as image sequence instead of video:

```bash
npx remotion render src/remotion/index.ts DynamicVideo out/frames
```

## Configuration

### remotion.config.ts

The project includes a `remotion.config.ts` file with optimized settings:

- **Video Format**: H.264 codec with YUV420p pixel format
- **Image Format**: JPEG for faster rendering
- **Concurrency**: Set to 4 threads (adjust based on your machine)
- **Renderer**: ANGLE for better GPU performance

### Composition Registration

All video compositions are registered in `src/remotion/Root.tsx`. To add new compositions:

```typescript
<Composition
  id="MyNewVideo"
  component={MyVideoComponent}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    // your props here
  }}
/>
```

## Video Quality Settings

### Resolution Options

- **1080p (Full HD)**: `width={1920} height={1080}` (default)
- **4K**: `width={3840} height={2160}` (requires more rendering time)
- **720p**: `width={1280} height={720}` (faster rendering)

### Frame Rate Options

- **30fps**: Standard (default)
- **60fps**: Smooth motion (doubles file size)
- **24fps**: Cinematic look

### Codec Options

Available in CLI with `--codec` flag:
- `h264`: Best compatibility (default)
- `h265`: Better compression, smaller files
- `vp8/vp9`: WebM format
- `prores`: Highest quality, large files

## Integration with Video Canvas Creator

The `DynamicVideo` component in `src/components/remotion/DynamicVideo.tsx` renders videos based on `VideoPlan` data structure. This allows:

1. **Visual Editor**: Users create videos in the UI
2. **Real-time Preview**: `RemotionPlayerWrapper` shows live preview
3. **Export**: Render high-quality videos using the CLI

## Performance Tips

1. **Use --concurrency flag**: Adjust based on CPU cores
   ```bash
   npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 --concurrency=8
   ```

2. **Enable parallelism**: Render frames in parallel
   ```bash
   npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 --parallelism=4
   ```

3. **Use scale for quality**: Render at higher resolution then downscale
   ```bash
   npx remotion render src/remotion/index.ts DynamicVideo out/video.mp4 --scale=1.5
   ```

4. **Optimize animations**: Use Remotion's spring animations for smooth motion

## Troubleshooting

### Memory Issues

If rendering fails due to memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run remotion:render
```

### Chrome/Puppeteer Issues

If browser fails to launch:
```bash
npx remotion browser ensure
```

### Slow Rendering

1. Reduce `--concurrency` value
2. Lower video resolution
3. Reduce frame rate
4. Disable complex animations during development

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion API Reference](https://www.remotion.dev/docs/api)
- [CLI Options](https://www.remotion.dev/docs/cli)
- [Performance Guide](https://www.remotion.dev/docs/performance)

## License

Remotion is free for individuals and small teams. For production use, check [Remotion's licensing](https://www.remotion.dev/license).
