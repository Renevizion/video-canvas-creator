import { motion } from 'framer-motion';
import { Film, Video, Layers, Zap, TrendingUp, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import type { VideoProject } from '@/types/video';

// Demo data for initial state
const demoProjects: VideoProject[] = [
  {
    id: '1',
    prompt: 'Product showcase with dark dashboard and glowing elements',
    plan: null,
    generated_code: null,
    status: 'completed',
    reference_pattern_id: null,
    preview_url: null,
    final_video_url: null,
    error: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date().toISOString(),
  },
  {
    id: '2',
    prompt: 'SaaS landing page animation with feature highlights',
    plan: null,
    generated_code: null,
    status: 'rendering',
    reference_pattern_id: null,
    preview_url: null,
    final_video_url: null,
    error: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: null,
  },
  {
    id: '3',
    prompt: 'Mobile app demo with smooth transitions',
    plan: null,
    generated_code: null,
    status: 'pending',
    reference_pattern_id: null,
    preview_url: null,
    final_video_url: null,
    error: null,
    created_at: new Date().toISOString(),
    completed_at: null,
  },
];

const Index = () => {
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

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze reference videos, generate assets, and produce professional marketing videos
              using Remotion and AI-powered scene generation.
            </p>
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
              value="24"
              trend={{ value: 12, positive: true }}
              glowColor="primary"
            />
            <StatsCard
              icon={Layers}
              title="Learned Patterns"
              value="8"
              subtitle="from reference videos"
              glowColor="accent"
            />
            <StatsCard
              icon={Film}
              title="Assets Generated"
              value="156"
              trend={{ value: 23, positive: true }}
              glowColor="success"
            />
            <StatsCard
              icon={Clock}
              title="Avg. Render Time"
              value="2.4m"
              subtitle="per video"
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
              <a href="/projects" className="text-sm text-primary hover:underline">
                View all →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoProjects.map((project, index) => (
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
                  />
                </motion.div>
              ))}
            </div>
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
