/**
 * Simple Natural Language Video Creator
 * Just type what you want, get a video
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import { findMatchingComponents, componentToVideoPlan } from '@/components/remotion/showcases/UsableComponents';
import type { VideoPlan } from '@/types/video';

export default function SimpleVideoCreator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoPlan, setVideoPlan] = useState<VideoPlan | null>(null);

  const examplePrompts = [
    "Create a music visualization with audio bars",
    "Make animated captions like TikTok",
    "Show year in review stats with counters",
    "Create a complete vertical video for Reels",
    "Make a screencast tutorial demo",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find matching usable components
    const matchingComponents = findMatchingComponents(prompt);
    
    let plan: VideoPlan;
    
    if (matchingComponents.length > 0) {
      // Use the best matching component
      plan = componentToVideoPlan(matchingComponents[0]);
    } else {
      // Fallback to generated plan
      plan = generateVideoPlanFromPrompt(prompt);
    }
    
    setVideoPlan(plan);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Just Say What You Want</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe the video you want in plain English. We'll create it for you.
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  What do you want to create?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., Create a product demo for my scheduling app showing the calendar feature..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] text-base"
                  disabled={loading}
                />

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Try:</span>
                  {examplePrompts.map((example, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(example)}
                      disabled={loading}
                      className="text-xs"
                    >
                      {example.substring(0, 40)}...
                    </Button>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Video Preview */}
          {videoPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Your Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RemotionPlayerWrapper plan={videoPlan} className="rounded-lg overflow-hidden" />
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => setVideoPlan(null)}>
                      Create Another
                    </Button>
                    <Button>Download Video</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Generate a video plan from natural language prompt
 */
function generateVideoPlanFromPrompt(prompt: string): VideoPlan {
  const lowerPrompt = prompt.toLowerCase();

  // Detect video type and content
  let title = 'Your Video';
  let subtitle = '';
  let duration = 10;

  // Extract product name
  const forMatch = prompt.match(/for\s+([A-Za-z0-9\s]+?)(?:\s+showing|\s+with|\s+that|\.|\s*$)/i);
  if (forMatch) {
    title = forMatch[1].trim();
  }

  // Extract features/content
  const showingMatch = prompt.match(/showing\s+(.+?)(?:\s+and\s+|\.|\s*$)/i);
  if (showingMatch) {
    subtitle = showingMatch[1].trim();
  }

  // Extract message for social posts
  const sayingMatch = prompt.match(/saying\s+['"](.+?)['"]|saying\s+([^.]+)/i);
  if (sayingMatch) {
    subtitle = sayingMatch[1] || sayingMatch[2];
  }

  // Determine style based on keywords
  let colorPalette = ['#ffffff', '#06b6d4', '#1e293b', '#0f172a'];
  if (lowerPrompt.includes('social') || lowerPrompt.includes('instagram')) {
    colorPalette = ['#ffffff', '#ec4899', '#8b5cf6', '#3b82f6'];
  } else if (lowerPrompt.includes('youtube')) {
    colorPalette = ['#ffffff', '#ff0000', '#282828', '#0f0f0f'];
  } else if (lowerPrompt.includes('product') || lowerPrompt.includes('demo')) {
    colorPalette = ['#ffffff', '#3b82f6', '#1e293b', '#0f172a'];
  }

  // Create video plan
  return {
    id: `video-${Date.now()}`,
    duration,
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    requiredAssets: [],
    scenes: [
      {
        id: 'intro',
        startTime: 0,
        duration: 3,
        description: 'Intro scene',
        animations: [],
        transition: { type: 'fade', duration: 0.3 },
        elements: [
          {
            id: 'title',
            type: 'text',
            content: title,
            position: { x: 50, y: 40, z: 1 },
            size: { width: 80, height: 15 },
            animation: {
              type: 'fade',
              name: 'fadeIn',
              duration: 1,
              delay: 0,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
            style: {
              fontSize: 72,
              fontWeight: 800,
              color: colorPalette[0],
            },
          },
        ],
      },
      {
        id: 'content',
        startTime: 3,
        duration: 7,
        description: 'Main content',
        animations: [],
        transition: { type: 'fade', duration: 0.3 },
        elements: [
          {
            id: 'subtitle',
            type: 'text',
            content: subtitle || prompt.substring(0, 100),
            position: { x: 50, y: 50, z: 1 },
            size: { width: 80, height: 20 },
            animation: {
              type: 'slide',
              name: 'slideUp',
              duration: 0.8,
              delay: 0,
              easing: 'ease-out',
              properties: { y: [60, 50] },
            },
            style: {
              fontSize: 36,
              fontWeight: 500,
              color: colorPalette[0],
            },
          },
        ],
      },
    ],
    style: {
      colorPalette,
      typography: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'monospace',
        sizes: { h1: 72, h2: 48, body: 24 },
      },
      borderRadius: 24,
      spacing: 24,
    },
  };
}
