# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

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

### AI-Powered Video Creation

Remotion supports AI-powered motion graphics generation from text prompts:

```sh
npx create-video@latest --prompt-to-motion-graphics
```

This allows you to quickly prototype and create videos using natural language descriptions. For more information, see the [Remotion AI Documentation](https://www.remotion.dev/docs/ai/).

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
