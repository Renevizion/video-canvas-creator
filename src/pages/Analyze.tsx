import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { VideoAnalyzer } from '@/components/video/VideoAnalyzer';
import { toast } from 'sonner';

const Analyze = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [patternId, setPatternId] = useState<string | null>(null);

  const handleAnalysisComplete = (id: string) => {
    setPatternId(id);
    setAnalysisComplete(true);
    toast.success('Pattern learned! You can now use it as a reference.');
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-3xl">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 glow-primary">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Analyze Reference Video
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload a video to extract patterns, timing, animations, and styles.
              The AI will learn from it so you can recreate similar videos.
            </p>
          </motion.div>

          {/* Analyzer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <VideoAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>

          {/* Success state */}
          {analysisComplete && patternId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-card p-6 border-glow-success glow-success"
            >
              <h3 className="font-semibold text-foreground mb-2">Pattern Learned!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The video pattern has been saved. You can now use it as a reference
                when creating new videos.
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <a href="/create">Create Video with Pattern</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/patterns/${patternId}`}>View Pattern Details</a>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                step: '1',
                title: 'Upload Video',
                desc: 'Drop or select a reference video file',
              },
              {
                step: '2',
                title: 'AI Analysis',
                desc: 'Gemini extracts patterns and timing',
              },
              {
                step: '3',
                title: 'Use Pattern',
                desc: 'Apply the learned style to new videos',
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-primary">{item.step}</span>
                </div>
                <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;
