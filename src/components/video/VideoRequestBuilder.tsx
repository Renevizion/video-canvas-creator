import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Palette, Sparkles, Loader2, Globe, X, Monitor, Smartphone, Square, Image, Paintbrush, Layers, Film, Box, Zap, Coffee, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useGenerateVideoPlan } from '@/hooks/useVideoData';
import { toast } from 'sonner';

import type { VideoPattern } from '@/types/video';

interface VideoRequestBuilderProps {
  onPlanGenerated?: (planId: string) => void;
  referencePattern?: VideoPattern;
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

type AspectRatioType = 'landscape' | 'portrait' | 'square';
type ImageStyleType = 'illustration' | 'isometric' | 'realistic' | 'cartoon' | '3d-render' | 'minimal';
type VideoType = 'auto' | 'motion-graphics' | 'product' | 'tech' | 'lifestyle' | 'explainer';

const aspectRatioPresets = [
  { id: 'landscape' as AspectRatioType, name: 'YouTube', icon: Monitor, dimensions: '1920×1080', ratio: '16:9' },
  { id: 'portrait' as AspectRatioType, name: 'TikTok/Reels', icon: Smartphone, dimensions: '1080×1920', ratio: '9:16' },
  { id: 'square' as AspectRatioType, name: 'Instagram', icon: Square, dimensions: '1080×1080', ratio: '1:1' },
];

const stylePresets = [
  { id: 'dark-web', name: 'Dark Web', colors: ['#0a0e27', '#1a1a2e', '#53a8ff'] },
  { id: 'corporate', name: 'Corporate', colors: ['#ffffff', '#1a1a2e', '#3b82f6'] },
  { id: 'neon', name: 'Neon', colors: ['#0d0d0d', '#ff00ff', '#00ffff'] },
  { id: 'minimal', name: 'Minimal', colors: ['#fafafa', '#171717', '#737373'] },
  { id: 'gradient', name: 'Gradient', colors: ['#667eea', '#764ba2', '#f43f5e'] },
  { id: 'nature', name: 'Nature', colors: ['#f0fdf4', '#166534', '#84cc16'] },
];

const imageStylePresets: { id: ImageStyleType; name: string; description: string }[] = [
  { id: 'illustration', name: 'Illustration', description: 'Flat, clean vector style' },
  { id: 'isometric', name: 'Isometric', description: '3D-like angled view' },
  { id: 'realistic', name: 'Realistic', description: 'Photo-realistic imagery' },
  { id: 'cartoon', name: 'Cartoon', description: 'Fun, playful style' },
  { id: '3d-render', name: '3D Render', description: 'Polished 3D graphics' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, iconic shapes' },
];

const videoTypePresets: { id: VideoType; name: string; description: string; icon: React.ElementType; suggestImages: boolean }[] = [
  { id: 'auto', name: 'Auto-Detect', description: 'AI chooses best approach', icon: Zap, suggestImages: true },
  { id: 'motion-graphics', name: 'Motion Graphics', description: 'Abstract shapes & typography', icon: Layers, suggestImages: false },
  { id: 'product', name: 'Product Showcase', description: 'Hero shots & close-ups', icon: Box, suggestImages: true },
  { id: 'tech', name: 'Tech/SaaS', description: 'Code, terminals & mockups', icon: Code, suggestImages: false },
  { id: 'lifestyle', name: 'Lifestyle/Brand', description: 'Cinematic imagery', icon: Coffee, suggestImages: true },
  { id: 'explainer', name: 'Explainer', description: 'Icons & step-by-step', icon: Film, suggestImages: true },
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

export function VideoRequestBuilder({ onPlanGenerated, referencePattern }: VideoRequestBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([10]);
  const [selectedStyle, setSelectedStyle] = useState('dark-web');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioType>('landscape');
  const [selectedVideoType, setSelectedVideoType] = useState<VideoType>('auto');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isExtractingBrand, setIsExtractingBrand] = useState(false);
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const [generateImages, setGenerateImages] = useState(false);
  const [imageStyle, setImageStyle] = useState<ImageStyleType>('realistic');
  
  const generateMutation = useGenerateVideoPlan();

  // Auto-enable images for video types that benefit from them
  useEffect(() => {
    const preset = videoTypePresets.find(p => p.id === selectedVideoType);
    if (preset && selectedVideoType !== 'auto') {
      setGenerateImages(preset.suggestImages);
    }
  }, [selectedVideoType]);

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

    // Build enhanced prompt with video type context
    let enhancedPrompt = prompt.trim();
    if (selectedVideoType !== 'auto') {
      const typeHint = {
        'motion-graphics': '[Motion Graphics Style - abstract shapes, geometric animations, kinetic typography]',
        'product': '[Product Showcase - hero product shots, close-ups, cinematic angles]',
        'tech': '[Tech/SaaS Demo - code editors, terminals, laptop mockups, data viz]',
        'lifestyle': '[Lifestyle/Brand - cinematic imagery, emotional storytelling, atmospheric]',
        'explainer': '[Explainer Video - step-by-step, icons, clear visual hierarchy]',
      }[selectedVideoType];
      enhancedPrompt = `${typeHint} ${enhancedPrompt}`;
    }

    try {
      const result = await generateMutation.mutateAsync({
        prompt: enhancedPrompt,
        duration: duration[0],
        style: brandData ? 'brand' : selectedStyle,
        brandData: brandData ? (brandData as unknown as Record<string, unknown>) : undefined,
        aspectRatio: selectedAspectRatio,
        generateImages,
        imageStyle: generateImages ? imageStyle : undefined,
        referencePattern: referencePattern as unknown as Record<string, unknown> | undefined,
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

      {/* Aspect Ratio Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Monitor className="w-4 h-4 text-primary" />
          Aspect Ratio
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {aspectRatioPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <motion.button
                key={preset.id}
                onClick={() => setSelectedAspectRatio(preset.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                  selectedAspectRatio === preset.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{preset.name}</span>
                <span className="text-[10px] text-muted-foreground">{preset.ratio}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Video Type Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <Film className="w-4 h-4 text-primary" />
          Video Type
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {videoTypePresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <motion.button
                key={preset.id}
                onClick={() => setSelectedVideoType(preset.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                  selectedVideoType === preset.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] font-medium">{preset.name}</span>
                <span className="text-[9px] text-muted-foreground text-center leading-tight">{preset.description}</span>
              </motion.button>
            );
          })}
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

      {/* AI Image Generation Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-foreground">
            <Image className="w-4 h-4 text-primary" />
            Generate AI Images
          </Label>
          <Switch
            checked={generateImages}
            onCheckedChange={setGenerateImages}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Creates product visuals, icons, and branded assets using AI. Uses extra tokens.
        </p>
        
        {/* Image Style Options - only show when toggle is on */}
        {generateImages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-2"
          >
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Paintbrush className="w-3 h-3" />
              Image Style
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {imageStylePresets.map((preset) => (
                <motion.button
                  key={preset.id}
                  onClick={() => setImageStyle(preset.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 rounded-lg border transition-all text-left ${
                    imageStyle === preset.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <span className="text-xs font-medium block">{preset.name}</span>
                  <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

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
