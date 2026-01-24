import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlannedScene } from '@/types/video';

interface SortableSceneProps {
  scene: PlannedScene;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableScene({
  scene,
  index,
  isSelected,
  onSelect,
  onDelete,
}: SortableSceneProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-primary/20 border-primary/50'
          : 'bg-muted/30 border-border/50 hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 rounded hover:bg-muted/50"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-medium text-sm text-foreground truncate">
            {scene.description || `Scene ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{scene.duration.toFixed(1)}s</span>
          <span>•</span>
          <span>{scene.elements?.length || 0} elements</span>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-3 h-3 text-destructive" />
      </Button>
    </div>
  );
}
