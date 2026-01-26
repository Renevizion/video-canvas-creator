import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Play, Sparkles, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import type { StoredPattern, VideoPattern } from '@/types/video';
import { toast } from 'sonner';

const PatternDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pattern, setPattern] = useState<StoredPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPattern();
    }
  }, [id]);

  const fetchPattern = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from('video_patterns')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      setError('Failed to load pattern');
      toast.error('Failed to load pattern');
      setLoading(false);
      return;
    }

    if (!data) {
      setError('Pattern not found');
      setLoading(false);
      return;
    }

    const storedPattern: StoredPattern = {
      id: data.id,
      name: data.name,
      pattern: data.pattern as unknown as VideoPattern,
      thumbnail_url: data.thumbnail_url,
      created_at: data.created_at || new Date().toISOString(),
    };

    setPattern(storedPattern);
    setLoading(false);
  };

  const handleUsePattern = () => {
    navigate(`/create?patternId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="min-h-screen bg-background noise-bg">
        <Header />
        <main className="pt-24 px-4 pb-12">
          <div className="container mx-auto max-w-3xl text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">{error || 'Pattern not found'}</h1>
            <p className="text-muted-foreground mb-6">
              The pattern you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={() => navigate('/patterns')}>
              View All Patterns
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const patternData = pattern.pattern;
  const sceneCount = patternData?.scenes?.length || 0;
  const duration = patternData?.duration || 0;
  const fps = patternData?.fps || 30;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/patterns')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Patterns
          </Button>

          {/* Pattern Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex items-start gap-6">
              {/* Thumbnail */}
              <div className="w-48 h-28 rounded-xl bg-muted/50 overflow-hidden flex-shrink-0">
                {pattern.thumbnail_url ? (
                  <img 
                    src={pattern.thumbnail_url} 
                    alt={pattern.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">{pattern.name}</h1>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyzed on {new Date(pattern.created_at).toLocaleDateString()} at {new Date(pattern.created_at).toLocaleTimeString()}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    {sceneCount} scenes
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {duration}s @ {fps}fps
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button 
                onClick={handleUsePattern}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Sparkles className="w-4 h-4" />
                Use This Pattern
              </Button>
            </div>
          </motion.div>

          {/* Pattern Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Palette */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Color Palette</h3>
              <div className="flex gap-2 flex-wrap">
                {patternData?.globalStyles?.colorPalette?.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-lg border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-muted-foreground font-mono">{color}</span>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">No colors extracted</p>
                )}
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Typography</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Primary Font</span>
                  <p className="font-medium text-foreground">
                    {patternData?.globalStyles?.typography?.primary || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Secondary Font</span>
                  <p className="font-medium text-foreground">
                    {patternData?.globalStyles?.typography?.secondary || 'Not specified'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scenes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mt-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Scenes ({sceneCount})</h3>
            {patternData?.scenes?.length > 0 ? (
              <div className="space-y-3">
                {patternData.scenes.map((scene, i) => (
                  <div key={scene.id || i} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                          Scene {i + 1}
                        </span>
                        <p className="text-sm text-foreground mt-1">{scene.description || 'No description'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {scene.startTime}s - {scene.startTime + scene.duration}s
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No scenes extracted</p>
            )}
          </motion.div>

          {/* Raw JSON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mt-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Raw Pattern Data</h3>
            <pre className="p-4 rounded-xl bg-muted/30 border border-border/50 overflow-auto max-h-80 text-xs font-mono text-muted-foreground">
              {JSON.stringify(patternData, null, 2)}
            </pre>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PatternDetail;
