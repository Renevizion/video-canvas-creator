import { motion } from 'framer-motion';
import { Play, Clock, Layers } from 'lucide-react';
import type { PlannedScene } from '@/types/video';

interface SceneTimelineProps {
  scenes: PlannedScene[];
  totalDuration: number;
  activeSceneId?: string;
  onSceneSelect?: (sceneId: string) => void;
}

export function SceneTimeline({ scenes, totalDuration, activeSceneId, onSceneSelect }: SceneTimelineProps) {
  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Scene Timeline
        </h3>
        <span className="text-sm text-muted-foreground font-mono">
          {totalDuration}s total
        </span>
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Time ruler */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 px-1">
          <span>0s</span>
          <span>{Math.floor(totalDuration / 4)}s</span>
          <span>{Math.floor(totalDuration / 2)}s</span>
          <span>{Math.floor((totalDuration * 3) / 4)}s</span>
          <span>{totalDuration}s</span>
        </div>

        {/* Scene blocks */}
        <div className="relative h-16 bg-muted/30 rounded-lg overflow-hidden">
          {scenes.map((scene, index) => {
            const left = (scene.startTime / totalDuration) * 100;
            const width = (scene.duration / totalDuration) * 100;
            const isActive = scene.id === activeSceneId;

            return (
              <motion.button
                key={scene.id}
                onClick={() => onSceneSelect?.(scene.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`absolute top-1 bottom-1 rounded-lg transition-all ${
                  isActive
                    ? 'ring-2 ring-primary glow-primary z-10'
                    : 'hover:ring-1 hover:ring-primary/50'
                }`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: `hsl(${(index * 60) % 360} 70% 50% / 0.4)`,
                }}
              >
                <div className="px-2 py-1 h-full flex flex-col justify-center overflow-hidden">
                  <span className="text-xs font-medium text-foreground truncate">
                    Scene {index + 1}
                  </span>
                  <span className="text-[10px] text-foreground/70 truncate">
                    {scene.duration}s
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scene list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {scenes.map((scene, index) => (
          <motion.button
            key={scene.id}
            onClick={() => onSceneSelect?.(scene.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              scene.id === activeSceneId
                ? 'bg-primary/10 border border-primary'
                : 'bg-card/50 border border-transparent hover:border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  Scene {index + 1}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {scene.description || 'No description'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Clock className="w-3 h-3" />
                {scene.duration}s
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
