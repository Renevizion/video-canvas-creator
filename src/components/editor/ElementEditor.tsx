import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PlannedElement, AnimationPattern } from '@/types/video';

interface ElementEditorProps {
  element: PlannedElement;
  onUpdate: (updates: Partial<PlannedElement>) => void;
  onClose: () => void;
}

export function ElementEditor({ element, onUpdate, onClose }: ElementEditorProps) {
  const style = element.style as Record<string, unknown>;
  const animation = element.animation as AnimationPattern | undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground capitalize">{element.type} Element</h4>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Shape Type Selector (NEW) */}
      {element.type === 'shape' && (
        <div>
          <Label className="text-xs text-muted-foreground">Shape Type</Label>
          <Select
            value={element.content || 'card'}
            onValueChange={(value) => onUpdate({ content: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select shape type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card (Glassmorphic)</SelectItem>
              <SelectItem value="button">Button (CTA)</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="rect">Rectangle</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
              <SelectItem value="star">Star</SelectItem>
              <SelectItem value="polygon">Polygon/Hexagon</SelectItem>
              <SelectItem value="device">Device/Phone</SelectItem>
              <SelectItem value="globe">Globe/World</SelectItem>
              <SelectItem value="arrow">Arrow</SelectItem>
              <SelectItem value="cursor">Cursor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Content */}
      {element.type === 'text' && (
        <div>
          <Label className="text-xs text-muted-foreground">Content</Label>
          <Input
            value={element.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="mt-1"
          />
        </div>
      )}

      {/* Position */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">X: {element.position.x}%</Label>
          <Slider
            value={[element.position.x]}
            onValueChange={([x]) => onUpdate({ position: { ...element.position, x } })}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Y: {element.position.y}%</Label>
          <Slider
            value={[element.position.y]}
            onValueChange={([y]) => onUpdate({ position: { ...element.position, y } })}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      {/* Size */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Width: {element.size.width}%</Label>
          <Slider
            value={[element.size.width]}
            onValueChange={([width]) => onUpdate({ size: { ...element.size, width } })}
            min={5}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Height: {element.size.height}%</Label>
          <Slider
            value={[element.size.height]}
            onValueChange={([height]) => onUpdate({ size: { ...element.size, height } })}
            min={5}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      {/* Text-specific properties */}
      {element.type === 'text' && (
        <>
          <div>
            <Label className="text-xs text-muted-foreground">
              Font Size: {(style.fontSize as number) || 48}px
            </Label>
            <Slider
              value={[(style.fontSize as number) || 48]}
              onValueChange={([fontSize]) =>
                onUpdate({ style: { ...style, fontSize } })
              }
              min={12}
              max={200}
              step={2}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Color</Label>
            <Input
              type="color"
              value={(style.color as string) || '#ffffff'}
              onChange={(e) => onUpdate({ style: { ...style, color: e.target.value } })}
              className="mt-1 h-10 p-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Font Weight</Label>
            <select
              value={(style.fontWeight as number) || 700}
              onChange={(e) =>
                onUpdate({ style: { ...style, fontWeight: Number(e.target.value) } })
              }
              className="w-full mt-1 p-2 rounded-lg bg-muted/50 border border-border text-sm"
            >
              <option value={400}>Regular</option>
              <option value={500}>Medium</option>
              <option value={600}>Semibold</option>
              <option value={700}>Bold</option>
              <option value={800}>Extra Bold</option>
            </select>
          </div>
        </>
      )}

      {/* Shape-specific properties */}
      {element.type === 'shape' && (
        <>
          <div>
            <Label className="text-xs text-muted-foreground">Shape Color</Label>
            <Input
              type="color"
              value={(style.color as string) || '#06b6d4'}
              onChange={(e) => onUpdate({ style: { ...style, color: e.target.value } })}
              className="mt-1 h-10 p-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Background</Label>
            <Input
              value={(style.background as string) || 'rgba(255,255,255,0.1)'}
              onChange={(e) => onUpdate({ style: { ...style, background: e.target.value } })}
              className="mt-1"
              placeholder="rgba(255,255,255,0.1) or #hex"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Border Radius: {(style.borderRadius as number) || 16}px
            </Label>
            <Slider
              value={[(style.borderRadius as number) || 16]}
              onValueChange={([borderRadius]) =>
                onUpdate({ style: { ...style, borderRadius } })
              }
              min={0}
              max={100}
              step={2}
              className="mt-2"
            />
          </div>
        </>
      )}

      {/* Animation */}
      <div className="pt-4 border-t border-border/50">
        <Label className="text-xs text-muted-foreground">Animation Pattern</Label>
        <Select
          value={animation?.pattern || 'fadeIn'}
          onValueChange={(value) =>
            onUpdate({
              animation: {
                ...animation,
                pattern: value,
                type: value.includes('slide') ? 'slide' : value.includes('scale') || value.includes('pop') ? 'scale' : value.includes('rotate') ? 'rotate' : 'fade',
                duration: animation?.duration || 0.5,
                delay: animation?.delay || 0,
                name: value,
                easing: 'ease-out',
                properties: {},
              } as AnimationPattern,
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fadeIn">Fade In</SelectItem>
            <SelectItem value="slideInLeft">Slide In Left (Motion Blur)</SelectItem>
            <SelectItem value="slideInRight">Slide In Right (Motion Blur)</SelectItem>
            <SelectItem value="slideInUp">Slide In Up (Motion Blur)</SelectItem>
            <SelectItem value="slideInDown">Slide In Down (Motion Blur)</SelectItem>
            <SelectItem value="scale">Scale/Pop In</SelectItem>
            <SelectItem value="rotate">Rotate (Motion Blur)</SelectItem>
            <SelectItem value="spin">Spin (Motion Blur)</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
            <SelectItem value="float">Float</SelectItem>
            <SelectItem value="glow">Glow</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground/70 mt-1">
          * Motion Blur applied to fast animations automatically
        </p>
      </div>

      {animation && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              Delay: {(animation?.delay || 0).toFixed(1)}s
            </Label>
            <Slider
              value={[animation?.delay || 0]}
              onValueChange={([delay]) =>
                onUpdate({
                  animation: { ...animation, delay } as AnimationPattern,
                })
              }
              min={0}
              max={5}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              Duration: {(animation?.duration || 0.5).toFixed(1)}s
            </Label>
            <Slider
              value={[animation?.duration || 0.5]}
              onValueChange={([duration]) =>
                onUpdate({
                  animation: { ...animation, duration } as AnimationPattern,
                })
              }
              min={0.1}
              max={3}
              step={0.1}
              className="mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
