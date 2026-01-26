/**
 * Simple Natural Language Video Creator
 * Just type what you want, get a video
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Play, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import { SceneBreakdown } from '@/components/video/SceneBreakdown';
import { findMatchingComponents, componentToVideoPlan } from '@/components/remotion/showcases/UsableComponents';
import type { VideoPlan } from '@/types/video';
import { gateway } from '@/lib/videoGateway';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

export default function SimpleVideoCreator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoPlan, setVideoPlan] = useState<EnhancedVideoPlan | null>(null);

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

    try {
      // Use the sophisticated video gateway (STANDARD)
      console.log('🎬 Generating sophisticated video via gateway...');
      const result = await gateway.process({
        type: 'text',
        prompt: prompt,
        duration: 30, // Default 30 seconds
      });

      if (result.status === 'success' && result.videoPlan) {
        console.log('✅ Sophisticated video generated successfully');
        console.log('   Production Grade:', result.videoPlan.sophisticatedMetadata?.productionGrade || 'N/A');
        setVideoPlan(result.videoPlan as EnhancedVideoPlan);
      } else if (result.status === 'error') {
        console.error('❌ Video generation failed:', result.error);
        // Fallback to basic plan
        const fallbackPlan = generateVideoPlanFromPrompt(prompt);
        setVideoPlan(fallbackPlan as EnhancedVideoPlan);
      }
    } catch (error) {
      console.error('❌ Error generating video:', error);
      // Fallback to basic plan
      const fallbackPlan = generateVideoPlanFromPrompt(prompt);
      setVideoPlan(fallbackPlan as EnhancedVideoPlan);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Video Creation
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Create Videos with Natural Language
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe what you want in plain English. We'll create professional videos instantly.
            </p>
          </motion.div>

          {/* Input Section */}
          <AnimatePresence mode="wait">
            {!videoPlan && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="border-2 shadow-2xl">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      What do you want to create?
                    </CardTitle>
                    <CardDescription className="text-base">
                      Describe your video idea and we'll make it happen
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="e.g., Create a music visualization with colorful bars..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[140px] text-lg resize-none focus:ring-2 focus:ring-primary transition-all"
                        disabled={loading}
                      />
                      <p className="text-sm text-muted-foreground">
                        {prompt.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Quick examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => setPrompt(example)}
                            disabled={loading}
                            className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2 text-lg h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl"
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating your video...
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
            )}

            {/* Video Preview */}
            {videoPlan && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <Card className="border-2 shadow-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Play className="w-6 h-6 text-primary" />
                          Your Video
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Preview your generated video below
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-3 py-1 bg-background rounded-full">
                          {videoPlan.resolution.width}×{videoPlan.resolution.height}
                        </span>
                        <span className="px-3 py-1 bg-background rounded-full">
                          {videoPlan.fps} FPS
                        </span>
                        <span className="px-3 py-1 bg-background rounded-full">
                          {videoPlan.duration}s
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="rounded-xl overflow-hidden shadow-2xl mb-6 bg-black">
                      <RemotionPlayerWrapper plan={videoPlan} className="w-full" />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setVideoPlan(null);
                          setPrompt('');
                        }}
                        className="gap-2 flex-1"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Create Another
                      </Button>
                      <Button
                        size="lg"
                        className="gap-2 flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Scene Breakdown - NEW! */}
                {videoPlan.sophisticatedMetadata && (
                  <SceneBreakdown videoPlan={videoPlan} />
                )}

                {/* Prompt reminder */}
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Your prompt:</span> "{prompt}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
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

