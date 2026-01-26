/**
 * Mobajump Product Launch Video Plan
 * Professional video showcasing the key value propositions
 */

import type { VideoPlan } from '@/types/video';

export function generateMobajumpVideo(): VideoPlan {
  return {
    id: 'mobajump-launch-' + Date.now(),
    duration: 15,
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    aspectRatio: 'landscape',
    scenes: [
      // Scene 1: Hook - The Problem (0-4s)
      {
        id: 'scene-1',
        startTime: 0,
        duration: 4,
        description: 'No Xcode. No Mac. No Problem.',
        elements: [
          {
            id: 'headline-1',
            type: 'text',
            content: 'No Xcode. No Mac.',
            position: { x: 50, y: 35, z: 10 },
            size: { width: 85, height: 15 },
            style: {
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'headline-2',
            type: 'text',
            content: 'No Problem.',
            position: { x: 50, y: 55, z: 10 },
            size: { width: 85, height: 15 },
            style: {
              fontSize: 72,
              fontWeight: 800,
              color: '#00ff88',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.4,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          // Decorative circles
          {
            id: 'circle-accent-1',
            type: 'shape',
            content: 'circle',
            position: { x: 15, y: 45, z: 3 },
            size: { width: 120, height: 120 },
            style: {
              color: '#00ff8844',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.5,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'circle-accent-2',
            type: 'shape',
            content: 'circle',
            position: { x: 85, y: 45, z: 3 },
            size: { width: 100, height: 100 },
            style: {
              color: '#0088ff44',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.7,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
        ],
        animations: [],
        transition: {
          type: 'fade',
          duration: 0.4,
        },
        voiceover: undefined,
      },
      
      // Scene 2: Solution - Mobajump Logo & Tagline (4-8s)
      {
        id: 'scene-2',
        startTime: 4,
        duration: 4,
        description: 'Mobajump - Ship to App Store',
        elements: [
          {
            id: 'logo-text',
            type: 'text',
            content: 'Mobajump',
            position: { x: 50, y: 40, z: 10 },
            size: { width: 70, height: 15 },
            style: {
              fontSize: 96,
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'tagline',
            type: 'text',
            content: 'Ship to App Store in Days',
            position: { x: 50, y: 60, z: 10 },
            size: { width: 80, height: 10 },
            style: {
              fontSize: 42,
              fontWeight: 600,
              color: '#00ff88',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0.3,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          // Animated triangles representing features
          {
            id: 'triangle-1',
            type: 'shape',
            content: 'triangle',
            position: { x: 25, y: 50, z: 4 },
            size: { width: 80, height: 80 },
            style: {
              color: '#ff006644',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.6,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'triangle-2',
            type: 'shape',
            content: 'triangle',
            position: { x: 75, y: 50, z: 4 },
            size: { width: 80, height: 80 },
            style: {
              color: '#8800ff44',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.8,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
        ],
        animations: [],
        transition: {
          type: 'fade',
          duration: 0.4,
        },
        voiceover: undefined,
      },
      
      // Scene 3: Key Features with Icons (8-12s)
      {
        id: 'scene-3',
        startTime: 8,
        duration: 4,
        description: 'Key features showcase',
        elements: [
          {
            id: 'features-title',
            type: 'text',
            content: 'Cloud Builds • Auto Signing • TestFlight',
            position: { x: 50, y: 30, z: 10 },
            size: { width: 90, height: 10 },
            style: {
              fontSize: 48,
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          // Feature icons as shapes
          {
            id: 'feature-icon-1',
            type: 'shape',
            content: 'square',
            position: { x: 25, y: 55, z: 5 },
            size: { width: 110, height: 110 },
            style: {
              color: '#0088ff',
              borderRadius: 20,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.3,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'feature-icon-2',
            type: 'shape',
            content: 'star',
            position: { x: 50, y: 55, z: 5 },
            size: { width: 110, height: 110 },
            style: {
              color: '#00ff88',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.5,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'feature-icon-3',
            type: 'shape',
            content: 'hexagon',
            position: { x: 75, y: 55, z: 5 },
            size: { width: 110, height: 110 },
            style: {
              color: '#ff0066',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.7,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'feature-text',
            type: 'text',
            content: 'Everything Automated',
            position: { x: 50, y: 75, z: 10 },
            size: { width: 70, height: 8 },
            style: {
              fontSize: 36,
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0.9,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
        ],
        animations: [],
        transition: {
          type: 'fade',
          duration: 0.4,
        },
        voiceover: undefined,
      },
      
      // Scene 4: Call to Action (12-15s)
      {
        id: 'scene-4',
        startTime: 12,
        duration: 3,
        description: 'Call to action',
        elements: [
          {
            id: 'cta-main',
            type: 'text',
            content: 'Start Building Free',
            position: { x: 50, y: 45, z: 10 },
            size: { width: 80, height: 15 },
            style: {
              fontSize: 78,
              fontWeight: 900,
              color: '#00ff88',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'cta-sub',
            type: 'text',
            content: '2 Free Builds • No Credit Card',
            position: { x: 50, y: 60, z: 10 },
            size: { width: 80, height: 8 },
            style: {
              fontSize: 38,
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.8,
              delay: 0.3,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          // Explosive stars for emphasis
          {
            id: 'star-cta-1',
            type: 'shape',
            content: 'star',
            position: { x: 20, y: 45, z: 4 },
            size: { width: 90, height: 90 },
            style: {
              color: '#ffaa0088',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.5,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'star-cta-2',
            type: 'shape',
            content: 'star',
            position: { x: 80, y: 45, z: 4 },
            size: { width: 90, height: 90 },
            style: {
              color: '#ff006688',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 0.6,
              delay: 0.7,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'circle-cta',
            type: 'shape',
            content: 'circle',
            position: { x: 50, y: 30, z: 3 },
            size: { width: 140, height: 140 },
            style: {
              color: '#0088ff33',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.4,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
        ],
        animations: [],
        transition: null,
        voiceover: undefined,
      },
    ],
    requiredAssets: [],
    style: {
      colorPalette: ['#ffffff', '#00ff88', '#0f0f1a', '#1a1a2e'],
      typography: {
        primary: 'Inter',
        secondary: 'Inter',
        sizes: {
          h1: 78,
          h2: 48,
          body: 24,
        },
      },
      spacing: 24,
      borderRadius: 24,
    },
    captions: [],
  };
}
