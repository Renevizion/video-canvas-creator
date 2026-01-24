import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Code, Layers, Image, Clock, CheckCircle, AlertCircle, Loader2, Download, RefreshCw, Film, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { SceneTimeline } from '@/components/video/SceneTimeline';
import { AssetPreview } from '@/components/video/AssetPreview';
import { CodePreview } from '@/components/video/CodePreview';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import { VideoExporter } from '@/components/video/VideoExporter';
import { supabase } from '@/integrations/supabase/client';
import { useGenerateRemotionCode, useRenderVideo } from '@/hooks/useVideoData';
import type { VideoProject, VideoPlan, PlannedScene, AssetRequirement } from '@/types/video';
import { toast } from 'sonner';

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: 'text-muted-foreground' },
  analyzing: { icon: Loader2, label: 'Analyzing', color: 'text-primary' },
  generating_assets: { icon: Loader2, label: 'Generating Assets', color: 'text-accent' },
  generating_code: { icon: Loader2, label: 'Generating Code', color: 'text-primary' },
  rendering: { icon: Loader2, label: 'Rendering', color: 'text-glow-warning' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-glow-success' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-destructive' },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [activeSceneId, setActiveSceneId] = useState('');
  const [showExporter, setShowExporter] = useState(false);
  
  const generateCodeMutation = useGenerateRemotionCode();
  const renderVideoMutation = useRenderVideo();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('video_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Project not found');
      navigate('/');
      return;
    }

    const projectData: VideoProject = {
      id: data.id,
      prompt: data.prompt,
      plan: data.plan as unknown as VideoPlan | null,
      generated_code: data.generated_code,
      status: data.status as VideoProject['status'],
      reference_pattern_id: data.reference_pattern_id,
      preview_url: data.preview_url,
      final_video_url: data.final_video_url,
      error: data.error,
      created_at: data.created_at || new Date().toISOString(),
      completed_at: data.completed_at,
    };

    setProject(projectData);
    if (projectData.plan?.scenes?.length) {
      setActiveSceneId(projectData.plan.scenes[0].id);
    }
    setLoading(false);
  };

  const handleGenerateCode = async () => {
    if (!id) return;
    try {
      await generateCodeMutation.mutateAsync(id);
      fetchProject();
      setActiveTab('code');
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const plan = project.plan;
  const scenes: PlannedScene[] = plan?.scenes || [];
  const assets: (AssetRequirement & { generatedUrl?: string })[] = 
    plan?.requiredAssets?.map(a => ({ ...a })) || [];
  const totalDuration = plan?.duration || 10;
  const StatusIcon = statusConfig[project.status]?.icon || Clock;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>

          {/* Project header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <StatusIcon className={`w-5 h-5 ${statusConfig[project.status]?.color} ${project.status.includes('ing') ? 'animate-spin' : ''}`} />
                  <span className="text-sm text-muted-foreground">
                    {statusConfig[project.status]?.label}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2 truncate">
                  {project.prompt.slice(0, 60)}...
                </h1>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(project.created_at).toLocaleDateString()} at {new Date(project.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={fetchProject} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                {!project.generated_code && (
                  <Button 
                    onClick={handleGenerateCode}
                    disabled={generateCodeMutation.isPending}
                    className="gap-2"
                  >
                    {generateCodeMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Code className="w-4 h-4" />
                    )}
                    Generate Code
                  </Button>
                )}
                {plan && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/editor/${id}`)}
                    className="gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    Edit Video
                  </Button>
                )}
                {plan && (
                  <Button 
                    onClick={() => setShowExporter(true)}
                    variant="default"
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Download className="w-4 h-4" />
                    Export Video
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="preview" className="gap-2">
                <Play className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="scenes" className="gap-2">
                <Layers className="w-4 h-4" />
                Scenes
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2">
                <Image className="w-4 h-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>

            {/* Preview Tab - Remotion Player */}
            <TabsContent value="preview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Play className="w-4 h-4 text-primary" />
                    Video Preview
                  </h3>
                  <span className="text-sm text-muted-foreground font-mono">
                    {totalDuration}s @ 30fps
                  </span>
                </div>

                {plan ? (
                  <RemotionPlayerWrapper plan={plan} className="rounded-xl overflow-hidden" />
                ) : (
                  <div className="aspect-video bg-muted/50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No video plan available</p>
                    </div>
                  </div>
                )}

                {plan && (
                  <div className="mt-4 p-4 glass-card bg-primary/5 border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Tip:</strong> Use the player controls to play, pause, and scrub through the video. 
                      The preview renders in real-time using Remotion.
                    </p>
                  </div>
                )}
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
                  <SceneTimeline
                    scenes={scenes}
                    totalDuration={totalDuration}
                    activeSceneId={activeSceneId}
                    onSceneSelect={setActiveSceneId}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No scenes in this plan</p>
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
                {project.generated_code ? (
                  <CodePreview code={project.generated_code} />
                ) : (
                  <div className="text-center py-12">
                    <Code className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Generate Remotion Code</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get the exportable React/Remotion code for this video
                    </p>
                    <Button
                      onClick={handleGenerateCode}
                      disabled={generateCodeMutation.isPending}
                      className="gap-2"
                    >
                      {generateCodeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Generate Exportable Code
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Video Exporter Modal */}
      <AnimatePresence>
        {showExporter && plan && (
          <VideoExporter plan={plan} projectId={id} onClose={() => setShowExporter(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
