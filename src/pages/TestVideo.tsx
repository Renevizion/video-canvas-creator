import React, { useState } from 'react';
import { VideoExporter } from '@/components/video/VideoExporter';
import { generateMobajumpVideo } from '@/lib/mobajumpTestVideo';
import { generateTestVideoPlan } from '@/lib/testVideoGenerator';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export default function TestVideoPage() {
  const [showExporter, setShowExporter] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  const loadMobajumpVideo = () => {
    const plan = generateMobajumpVideo();
    setCurrentPlan(plan);
    setShowExporter(true);
  };

  const loadTestVideo = () => {
    const plan = generateTestVideoPlan();
    setCurrentPlan(plan);
    setShowExporter(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video Test Page</h1>
          <p className="text-slate-400">Test video rendering with shapes, transitions, and render history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mobajump Launch</h2>
                <p className="text-sm text-slate-400">Professional product video</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              15 second video showcasing Mobajump's key features with animated shapes, smooth transitions, and compelling copy.
            </p>
            <Button onClick={loadMobajumpVideo} className="w-full">
              Load & Preview
            </Button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Film className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Test Shapes</h2>
                <p className="text-sm text-slate-400">Geometric shapes demo</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              10 second test video with circles, triangles, stars, and polygons to verify @remotion/shapes rendering.
            </p>
            <Button onClick={loadTestVideo} variant="outline" className="w-full">
              Load & Preview
            </Button>
          </div>
        </div>

        {showExporter && currentPlan && (
          <VideoExporter
            plan={currentPlan}
            projectId={currentPlan.id}
            onClose={() => setShowExporter(false)}
          />
        )}
      </div>
    </div>
  );
}
