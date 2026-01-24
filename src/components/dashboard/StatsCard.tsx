import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  glowColor?: 'primary' | 'accent' | 'success' | 'warning';
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, glowColor = 'primary' }: StatsCardProps) {
  const glowClasses = {
    primary: 'glow-primary',
    accent: 'glow-accent',
    success: 'glow-success',
    warning: '',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`glass-card p-6 relative overflow-hidden group ${glowClasses[glowColor]}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {trend && (
            <span className={`text-xs font-mono ${trend.positive ? 'text-glow-success' : 'text-destructive'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/60 mt-2 font-mono">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
