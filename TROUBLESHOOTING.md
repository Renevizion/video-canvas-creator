# Quick Fix: Module Not Found Errors

## Error Message
```
Module not found: Error: Can't resolve '@remotion/shapes' in '/tmp/remotion-1769415418916'
```

## What This Means
Your **backend render service** (the separate server that renders videos) is missing npm packages.

## Where the Error Occurs
```
Frontend (this repo) → Generates code with imports
    ↓
Supabase Edge Function → Sends code to backend
    ↓
Backend Render Service → ❌ FAILS HERE - missing packages
```

## Quick Fix (2 minutes)

### Step 1: Locate Your Backend Render Service
This is **NOT** this repository. It's a separate Node.js server, such as:
- A separate repository like `your-org/your-render-service` on GitHub
- Your Railway deployment
- Your custom render server
- Example: `Renevizion/remorender` (if using that setup)

### Step 2: Add Missing Packages
In your **backend render service** (not this repo), update `package.json`:

```json
{
  "dependencies": {
    "remotion": "^4.0.409",
    "@remotion/shapes": "^4.0.409",
    "@remotion/transitions": "^4.0.409",
    "@remotion/motion-blur": "^4.0.409",
    "@remotion/noise": "^4.0.409",
    "@remotion/paths": "^4.0.409",
    "@remotion/media": "^4.0.409",
    "@remotion/media-utils": "^4.0.409",
    "@remotion/layout-utils": "^4.0.409",
    "@remotion/google-fonts": "^4.0.409",
    "@remotion/captions": "^4.0.409",
    "@remotion/animated-emoji": "^4.0.409",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### Step 3: Install Packages
In your backend service directory:
```bash
npm install
```

### Step 4: Redeploy (if using Railway/cloud)
```bash
git add package.json package-lock.json
git commit -m "Add required Remotion packages"
git push
```

Railway will auto-deploy with the new packages.

## Why This Happens

1. Frontend generates Remotion code with imports:
   ```typescript
   import { Circle } from '@remotion/shapes';
   ```

2. Code is sent to backend render service

3. Backend tries to bundle/render the code

4. ❌ Fails because `@remotion/shapes` isn't installed

## Complete Setup Guide

For detailed instructions, see:
- **[BACKEND_RENDER_SERVICE_SETUP.md](./BACKEND_RENDER_SERVICE_SETUP.md)** - Complete setup guide with all packages
- **[BACKEND_CHANGES_REQUIRED.md](./BACKEND_CHANGES_REQUIRED.md)** - Additional backend configuration
- **[FUTURE_PROOF_SYSTEM.md](./FUTURE_PROOF_SYSTEM.md)** - System architecture and troubleshooting

## Common Mistakes

❌ **Installing packages in THIS repo (video-canvas-creator)**
  - This repo already has all packages
  - The error is in the **backend render service**

❌ **Skipping some packages**
  - "I don't need shapes" - Wrong! Install ALL packages
  - Generated code may use any feature dynamically

❌ **Using different versions**
  - Backend and frontend must use same versions
  - Currently: `^4.0.409`

## Verification

After installing packages, verify with the automated checker:

```bash
# Copy check-backend-packages.cjs from this repo to your backend
# Run in backend directory:
node check-backend-packages.cjs
```

Or test manually:

```bash
# In backend render service
node -e "require('@remotion/shapes'); console.log('✅ Package installed')"
```

Should output: `✅ Package installed`

## Still Not Working?

1. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Railway logs for errors

3. Verify RAILWAY_RENDER_URL is set in Supabase

4. See [BACKEND_RENDER_SERVICE_SETUP.md](./BACKEND_RENDER_SERVICE_SETUP.md) for detailed troubleshooting

## TL;DR

**Backend needs packages, not frontend!**

1. Go to your backend render service repository
2. Add all @remotion/* packages to package.json
3. Run `npm install`
4. Redeploy
5. ✅ Fixed!
