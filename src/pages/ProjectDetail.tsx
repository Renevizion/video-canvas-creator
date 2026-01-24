import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Code, Layers, Image, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { SceneTimeline } from '@/components/video/SceneTimeline';
import { AssetPreview } from '@/components/video/AssetPreview';
import { CodePreview } from '@/components/video/CodePreview';
import { supabase } from '@/integrations/supabase/client';
import { useGenerateRemotionCode } from '@/hooks/useVideoData';
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
  const [activeTab, setActiveTab] = useState('scenes');
  const [activeSceneId, setActiveSceneId] = useState('');
  
  const generateCodeMutation = useGenerateRemotionCode();

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
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
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
              <div className="flex gap-2">
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
                {project.generated_code && (
                  <Button className="gap-2 glow-primary">
                    <Play className="w-4 h-4" />
                    Render Video
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Full prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="font-semibold text-foreground mb-2">Full Prompt</h3>
            <p className="text-muted-foreground">{project.prompt}</p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="scenes" className="gap-2">
                <Layers className="w-4 h-4" />
                Scenes
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2">
                <Image className="w-4 h-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="code" disabled={!project.generated_code} className="gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>

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
                  <div className="text-center py-12 text-muted-foreground">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No code generated yet</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
