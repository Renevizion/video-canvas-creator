import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Layers, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { VideoRequestBuilder } from '@/components/video/VideoRequestBuilder';
import { SceneTimeline } from '@/components/video/SceneTimeline';
import { AssetPreview } from '@/components/video/AssetPreview';
import type { PlannedScene, AssetRequirement } from '@/types/video';

// Demo data
const demoScenes: PlannedScene[] = [
  {
    id: 'scene_1',
    startTime: 0,
    duration: 3,
    description: 'Dark dashboard fade in with glowing cards',
    elements: [],
    animations: [],
    transition: { type: 'fade', duration: 0.5 },
  },
  {
    id: 'scene_2',
    startTime: 3,
    duration: 4,
    description: 'Feature highlight with cursor interaction',
    elements: [],
    animations: [],
    transition: { type: 'wipe', duration: 0.3 },
  },
  {
    id: 'scene_3',
    startTime: 7,
    duration: 3,
    description: 'CTA and final branding animation',
    elements: [],
    animations: [],
    transition: null,
  },
];

const demoAssets: (AssetRequirement & { generatedUrl?: string })[] = [
  {
    id: 'bg_1',
    type: 'background',
    description: 'Dark futuristic dashboard with blue glow',
    specifications: { width: 1920, height: 1080, style: 'dark web, cyberpunk' },
    providedByUser: false,
    generatedUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
  },
  {
    id: 'icon_1',
    type: 'icon',
    description: 'Glowing analytics chart icon',
    specifications: { width: 256, height: 256, style: 'neon, minimal' },
    providedByUser: false,
  },
  {
    id: 'bg_2',
    type: 'background',
    description: 'Abstract gradient overlay',
    specifications: { width: 1920, height: 1080, style: 'gradient, smooth' },
    providedByUser: false,
    generatedUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
  },
];

const Create = () => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<string>('scene_1');

  const handlePlanGenerated = (planId: string) => {
    setPlanGenerated(true);
    setActiveTab('scenes');
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" asChild>
            <a href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </a>
          </Button>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-6 glow-accent">
              <Wand2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Create New Video
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Describe your video and let AI generate the scenes, assets, and Remotion code.
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="prompt" className="gap-2">
                <Wand2 className="w-4 h-4" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="scenes" disabled={!planGenerated} className="gap-2">
                <Layers className="w-4 h-4" />
                Scenes
              </TabsTrigger>
              <TabsTrigger value="assets" disabled={!planGenerated} className="gap-2">
                <Image className="w-4 h-4" />
                Assets
              </TabsTrigger>
            </TabsList>

            {/* Prompt Tab */}
            <TabsContent value="prompt">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <VideoRequestBuilder onPlanGenerated={handlePlanGenerated} />
              </motion.div>
            </TabsContent>

            {/* Scenes Tab */}
            <TabsContent value="scenes">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <SceneTimeline
                  scenes={demoScenes}
                  totalDuration={10}
                  activeSceneId={activeSceneId}
                  onSceneSelect={setActiveSceneId}
                />

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Scene Details</h3>
                  {demoScenes.find(s => s.id === activeSceneId) && (
                    <div className="glass-card p-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        {demoScenes.find(s => s.id === activeSceneId)?.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <AssetPreview assets={demoAssets} />
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          {planGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Button variant="outline" size="lg">
                Preview Video
              </Button>
              <Button size="lg" className="glow-primary">
                Render Final Video
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Create;
