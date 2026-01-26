/**
 * Scene Breakdown Component
 * 
 * Displays a collapsible breakdown of how the video was directed,
 * showing all the sophisticated features applied (camera paths, animations, etc.)
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Camera, Sparkles, Layers, Palette, Film, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EnhancedVideoPlan } from '@/services/SophisticatedVideoGenerator';

interface SceneBreakdownProps {
  videoPlan: EnhancedVideoPlan;
}

export const SceneBreakdown: React.FC<SceneBreakdownProps> = ({ videoPlan }) => {
  const [isOpen, setIsOpen] = useState(false);

  const metadata = videoPlan.sophisticatedMetadata;
  if (!metadata) {
    return null; // Don't show for non-sophisticated videos
  }

  const features = [
    {
      enabled: metadata.usesOrbitalCamera || metadata.usesForwardTracking,
      icon: Camera,
      title: 'Advanced Camera System',
      description: metadata.usesOrbitalCamera 
        ? 'Orbital camera reveals with 360° movement around subjects'
        : metadata.usesForwardTracking 
        ? 'Forward tracking camera with dynamic speed variations'
        : 'Static camera positioning',
      color: 'text-blue-500'
    },
    {
      enabled: metadata.usesCurvedPaths,
      icon: Sparkles,
      title: 'Curved Path Animations',
      description: 'Characters follow smooth Bézier curves with auto-rotation toward movement direction',
      color: 'text-purple-500'
    },
    {
      enabled: metadata.usesParallax,
      icon: Layers,
      title: '6-Layer Parallax Depth',
      description: 'Multi-layer depth system with atmospheric perspective and distance-based scaling',
      color: 'text-green-500'
    },
    {
      enabled: metadata.usesColorGrading,
      icon: Palette,
      title: 'Dynamic Color Grading',
      description: 'Professional color temperature shifts with mood presets and vignette effects',
      color: 'text-orange-500'
    }
  ];

  const enabledFeatures = features.filter(f => f.enabled);
  const productionGrade = metadata.productionGrade.toUpperCase();
  const qualityScore = metadata.finalQualityScore || 85;

  // Grade color
  const gradeColors: Record<string, string> = {
    'BASIC': 'text-gray-400',
    'ENHANCED': 'text-blue-400',
    'PROFESSIONAL': 'text-purple-400',
    'CINEMATIC': 'text-yellow-400'
  };

  const gradeColor = gradeColors[productionGrade] || 'text-gray-400';

  return (
    <Card className="border-2">
      <CardHeader 
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Scene Direction Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {enabledFeatures.length} advanced techniques applied • Production Grade: <span className={`font-bold ${gradeColor}`}>{productionGrade}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold">{qualityScore}</div>
              <div className="text-xs text-muted-foreground">Quality Score</div>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-6 pt-6">
          {/* Production Overview */}
          <div className="bg-accent/30 rounded-lg p-4 border border-accent">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Production Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  This video was generated using our <span className="font-semibold text-foreground">sophisticated production system</span>, 
                  which automatically applies {enabledFeatures.length === 4 ? 'all 4' : enabledFeatures.length} advanced cinematography 
                  techniques to every video.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`rounded-lg p-4 border-2 transition-all ${
                    feature.enabled 
                      ? 'bg-accent/20 border-accent' 
                      : 'bg-muted/30 border-muted opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${feature.enabled ? feature.color : 'text-muted-foreground'} mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                        {feature.enabled ? (
                          <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scene-by-Scene Breakdown */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Film className="w-4 h-4" />
              Scene Structure
            </h4>
            <div className="space-y-2">
              {videoPlan.scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  className="bg-muted/30 rounded-lg p-3 border border-muted"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-background px-2 py-1 rounded">
                        Scene {index + 1}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {scene.startTime.toFixed(1)}s - {(scene.startTime + scene.duration).toFixed(1)}s
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {scene.elements.length} elements
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scene.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-muted/20 rounded-lg p-4 border border-muted">
            <h4 className="font-semibold text-sm mb-3">Technical Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Resolution</div>
                <div className="font-mono font-medium">{videoPlan.resolution.width}×{videoPlan.resolution.height}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Frame Rate</div>
                <div className="font-mono font-medium">{videoPlan.fps} FPS</div>
              </div>
              <div>
                <div className="text-muted-foreground">Duration</div>
                <div className="font-mono font-medium">{videoPlan.duration}s</div>
              </div>
              <div>
                <div className="text-muted-foreground">Scenes</div>
                <div className="font-mono font-medium">{videoPlan.scenes.length}</div>
              </div>
            </div>
          </div>

          {/* Camera Path Details */}
          {videoPlan.cameraPath && (
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-blue-600">
                <Camera className="w-4 h-4" />
                Camera Path Configuration
              </h4>
              <p className="text-xs text-muted-foreground">
                {metadata.usesOrbitalCamera && 'Orbital camera with 360° rotation around subject, creating cinematic reveal effect.'}
                {metadata.usesForwardTracking && 'Forward tracking shot with variable speed control, simulating continuous movement through scene.'}
              </p>
            </div>
          )}

          {/* Parallax Details */}
          {videoPlan.parallaxConfig && (
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-600">
                <Layers className="w-4 h-4" />
                Parallax Layer System
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>6 depth layers configured:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  {Object.keys(videoPlan.parallaxConfig).map(layer => (
                    <li key={layer} className="font-mono">{layer}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default SceneBreakdown;
