import { motion } from 'framer-motion';
import { Sparkles, Wand2, Upload, FolderOpen, Play } from 'lucide-react';

const actions = [
  {
    icon: Sparkles,
    title: 'Create Video (Natural Language)',
    description: 'Just describe what you want - we\'ll make it',
    gradient: 'from-purple-500 to-pink-500',
    href: '/simple-create',
    featured: true,
  },
  {
    icon: Wand2,
    title: 'Template Creator',
    description: 'Use professional video templates',
    gradient: 'from-accent to-accent/60',
    href: '/create',
  },
  {
    icon: Upload,
    title: 'Analyze Video',
    description: 'Upload a reference video to extract patterns',
    gradient: 'from-primary to-primary/60',
    href: '/analyze',
  },
  {
    icon: FolderOpen,
    title: 'Browse Patterns',
    description: 'View and manage learned video patterns',
    gradient: 'from-glow-success to-glow-success/60',
    href: '/patterns',
  },
  {
    icon: Play,
    title: 'Animation Showcase',
    description: 'See code editors, progress bars & 3D effects',
    gradient: 'from-glow-warning to-glow-warning/60',
    href: '/showcase',
  },
];

export function QuickActions() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.a
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`glass-card p-5 group relative overflow-hidden cursor-pointer ${
              action.featured ? 'ring-2 ring-primary' : ''
            }`}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {action.featured && (
              <div className="absolute top-2 right-2 z-20">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </span>
              </div>
            )}

            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
