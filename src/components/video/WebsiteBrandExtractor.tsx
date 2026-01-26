import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Loader2, ArrowRight, Palette, Type, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface WebsiteBrandExtractorProps {
  onBrandExtracted: (brand: BrandData) => void;
}

export const WebsiteBrandExtractor = ({ onBrandExtracted }: WebsiteBrandExtractorProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brandData, setBrandData] = useState<BrandData | null>(null);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setBrandData(null);

    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-brand', {
        body: { url },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to extract brand');
      }

      setBrandData(data);
      toast.success('Brand extracted successfully!');
    } catch (error) {
      console.error('Brand extraction error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to extract brand. Make sure Firecrawl is connected in Settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseBrand = () => {
    if (brandData) {
      onBrandExtracted(brandData);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., mobajump.com)"
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
          />
        </div>
        <Button onClick={handleExtract} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          Extract Brand
        </Button>
      </div>

      {/* Brand Preview */}
      {brandData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{brandData.title || brandData.domain}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{brandData.description}</p>
            </div>
            {brandData.logo && (
              <img src={brandData.logo} alt="Logo" className="h-10 w-auto object-contain" />
            )}
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Colors</span>
            </div>
            <div className="flex gap-2">
              {Object.entries(brandData.colors).map(([name, color]) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Typography</span>
            </div>
            <div className="flex gap-4">
              {Object.entries(brandData.fonts).map(([type, font]) => (
                <div key={type} className="text-sm">
                  <span className="text-muted-foreground capitalize">{type}:</span>{' '}
                  <span className="font-medium">{font}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copywriting */}
          {brandData.copywriting?.headlines?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Key Messages</span>
              </div>
              <div className="space-y-2">
                {brandData.copywriting.headlines.slice(0, 3).map((headline, i) => (
                  <p key={i} className="text-sm bg-muted/50 rounded px-3 py-2">
                    {headline}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot Preview */}
          {brandData.screenshot && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Screenshot</span>
              </div>
              <img
                src={`data:image/png;base64,${brandData.screenshot}`}
                alt="Website screenshot"
                className="w-full rounded-lg border border-border"
              />
            </div>
          )}

          {/* Use Brand Button */}
          <Button onClick={handleUseBrand} className="w-full gap-2">
            <ArrowRight className="w-4 h-4" />
            Use This Brand for Video
          </Button>
        </motion.div>
      )}
    </div>
  );
};
