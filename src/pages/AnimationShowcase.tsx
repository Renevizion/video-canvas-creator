import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Code2, Terminal as TerminalIcon, Layers, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import type { VideoPlan } from '@/types/video';

// Demo plans for each animation style
const codeEditorDemoPlan: VideoPlan = {
  id: 'demo-code-editor',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: 'Code editor demo',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Compose with code',
          position: { x: 70, y: 25, z: 2 },
          size: { width: 600, height: 80 },
          style: { fontSize: 64, fontWeight: 800 },
          animation: { name: 'slideUp', type: 'slide', duration: 0.8, delay: 0, easing: 'spring', properties: { y: [60, 0] } },
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Use React to create sophisticated videos with code.',
          position: { x: 70, y: 38, z: 2 },
          size: { width: 500, height: 40 },
          style: { fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.7)' },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0.3, easing: 'ease-out', properties: {} },
        },
        {
          id: 'code-editor',
          type: 'shape',
          content: 'code editor',
          position: { x: 35, y: 60, z: 1 },
          size: { width: 500, height: 340 },
          style: { elementType: 'code-editor' },
          animation: { name: 'slideIn', type: 'slide', duration: 1, delay: 0.2, easing: 'spring', properties: {} },
        },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#1e293b', '#0f172a'],
    typography: { primary: 'Inter', secondary: 'JetBrains Mono', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const progressBarDemoPlan: VideoPlan = {
  id: 'demo-progress',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: 'Progress bar demo',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Scalable rendering',
          position: { x: 50, y: 25, z: 2 },
          size: { width: 600, height: 80 },
          style: { fontSize: 56, fontWeight: 800 },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0, easing: 'ease-out', properties: {} },
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Render video files locally, on the server, or serverless.',
          position: { x: 50, y: 37, z: 2 },
          size: { width: 600, height: 40 },
          style: { fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)' },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0.2, easing: 'ease-out', properties: {} },
        },
        {
          id: 'progress-bar',
          type: 'shape',
          content: 'video.mp4 progress render',
          position: { x: 50, y: 62, z: 1 },
          size: { width: 380, height: 120 },
          style: { elementType: 'progress' },
          animation: { name: 'slideUp', type: 'slide', duration: 0.8, delay: 0.3, easing: 'spring', properties: {} },
        },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#06b6d4', '#1e293b', '#0a0a0f'],
    typography: { primary: 'Inter', secondary: 'SF Mono', sizes: {} },
    spacing: 16,
    borderRadius: 20,
  },
};

const terminalDemoPlan: VideoPlan = {
  id: 'demo-terminal',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 6,
      description: 'Terminal demo',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Command Line Rendering',
          position: { x: 50, y: 20, z: 2 },
          size: { width: 600, height: 80 },
          style: { fontSize: 52, fontWeight: 700 },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
        },
        {
          id: 'terminal',
          type: 'shape',
          content: '$ npx remotion render DynamicVideo out/video.mp4\n⠋ Rendering frames...\n✓ Video rendered successfully\n✓ Output: out/video.mp4 (2.4 MB)',
          position: { x: 50, y: 58, z: 1 },
          size: { width: 580, height: 320 },
          style: { elementType: 'terminal' },
          animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.2, easing: 'spring', properties: {} },
        },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#a855f7', '#1e1e2e', '#11111b'],
    typography: { primary: 'Inter', secondary: 'JetBrains Mono', sizes: {} },
    spacing: 16,
    borderRadius: 14,
  },
};

const perspective3DDemoPlan: VideoPlan = {
  id: 'demo-3d',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: '3D perspective demo',
      elements: [
        {
          id: 'card-1',
          type: 'shape',
          content: '3d card',
          position: { x: 30, y: 50, z: 1 },
          size: { width: 320, height: 220 },
          style: { elementType: '3d-card', rotateY: -20, rotateX: 10 },
          animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.1, easing: 'spring', properties: {} },
        },
        {
          id: 'card-2',
          type: 'shape',
          content: '3d card',
          position: { x: 55, y: 45, z: 2 },
          size: { width: 360, height: 260 },
          style: { elementType: '3d-card', rotateY: -12, rotateX: 8, background: 'linear-gradient(145deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 100%)' },
          animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.3, easing: 'spring', properties: {} },
        },
        {
          id: 'card-3',
          type: 'shape',
          content: '3d card',
          position: { x: 78, y: 55, z: 3 },
          size: { width: 280, height: 200 },
          style: { elementType: '3d-card', rotateY: -25, rotateX: 12 },
          animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.5, easing: 'spring', properties: {} },
        },
        {
          id: 'title',
          type: 'text',
          content: '3D Perspective Effects',
          position: { x: 50, y: 12, z: 10 },
          size: { width: 600, height: 80 },
          style: { fontSize: 48, fontWeight: 800 },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0, easing: 'ease-out', properties: {} },
        },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#6366f1', '#1e293b', '#0f0f1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 24,
  },
};

const animatedTextDemoPlan: VideoPlan = {
  id: 'demo-animated-text',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 5,
      description: 'Animated text demo',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Dynamic Text',
          position: { x: 50, y: 40, z: 1 },
          size: { width: 800, height: 100 },
          style: { fontSize: 72, fontWeight: 800, animated: true },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.3, delay: 0, easing: 'ease-out', properties: {} },
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Character Animations',
          position: { x: 50, y: 60, z: 1 },
          size: { width: 700, height: 60 },
          style: { fontSize: 48, fontWeight: 600, animated: true },
          animation: { name: 'fadeIn', type: 'fade', duration: 0.3, delay: 0.8, easing: 'ease-out', properties: {} },
        },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#8b5cf6', '#1e293b', '#0a0a1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const demos = [
  { id: 'code', label: 'Code Editor', icon: Code2, plan: codeEditorDemoPlan },
  { id: 'progress', label: 'Progress Bar', icon: Layers, plan: progressBarDemoPlan },
  { id: 'terminal', label: 'Terminal', icon: TerminalIcon, plan: terminalDemoPlan },
  { id: '3d', label: '3D Cards', icon: Monitor, plan: perspective3DDemoPlan },
  { id: 'text', label: 'Animated Text', icon: Monitor, plan: animatedTextDemoPlan },
];

const AnimationShowcase = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('code');

  const currentDemo = demos.find(d => d.id === activeDemo)!;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold mb-3">
              <span className="gradient-text">Animation Showcase</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional video animations like Remotion's demos. Use these styles in your video projects.
            </p>
          </motion.div>

          {/* Demo selector */}
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              {demos.map(demo => (
                <TabsTrigger key={demo.id} value={demo.id} className="gap-2">
                  <demo.icon className="w-4 h-4" />
                  {demo.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {demos.map(demo => (
              <TabsContent key={demo.id} value={demo.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      {demo.label} Demo
                    </h3>
                    <span className="text-sm text-muted-foreground font-mono">
                      {demo.plan.duration}s @ {demo.plan.fps}fps
                    </span>
                  </div>

                  <RemotionPlayerWrapper plan={demo.plan} className="rounded-xl overflow-hidden" />

                  <div className="mt-4 p-4 glass-card bg-primary/5 border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">How to use:</strong> Add elements with content keywords like 
                      "{demo.id === 'code' ? 'code editor' : demo.id === 'progress' ? 'progress render' : demo.id === 'terminal' ? 'terminal command' : '3d card'}" 
                      or set <code className="text-primary bg-primary/10 px-1 rounded">style.elementType</code> to 
                      "{demo.id === 'code' ? 'code-editor' : demo.id === 'progress' ? 'progress' : demo.id === 'terminal' ? 'terminal' : '3d-card'}".
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Use in projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Ready to create professional videos?</h3>
            <p className="text-muted-foreground mb-6">
              Use these animation styles in your next video project.
            </p>
            <Button size="lg" onClick={() => navigate('/create')} className="gap-2 glow-primary">
              <Play className="w-5 h-5" />
              Create New Video
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AnimationShowcase;
