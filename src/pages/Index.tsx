import { motion } from 'framer-motion';
import { Plus, Video, Sparkles, TrendingUp, Layers, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { useVideoPlans } from '@/hooks/useVideoData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useVideoPlans();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 text-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">AI Video Generation</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Create Videos</span> from Text or Websites
            </h1>

            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Describe your video or paste a website URL. AI extracts your brand and generates professional motion graphics.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/create')} className="gap-2">
                <Plus className="w-5 h-5" />
                Create Video
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/ultimate-showcase')} className="gap-2 border-primary/50 hover:bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
                See All Capabilities
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Showcase Banner */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/ultimate-showcase')}
            className="glass-card p-6 cursor-pointer group hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Ultimate Showcase
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Explore 12+ components, 20+ animations, 50+ styles, and more
                  </p>
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <main className="px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Recent Projects
            </h2>
            {projects.length > 6 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                View all →
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-10 text-center"
            >
              <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first AI video</p>
              <Button onClick={() => navigate('/create')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Video
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProjectCard
                    id={project.id}
                    name={project.prompt.slice(0, 40) + (project.prompt.length > 40 ? '...' : '')}
                    status={project.status}
                    createdAt={project.created_at}
                    onOpen={() => navigate(`/project/${project.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      </div>
    </div>
  );
};

export default Index;
