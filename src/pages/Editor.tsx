import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { AIEditChat } from '@/components/editor/AIEditChat';
import { supabase } from '@/integrations/supabase/client';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<VideoPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
    
    // Cleanup on unmount
    return () => {
      setPlan(null);
    };
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
      toast.error('Failed to save');
      console.error(error);
    } else {
      toast.success('Saved!');
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

  if (!plan || !id) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-xl border-b border-border z-40 flex items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/project/${id}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </header>

      {/* Editor - full height */}
      <main className="pt-14 h-screen">
        <VisualEditor
          plan={plan}
          onPlanChange={handlePlanChange}
          onSave={handleSave}
        />
      </main>

      {/* AI Edit Chat */}
      <AIEditChat
        planId={id}
        currentPlan={plan}
        onPlanUpdate={(newPlan) => {
          // Immediately update local state for instant preview refresh
          setPlan({ ...newPlan });
          toast.success('Preview updated with AI changes');
        }}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />
    </div>
  );
};

export default Editor;
