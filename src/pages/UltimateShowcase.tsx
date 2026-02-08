/**
 * ULTIMATE SHOWCASE - Everything This System Can Do
 * 
 * A comprehensive demo of ALL video generation capabilities including:
 * - Elements: Phone mockups, logo grids, data visualizations, code editors, etc.
 * - Animations: Spring, fade, slide, scale, parallax, 3D transforms
 * - Styles: Glassmorphism, gradients, shadows, glows
 * - Audio: Real audio visualization with waveforms and spectrum
 * - Scene Planning: Parallax depth system, camera systems, motion design
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, Sparkles, Layers, 
  Smartphone, BarChart3, Code2, Palette, 
  Music, Box, Wand2, Zap, Grid3X3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RemotionPlayerWrapper } from '@/components/remotion/RemotionPlayerWrapper';
import type { VideoPlan, PlannedElement } from '@/types/video';

// ============================================================================
// SHOWCASE CATEGORIES
// ============================================================================

interface ShowcaseCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const CATEGORIES: ShowcaseCategory[] = [
  { id: 'elements', name: 'UI Elements', icon: Box, description: 'Phone mockups, code editors, data viz', color: 'from-blue-500 to-cyan-500' },
  { id: 'animations', name: 'Animations', icon: Zap, description: 'Spring, parallax, 3D transforms', color: 'from-purple-500 to-pink-500' },
  { id: 'styles', name: 'Visual Styles', icon: Palette, description: 'Glassmorphism, gradients, effects', color: 'from-orange-500 to-red-500' },
  { id: 'audio', name: 'Audio & Music', icon: Music, description: 'Real audio visualization', color: 'from-green-500 to-emerald-500' },
  { id: 'compositions', name: 'Full Compositions', icon: Layers, description: 'Complete video showcases', color: 'from-indigo-500 to-violet-500' },
];

// ============================================================================
// ELEMENT SHOWCASE PLANS
// ============================================================================

const phoneShowcasePlan: VideoPlan = {
  id: 'phone-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Phone mockup showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Phone Mockups',
        position: { x: 70, y: 20, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 56, fontWeight: 800 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'subtitle',
        type: 'text',
        content: 'Realistic iPhone & Android mockups with glow effects',
        position: { x: 70, y: 30, z: 2 },
        size: { width: 500, height: 40 },
        style: { fontSize: 20, color: 'rgba(255,255,255,0.7)' },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
      {
        id: 'phone',
        type: 'phone-mockup',
        content: 'app-screen',
        position: { x: 30, y: 55, z: 1 },
        size: { width: 280, height: 560 },
        style: { phoneType: 'iphone' },
        animation: { name: 'slideUp', type: 'slide', duration: 0.8, delay: 0.3, easing: 'spring', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#6366f1', '#0a0a1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const barChartShowcasePlan: VideoPlan = {
  id: 'bar-chart-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Bar chart showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Bar Chart',
        position: { x: 50, y: 12, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 52, fontWeight: 800 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'bar-chart',
        type: 'data-viz',
        content: 'bar chart',
        position: { x: 50, y: 55, z: 1 },
        size: { width: 600, height: 400 },
        style: { 
          chartType: 'bar',
          data: [
            { label: 'Jan', value: 45 },
            { label: 'Feb', value: 72 },
            { label: 'Mar', value: 88 },
            { label: 'Apr', value: 95 },
          ]
        },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const lineChartShowcasePlan: VideoPlan = {
  id: 'line-chart-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Line chart showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Line Chart',
        position: { x: 50, y: 12, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 52, fontWeight: 800 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'line-chart',
        type: 'data-viz',
        content: 'line chart',
        position: { x: 50, y: 55, z: 1 },
        size: { width: 700, height: 400 },
        style: { 
          chartType: 'line',
          data: [
            { label: 'Week 1', value: 20 },
            { label: 'Week 2', value: 35 },
            { label: 'Week 3', value: 28 },
            { label: 'Week 4', value: 55 },
            { label: 'Week 5', value: 75 },
            { label: 'Week 6', value: 92 },
          ]
        },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const pieChartShowcasePlan: VideoPlan = {
  id: 'pie-chart-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Pie chart showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Pie Chart',
        position: { x: 50, y: 12, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 52, fontWeight: 800 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'pie-chart',
        type: 'data-viz',
        content: 'pie chart',
        position: { x: 50, y: 55, z: 1 },
        size: { width: 600, height: 400 },
        style: { 
          chartType: 'pie',
          data: [
            { label: 'Product A', value: 35 },
            { label: 'Product B', value: 25 },
            { label: 'Product C', value: 22 },
            { label: 'Product D', value: 18 },
          ]
        },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const donutChartShowcasePlan: VideoPlan = {
  id: 'donut-chart-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Donut chart showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Donut Chart',
        position: { x: 50, y: 12, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 52, fontWeight: 800 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'donut-chart',
        type: 'data-viz',
        content: 'donut chart',
        position: { x: 50, y: 55, z: 1 },
        size: { width: 600, height: 400 },
        style: { 
          chartType: 'donut',
          data: [
            { label: 'Mobile', value: 45 },
            { label: 'Desktop', value: 30 },
            { label: 'Tablet', value: 15 },
            { label: 'Other', value: 10 },
          ]
        },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#6366f1', '#22d3ee', '#a855f7', '#f472b6'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const codeEditorShowcasePlan: VideoPlan = {
  id: 'code-editor-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Code editor showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Compose with Code',
        position: { x: 70, y: 20, z: 2 },
        size: { width: 600, height: 80 },
        style: { fontSize: 56, fontWeight: 800 },
        animation: { name: 'slideUp', type: 'slide', duration: 0.8, delay: 0, easing: 'spring', properties: {} },
      },
      {
        id: 'subtitle',
        type: 'text',
        content: 'Real syntax highlighting with typing animations',
        position: { x: 70, y: 32, z: 2 },
        size: { width: 500, height: 40 },
        style: { fontSize: 20, color: 'rgba(255,255,255,0.7)' },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.3, easing: 'ease-out', properties: {} },
      },
      {
        id: 'code-editor',
        type: 'code-editor',
        content: 'code-editor',
        position: { x: 35, y: 60, z: 1 },
        size: { width: 520, height: 360 },
        style: { elementType: 'code-editor' },
        animation: { name: 'slideIn', type: 'slide', duration: 1, delay: 0.2, easing: 'spring', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#1e293b', '#0f172a'],
    typography: { primary: 'Inter', secondary: 'JetBrains Mono', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const logoGridShowcasePlan: VideoPlan = {
  id: 'logo-grid-showcase',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Logo grid showcase',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Trusted by Industry Leaders',
        position: { x: 50, y: 18, z: 2 },
        size: { width: 800, height: 80 },
        style: { fontSize: 48, fontWeight: 700 },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} },
      },
      {
        id: 'logo-grid',
        type: 'logo-grid',
        content: 'logos',
        position: { x: 50, y: 55, z: 1 },
        size: { width: 800, height: 400 },
        style: { 
          columns: 4,
          logoSize: 100,
          gap: 30,
          animation: 'zoom',
          logos: [
            { url: '', name: 'Stripe' },
            { url: '', name: 'Vercel' },
            { url: '', name: 'GitHub' },
            { url: '', name: 'Figma' },
            { url: '', name: 'Notion' },
            { url: '', name: 'Linear' },
            { url: '', name: 'Slack' },
            { url: '', name: 'Discord' },
          ]
        },
        animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} },
      },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#6366f1', '#1e293b', '#0a0a1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

// ============================================================================
// ANIMATION SHOWCASE PLANS
// ============================================================================

const parallaxShowcasePlan: VideoPlan = {
  id: 'parallax-showcase',
  duration: 8,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 8,
    description: '6-Layer Parallax Depth',
    elements: [
      // Far background stars
      { id: 'stars', type: 'shape', content: '✦', position: { x: 20, y: 20, z: 0.1 }, size: { width: 40, height: 40 }, style: { opacity: 0.4, fontSize: 32 }, animation: { name: 'float', type: 'custom', duration: 4, delay: 0, easing: 'linear', properties: {} } },
      { id: 'stars2', type: 'shape', content: '✦', position: { x: 80, y: 30, z: 0.1 }, size: { width: 40, height: 40 }, style: { opacity: 0.3, fontSize: 24 }, animation: { name: 'float', type: 'custom', duration: 4, delay: 0.5, easing: 'linear', properties: {} } },
      { id: 'stars3', type: 'shape', content: '✦', position: { x: 50, y: 15, z: 0.1 }, size: { width: 40, height: 40 }, style: { opacity: 0.5, fontSize: 20 }, animation: { name: 'float', type: 'custom', duration: 4, delay: 1, easing: 'linear', properties: {} } },

      // Mid background nebula
      { id: 'nebula', type: 'shape', content: '', position: { x: 50, y: 50, z: 0.3 }, size: { width: 800, height: 400 }, style: { background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: 999 }, animation: { name: 'pulse', type: 'scale', duration: 6, delay: 0, easing: 'ease-in-out', properties: {} } },

      // Environment layer
      { id: 'planet', type: 'shape', content: '🪐', position: { x: 15, y: 70, z: 0.6 }, size: { width: 120, height: 120 }, style: { fontSize: 80, opacity: 0.8 }, animation: { name: 'float', type: 'custom', duration: 5, delay: 0.3, easing: 'ease-in-out', properties: {} } },

      // Mid-ground UI card (explicit mid-ground layer)
      {
        id: 'midground-card',
        type: 'shape',
        content: 'Mid-ground UI',
        position: { x: 72, y: 66, z: 0.8 },
        size: { width: 360, height: 180 },
        style: {
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(18px)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          fontSize: 22,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.92)',
        },
        animation: { name: 'slideUp', type: 'slide', duration: 0.8, delay: 0.35, easing: 'spring', properties: {} },
      },

      // Subject layer
      { id: 'ship', type: 'shape', content: '🚀', position: { x: 64, y: 72, z: 1 }, size: { width: 120, height: 120 }, style: { fontSize: 84, filter: 'drop-shadow(0 18px 35px rgba(59,130,246,0.35))' }, animation: { name: 'float', type: 'custom', duration: 4, delay: 0.4, easing: 'ease-in-out', properties: {} } },
      { id: 'title', type: 'text', content: '6-Layer Parallax', position: { x: 50, y: 35, z: 1 }, size: { width: 800, height: 100 }, style: { fontSize: 72, fontWeight: 900 }, animation: { name: 'scaleIn', type: 'scale', duration: 0.8, delay: 0.2, easing: 'spring', properties: {} } },
      { id: 'subtitle', type: 'text', content: 'Far → Mid → Environment → Mid-ground → Subject → Foreground', position: { x: 50, y: 50, z: 1 }, size: { width: 900, height: 40 }, style: { fontSize: 24, color: 'rgba(255,255,255,0.7)' }, animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0.5, easing: 'ease-out', properties: {} } },

      // Foreground particles
      { id: 'particle1', type: 'shape', content: '•', position: { x: 10, y: 80, z: 1.5 }, size: { width: 20, height: 20 }, style: { fontSize: 32, color: '#3b82f6', opacity: 0.6 }, animation: { name: 'float', type: 'custom', duration: 2, delay: 0, easing: 'linear', properties: {} } },
      { id: 'particle2', type: 'shape', content: '•', position: { x: 90, y: 20, z: 1.5 }, size: { width: 20, height: 20 }, style: { fontSize: 48, color: '#8b5cf6', opacity: 0.4 }, animation: { name: 'float', type: 'custom', duration: 2.5, delay: 0.3, easing: 'linear', properties: {} } },
      { id: 'particle3', type: 'shape', content: '•', position: { x: 55, y: 88, z: 1.8 }, size: { width: 20, height: 20 }, style: { fontSize: 40, color: '#22d3ee', opacity: 0.35 }, animation: { name: 'float', type: 'custom', duration: 1.9, delay: 0.15, easing: 'linear', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#8b5cf6', '#0a0e27'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

const springAnimationPlan: VideoPlan = {
  id: 'spring-animations',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 5,
    description: 'Spring physics animations',
    elements: [
      { id: 'title', type: 'text', content: 'Spring Physics', position: { x: 50, y: 20, z: 2 }, size: { width: 600, height: 80 }, style: { fontSize: 56, fontWeight: 800 }, animation: { name: 'springIn', type: 'scale', duration: 0.8, delay: 0, easing: 'spring', properties: { damping: 15, stiffness: 100 } } },
      { id: 'card1', type: 'shape', content: '🚀', position: { x: 25, y: 55, z: 1 }, size: { width: 200, height: 200 }, style: { fontSize: 80, background: 'rgba(59,130,246,0.1)', borderRadius: 24, border: '2px solid rgba(59,130,246,0.3)' }, animation: { name: 'bounceIn', type: 'scale', duration: 0.6, delay: 0.2, easing: 'spring', properties: { damping: 8 } } },
      { id: 'card2', type: 'shape', content: '⚡', position: { x: 50, y: 55, z: 1 }, size: { width: 200, height: 200 }, style: { fontSize: 80, background: 'rgba(245,158,11,0.1)', borderRadius: 24, border: '2px solid rgba(245,158,11,0.3)' }, animation: { name: 'bounceIn', type: 'scale', duration: 0.6, delay: 0.4, easing: 'spring', properties: { damping: 10 } } },
      { id: 'card3', type: 'shape', content: '✨', position: { x: 75, y: 55, z: 1 }, size: { width: 200, height: 200 }, style: { fontSize: 80, background: 'rgba(139,92,246,0.1)', borderRadius: 24, border: '2px solid rgba(139,92,246,0.3)' }, animation: { name: 'bounceIn', type: 'scale', duration: 0.6, delay: 0.6, easing: 'spring', properties: { damping: 12 } } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#f59e0b', '#8b5cf6'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 24,
  },
};

const transform3DPlan: VideoPlan = {
  id: '3d-transforms',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: '3D Transform showcase',
    elements: [
      { id: 'title', type: 'text', content: '3D Perspective', position: { x: 50, y: 12, z: 10 }, size: { width: 600, height: 80 }, style: { fontSize: 52, fontWeight: 800 }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
      { id: 'card1', type: '3d-card', content: 'Featured', position: { x: 28, y: 50, z: 1 }, size: { width: 320, height: 220 }, style: { rotateY: -18, rotateX: 8 }, animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.1, easing: 'spring', properties: {} } },
      { id: 'card2', type: '3d-card', content: 'Popular', position: { x: 52, y: 45, z: 2 }, size: { width: 380, height: 260 }, style: { rotateY: -10, rotateX: 6, background: 'linear-gradient(145deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 100%)' }, animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.3, easing: 'spring', properties: {} } },
      { id: 'card3', type: '3d-card', content: 'New', position: { x: 76, y: 55, z: 3 }, size: { width: 280, height: 200 }, style: { rotateY: -22, rotateX: 10 }, animation: { name: 'popIn', type: 'scale', duration: 0.8, delay: 0.5, easing: 'spring', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#6366f1', '#8b5cf6', '#0f0f1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 24,
  },
};

// ============================================================================
// STYLE SHOWCASE PLANS  
// ============================================================================

const glassmorphismPlan: VideoPlan = {
  id: 'glassmorphism',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 5,
    description: 'Glassmorphism effects',
    elements: [
      { id: 'bg-orb1', type: 'shape', content: '', position: { x: 30, y: 40, z: 0 }, size: { width: 400, height: 400 }, style: { background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)', borderRadius: 999, filter: 'blur(60px)' }, animation: { name: 'float', type: 'custom', duration: 4, delay: 0, easing: 'ease-in-out', properties: {} } },
      { id: 'bg-orb2', type: 'shape', content: '', position: { x: 70, y: 60, z: 0 }, size: { width: 350, height: 350 }, style: { background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)', borderRadius: 999, filter: 'blur(50px)' }, animation: { name: 'float', type: 'custom', duration: 5, delay: 0.5, easing: 'ease-in-out', properties: {} } },
      { id: 'title', type: 'text', content: 'Glassmorphism', position: { x: 50, y: 20, z: 2 }, size: { width: 600, height: 80 }, style: { fontSize: 64, fontWeight: 800 }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
      { id: 'glass-card', type: 'shape', content: 'Premium Glass Card', position: { x: 50, y: 55, z: 1 }, size: { width: 500, height: 300 }, style: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', fontSize: 28, fontWeight: 600, color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'scaleIn', type: 'scale', duration: 0.6, delay: 0.3, easing: 'spring', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#8b5cf6', '#0a0a1a'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 32,
  },
};

const gradientsPlan: VideoPlan = {
  id: 'gradients',
  duration: 6,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 6,
    description: 'Gradient showcase',
    elements: [
      { id: 'title', type: 'text', content: 'Gradient Styles', position: { x: 50, y: 12, z: 2 }, size: { width: 600, height: 80 }, style: { fontSize: 52, fontWeight: 800 }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
      { id: 'grad1', type: 'shape', content: 'Ocean', position: { x: 20, y: 45, z: 1 }, size: { width: 250, height: 160 }, style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 24, fontSize: 20, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.1, easing: 'spring', properties: {} } },
      { id: 'grad2', type: 'shape', content: 'Sunset', position: { x: 40, y: 45, z: 1 }, size: { width: 250, height: 160 }, style: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 24, fontSize: 20, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.2, easing: 'spring', properties: {} } },
      { id: 'grad3', type: 'shape', content: 'Forest', position: { x: 60, y: 45, z: 1 }, size: { width: 250, height: 160 }, style: { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: 24, fontSize: 20, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.3, easing: 'spring', properties: {} } },
      { id: 'grad4', type: 'shape', content: 'Aurora', position: { x: 80, y: 45, z: 1 }, size: { width: 250, height: 160 }, style: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 24, fontSize: 20, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.4, easing: 'spring', properties: {} } },
      { id: 'grad5', type: 'shape', content: 'Cosmic', position: { x: 30, y: 75, z: 1 }, size: { width: 350, height: 180 }, style: { background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', borderRadius: 24, fontSize: 22, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.5, easing: 'spring', properties: {} } },
      { id: 'grad6', type: 'shape', content: 'Neon', position: { x: 70, y: 75, z: 1 }, size: { width: 350, height: 180 }, style: { background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', borderRadius: 24, fontSize: 22, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.6, delay: 0.6, easing: 'spring', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#667eea', '#f5576c', '#38ef7d'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 24,
  },
};

const glowEffectsPlan: VideoPlan = {
  id: 'glow-effects',
  duration: 5,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 5,
    description: 'Glow effects',
    elements: [
      { id: 'title', type: 'text', content: 'Glow Effects', position: { x: 50, y: 15, z: 2 }, size: { width: 600, height: 80 }, style: { fontSize: 56, fontWeight: 800, textShadow: '0 0 40px rgba(59,130,246,0.8)' }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
      { id: 'glow1', type: 'shape', content: '💡', position: { x: 25, y: 55, z: 1 }, size: { width: 180, height: 180 }, style: { fontSize: 80, filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }, animation: { name: 'pulse', type: 'scale', duration: 2, delay: 0.2, easing: 'ease-in-out', properties: {} } },
      { id: 'glow2', type: 'shape', content: '🔮', position: { x: 50, y: 55, z: 1 }, size: { width: 180, height: 180 }, style: { fontSize: 80, filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.9))' }, animation: { name: 'pulse', type: 'scale', duration: 2.5, delay: 0.4, easing: 'ease-in-out', properties: {} } },
      { id: 'glow3', type: 'shape', content: '⚡', position: { x: 75, y: 55, z: 1 }, size: { width: 180, height: 180 }, style: { fontSize: 80, filter: 'drop-shadow(0 0 35px rgba(59,130,246,0.9))' }, animation: { name: 'pulse', type: 'scale', duration: 2.2, delay: 0.6, easing: 'ease-in-out', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#8b5cf6', '#ffd700'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 24,
  },
};

// ============================================================================
// AUDIO SHOWCASE PLANS
// ============================================================================

const audioVisualizationPlan: VideoPlan = {
  id: 'audio-viz',
  duration: 8,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [{
    id: 'scene-1',
    startTime: 0,
    duration: 8,
    description: 'Audio visualization',
    elements: [
      { id: 'title', type: 'text', content: 'Audio Reactive', position: { x: 50, y: 15, z: 2 }, size: { width: 600, height: 80 }, style: { fontSize: 56, fontWeight: 800 }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
      { id: 'subtitle', type: 'text', content: 'Real audio visualization with @remotion/media-utils', position: { x: 50, y: 26, z: 2 }, size: { width: 700, height: 40 }, style: { fontSize: 22, color: 'rgba(255,255,255,0.7)' }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.2, easing: 'ease-out', properties: {} } },
      { id: 'audio-viz', type: 'audio-visualization', content: 'bars', position: { x: 50, y: 60, z: 1 }, size: { width: 900, height: 400 }, style: { visualizationType: 'bars', color: '#3b82f6' }, animation: { name: 'fadeIn', type: 'fade', duration: 0.5, delay: 0.3, easing: 'ease-out', properties: {} } },
    ],
    animations: [],
    transition: null,
  }],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#10b981', '#8b5cf6'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 16,
  },
};

// ============================================================================
// FULL COMPOSITION SHOWCASES
// ============================================================================

const productLaunchPlan: VideoPlan = {
  id: 'product-launch',
  duration: 10,
  fps: 30,
  resolution: { width: 1920, height: 1080 },
  scenes: [
    {
      id: 'scene-1',
      startTime: 0,
      duration: 3,
      description: 'Hook scene',
      elements: [
        { id: 'emoji', type: 'shape', content: '🚀', position: { x: 50, y: 35, z: 1 }, size: { width: 200, height: 200 }, style: { fontSize: 120 }, animation: { name: 'bounceIn', type: 'scale', duration: 0.8, delay: 0, easing: 'spring', properties: {} } },
        { id: 'title', type: 'text', content: 'Introducing the Future', position: { x: 50, y: 60, z: 1 }, size: { width: 800, height: 100 }, style: { fontSize: 64, fontWeight: 800 }, animation: { name: 'fadeIn', type: 'fade', duration: 0.6, delay: 0.3, easing: 'ease-out', properties: {} } },
      ],
      animations: [],
      transition: { type: 'fade', duration: 0.3 },
    },
    {
      id: 'scene-2',
      startTime: 3,
      duration: 4,
      description: 'Features scene',
      elements: [
        { id: 'title', type: 'text', content: 'Powerful Features', position: { x: 50, y: 18, z: 1 }, size: { width: 600, height: 80 }, style: { fontSize: 48, fontWeight: 700 }, animation: { name: 'slideDown', type: 'slide', duration: 0.5, delay: 0, easing: 'ease-out', properties: {} } },
        { id: 'feature1', type: 'shape', content: '⚡ Lightning Fast', position: { x: 30, y: 50, z: 1 }, size: { width: 280, height: 120 }, style: { background: 'rgba(59,130,246,0.1)', borderRadius: 20, border: '1px solid rgba(59,130,246,0.3)', fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideRight', type: 'slide', duration: 0.5, delay: 0.2, easing: 'spring', properties: {} } },
        { id: 'feature2', type: 'shape', content: '🔒 Secure', position: { x: 50, y: 50, z: 1 }, size: { width: 280, height: 120 }, style: { background: 'rgba(16,185,129,0.1)', borderRadius: 20, border: '1px solid rgba(16,185,129,0.3)', fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideUp', type: 'slide', duration: 0.5, delay: 0.4, easing: 'spring', properties: {} } },
        { id: 'feature3', type: 'shape', content: '🎨 Beautiful', position: { x: 70, y: 50, z: 1 }, size: { width: 280, height: 120 }, style: { background: 'rgba(139,92,246,0.1)', borderRadius: 20, border: '1px solid rgba(139,92,246,0.3)', fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }, animation: { name: 'slideLeft', type: 'slide', duration: 0.5, delay: 0.6, easing: 'spring', properties: {} } },
      ],
      animations: [],
      transition: { type: 'fade', duration: 0.3 },
    },
    {
      id: 'scene-3',
      startTime: 7,
      duration: 3,
      description: 'CTA scene',
      elements: [
        { id: 'cta-text', type: 'text', content: 'Start Your Journey', position: { x: 50, y: 35, z: 1 }, size: { width: 700, height: 100 }, style: { fontSize: 56, fontWeight: 800 }, animation: { name: 'scaleIn', type: 'scale', duration: 0.6, delay: 0, easing: 'spring', properties: {} } },
        { id: 'cta-button', type: 'shape', content: 'Get Started Free →', position: { x: 50, y: 60, z: 1 }, size: { width: 300, height: 70 }, style: { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: 35, fontSize: 22, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(59,130,246,0.4)' }, animation: { name: 'bounceIn', type: 'scale', duration: 0.6, delay: 0.4, easing: 'spring', properties: {} } },
      ],
      animations: [],
      transition: null,
    },
  ],
  requiredAssets: [],
  style: {
    colorPalette: ['#ffffff', '#3b82f6', '#10b981', '#8b5cf6'],
    typography: { primary: 'Inter', secondary: 'Inter', sizes: {} },
    spacing: 16,
    borderRadius: 20,
  },
};

// ============================================================================
// SHOWCASE DATA STRUCTURE
// ============================================================================

interface ShowcaseItem {
  id: string;
  name: string;
  description: string;
  plan: VideoPlan;
  category: string;
  tags: string[];
}

const SHOWCASES: ShowcaseItem[] = [
  // Elements
  { id: 'phone', name: 'Phone Mockups', description: 'Realistic iPhone/Android with animations', plan: phoneShowcasePlan, category: 'elements', tags: ['mockup', 'mobile', 'device'] },
  { id: 'bar-chart', name: 'Bar Chart', description: 'Animated bar chart with spring physics', plan: barChartShowcasePlan, category: 'elements', tags: ['charts', 'data', 'bar'] },
  { id: 'line-chart', name: 'Line Chart', description: 'Animated line chart with path drawing', plan: lineChartShowcasePlan, category: 'elements', tags: ['charts', 'data', 'line'] },
  { id: 'pie-chart', name: 'Pie Chart', description: 'Animated pie chart with segments', plan: pieChartShowcasePlan, category: 'elements', tags: ['charts', 'data', 'pie'] },
  { id: 'donut-chart', name: 'Donut Chart', description: 'Animated donut chart with center value', plan: donutChartShowcasePlan, category: 'elements', tags: ['charts', 'data', 'donut'] },
  { id: 'code', name: 'Code Editor', description: 'Syntax highlighting with typing', plan: codeEditorShowcasePlan, category: 'elements', tags: ['code', 'developer', 'tech'] },
  { id: 'logos', name: 'Logo Grid', description: 'Animated partner/client logos', plan: logoGridShowcasePlan, category: 'elements', tags: ['logos', 'brands', 'partners'] },
  
  // Animations
  { id: 'parallax', name: '6-Layer Parallax', description: 'Depth system with atmospheric effects', plan: parallaxShowcasePlan, category: 'animations', tags: ['parallax', 'depth', '3d'] },
  { id: 'spring', name: 'Spring Physics', description: 'Realistic bounce and elastic animations', plan: springAnimationPlan, category: 'animations', tags: ['spring', 'physics', 'bounce'] },
  { id: '3d', name: '3D Perspective', description: 'Rotating 3D card transforms', plan: transform3DPlan, category: 'animations', tags: ['3d', 'perspective', 'transform'] },
  
  // Styles
  { id: 'glass', name: 'Glassmorphism', description: 'Frosted glass with blur effects', plan: glassmorphismPlan, category: 'styles', tags: ['glass', 'blur', 'modern'] },
  { id: 'gradients', name: 'Gradients', description: '6 beautiful gradient presets', plan: gradientsPlan, category: 'styles', tags: ['gradient', 'color', 'vibrant'] },
  { id: 'glow', name: 'Glow Effects', description: 'Neon glows and shadows', plan: glowEffectsPlan, category: 'styles', tags: ['glow', 'neon', 'effects'] },
  
  // Audio
  { id: 'audio', name: 'Audio Visualization', description: 'Real audio-reactive graphics', plan: audioVisualizationPlan, category: 'audio', tags: ['audio', 'music', 'visualization'] },
  
  // Compositions
  { id: 'launch', name: 'Product Launch', description: 'Complete multi-scene video', plan: productLaunchPlan, category: 'compositions', tags: ['product', 'launch', 'marketing'] },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UltimateShowcase = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('elements');
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseItem | null>(null);
  
  const filteredShowcases = SHOWCASES.filter(s => s.category === activeCategory);
  
  return (
    <div className="min-h-screen bg-background noise-bg">
      <Header />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-7xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
              <h1 className="text-5xl font-bold">
                <span className="gradient-text">Ultimate Showcase</span>
              </h1>
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every component, animation, style, and effect this video generation system can create.
              <span className="text-primary font-semibold"> See what's possible.</span>
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              {[
                { label: 'Components', value: '12+' },
                { label: 'Animations', value: '20+' },
                { label: 'Styles', value: '50+' },
                { label: 'Effects', value: '30+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveShowcase(null);
                  }}
                  className={`gap-2 transition-all ${
                    activeCategory === category.id 
                      ? `bg-gradient-to-r ${category.color} border-0` 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Category description */}
            <p className="text-center text-muted-foreground mt-4">
              {CATEGORIES.find(c => c.id === activeCategory)?.description}
            </p>
          </motion.div>
          
          {/* Showcase Grid */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {filteredShowcases.map((showcase, index) => (
              <motion.div
                key={showcase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
                  activeShowcase?.id === showcase.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveShowcase(showcase)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{showcase.name}</h3>
                    <p className="text-sm text-muted-foreground">{showcase.description}</p>
                  </div>
                  <Play className="w-5 h-5 text-primary shrink-0" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {showcase.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Active Showcase Player */}
          <AnimatePresence mode="wait">
            {activeShowcase && (
              <motion.div
                key={activeShowcase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{activeShowcase.name}</h3>
                    <p className="text-muted-foreground">{activeShowcase.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      {activeShowcase.plan.duration}s @ {activeShowcase.plan.fps}fps
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveShowcase(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                <RemotionPlayerWrapper 
                  plan={activeShowcase.plan} 
                  className="rounded-xl overflow-hidden" 
                />
                
                {/* Technical details */}
                <div className="mt-4 p-4 glass-card bg-primary/5 border-primary/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Scenes:</span>
                      <span className="ml-2 font-mono text-foreground">{activeShowcase.plan.scenes.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Elements:</span>
                      <span className="ml-2 font-mono text-foreground">
                        {activeShowcase.plan.scenes.reduce((acc, s) => acc + s.elements.length, 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resolution:</span>
                      <span className="ml-2 font-mono text-foreground">
                        {activeShowcase.plan.resolution.width}x{activeShowcase.plan.resolution.height}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Frames:</span>
                      <span className="ml-2 font-mono text-foreground">
                        {activeShowcase.plan.duration * activeShowcase.plan.fps}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Empty state when no showcase selected */}
          {!activeShowcase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Grid3X3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Select a showcase above
              </h3>
              <p className="text-muted-foreground">
                Click on any card to preview that component or effect
              </p>
            </motion.div>
          )}
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass-card p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-3">Ready to Create Your Own?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              All these components and effects are available in the AI video generator. 
              Just describe what you want and watch the magic happen.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/create')} className="gap-2 glow-primary">
                <Wand2 className="w-5 h-5" />
                Create with AI
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/wizard')} className="gap-2">
                <Layers className="w-5 h-5" />
                Use Wizard
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default UltimateShowcase;
