import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { VideoRequestBuilder } from '@/components/video/VideoRequestBuilder';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

const Create = () => {
  const navigate = useNavigate();
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<VideoPlan | null>(null);

  const handlePlanGenerated = async (planId: string) => {
    setCurrentPlanId(planId);
    
    const { data } = await supabase
      .from('video_plans')
      .select('plan')
      .eq('id', planId)
      .single();
    
    if (data?.plan) {
      setCurrentPlan(data.plan as unknown as VideoPlan);
      toast.success('Video generated! Check the preview.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          {/* Back */}
          <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Request Builder */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Create Video</h1>
                    <p className="text-sm text-muted-foreground">AI-powered video generation</p>
                  </div>
                </div>

                <VideoRequestBuilder onPlanGenerated={handlePlanGenerated} />
              </motion.div>
            </div>

            {/* Right: Preview */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 sticky top-20"
              >
                <h3 className="font-semibold mb-4">Preview</h3>
                
                {currentPlan ? (
                  <div className="space-y-4">
                    <RemotionPlayerWrapper plan={currentPlan} className="rounded-xl overflow-hidden" />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/editor/${currentPlanId}`)}
                      >
                        Edit Video
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/project/${currentPlanId}`)}
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Preview will appear here</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
