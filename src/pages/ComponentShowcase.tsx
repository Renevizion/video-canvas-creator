import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Type, Layers, MousePointer, Palette, Box, BarChart3, 
  Music, Video, Smartphone, Grid3X3, Code, Sparkles, Wand2, 
  CircleDot, Paintbrush, Zap, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ============================================================
// CATEGORY DATA
// ============================================================

interface DemoCard {
  id: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  tags?: string[];
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  demos: DemoCard[];
}

// ============================================================
// TEXT EFFECTS DEMOS
// ============================================================

const TypewriterDemo = () => {
  const [text, setText] = useState('');
  const fullText = 'Typewriter Effect';
  
  return (
    <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
      <motion.span
        className="text-2xl font-mono text-foreground"
        initial={{ width: 0 }}
        animate={{ width: 'auto' }}
      >
        {fullText.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, repeat: Infinity, repeatDelay: 3, duration: 0.1 }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span 
          className="inline-block w-0.5 h-6 bg-primary ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </motion.span>
    </div>
  );
};

const TextScrambleDemo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const [scrambled, setScrambled] = useState(false);
  
  return (
    <div className="h-40 flex flex-col items-center justify-center bg-card/50 rounded-lg gap-4">
      <motion.span
        className="text-2xl font-mono text-foreground"
        animate={scrambled ? {} : {}}
      >
        {scrambled ? 'Decrypted!' : 'Xyq@#Fk&Z'}
      </motion.span>
      <Button size="sm" variant="outline" onClick={() => setScrambled(!scrambled)}>
        Scramble
      </Button>
    </div>
  );
};

const GradientTextDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.span
      className="text-3xl font-bold"
      style={{
        background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    >
      GRADIENT
    </motion.span>
  </div>
);

const OutlineTextDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg group">
    <span
      className="text-3xl font-bold transition-all duration-300 cursor-pointer hover:text-primary"
      style={{
        WebkitTextStroke: '2px hsl(var(--primary))',
        WebkitTextFillColor: 'transparent',
      }}
    >
      OUTLINE
    </span>
  </div>
);

const GlitchTextDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg relative overflow-hidden">
    <div className="relative">
      <motion.span
        className="text-3xl font-bold text-foreground absolute"
        animate={{ x: [-2, 2, -2], opacity: [0.8, 0.9, 0.8] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        style={{ color: '#ff0000', mixBlendMode: 'screen' }}
      >
        GLITCH
      </motion.span>
      <motion.span
        className="text-3xl font-bold text-foreground absolute"
        animate={{ x: [2, -2, 2], opacity: [0.8, 0.9, 0.8] }}
        transition={{ duration: 0.15, repeat: Infinity }}
        style={{ color: '#00ffff', mixBlendMode: 'screen' }}
      >
        GLITCH
      </motion.span>
      <span className="text-3xl font-bold text-foreground relative">GLITCH</span>
    </div>
  </div>
);

const BouncingTextDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <div className="flex">
      {'BOUNCE'.split('').map((char, i) => (
        <motion.span
          key={i}
          className="text-3xl font-bold text-primary"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  </div>
);

// ============================================================
// TRANSITIONS DEMOS
// ============================================================

const FadeTransitionDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/50"
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
    />
  </div>
);

const SlideTransitionDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg overflow-hidden">
    <motion.div
      className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"
      animate={{ x: [-100, 0, 0, 100] }}
      transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
    />
  </div>
);

const ScaleTransitionDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"
      animate={{ scale: [0, 1, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
    />
  </div>
);

const FlipTransitionDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg perspective-1000">
    <motion.div
      className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500"
      animate={{ rotateY: [0, 180, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    />
  </div>
);

// ============================================================
// MOUSE/INTERACTION EFFECTS
// ============================================================

const CursorFollowDemo = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  return (
    <div 
      className="h-40 flex items-center justify-center bg-card/50 rounded-lg relative cursor-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
    >
      <motion.div
        className="w-8 h-8 rounded-full bg-primary/80 absolute pointer-events-none"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      <span className="text-muted-foreground text-sm">Move cursor here</span>
    </div>
  );
};

const HoverScaleDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      Hover Me
    </motion.div>
  </div>
);

const MagneticButtonDemo = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
      <motion.button
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
        animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: e.clientX - rect.left - rect.width / 2,
            y: e.clientY - rect.top - rect.height / 2,
          });
        }}
        onMouseLeave={() => setPosition({ x: 0, y: 0 })}
        transition={{ type: 'spring', damping: 15 }}
      >
        Magnetic
      </motion.button>
    </div>
  );
};

// ============================================================
// BACKGROUND EFFECTS
// ============================================================

const GradientBackgroundDemo = () => (
  <motion.div
    className="h-40 rounded-lg overflow-hidden"
    style={{
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
    }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
  />
);

const ParticlesDemo = () => (
  <div className="h-40 rounded-lg bg-slate-900 relative overflow-hidden">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-white/30"
        initial={{ 
          x: Math.random() * 300,
          y: Math.random() * 160 
        }}
        animate={{ 
          y: [null, -180],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3
        }}
      />
    ))}
    <div className="absolute inset-0 flex items-center justify-center text-white/50">
      Particles
    </div>
  </div>
);

const NoiseTextureDemo = () => (
  <div 
    className="h-40 rounded-lg relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    }}
  >
    <div 
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center text-white/70 font-semibold">
      Noise Texture
    </div>
  </div>
);

// ============================================================
// 3D EFFECTS
// ============================================================

const Perspective3DCardDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg" style={{ perspective: '1000px' }}>
    <motion.div
      className="w-32 h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl"
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ 
        rotateY: [-15, 15, -15],
        rotateX: [5, -5, 5]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

const FloatingLayersDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg" style={{ perspective: '1000px' }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute w-20 h-20 rounded-lg"
        style={{ 
          transformStyle: 'preserve-3d',
          backgroundColor: i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#ec4899',
          zIndex: 3 - i
        }}
        animate={{ 
          y: [0, -10, 0],
          rotateX: [-5, 5, -5],
          rotateY: [i * 10, i * 10 + 10, i * 10],
          translateZ: i * 20
        }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const CubeRotationDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg" style={{ perspective: '500px' }}>
    <motion.div
      className="w-16 h-16 relative"
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateX: 360, rotateY: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face, i) => (
        <div
          key={face}
          className="absolute w-16 h-16 border-2 border-primary/50 bg-primary/20 backdrop-blur"
          style={{
            transform: face === 'front' ? 'translateZ(32px)' :
                       face === 'back' ? 'rotateY(180deg) translateZ(32px)' :
                       face === 'left' ? 'rotateY(-90deg) translateZ(32px)' :
                       face === 'right' ? 'rotateY(90deg) translateZ(32px)' :
                       face === 'top' ? 'rotateX(90deg) translateZ(32px)' :
                       'rotateX(-90deg) translateZ(32px)',
          }}
        />
      ))}
    </motion.div>
  </div>
);

// ============================================================
// DATA VISUALIZATION
// ============================================================

const AnimatedBarChartDemo = () => {
  const data = [40, 70, 45, 90, 60];
  return (
    <div className="h-40 flex items-end justify-center gap-2 bg-card/50 rounded-lg p-4">
      {data.map((value, i) => (
        <motion.div
          key={i}
          className="w-8 rounded-t bg-primary"
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }}
        />
      ))}
    </div>
  );
};

const AnimatedCounterDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.span
      className="text-5xl font-bold text-primary tabular-nums"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Counter from={0} to={10000} />
    </motion.span>
  </div>
);

const Counter = ({ from, to }: { from: number; to: number }) => {
  const [count, setCount] = useState(from);
  
  useState(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c >= to) return from;
        return Math.min(c + Math.floor((to - from) / 50), to);
      });
    }, 50);
    return () => clearInterval(interval);
  });
  
  return <>{count.toLocaleString()}</>;
};

const DonutChartDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      {[
        { offset: 0, length: 25, color: '#3b82f6' },
        { offset: 25, length: 35, color: '#8b5cf6' },
        { offset: 60, length: 25, color: '#ec4899' },
        { offset: 85, length: 15, color: '#10b981' },
      ].map((segment, i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="12"
          stroke={segment.color}
          strokeDasharray={`${segment.length} 100`}
          strokeDashoffset={-segment.offset}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: i * 0.2 }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
      ))}
    </svg>
  </div>
);

// ============================================================
// AUDIO VISUALIZATIONS
// ============================================================

const AudioBarsDemo = () => (
  <div className="h-40 flex items-center justify-center gap-1 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg">
    {Array.from({ length: 32 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
        animate={{ 
          height: [20, 60 + Math.sin(i * 0.5) * 40, 20]
        }}
        transition={{ 
          duration: 0.5 + Math.random() * 0.5,
          repeat: Infinity,
          delay: i * 0.02
        }}
      />
    ))}
  </div>
);

const WaveformDemo = () => (
  <div className="h-40 flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
    <svg viewBox="0 0 200 60" className="w-full h-20">
      <motion.path
        d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30"
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// ============================================================
// VIDEO ELEMENTS
// ============================================================

const PhoneMockupDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-20 h-36 bg-slate-900 rounded-2xl border-4 border-slate-700 relative overflow-hidden"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-700 rounded-full" />
      <div className="absolute inset-2 top-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
    </motion.div>
  </div>
);

const CodeEditorDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg p-4">
    <div className="w-full max-w-xs bg-slate-900 rounded-lg overflow-hidden shadow-xl">
      <div className="flex gap-1.5 p-2 bg-slate-800">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      <div className="p-3 font-mono text-xs">
        <span className="text-purple-400">const</span>{' '}
        <span className="text-blue-300">video</span>{' '}
        <span className="text-white">=</span>{' '}
        <span className="text-green-400">'amazing'</span>
        <motion.span 
          className="inline-block w-0.5 h-3 bg-white ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </div>
  </div>
);

const LogoGridDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-8 h-8 rounded-lg bg-muted"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
    </div>
  </div>
);

// ============================================================
// SPRING PHYSICS
// ============================================================

const SpringBounceDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500"
      animate={{ y: [0, 50, 0] }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        type: 'spring',
        stiffness: 300,
        damping: 10
      }}
    />
  </div>
);

const ElasticDemo = () => (
  <div className="h-40 flex items-center justify-center bg-card/50 rounded-lg">
    <motion.div
      className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500"
      animate={{ 
        scaleX: [1, 1.5, 1],
        scaleY: [1, 0.5, 1]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  </div>
);

// ============================================================
// PARALLAX
// ============================================================

const ParallaxLayersDemo = () => (
  <div className="h-40 rounded-lg bg-gradient-to-b from-sky-400 to-sky-600 relative overflow-hidden">
    {/* Background */}
    <motion.div 
      className="absolute bottom-0 w-full h-12 bg-emerald-700"
      animate={{ x: [-10, 10] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
    />
    {/* Midground */}
    <motion.div 
      className="absolute bottom-10 left-10 w-16 h-20 bg-emerald-500 rounded-t-full"
      animate={{ x: [-20, 20] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
    />
    {/* Foreground */}
    <motion.div 
      className="absolute bottom-8 right-10 w-12 h-16 bg-emerald-400 rounded-t-full"
      animate={{ x: [-30, 30] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
    />
    <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-yellow-300" />
  </div>
);

const DepthScrollDemo = () => (
  <div className="h-40 rounded-lg bg-slate-900 relative overflow-hidden flex items-center justify-center">
    {[1, 2, 3, 4, 5].map((layer) => (
      <motion.div
        key={layer}
        className="absolute rounded-full border border-primary/30"
        style={{
          width: layer * 40,
          height: layer * 40,
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: layer * 0.2
        }}
      />
    ))}
    <div className="w-4 h-4 rounded-full bg-primary" />
  </div>
);

// ============================================================
// CATEGORIES CONFIGURATION
// ============================================================

const categories: Category[] = [
  {
    id: 'text-effects',
    label: 'Text Effects',
    icon: Type,
    demos: [
      { id: 'typewriter', title: 'Typewriter', description: 'Text appears letter by letter with a blinking cursor', preview: <TypewriterDemo /> },
      { id: 'text-scramble', title: 'Text Scramble', description: 'Random characters resolve into readable text', preview: <TextScrambleDemo /> },
      { id: 'gradient-text', title: 'Animated Gradient', description: 'Text filled with shifting color gradients', preview: <GradientTextDemo /> },
      { id: 'outline-text', title: 'Stroke/Outline', description: 'Hollow text with just the outline', preview: <OutlineTextDemo /> },
      { id: 'glitch-text', title: 'Glitch Effect', description: 'Digital distortion with RGB splits', preview: <GlitchTextDemo /> },
      { id: 'bouncing-text', title: 'Bouncing Letters', description: 'Each character bounces independently', preview: <BouncingTextDemo /> },
    ],
  },
  {
    id: 'transitions',
    label: 'Transitions',
    icon: Layers,
    demos: [
      { id: 'fade', title: 'Fade', description: 'Smooth opacity transitions', preview: <FadeTransitionDemo /> },
      { id: 'slide', title: 'Slide', description: 'Elements slide in/out', preview: <SlideTransitionDemo /> },
      { id: 'scale', title: 'Scale', description: 'Grow and shrink effects', preview: <ScaleTransitionDemo /> },
      { id: 'flip', title: '3D Flip', description: 'Card flip rotations', preview: <FlipTransitionDemo /> },
    ],
  },
  {
    id: 'mouse-effects',
    label: 'Mouse Effects',
    icon: MousePointer,
    demos: [
      { id: 'cursor-follow', title: 'Cursor Follow', description: 'Elements follow your cursor', preview: <CursorFollowDemo /> },
      { id: 'hover-scale', title: 'Hover Scale', description: 'Grow on hover interaction', preview: <HoverScaleDemo /> },
      { id: 'magnetic', title: 'Magnetic Button', description: 'Button pulls toward cursor', preview: <MagneticButtonDemo /> },
    ],
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    icon: Palette,
    demos: [
      { id: 'gradient-bg', title: 'Animated Gradient', description: 'Smoothly shifting gradient colors', preview: <GradientBackgroundDemo /> },
      { id: 'particles', title: 'Particles', description: 'Floating particle effects', preview: <ParticlesDemo /> },
      { id: 'noise', title: 'Noise Texture', description: 'Subtle grain overlay effect', preview: <NoiseTextureDemo /> },
    ],
  },
  {
    id: '3d-effects',
    label: '3D Effects',
    icon: Box,
    demos: [
      { id: '3d-card', title: 'Perspective Card', description: '3D rotating card effect', preview: <Perspective3DCardDemo /> },
      { id: 'floating-layers', title: 'Floating Layers', description: 'Stacked depth layers', preview: <FloatingLayersDemo /> },
      { id: 'cube', title: 'Rotating Cube', description: 'Full 3D cube rotation', preview: <CubeRotationDemo /> },
    ],
  },
  {
    id: 'data-viz',
    label: 'Data Viz',
    icon: BarChart3,
    demos: [
      { id: 'bar-chart', title: 'Animated Bars', description: 'Bar chart with entrance animation', preview: <AnimatedBarChartDemo /> },
      { id: 'counter', title: 'Counter', description: 'Animated number counting up', preview: <AnimatedCounterDemo /> },
      { id: 'donut-chart', title: 'Donut Chart', description: 'Circular progress visualization', preview: <DonutChartDemo /> },
    ],
  },
  {
    id: 'audio',
    label: 'Audio Viz',
    icon: Music,
    demos: [
      { id: 'audio-bars', title: 'Audio Bars', description: 'Music visualizer bars', preview: <AudioBarsDemo /> },
      { id: 'waveform', title: 'Waveform', description: 'Audio waveform animation', preview: <WaveformDemo /> },
    ],
  },
  {
    id: 'video-elements',
    label: 'Video Elements',
    icon: Video,
    demos: [
      { id: 'phone-mockup', title: 'Phone Mockup', description: 'Floating device frame', preview: <PhoneMockupDemo /> },
      { id: 'code-editor', title: 'Code Editor', description: 'Animated code typing', preview: <CodeEditorDemo /> },
      { id: 'logo-grid', title: 'Logo Grid', description: 'Grid of logos/icons', preview: <LogoGridDemo /> },
    ],
  },
  {
    id: 'spring-physics',
    label: 'Spring Physics',
    icon: Zap,
    demos: [
      { id: 'spring-bounce', title: 'Bounce', description: 'Bouncy spring animation', preview: <SpringBounceDemo /> },
      { id: 'elastic', title: 'Elastic', description: 'Stretchy elastic motion', preview: <ElasticDemo /> },
    ],
  },
  {
    id: 'parallax',
    label: 'Parallax',
    icon: Layers,
    demos: [
      { id: 'parallax-layers', title: 'Layered Parallax', description: 'Multi-layer depth effect', preview: <ParallaxLayersDemo /> },
      { id: 'depth-scroll', title: 'Depth Rings', description: 'Concentric depth animation', preview: <DepthScrollDemo /> },
    ],
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

const ComponentShowcase = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const currentCategory = categories.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-4rem)] border-r border-border bg-card/30 fixed left-0 top-16">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold gradient-text">Animation Playground</h2>
            <p className="text-xs text-muted-foreground mt-1">Interactive demos of web animation effects</p>
          </div>
          
          <ScrollArea className="h-[calc(100%-80px)]">
            <nav className="p-2 space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-all',
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                    {isActive && (
                      <ArrowRight className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            {/* Category Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <currentCategory.icon className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold">{currentCategory.label}</h1>
                </div>
                <p className="text-muted-foreground">
                  {currentCategory.demos.length} animation effects available
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Demo Cards Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentCategory.demos.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="glass-card overflow-hidden hover:border-primary/50 transition-colors">
                      {/* Preview */}
                      <div className="p-4">
                        {demo.preview}
                      </div>
                      
                      {/* Info */}
                      <div className="p-4 border-t border-border/50">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {demo.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {demo.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 glass-card p-8 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Ready to create videos with these effects?</h3>
              <p className="text-muted-foreground mb-6">
                Use these animations in your video projects with Remotion.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/create')} className="gap-2 glow-primary">
                  <Sparkles className="w-5 h-5" />
                  Create New Video
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/ultimate-showcase')}>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Ultimate Showcase
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComponentShowcase;
