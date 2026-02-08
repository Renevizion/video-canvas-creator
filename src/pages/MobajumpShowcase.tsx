/**
 * Mobajump Mega Showcase Page
 * A dedicated page to view the comprehensive Mobajump video
 * featuring EVERY animation from the Animation Playground
 */

import { useState } from 'react';
import { Player } from '@remotion/player';
import { ArrowLeft, Play, Pause, RotateCcw, Download, Sparkles, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { MobajumpMegaShowcase } from '@/components/remotion/showcases/MobajumpMegaShowcase';
import { Badge } from '@/components/ui/badge';

const ANIMATION_LIST = [
  { name: 'Typewriter Text', scene: 1 },
  { name: 'Gradient Text Animation', scene: 2 },
  { name: 'Bouncing Letters', scene: 2 },
  { name: 'Outline Text', scene: 2 },
  { name: 'Glitch Text Effect', scene: 3 },
  { name: 'Floating Particles', scene: 1 },
  { name: '3D Perspective Card', scene: 3 },
  { name: 'Rotating 3D Cube', scene: 3 },
  { name: 'Floating Layers (Parallax)', scene: 3 },
  { name: 'Phone Mockup with App', scene: 4 },
  { name: 'Code Editor with Typing', scene: 5 },
  { name: 'Animated Bar Chart', scene: 4 },
  { name: 'Animated Counter', scene: 5 },
  { name: 'Donut Chart', scene: 6 },
  { name: 'Audio Visualizer Bars', scene: 5 },
  { name: 'Waveform Animation', scene: 9 },
  { name: 'Spring Bounce Ball', scene: 8 },
  { name: 'Elastic Stretch', scene: 8 },
  { name: 'Parallax Landscape', scene: 9 },
  { name: 'Depth Rings', scene: 8 },
  { name: 'Logo Grid', scene: 9 },
  { name: 'Fade Transition', scene: 7 },
  { name: 'Slide Transition', scene: 7 },
  { name: 'Scale Transition', scene: 7 },
  { name: '3D Flip Transition', scene: 7 },
  { name: 'Progress Stepper', scene: 10 },
  { name: 'Animated Gradient Background', scene: 2 },
];

const MobajumpShowcase = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerRef, setPlayerRef] = useState<any>(null);

  const handleTogglePlay = () => {
    if (playerRef) {
      if (isPlaying) {
        playerRef.pause();
      } else {
        playerRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (playerRef) {
      playerRef.seekTo(0);
      playerRef.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/30">
                M
              </div>
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  Mobajump Mega Showcase
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </h1>
                <p className="text-muted-foreground mt-1">
                  45-second commercial featuring <span className="text-primary font-semibold">every animation</span> from the Animation Playground
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-orange-500 border-orange-500/30">
                11 Scenes
              </Badge>
              <Badge variant="outline" className="text-green-500 border-green-500/30">
                27 Animations
              </Badge>
              <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                45 Seconds
              </Badge>
              <a 
                href="https://mobajump.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                mobajump.com
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="glass-card overflow-hidden">
                <div className="aspect-video bg-black">
                  <Player
                    ref={(ref) => setPlayerRef(ref)}
                    component={MobajumpMegaShowcase}
                    durationInFrames={1350}
                    fps={30}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    style={{ width: '100%', height: '100%' }}
                    autoPlay
                    loop
                    controls
                    clickToPlay={false}
                  />
                </div>
                
                {/* Controls */}
                <div className="p-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleTogglePlay}
                      className="gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleRestart}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    onClick={() => navigate('/create')}
                  >
                    <Download className="w-4 h-4" />
                    Render Video
                  </Button>
                </div>
              </div>

              {/* Scenes Timeline */}
              <div className="glass-card mt-6 p-6">
                <h3 className="font-semibold mb-4">Scene Timeline</h3>
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (playerRef) {
                          const frames = [0, 90, 210, 330, 450, 570, 690, 810, 930, 1050, 1170];
                          playerRef.seekTo(frames[i]);
                        }
                      }}
                      className="aspect-square rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:from-orange-500/40 hover:to-red-500/40 flex items-center justify-center text-sm font-medium transition-all hover:scale-105"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <span>1: Intro</span>
                  <span>2: Hero</span>
                  <span>3: Features</span>
                  <span>4: Phone Demo</span>
                  <span>5: Code Demo</span>
                  <span>6: Data Viz</span>
                  <span>7: Transitions</span>
                  <span>8: Physics</span>
                  <span>9: Parallax</span>
                  <span>10: Stepper</span>
                  <span>11: CTA</span>
                </div>
              </div>
            </div>

            {/* Animations List */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Animations Used ({ANIMATION_LIST.length})
                </h3>
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {ANIMATION_LIST.map((anim, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (playerRef) {
                          const sceneFrames = [0, 90, 210, 330, 450, 570, 690, 810, 930, 1050, 1170];
                          playerRef.seekTo(sceneFrames[anim.scene - 1]);
                          playerRef.play();
                          setIsPlaying(true);
                        }
                      }}
                    >
                      <span className="text-sm">{anim.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Scene {anim.scene}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => navigate('/showcase')}
                  >
                    <Sparkles className="w-4 h-4" />
                    View Animation Playground
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobajumpShowcase;
