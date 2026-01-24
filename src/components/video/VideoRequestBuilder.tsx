import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Palette, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoRequestBuilderProps {
  onPlanGenerated?: (planId: string) => void;
}

const stylePresets = [
  { id: 'dark-web', name: 'Dark Web', colors: ['#0a0e27', '#1a1a2e', '#53a8ff'] },
  { id: 'corporate', name: 'Corporate', colors: ['#ffffff', '#1a1a2e', '#3b82f6'] },
  { id: 'neon', name: 'Neon', colors: ['#0d0d0d', '#ff00ff', '#00ffff'] },
  { id: 'minimal', name: 'Minimal', colors: ['#fafafa', '#171717', '#737373'] },
  { id: 'gradient', name: 'Gradient', colors: ['#667eea', '#764ba2', '#f43f5e'] },
  { id: 'nature', name: 'Nature', colors: ['#f0fdf4', '#166534', '#84cc16'] },
];

export function VideoRequestBuilder({ onPlanGenerated }: VideoRequestBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([10]);
  const [selectedStyle, setSelectedStyle] = useState('dark-web');
  const [generating, setGenerating] = useState(false);

  const generatePlan = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-video-plan', {
        body: {
          prompt: prompt.trim(),
          duration: duration[0],
          style: selectedStyle,
        }
      });

      if (error) throw error;

      toast.success('Video plan generated!');
      onPlanGenerated?.(data.planId);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate video plan');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prompt Input */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Wand2 className="w-4 h-4 text-primary" />
          Describe Your Video
        </Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a 10-second product showcase video with a dark futuristic dashboard, glowing blue accents, smooth fade-in animations, and professional typography..."
          className="min-h-[150px] bg-input/50 border-border focus:border-primary resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Be specific about scenes, animations, colors, and timing for best results.
        </p>
      </div>

      {/* Duration Slider */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          Duration: {duration[0]} seconds
        </Label>
        <Slider
          value={duration}
          onValueChange={setDuration}
          min={5}
          max={60}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5s</span>
          <span>30s</span>
          <span>60s</span>
        </div>
      </div>

      {/* Style Presets */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-foreground">
          <Palette className="w-4 h-4 text-primary" />
          Visual Style
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stylePresets.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => setSelectedStyle(preset.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border transition-all ${
                selectedStyle === preset.id
                  ? 'border-primary bg-primary/10 glow-primary'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex gap-1 mb-3">
                {preset.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{preset.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generatePlan}
        disabled={generating || !prompt.trim()}
        className="w-full gap-2 h-12 text-base glow-primary"
      >
        {generating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {generating ? 'Generating Video Plan...' : 'Generate Video Plan'}
      </Button>
    </div>
  );
}
