import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Layers, Image, Code, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { VideoRequestBuilder } from '@/components/video/VideoRequestBuilder';
import { SceneTimeline } from '@/components/video/SceneTimeline';
import { AssetPreview } from '@/components/video/AssetPreview';
import { CodePreview } from '@/components/video/CodePreview';
import { useNavigate } from 'react-router-dom';
import { useGenerateRemotionCode } from '@/hooks/useVideoData';
import { supabase } from '@/integrations/supabase/client';
import type { PlannedScene, AssetRequirement, VideoPlan } from '@/types/video';
import { toast } from 'sonner';

const Create = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prompt');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<VideoPlan | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  const generateCodeMutation = useGenerateRemotionCode();

  const handlePlanGenerated = async (planId: string) => {
    setCurrentPlanId(planId);
    setPlanGenerated(true);
    
    // Fetch the generated plan
    const { data } = await supabase
      .from('video_plans')
      .select('plan')
      .eq('id', planId)
      .single();
    
    if (data?.plan) {
      const plan = data.plan as unknown as VideoPlan;
      setCurrentPlan(plan);
      if (plan.scenes?.length > 0) {
        setActiveSceneId(plan.scenes[0].id);
      }
    }
    
    setActiveTab('scenes');
  };

  const handleGenerateCode = async () => {
    if (!currentPlanId) return;
    
    try {
      const result = await generateCodeMutation.mutateAsync(currentPlanId);
      setGeneratedCode(result.code);
      setActiveTab('code');
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  const scenes: PlannedScene[] = currentPlan?.scenes || [];
  const assets: (AssetRequirement & { generatedUrl?: string })[] = 
    currentPlan?.requiredAssets?.map(a => ({ ...a, generatedUrl: undefined })) || [];
  const totalDuration = currentPlan?.duration || 10;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
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
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="prompt" className="gap-2">
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Prompt</span>
              </TabsTrigger>
              <TabsTrigger value="scenes" disabled={!planGenerated} className="gap-2">
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Scenes</span>
              </TabsTrigger>
              <TabsTrigger value="assets" disabled={!planGenerated} className="gap-2">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="code" disabled={!planGenerated} className="gap-2">
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Code</span>
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
                {scenes.length > 0 ? (
                  <>
                    <SceneTimeline
                      scenes={scenes}
                      totalDuration={totalDuration}
                      activeSceneId={activeSceneId}
                      onSceneSelect={setActiveSceneId}
                    />

                    <div className="mt-8 pt-8 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-4">Scene Details</h3>
                      {scenes.find(s => s.id === activeSceneId) && (
                        <div className="glass-card p-4 bg-muted/30">
                          <p className="text-sm text-muted-foreground">
                            {scenes.find(s => s.id === activeSceneId)?.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {scenes.find(s => s.id === activeSceneId)?.elements?.map((el, i) => (
                              <span key={i} className="px-2 py-1 bg-primary/10 rounded text-xs text-primary">
                                {el.type}: {el.content?.slice(0, 20)}...
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scenes generated yet</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <AssetPreview assets={assets} />
              </motion.div>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                {generatedCode ? (
                  <CodePreview code={generatedCode} />
                ) : (
                  <div className="text-center py-12">
                    <Code className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Generate Remotion Code</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Transform your video plan into production-ready Remotion code
                    </p>
                    <Button
                      onClick={handleGenerateCode}
                      disabled={generateCodeMutation.isPending}
                      className="gap-2"
                    >
                      {generateCodeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {generateCodeMutation.isPending ? 'Generating...' : 'Generate Remotion Code'}
                    </Button>
                  </div>
                )}
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
              {!generatedCode && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleGenerateCode}
                  disabled={generateCodeMutation.isPending}
                >
                  {generateCodeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Generate Code
                </Button>
              )}
              {generatedCode && (
                <Button size="lg" className="glow-primary" onClick={() => toast.success('Rendering would start here!')}>
                  Render Final Video
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Create;
