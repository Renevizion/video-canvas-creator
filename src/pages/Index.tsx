import { motion } from 'framer-motion';
import { Film, Video, Layers, Zap, TrendingUp, Clock, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { useVideoPlans, usePatterns } from '@/hooks/useVideoData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useVideoPlans();
  const { data: patterns = [] } = usePatterns();

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const renderingCount = projects.filter(p => p.status === 'rendering' || p.status === 'generating_code').length;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">AI-Powered Video Generation</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Create Commercial Videos</span>
              <br />
              <span className="text-foreground">with AI</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Analyze reference videos, generate assets, and produce professional marketing videos
              using Remotion and AI-powered scene generation.
            </p>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2 glow-primary" onClick={() => navigate('/create')}>
                <Plus className="w-5 h-5" />
                Create New Video
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/analyze')}>
                Analyze Reference
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <StatsCard
              icon={Video}
              title="Videos Created"
              value={projects.length}
              trend={projects.length > 0 ? { value: 12, positive: true } : undefined}
              glowColor="primary"
            />
            <StatsCard
              icon={Layers}
              title="Learned Patterns"
              value={patterns.length}
              subtitle="from reference videos"
              glowColor="accent"
            />
            <StatsCard
              icon={Film}
              title="Completed"
              value={completedCount}
              trend={completedCount > 0 ? { value: 23, positive: true } : undefined}
              glowColor="success"
            />
            <StatsCard
              icon={Clock}
              title="In Progress"
              value={renderingCount}
              subtitle="currently rendering"
              glowColor="primary"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <div className="container mx-auto">
          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Projects
              </h2>
              {projects.length > 6 && (
                <a href="/projects" className="text-sm text-primary hover:underline">
                  View all →
                </a>
              )}
            </div>

            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card aspect-[4/3] animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI-generated video to get started
                </p>
                <Button onClick={() => navigate('/create')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Video
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <ProjectCard
                      id={project.id}
                      name={project.prompt.slice(0, 50) + (project.prompt.length > 50 ? '...' : '')}
                      status={project.status}
                      createdAt={project.created_at}
                      onOpen={() => navigate(`/project/${project.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Index;
