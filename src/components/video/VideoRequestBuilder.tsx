import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Palette, Sparkles, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebsiteBrandExtractor } from './WebsiteBrandExtractor';
import { useGenerateVideoPlan } from '@/hooks/useVideoData';

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

export function VideoRequestBuilder({ onPlanGenerated }: VideoRequestBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([10]);
  const [selectedStyle, setSelectedStyle] = useState('dark-web');
  const [inputMode, setInputMode] = useState<'prompt' | 'website'>('prompt');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  
  const generateMutation = useGenerateVideoPlan();

  const handleBrandExtracted = (brand: BrandData) => {
    setBrandData(brand);
    // Auto-populate prompt with brand info
    const autoPrompt = `Create a video for ${brand.title || brand.domain}. 
${brand.description ? `Description: ${brand.description}` : ''}
${brand.copywriting?.headlines?.[0] ? `Main message: ${brand.copywriting.headlines[0]}` : ''}
${brand.copywriting?.ctas?.[0] ? `CTA: ${brand.copywriting.ctas[0]}` : ''}`;
    setPrompt(autoPrompt);
  };

  const generatePlan = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generateMutation.mutateAsync({
        prompt: prompt.trim(),
        duration: duration[0],
        style: selectedStyle,
        brandData: brandData ? (brandData as unknown as Record<string, unknown>) : undefined,
      });
      
      if (result?.planId) {
        onPlanGenerated?.(result.planId);
      }
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Tabs */}
      <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'prompt' | 'website')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Describe Video
          </TabsTrigger>
          <TabsTrigger value="website" className="gap-2">
            <Globe className="w-4 h-4" />
            From Website
          </TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="mt-6">
          <WebsiteBrandExtractor onBrandExtracted={handleBrandExtracted} />
        </TabsContent>

        <TabsContent value="prompt" className="mt-6 space-y-6">
          {/* Brand indicator */}
          {brandData && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex gap-1">
                {Object.values(brandData.colors).slice(0, 4).map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-sm text-primary font-medium">
                Using brand from {brandData.title || brandData.domain}
              </span>
              <button
                onClick={() => setBrandData(null)}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
          )}

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
              className="min-h-[120px] bg-input/50 border-border focus:border-primary resize-none"
            />
          </div>

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
            disabled={generateMutation.isPending || !prompt.trim()}
            className="w-full gap-2 h-11"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generateMutation.isPending ? 'Generating...' : 'Generate Video'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
