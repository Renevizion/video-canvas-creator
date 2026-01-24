import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Save, Plus, Trash2, Settings2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SortableScene } from './SortableScene';
import { ElementEditor } from './ElementEditor';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import type { VideoPlan, PlannedScene, PlannedElement } from '@/types/video';
import { toast } from 'sonner';

interface VisualEditorProps {
  plan: VideoPlan;
  onPlanChange: (plan: VideoPlan) => void;
  onSave?: () => void;
}

export function VisualEditor({ plan, onPlanChange, onSave }: VisualEditorProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    plan.scenes[0]?.id || null
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedScene = plan.scenes.find((s) => s.id === selectedSceneId);
  const selectedElement = selectedScene?.elements?.find((e) => e.id === selectedElementId);

  // Handle drag end for scene reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = plan.scenes.findIndex((s) => s.id === active.id);
        const newIndex = plan.scenes.findIndex((s) => s.id === over.id);

        const newScenes = arrayMove(plan.scenes, oldIndex, newIndex);
        
        // Recalculate start times
        let currentTime = 0;
        const updatedScenes = newScenes.map((scene) => {
          const updated = { ...scene, startTime: currentTime };
          currentTime += scene.duration;
          return updated;
        });

        onPlanChange({ ...plan, scenes: updatedScenes });
        toast.success('Scenes reordered');
      }
    },
    [plan, onPlanChange]
  );

  // Update scene
  const updateScene = useCallback(
    (sceneId: string, updates: Partial<PlannedScene>) => {
      const newScenes = plan.scenes.map((s) =>
        s.id === sceneId ? { ...s, ...updates } : s
      );
      
      // Recalculate timings if duration changed
      if (updates.duration !== undefined) {
        let currentTime = 0;
        const timedScenes = newScenes.map((scene) => {
          const updated = { ...scene, startTime: currentTime };
          currentTime += scene.duration;
          return updated;
        });
        onPlanChange({ ...plan, scenes: timedScenes, duration: currentTime });
      } else {
        onPlanChange({ ...plan, scenes: newScenes });
      }
    },
    [plan, onPlanChange]
  );

  // Update element
  const updateElement = useCallback(
    (sceneId: string, elementId: string, updates: Partial<PlannedElement>) => {
      const newScenes = plan.scenes.map((scene) => {
        if (scene.id !== sceneId) return scene;
        return {
          ...scene,
          elements: scene.elements?.map((el) =>
            el.id === elementId ? { ...el, ...updates } : el
          ),
        };
      });
      onPlanChange({ ...plan, scenes: newScenes });
    },
    [plan, onPlanChange]
  );

  // Add new scene
  const addScene = useCallback(() => {
    const newScene: PlannedScene = {
      id: `scene-${Date.now()}`,
      startTime: plan.duration,
      duration: 3,
      description: 'New Scene',
      elements: [],
      animations: [],
      transition: null,
    };
    onPlanChange({
      ...plan,
      scenes: [...plan.scenes, newScene],
      duration: plan.duration + 3,
    });
    setSelectedSceneId(newScene.id);
    toast.success('Scene added');
  }, [plan, onPlanChange]);

  // Delete scene
  const deleteScene = useCallback(
    (sceneId: string) => {
      if (plan.scenes.length <= 1) {
        toast.error('Cannot delete the only scene');
        return;
      }
      const newScenes = plan.scenes.filter((s) => s.id !== sceneId);
      let currentTime = 0;
      const timedScenes = newScenes.map((scene) => {
        const updated = { ...scene, startTime: currentTime };
        currentTime += scene.duration;
        return updated;
      });
      onPlanChange({ ...plan, scenes: timedScenes, duration: currentTime });
      if (selectedSceneId === sceneId) {
        setSelectedSceneId(timedScenes[0]?.id || null);
      }
      toast.success('Scene deleted');
    },
    [plan, onPlanChange, selectedSceneId]
  );

  // Add element to scene
  const addElement = useCallback(
    (type: PlannedElement['type']) => {
      if (!selectedSceneId) return;
      
      const newElement: PlannedElement = {
        id: `element-${Date.now()}`,
        type,
        content: type === 'text' ? 'New Text' : type === 'shape' ? 'Card' : '',
        position: { x: 50, y: 50, z: 1 },
        size: { width: type === 'text' ? 80 : 30, height: type === 'text' ? 10 : 20 },
        style: type === 'text' 
          ? { fontSize: 48, fontWeight: 700, color: '#ffffff' }
          : { background: 'rgba(255,255,255,0.1)', borderRadius: 16 },
        animation: { type: 'fade', duration: 0.5, delay: 0, name: 'fadeIn', easing: 'ease-out', properties: {} },
      };
      
      updateScene(selectedSceneId, {
        elements: [...(selectedScene?.elements || []), newElement],
      });
      setSelectedElementId(newElement.id);
      toast.success(`${type} element added`);
    },
    [selectedSceneId, selectedScene, updateScene]
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Panel - Scene List */}
      <div className="w-72 flex flex-col glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Scenes
          </h3>
          <Button size="sm" variant="ghost" onClick={addScene}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={plan.scenes.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex-1 overflow-y-auto space-y-2">
              {plan.scenes.map((scene, idx) => (
                <SortableScene
                  key={scene.id}
                  scene={scene}
                  index={idx}
                  isSelected={selectedSceneId === scene.id}
                  onSelect={() => {
                    setSelectedSceneId(scene.id);
                    setSelectedElementId(null);
                  }}
                  onDelete={() => deleteScene(scene.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Center - Preview */}
      <div className="flex-1 flex flex-col glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Live Preview</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="ghost">
              <RotateCcw className="w-4 h-4" />
            </Button>
            {onSave && (
              <Button size="sm" onClick={onSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-black/50 rounded-xl overflow-hidden">
          <RemotionPlayerWrapper plan={plan} className="h-full" />
        </div>

        {/* Add Element Buttons */}
        {selectedSceneId && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground mr-2">Add:</span>
            <Button size="sm" variant="outline" onClick={() => addElement('text')}>
              Text
            </Button>
            <Button size="sm" variant="outline" onClick={() => addElement('shape')}>
              Shape
            </Button>
            <Button size="sm" variant="outline" onClick={() => addElement('image')}>
              Image
            </Button>
          </div>
        )}
      </div>

      {/* Right Panel - Properties */}
      <div className="w-80 glass-card p-4 overflow-y-auto">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Settings2 className="w-4 h-4" />
          Properties
        </h3>

        {selectedScene && !selectedElementId && (
          <SceneProperties
            scene={selectedScene}
            onUpdate={(updates) => updateScene(selectedScene.id, updates)}
          />
        )}

        {selectedScene && selectedElementId && selectedElement && (
          <ElementEditor
            element={selectedElement}
            onUpdate={(updates) =>
              updateElement(selectedScene.id, selectedElementId, updates)
            }
            onClose={() => setSelectedElementId(null)}
          />
        )}

        {!selectedScene && (
          <p className="text-sm text-muted-foreground">Select a scene to edit</p>
        )}

        {/* Element List */}
        {selectedScene && selectedScene.elements && selectedScene.elements.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Elements</h4>
            <div className="space-y-2">
              {selectedScene.elements.map((el) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                    selectedElementId === el.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/30 text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="capitalize">{el.type}</span>
                  {el.content && (
                    <span className="text-muted-foreground ml-2 truncate">
                      - {el.content.slice(0, 20)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Scene Properties Panel
function SceneProperties({
  scene,
  onUpdate,
}: {
  scene: PlannedScene;
  onUpdate: (updates: Partial<PlannedScene>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Input
          value={scene.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Duration: {scene.duration.toFixed(1)}s
        </Label>
        <Slider
          value={[scene.duration]}
          onValueChange={([val]) => onUpdate({ duration: val })}
          min={0.5}
          max={30}
          step={0.5}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Start Time: {scene.startTime.toFixed(1)}s
        </Label>
        <p className="text-xs text-muted-foreground/60 mt-1">
          (Calculated from scene order)
        </p>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Transition</Label>
        <select
          value={scene.transition?.type || 'cut'}
          onChange={(e) =>
            onUpdate({
              transition:
                e.target.value === 'cut'
                  ? null
                  : { type: e.target.value as 'fade' | 'wipe' | 'zoom', duration: 0.5 },
            })
          }
          className="w-full mt-1 p-2 rounded-lg bg-muted/50 border border-border text-sm"
        >
          <option value="cut">Cut</option>
          <option value="fade">Fade</option>
          <option value="wipe">Wipe</option>
          <option value="zoom">Zoom</option>
        </select>
      </div>
    </div>
  );
}
