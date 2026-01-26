# Backend Render Service Setup Guide

This guide explains how to set up the backend render service (Railway/custom server) that processes video rendering requests from the Supabase Edge Functions.

## Architecture Overview

```
Frontend (video-canvas-creator)
    ↓ (User creates video)
Supabase Edge Function (render-video)
    ↓ (Sends code + plan)
Backend Render Service (Railway/Node.js server)
    ↓ (Renders with Remotion)
Video Output (MP4)
```

## Problem: Module Not Found Errors

If you see errors like:
```
Module not found: Error: Can't resolve '@remotion/shapes' in '/tmp/remotion-1769415418916'
```

This means your backend render service is **missing required npm packages**.

## Solution: Complete package.json for Backend Render Service

Your backend render service MUST have all these packages installed:

### Complete package.json Template

```json
{
  "name": "video-render-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    
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
    "@remotion/media-parser": "^4.0.409",
    "@remotion/layout-utils": "^4.0.409",
    "@remotion/google-fonts": "^4.0.409",
    "@remotion/captions": "^4.0.409",
    "@remotion/animated-emoji": "^4.0.409"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.17"
  }
}
```

## Installation Steps

### 1. Clone/Create Your Backend Render Service

```bash
# If you have an existing render service repository
git clone https://github.com/YOUR_ORG/YOUR_RENDER_SERVICE.git
cd YOUR_RENDER_SERVICE

# Example: If using Renevizion/remorender
# git clone https://github.com/Renevizion/remorender.git
# cd remorender

# Or create a new directory for your render service
mkdir video-render-service
cd video-render-service
npm init -y
```

### 2. Install ALL Required Packages

```bash
# Core dependencies
npm install express cors

# React (required by Remotion)
npm install react@^18.3.1 react-dom@^18.3.1

# Remotion core packages
npm install remotion@^4.0.409 \
  @remotion/bundler@^4.0.409 \
  @remotion/cli@^4.0.409 \
  @remotion/renderer@^4.0.409 \
  @remotion/player@^4.0.409

# Remotion feature packages (ALL REQUIRED - don't skip any!)
npm install @remotion/shapes@^4.0.409 \
  @remotion/transitions@^4.0.409 \
  @remotion/motion-blur@^4.0.409 \
  @remotion/noise@^4.0.409 \
  @remotion/paths@^4.0.409 \
  @remotion/media@^4.0.409 \
  @remotion/media-utils@^4.0.409 \
  @remotion/media-parser@^4.0.409 \
  @remotion/layout-utils@^4.0.409 \
  @remotion/google-fonts@^4.0.409 \
  @remotion/captions@^4.0.409 \
  @remotion/animated-emoji@^4.0.409
```

### 3. Verify Installation

```bash
# Check that all packages are installed
npm list @remotion/shapes
npm list @remotion/captions
npm list @remotion/motion-blur

# Should show version ^4.0.409 for all
```

#### Automated Package Checker

Use the provided validation script to check all packages at once:

```bash
# Copy check-backend-packages.cjs from video-canvas-creator repo to your backend
# Then run:
node check-backend-packages.cjs
```

This script will:
- ✅ Check all required packages are in package.json
- ✅ Verify packages are actually installed in node_modules
- ❌ List any missing packages
- 📝 Provide installation commands for missing packages

Example output:
```
🔍 Checking backend render service packages...

📦 Project: video-render-service

✅ react - ^18.3.1
✅ react-dom - ^18.3.1
✅ remotion - ^4.0.409
✅ @remotion/shapes - ^4.0.409
✅ @remotion/captions - ^4.0.409
...

====================================================================
Summary:
====================================================================
✅ Installed: 17
❌ Missing: 0

✅ All required packages are installed!
   Your backend render service is ready.
```

## Why All These Packages Are Required

The frontend generates dynamic Remotion code that may use any of these features:

| Package | Used For | Example Code |
|---------|----------|--------------|
| `@remotion/shapes` | Geometric shapes (circles, rectangles, stars) | `<Circle radius={100} />` |
| `@remotion/transitions` | Scene transitions (fade, slide, wipe) | `<TransitionSeries>` |
| `@remotion/motion-blur` | Smooth animations with motion trails | `<Trail><Component /></Trail>` |
| `@remotion/noise` | Deterministic randomness for organic motion | `noise3D(x, y, z)` |
| `@remotion/paths` | SVG path animations | `evolvePath()` |
| `@remotion/media` | Audio/video playback | `<Audio src="..." />` |
| `@remotion/captions` | TikTok-style captions | `<Caption text="..." />` |
| `@remotion/layout-utils` | Text measurement and layout | `measureText()` |
| `@remotion/google-fonts` | Web fonts | `loadFont('Inter')` |
| `@remotion/animated-emoji` | Animated emoji | `<AnimatedEmoji emoji="🎉" />` |

**Even if a video doesn't use all features, the packages MUST be installed** because the generated code imports them conditionally.

## Deployment to Railway

### Environment Variables

Set these in your Railway dashboard:

```bash
PORT=3000
NODE_ENV=production
```

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

### Dockerfile (Optional - Railway can auto-detect Node.js)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including @remotion/* packages)
RUN npm ci --only=production

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## Testing Your Backend Render Service

### 1. Start the server locally
```bash
npm start
```

### 2. Test with curl
```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "test-123",
    "code": "import { Circle } from \"@remotion/shapes\"; ...",
    "composition": {
      "id": "DynamicVideo",
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "durationInFrames": 300
    }
  }'
```

### 3. Check for errors

✅ **Success:** Server processes request without module errors
❌ **Failure:** "Module not found" errors

If you see module errors, **go back and install the missing packages**.

## Troubleshooting

### Error: Can't resolve '@remotion/shapes'

**Solution:**
```bash
npm install @remotion/shapes@^4.0.409
```

### Error: Can't resolve '@remotion/captions'

**Solution:**
```bash
npm install @remotion/captions@^4.0.409
```

### Error: Can't resolve 'react'

**Solution:**
```bash
npm install react@^18.3.1 react-dom@^18.3.1
```

### All packages installed but still getting errors

1. Delete node_modules and package-lock.json:
```bash
rm -rf node_modules package-lock.json
```

2. Clear npm cache:
```bash
npm cache clean --force
```

3. Reinstall:
```bash
npm install
```

### Verifying Package Installation

**Option 1: Use the automated checker (recommended)**

```bash
# Copy check-backend-packages.cjs from video-canvas-creator repo
# Run in your backend directory:
node check-backend-packages.cjs
```

The script will show you exactly what's missing and how to fix it.

**Option 2: Manual verification script**

```javascript
// check-packages.js
const requiredPackages = [
  'remotion',
  '@remotion/shapes',
  '@remotion/transitions',
  '@remotion/motion-blur',
  '@remotion/noise',
  '@remotion/captions',
  '@remotion/paths',
  '@remotion/media',
  '@remotion/layout-utils',
  '@remotion/google-fonts',
  '@remotion/animated-emoji',
  'react',
  'react-dom'
];

let allInstalled = true;

for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg}`);
  } catch (e) {
    console.log(`❌ ${pkg} - NOT INSTALLED`);
    allInstalled = false;
  }
}

if (allInstalled) {
  console.log('\n✅ All packages are installed!');
} else {
  console.log('\n❌ Some packages are missing. Run: npm install');
  process.exit(1);
}
```

Run with:
```bash
node check-packages.js
```

## Integration with Supabase Edge Function

The Supabase Edge Function (`supabase/functions/render-video/index.ts`) sends requests to your backend render service:

```typescript
// In render-video/index.ts
const railwayUrl = Deno.env.get("RAILWAY_RENDER_URL");

const response = await fetch(`${railwayUrl}/render`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    planId,
    code: remotionCode,  // Contains imports like: import { Circle } from '@remotion/shapes'
    composition: { ... }
  }),
});
```

Your backend must:
1. Receive the code
2. Write it to a temporary file
3. Bundle it with Remotion bundler (which resolves imports)
4. Render with Remotion renderer

**All imported packages must be in node_modules or bundling will fail!**

## Keeping Packages in Sync

When the frontend adds new Remotion features, you must update the backend:

1. Check `video-canvas-creator/package.json` for Remotion packages
2. Add any new packages to backend's `package.json`
3. Keep versions in sync (currently using `^4.0.409`)
4. Redeploy backend after updates

## Summary

✅ **DO:**
- Install ALL @remotion/* packages listed in this guide
- Keep package versions in sync with frontend
- Test locally before deploying
- Monitor error logs for "Module not found" errors

❌ **DON'T:**
- Skip packages thinking "I don't need this feature"
- Use different versions than the frontend
- Ignore module resolution errors

## Need Help?

If you're still experiencing issues:

1. Check package versions match: `npm list | grep remotion`
2. Verify node_modules exists: `ls -la node_modules/@remotion`
3. Test with minimal code first (just imports, no rendering)
4. Check Railway/server logs for detailed error messages
5. Ensure you have enough memory/CPU on Railway (rendering is intensive)

## Quick Fix Checklist

- [ ] Backend has package.json with ALL @remotion/* packages
- [ ] Ran `npm install` after adding packages
- [ ] node_modules/@remotion directory exists and has all packages
- [ ] Server can start without import errors
- [ ] RAILWAY_RENDER_URL environment variable is set in Supabase
- [ ] Backend server is accessible from Supabase Edge Functions
- [ ] Railway deployment has completed successfully
- [ ] Test render request completes without "Module not found" errors
