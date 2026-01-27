# Remotion Video Rendering Guide

This project is now properly set up for high-grade video creation using Remotion v4 with a unified development workflow.

## Overview

Remotion allows you to create videos programmatically using React. This setup enables both:
- **Browser Preview**: Using `@remotion/player` for real-time editing in the main app
- **Remotion Studio**: Using `@remotion/cli` for advanced composition development
- **Server-Side Rendering**: Using `@remotion/cli` for high-quality video exports

## Unified Development Workflow

### Single Command Development

Start both the main application and Remotion Studio together:

```bash
npm run dev
```

This will launch:
- **Main Application** at `http://localhost:5173`
  - Create and edit videos using the visual interface
  - Real-time preview with the embedded Remotion Player
  - Save projects and manage your video library
  
- **Remotion Studio** at `http://localhost:3000`
  - Advanced composition development and testing
  - Frame-by-frame preview and timeline editor
  - Direct export from the studio interface

### Individual Commands

Run servers separately if needed:

```bash
# Run only the main application
npm run dev:app

# Run only Remotion Studio
npm run dev:studio
```

## Video Development Workflow

### For Regular Users

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Use the Main App** (`http://localhost:5173`)
   - Navigate to the Create page
   - Design your video using the visual editor
   - Preview in real-time with the embedded player
   - Save your project

3. **Export Your Video**
   ```bash
   npm run remotion:render
   ```

### For Advanced Users / Developers

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Use Remotion Studio** (`http://localhost:3000`)
   - Open the DynamicVideo composition
   - Edit props and test animations
   - Use the timeline for precise control
   - Export directly from the studio

3. **Develop New Compositions**
   - Edit `src/remotion/Root.tsx` to add new compositions
   - Create new video components in `src/components/remotion/`
   - Test in the studio before integrating into the main app

## Preview and Rendering

### 1. Preview Videos (Development)

**Using Remotion Studio** (for advanced development):

Open the Remotion Studio in your browser (it should auto-open at `http://localhost:3000` when you run `npm run dev`):

This will open an interactive studio where you can:
- Preview all compositions
- Adjust timings and animations
- Test different configurations
- Export videos directly from the UI

**Using the Main App** (for regular use):

The main application at `http://localhost:5173` includes an embedded Remotion Player that provides:
- Real-time preview of your video edits
- Integrated editing experience
- Seamless workflow without switching tools

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

## About Remotion Studio vs Preview

Remotion has renamed the `preview` command to `studio` in newer versions. This project uses:
- `remotion studio` - The official command (used in `dev:studio` and `remotion:preview`)
- Port 3000 is the default for Remotion Studio (or higher if unavailable)
- The studio provides the full Remotion development experience

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
  component={MyNewVideoComponent}
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

## AI-Powered Video Creation

Remotion supports AI-powered video generation from text prompts. You can quickly create videos using:

```bash
# Generate motion graphics from prompts
npx create-video@latest --prompt-to-motion-graphics

# Or generate video compositions
npx create-video@latest --prompt-to-video
```

This allows you to:
- Generate video compositions from natural language descriptions
- Create motion graphics automatically
- Rapidly prototype video ideas
- Test different styles and layouts quickly

### AI Templates
- [Prompt to Motion Graphics](https://www.remotion.dev/templates/prompt-to-motion-graphics) - Generate animated motion graphics from text descriptions
- [Prompt to Video](https://www.remotion.dev/templates/prompt-to-video) - Create complete video compositions from prompts
- [All Templates](https://www.remotion.dev/templates) - Browse all available Remotion templates

### AI Resources
- [AI Documentation](https://www.remotion.dev/docs/ai/)
- [System Prompt Guide](https://www.remotion.dev/docs/ai/system-prompt)

## Additional Resources

### Core Documentation
- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Core](https://www.remotion.dev/docs/remotion) - Core package documentation
- [Remotion API Reference](https://www.remotion.dev/docs/api)
- [CLI Options](https://www.remotion.dev/docs/cli)
- [Performance Guide](https://www.remotion.dev/docs/performance)
- [Terminology](https://www.remotion.dev/docs/terminology)
- [Studio Guide](https://www.remotion.dev/docs/terminology/studio)

### Graphics and Visual Effects
- [Motion Blur](https://www.remotion.dev/docs/motion-blur/) - Add realistic motion blur to animations
- [Shapes](https://www.remotion.dev/docs/shapes/) - Built-in shape components
- [Paths](https://www.remotion.dev/docs/paths/) - SVG path utilities and animations

### Advanced Features
- [Measuring](https://www.remotion.dev/docs/measuring)
- [Using Randomness](https://www.remotion.dev/docs/using-randomness)
- [Noise Visualization](https://www.remotion.dev/docs/noise-visualization)
- [Maps](https://www.remotion.dev/docs/maps)
- [Animation Math](https://www.remotion.dev/docs/animation-math)
- [Transitioning](https://www.remotion.dev/docs/transitioning)

### Media and Styling
- [Fonts](https://www.remotion.dev/docs/fonts)
- [Videos](https://www.remotion.dev/docs/videos/)
- [GIF Support](https://www.remotion.dev/docs/gif/)
- [Lottie Animations](https://www.remotion.dev/docs/lottie/)
- [Tailwind CSS](https://www.remotion.dev/docs/tailwind)

### Utilities and Tools
- [Fonts API](https://www.remotion.dev/docs/fonts-api/)
- [Layout Utils](https://www.remotion.dev/docs/layout-utils/)
- [Layout Utils Best Practices](https://www.remotion.dev/docs/layout-utils/best-practices)
- [Measure Text](https://www.remotion.dev/docs/layout-utils/measure-text)
- [Animation Utils](https://www.remotion.dev/docs/animation-utils/)
- [Interpolate Styles](https://www.remotion.dev/docs/animation-utils/interpolate-styles)

### Advanced Topics
- [Bundler](https://www.remotion.dev/docs/bundler)
- [Bundle](https://www.remotion.dev/docs/bundle)
- [Enable SCSS](https://www.remotion.dev/docs/enable-scss/overview)
- [Artifacts](https://www.remotion.dev/docs/artifacts)
- [Parameterized Rendering](https://www.remotion.dev/docs/parameterized-rendering)
- [Visual Editing](https://www.remotion.dev/docs/visual-editing)
- [Config](https://www.remotion.dev/docs/config)

### Snippets and Examples
- [Align Duration](https://www.remotion.dev/docs/miscellaneous/snippets/align-duration)
- [Jump Cuts](https://www.remotion.dev/docs/miscellaneous/snippets/jumpcuts)
- [Different Segments at Different Speeds](https://www.remotion.dev/docs/miscellaneous/snippets/different-segments-at-different-speeds)

### Integration
- [Player Integration](https://www.remotion.dev/docs/player/integration)

### Templates
- [Remotion Templates](https://www.remotion.dev/templates)

## Available Remotion Packages

This project can be extended with additional Remotion packages for advanced functionality:

### Core Packages
- **remotion** - Core framework for creating videos with React
- **@remotion/bundler** - Bundle Remotion projects
- **@remotion/cli** - Command-line interface (already installed)

### Animation and Effects
- **@remotion/animation-utils** - Animation utilities (already installed)
- **@remotion/motion-blur** - Add realistic motion blur effects
- **@remotion/animated-emoji** - Animated emoji components

### Media and Assets
- **@remotion/media** - Audio and video components (already installed)
- **@remotion/media-parser** - Parse and analyze media files
- **@remotion/media-utils** - Media manipulation utilities
- **@remotion/gif** - GIF support (already installed)
- **@remotion/lottie** - Lottie animation support (already installed)

### Text and Fonts
- **@remotion/fonts** - Font loading API (already installed)
- **@remotion/google-fonts** - Google Fonts integration (already installed)
- **@remotion/captions** - Subtitle and caption utilities

### Layout and Styling
- **@remotion/layout-utils** - Text measurement and layout (already installed)
- **@remotion/enable-scss** - SCSS/SASS support

### Cloud and Rendering
- **@remotion/lambda** - Render videos on AWS Lambda
- **@remotion/cloudrun** - Render videos on Google Cloud Run
- **@remotion/licensing** - License key management

### Audio Processing
- **@remotion/install-whisper-cpp** - Install Whisper for audio transcription

### Installation Example
To add any package, use:
```bash
npm install <package-name>
# Example:
npm install @remotion/motion-blur @remotion/shapes
```

For more information on each package, visit the [Remotion documentation](https://www.remotion.dev/docs).

## License

Remotion is free for individuals and small teams. For production use, check [Remotion's licensing](https://www.remotion.dev/license).
