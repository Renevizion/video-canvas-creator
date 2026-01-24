import { motion } from 'framer-motion';
import { Image, Loader2, CheckCircle, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AssetRequirement } from '@/types/video';

interface AssetPreviewProps {
  assets: (AssetRequirement & { generatedUrl?: string; generating?: boolean })[];
  onRegenerate?: (assetId: string) => void;
  onDownload?: (assetId: string) => void;
}

export function AssetPreview({ assets, onRegenerate, onDownload }: AssetPreviewProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No assets required for this video</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Image className="w-4 h-4 text-primary" />
        Generated Assets
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            {/* Preview */}
            <div className="aspect-video bg-muted/50 relative">
              {asset.generating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground">Generating...</span>
                  </div>
                </div>
              ) : asset.generatedUrl ? (
                <>
                  <img
                    src={asset.generatedUrl}
                    alt={asset.description}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onRegenerate?.(asset.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDownload?.(asset.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-glow-success" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm text-foreground truncate mb-1">
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {asset.description}
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                {asset.specifications.width}×{asset.specifications.height}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
