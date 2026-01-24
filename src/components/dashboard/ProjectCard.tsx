import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, AlertCircle, Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VideoStatus } from '@/types/video';

interface ProjectCardProps {
  id: string;
  name: string;
  status: VideoStatus;
  thumbnail?: string;
  duration?: number;
  createdAt: string;
  onOpen?: () => void;
}

const statusConfig: Record<VideoStatus, { icon: React.ElementType; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: 'text-muted-foreground' },
  analyzing: { icon: Loader2, label: 'Analyzing', color: 'text-primary animate-spin' },
  generating_assets: { icon: Loader2, label: 'Generating Assets', color: 'text-accent animate-spin' },
  generating_code: { icon: Loader2, label: 'Generating Code', color: 'text-primary animate-spin' },
  rendering: { icon: Loader2, label: 'Rendering', color: 'text-glow-warning animate-spin' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-glow-success' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-destructive' },
};

export function ProjectCard({ id, name, status, thumbnail, duration, createdAt, onOpen }: ProjectCardProps) {
  const StatusIcon = statusConfig[status].icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass-card overflow-hidden group cursor-pointer"
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted/50 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid-pattern flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary/50" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="secondary" className="gap-2">
            <Play className="w-4 h-4" />
            Open Project
          </Button>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-mono">
            {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground truncate flex-1">{name}</h3>
          <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${statusConfig[status].color}`} />
            <span className="text-xs text-muted-foreground">{statusConfig[status].label}</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
