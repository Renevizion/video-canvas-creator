import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<VideoPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('video_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Project not found');
      navigate('/projects');
      return;
    }

    setPlan(data.plan as unknown as VideoPlan);
    setLoading(false);
  };

  const handlePlanChange = useCallback((newPlan: VideoPlan) => {
    setPlan(newPlan);
  }, []);

  const handleSave = async () => {
    if (!id || !plan) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('video_plans')
      .update({ plan: plan as any })
      .eq('id', id);

    if (error) {
      toast.error('Failed to save changes');
      console.error(error);
    } else {
      toast.success('Changes saved!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-20 px-4 pb-4">
        <div className="container mx-auto">
          {/* Back button */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/project/${id}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </Button>
            {saving && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            )}
          </div>

          {/* Visual Editor */}
          <VisualEditor
            plan={plan}
            onPlanChange={handlePlanChange}
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  );
};

export default Editor;
