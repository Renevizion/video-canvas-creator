import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Palette, Sparkles, Loader2, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useGenerateVideoPlan } from '@/hooks/useVideoData';
import { toast } from 'sonner';

interface VideoRequestBuilderProps {
  onPlanGenerated?: (planId: string) => void;
}

interface BrandData {
  domain: string;
  title: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;
    heading: string;
    code: string;
  };
  logo: string;
  ogImage: string;
  screenshot: string;
  copywriting: {
    headlines: string[];
    taglines: string[];
    ctas: string[];
  };
}

const stylePresets = [
  { id: 'dark-web', name: 'Dark Web', colors: ['#0a0e27', '#1a1a2e', '#53a8ff'] },
  { id: 'corporate', name: 'Corporate', colors: ['#ffffff', '#1a1a2e', '#3b82f6'] },
  { id: 'neon', name: 'Neon', colors: ['#0d0d0d', '#ff00ff', '#00ffff'] },
  { id: 'minimal', name: 'Minimal', colors: ['#fafafa', '#171717', '#737373'] },
  { id: 'gradient', name: 'Gradient', colors: ['#667eea', '#764ba2', '#f43f5e'] },
  { id: 'nature', name: 'Nature', colors: ['#f0fdf4', '#166534', '#84cc16'] },
];

// Detect URL in prompt
const extractUrlFromPrompt = (text: string): string | null => {
  const urlMatch = text.match(/https?:\/\/[^\s"'<>]+/i);
  if (urlMatch) return urlMatch[0];
  
  // Also match domain-like patterns
  const domainMatch = text.match(/(?:^|\s)([a-zA-Z0-9][-a-zA-Z0-9]*(?:\.[a-zA-Z]{2,})+)(?:\s|$|\/)/);
  if (domainMatch) return domainMatch[1];
  
  return null;
};

export function VideoRequestBuilder({ onPlanGenerated }: VideoRequestBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([10]);
  const [selectedStyle, setSelectedStyle] = useState('dark-web');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isExtractingBrand, setIsExtractingBrand] = useState(false);
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  
  const generateMutation = useGenerateVideoPlan();

  // Detect URL in prompt as user types
  useEffect(() => {
    const url = extractUrlFromPrompt(prompt);
    setDetectedUrl(url);
  }, [prompt]);

  const extractBrand = useCallback(async (url: string) => {
    setIsExtractingBrand(true);
    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-brand', {
        body: { url },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to extract brand');

      setBrandData(data);
      toast.success(`Brand extracted from ${data.title || url}!`);
    } catch (error) {
      console.error('Brand extraction error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract brand');
    } finally {
      setIsExtractingBrand(false);
    }
  }, []);

  const generatePlan = async () => {
    if (!prompt.trim()) return;

    // If URL detected but no brand data, extract first
    if (detectedUrl && !brandData) {
      await extractBrand(detectedUrl);
    }

    try {
      const result = await generateMutation.mutateAsync({
        prompt: prompt.trim(),
        duration: duration[0],
        style: brandData ? 'brand' : selectedStyle,
        brandData: brandData ? (brandData as unknown as Record<string, unknown>) : undefined,
      });
      
      if (result?.planId) {
        onPlanGenerated?.(result.planId);
      }
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  const clearBrand = () => {
    setBrandData(null);
    toast.info('Brand cleared');
  };

  const isLoading = generateMutation.isPending || isExtractingBrand;

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Wand2 className="w-4 h-4 text-primary" />
          Describe Your Video
        </Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a 20 second commercial for mobajump.com using their brand colors and theme..."
          className="min-h-[120px] bg-input/50 border-border focus:border-primary resize-none"
        />
        
        {/* URL Detection Indicator */}
        {detectedUrl && !brandData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 border border-accent/20"
          >
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">
              Detected: <strong>{detectedUrl}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => extractBrand(detectedUrl)}
              disabled={isExtractingBrand}
              className="ml-auto text-xs h-7"
            >
              {isExtractingBrand ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : null}
              Extract Brand
            </Button>
          </motion.div>
        )}
      </div>

      {/* Brand Data Preview */}
      {brandData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{brandData.title || brandData.domain}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearBrand} className="h-7 w-7 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Color swatches */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {Object.values(brandData.colors).slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          {/* Typography */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Font:</span>
            <span className="text-xs font-medium">{brandData.fonts.primary}</span>
          </div>

          {/* Screenshot thumbnail */}
          {brandData.screenshot && (
            <div className="mt-2">
              <img
                src={brandData.screenshot.startsWith('data:') ? brandData.screenshot : `data:image/png;base64,${brandData.screenshot}`}
                alt="Website preview"
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Duration Slider */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          Duration: {duration[0]}s
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

      {/* Style Presets - only show if no brand data */}
      {!brandData && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-foreground">
            <Palette className="w-4 h-4 text-primary" />
            Visual Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {stylePresets.map((preset) => (
              <motion.button
                key={preset.id}
                onClick={() => setSelectedStyle(preset.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border transition-all ${
                  selectedStyle === preset.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  {preset.colors.map((color, i) => (
                    <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-xs font-medium">{preset.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generatePlan}
        disabled={isLoading || !prompt.trim()}
        className="w-full gap-2 h-11"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isExtractingBrand ? 'Extracting Brand...' : generateMutation.isPending ? 'Generating...' : 'Generate Video'}
      </Button>
    </div>
  );
}
