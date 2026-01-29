# Welcome to your Lovable project

## 🔐 Authentication & Security

**NEW:** This app now requires authentication! All user data is isolated and secure.

- **Authentication:** Sign up and sign in with email/password
- **Data Isolation:** Each user has their own data (Row-Level Security)
- **Protected Routes:** All pages require authentication
- **See:** [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) for setup instructions

## 🎥 What Makes This Different?

This is an **AI-powered video production system** that generates professional videos from simple text prompts, URLs, or data. Unlike manual Remotion coding (writing React components for each video), our system uses intelligent agents and sophisticated orchestration to create videos at scale.

**New to the project?** Start here:
- [QUICK_COMPARISON.md](./QUICK_COMPARISON.md) - Quick overview of our approach vs manual Remotion
- [VIDEO_CREATION_COMPARISON.md](./VIDEO_CREATION_COMPARISON.md) - Detailed comparison and architecture
- [SYSTEM_ARCHITECTURE_VISUAL.md](./SYSTEM_ARCHITECTURE_VISUAL.md) - Visual diagrams and flow charts

## 📚 Important Documentation

- **[AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md)** - Authentication setup and usage
- **[LOVABLE_INTEGRATION_ANALYSIS.md](./LOVABLE_INTEGRATION_ANALYSIS.md)** - Analysis of Lovable integration tradeoffs
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Summary of auth implementation

## 🎨 Color Consistency Fix

**Fixed:** Videos now have consistent colors between frontend preview and backend rendering!  
**See:** [COLOR_CONSISTENCY_FIX.md](./COLOR_CONSISTENCY_FIX.md) for details and backend update instructions.

## ⚠️ Troubleshooting "Module not found" Errors

If you see errors like `Module not found: Error: Can't resolve '@remotion/shapes'`, this means your **backend render service needs npm packages installed**. 

**Quick fix:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for a 2-minute solution.

## 🎨 Using Remotion Components

Custom components (Terminal, Laptop3D, Perspective3DCard) have been replaced with simpler implementations using Remotion's official packages. 

**See:** [USING_REMOTION_PACKAGES.md](./USING_REMOTION_PACKAGES.md) for migration guide and examples.

---

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**⚠️ Important Note About Lovable:**
See [LOVABLE_INTEGRATION_ANALYSIS.md](./LOVABLE_INTEGRATION_ANALYSIS.md) for lessons learned about using Lovable and recommendations for verification.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development servers (Main App + Remotion Studio)
npm run dev
```

This will start two servers simultaneously:
- **Main App** on `http://localhost:5173` - The video creation interface
- **Remotion Studio** on `http://localhost:3000` - For previewing and developing video compositions

You can also run them individually:
```sh
# Run only the main app
npm run dev:app

# Run only Remotion Studio
npm run dev:studio
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- **Remotion** - For high-grade video creation and rendering

## Video Rendering with Remotion

This project is properly configured to create **high-grade videos** using [Remotion](https://www.remotion.dev/), a framework for creating videos programmatically with React.

### Quick Start

The project now includes a unified development workflow that runs both the main application and Remotion Studio together:

```sh
# Start both servers (Main App + Remotion Studio)
npm run dev
```

This single command will start:
- **Main App** at `http://localhost:5173` - Create and edit videos in the visual interface
- **Remotion Studio** at `http://localhost:3000` - Preview and develop video compositions

You can also run them separately:

```sh
# Run only the main application
npm run dev:app

# Run only Remotion Studio
npm run dev:studio
```

### Other Remotion Commands

```sh
# Render a video to MP4
npm run remotion:render

# List all available compositions
npm run remotion:compositions
```

For detailed documentation on video rendering, quality settings, and advanced options, see [REMOTION_GUIDE.md](./REMOTION_GUIDE.md).

### Backend Render Service Setup

If you're setting up a backend render service (Railway/custom server) to handle video rendering, see [BACKEND_RENDER_SERVICE_SETUP.md](./BACKEND_RENDER_SERVICE_SETUP.md) for:
- Required npm packages (including `@remotion/shapes` and others)
- Fixing "Module not found" errors
- Complete setup and deployment guide

### AI-Powered Video Creation

Remotion supports AI-powered video generation from text prompts:

```sh
# Generate motion graphics from prompts
npx create-video@latest --prompt-to-motion-graphics

# Or generate complete video compositions
npx create-video@latest --prompt-to-video
```

This allows you to quickly prototype and create videos using natural language descriptions. See the [Remotion AI Templates](https://www.remotion.dev/templates) for examples, or check the [AI Documentation](https://www.remotion.dev/docs/ai/) for more details.

### Features

- ✅ **Browser Preview**: Real-time video editing with `@remotion/player`
- ✅ **Server-Side Rendering**: High-quality MP4 exports with `@remotion/cli`
- ✅ **Optimized Configuration**: Pre-configured for best quality and performance
- ✅ **1080p Full HD**: Default output at 1920x1080 resolution
- ✅ **H.264 Codec**: Maximum compatibility across all platforms
- ✅ **Dynamic Compositions**: Create videos from JSON data structures

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
