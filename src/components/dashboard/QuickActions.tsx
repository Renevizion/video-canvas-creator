import { motion } from 'framer-motion';
import { Upload, Wand2, FolderOpen, Sparkles } from 'lucide-react';

const actions = [
  {
    icon: Upload,
    title: 'Analyze Video',
    description: 'Upload a reference video to extract patterns',
    gradient: 'from-primary to-primary/60',
    href: '/analyze',
  },
  {
    icon: Wand2,
    title: 'Generate Video',
    description: 'Create a new video from a text prompt',
    gradient: 'from-accent to-accent/60',
    href: '/create',
  },
  {
    icon: FolderOpen,
    title: 'Browse Patterns',
    description: 'View and manage learned video patterns',
    gradient: 'from-glow-success to-glow-success/60',
    href: '/patterns',
  },
  {
    icon: Sparkles,
    title: 'Generate Assets',
    description: 'Create images and backgrounds with AI',
    gradient: 'from-glow-warning to-glow-warning/60',
    href: '/assets',
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
            className="glass-card p-5 group relative overflow-hidden cursor-pointer"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

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
