import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { 
  Check, Circle, Music, MessageSquare, Monitor, CalendarDays, 
  Code2, Sliders, Server, Play, Layers, Wand2, Upload, Globe,
  Film, Sparkles, Database, Palette
} from 'lucide-react';

interface FeatureItem {
  id: string;
  name: string;
  description: string;
  status: 'done' | 'in-progress' | 'planned';
  icon: React.ElementType;
}

interface FeatureCategory {
  title: string;
  description: string;
  icon: React.ElementType;
  features: FeatureItem[];
}

const roadmapData: FeatureCategory[] = [
  {
    title: 'Use Cases',
    description: 'Types of videos you can create',
    icon: Film,
    features: [
      {
        id: 'marketing-videos',
        name: 'Marketing Videos',
        description: 'Product demos, social ads, promotional content',
        status: 'done',
        icon: Sparkles,
      },
      {
        id: 'music-visualization',
        name: 'Music Visualization',
        description: 'Audio-reactive visuals synced to music',
        status: 'planned',
        icon: Music,
      },
      {
        id: 'captions',
        name: 'Captions / Subtitles',
        description: 'Auto-generated or custom captions with animations',
        status: 'planned',
        icon: MessageSquare,
      },
      {
        id: 'screencast',
        name: 'Screencast',
        description: 'Screen recordings with animated overlays',
        status: 'planned',
        icon: Monitor,
      },
      {
        id: 'year-in-review',
        name: 'Year in Review',
        description: 'Data-driven recap videos (Spotify Wrapped style)',
        status: 'planned',
        icon: CalendarDays,
      },
    ],
  },
  {
    title: 'Compose with Code',
    description: 'React-powered video creation',
    icon: Code2,
    features: [
      {
        id: 'react-components',
        name: 'React Components',
        description: 'Use React to build sophisticated video compositions',
        status: 'done',
        icon: Code2,
      },
      {
        id: 'remotion-primitives',
        name: 'Remotion Primitives',
        description: 'Sequence, AbsoluteFill, interpolate, spring animations',
        status: 'done',
        icon: Layers,
      },
      {
        id: 'ai-code-generation',
        name: 'AI Code Generation',
        description: 'Generate Remotion code from natural language prompts',
        status: 'done',
        icon: Wand2,
      },
      {
        id: 'custom-components',
        name: 'Custom Component Library',
        description: 'Pre-built components: cards, buttons, mockups, charts',
        status: 'in-progress',
        icon: Palette,
      },
    ],
  },
  {
    title: 'Edit Dynamically',
    description: 'Parameterize and customize videos',
    icon: Sliders,
    features: [
      {
        id: 'data-driven',
        name: 'Data-Driven Videos',
        description: 'Pass JSON data to customize video content',
        status: 'done',
        icon: Database,
      },
      {
        id: 'live-preview',
        name: 'Live Preview (Player)',
        description: 'In-browser video playback with Remotion Player',
        status: 'done',
        icon: Play,
      },
      {
        id: 'visual-editor',
        name: 'Visual Editor',
        description: 'Drag-and-drop scene reordering, visual property editing',
        status: 'planned',
        icon: Sliders,
      },
      {
        id: 'asset-upload',
        name: 'Asset Upload',
        description: 'Upload custom images, logos, videos to use in compositions',
        status: 'in-progress',
        icon: Upload,
      },
      {
        id: 'template-library',
        name: 'Template Library',
        description: 'Pre-made video templates to customize',
        status: 'planned',
        icon: Layers,
      },
    ],
  },
  {
    title: 'Scalable Rendering',
    description: 'Export videos in multiple formats',
    icon: Server,
    features: [
      {
        id: 'code-export',
        name: 'Code Export',
        description: 'Download Remotion code to render locally',
        status: 'done',
        icon: Code2,
      },
      {
        id: 'local-render',
        name: 'Local Render Instructions',
        description: 'CLI commands to render MP4 on your machine',
        status: 'done',
        icon: Monitor,
      },
      {
        id: 'cloud-render',
        name: 'Cloud Rendering',
        description: 'Render videos in the cloud, download MP4 directly',
        status: 'in-progress',
        icon: Globe,
      },
      {
        id: 'render-progress',
        name: 'Render Progress UI',
        description: 'Real-time progress bar during rendering',
        status: 'planned',
        icon: Server,
      },
      {
        id: 'format-options',
        name: 'Multiple Formats',
        description: 'Export as MP4, WebM, GIF, image sequences',
        status: 'planned',
        icon: Film,
      },
    ],
  },
];

const statusColors = {
  done: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  planned: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusLabels = {
  done: 'Done',
  'in-progress': 'In Progress',
  planned: 'Planned',
};

const Roadmap = () => {
  const [filter, setFilter] = useState<'all' | 'done' | 'in-progress' | 'planned'>('all');

  const totalFeatures = roadmapData.reduce((acc, cat) => acc + cat.features.length, 0);
  const doneFeatures = roadmapData.reduce(
    (acc, cat) => acc + cat.features.filter((f) => f.status === 'done').length,
    0
  );
  const progressPercent = Math.round((doneFeatures / totalFeatures) * 100);

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Feature Roadmap
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track what's built and what's coming to your video generation studio
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Overall Progress</h2>
              <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
            <div className="flex gap-6 mt-4 text-sm">
              <span className="text-emerald-400">{doneFeatures} Done</span>
              <span className="text-amber-400">
                {roadmapData.reduce(
                  (acc, cat) => acc + cat.features.filter((f) => f.status === 'in-progress').length,
                  0
                )}{' '}
                In Progress
              </span>
              <span className="text-slate-400">
                {roadmapData.reduce(
                  (acc, cat) => acc + cat.features.filter((f) => f.status === 'planned').length,
                  0
                )}{' '}
                Planned
              </span>
            </div>
          </motion.div>

          {/* Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['all', 'done', 'in-progress', 'planned'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {status === 'all' ? 'All Features' : statusLabels[status]}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {roadmapData.map((category, catIdx) => {
              const filteredFeatures =
                filter === 'all'
                  ? category.features
                  : category.features.filter((f) => f.status === filter);

              if (filteredFeatures.length === 0) return null;

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * catIdx }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {filteredFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            feature.status === 'done'
                              ? 'bg-emerald-500/20'
                              : feature.status === 'in-progress'
                              ? 'bg-amber-500/20'
                              : 'bg-slate-500/20'
                          }`}
                        >
                          {feature.status === 'done' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <feature.icon
                              className={`w-4 h-4 ${
                                feature.status === 'in-progress' ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {feature.description}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[feature.status]
                          }`}
                        >
                          {statusLabels[feature.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
