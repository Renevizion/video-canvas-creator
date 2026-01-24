import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { usePatterns } from '@/hooks/useVideoData';

const Patterns = () => {
  const navigate = useNavigate();
  const { data: patterns = [], isLoading } = usePatterns();

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-glow-success to-primary flex items-center justify-center mx-auto mb-6 glow-success">
              <Layers className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Learned Patterns
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Video patterns extracted from reference videos. Use these as templates for new videos.
            </p>
          </motion.div>

          {/* Patterns grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card aspect-[4/3] animate-pulse bg-muted/50" />
              ))}
            </div>
          ) : patterns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Layers className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No patterns yet</h3>
              <p className="text-muted-foreground mb-6">
                Analyze a reference video to create your first pattern
              </p>
              <Button onClick={() => navigate('/analyze')} className="gap-2">
                Analyze Video
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/create?pattern=${pattern.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted/50 relative">
                    {pattern.thumbnail_url ? (
                      <img
                        src={pattern.thumbnail_url}
                        alt={pattern.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid-pattern flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-glow-success/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-glow-success/50" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary">
                        Use Pattern
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{pattern.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {(pattern.pattern as any)?.scenes?.length || 0} scenes
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(pattern.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Patterns;
