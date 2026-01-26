/**
 * Test Video Generator
 * Creates a test video plan with shapes and transitions for testing
 */

import type { VideoPlan } from '@/types/video';

export function generateTestVideoPlan(): VideoPlan {
  return {
    id: 'test-video-' + Date.now(),
    duration: 10,
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    aspectRatio: 'landscape',
    scenes: [
      {
        id: 'scene-1',
        startTime: 0,
        duration: 3,
        description: 'Animated circles',
        elements: [
          {
            id: 'text-1',
            type: 'text',
            content: 'Geometric Shapes',
            position: { x: 50, y: 20, z: 10 },
            size: { width: 80, height: 10 },
            style: {
              fontSize: 64,
              fontWeight: 800,
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
            id: 'shape-circle-1',
            type: 'shape',
            content: 'circle',
            position: { x: 30, y: 50, z: 5 },
            size: { width: 150, height: 150 },
            style: {
              color: '#06b6d4',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.3,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'shape-circle-2',
            type: 'shape',
            content: 'circle',
            position: { x: 70, y: 50, z: 5 },
            size: { width: 120, height: 120 },
            style: {
              color: '#8b5cf6',
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
        ],
        animations: [],
        transition: {
          type: 'fade',
          duration: 0.3,
        },
        voiceover: undefined,
      },
      {
        id: 'scene-2',
        startTime: 3,
        duration: 3.5,
        description: 'Triangles and stars',
        elements: [
          {
            id: 'text-2',
            type: 'text',
            content: 'Smooth Transitions',
            position: { x: 50, y: 20, z: 10 },
            size: { width: 80, height: 10 },
            style: {
              fontSize: 64,
              fontWeight: 800,
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
            id: 'shape-triangle-1',
            type: 'shape',
            content: 'triangle',
            position: { x: 25, y: 55, z: 5 },
            size: { width: 140, height: 140 },
            style: {
              color: '#f59e0b',
              borderRadius: 0,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.2,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'shape-star-1',
            type: 'shape',
            content: 'star',
            position: { x: 75, y: 55, z: 5 },
            size: { width: 160, height: 160 },
            style: {
              color: '#ef4444',
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
        transition: {
          type: 'fade',
          duration: 0.3,
        },
        voiceover: undefined,
      },
      {
        id: 'scene-3',
        startTime: 6.5,
        duration: 3.5,
        description: 'Mixed shapes finale',
        elements: [
          {
            id: 'text-3',
            type: 'text',
            content: 'Beautiful Animations',
            position: { x: 50, y: 20, z: 10 },
            size: { width: 80, height: 10 },
            style: {
              fontSize: 64,
              fontWeight: 800,
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
            id: 'shape-rect-1',
            type: 'shape',
            content: 'square',
            position: { x: 20, y: 50, z: 5 },
            size: { width: 130, height: 130 },
            style: {
              color: '#10b981',
              borderRadius: 24,
            },
            animation: {
              name: 'fadeIn',
              type: 'fade',
              duration: 1.0,
              delay: 0.2,
              easing: 'ease-out',
              properties: { opacity: [0, 1] },
            },
          },
          {
            id: 'shape-polygon-1',
            type: 'shape',
            content: 'hexagon',
            position: { x: 50, y: 60, z: 5 },
            size: { width: 140, height: 140 },
            style: {
              color: '#ec4899',
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
          {
            id: 'shape-star-2',
            type: 'shape',
            content: 'star',
            position: { x: 80, y: 50, z: 5 },
            size: { width: 120, height: 120 },
            style: {
              color: '#f59e0b',
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
        ],
        animations: [],
        transition: null,
        voiceover: undefined,
      },
    ],
    requiredAssets: [],
    style: {
      colorPalette: ['#ffffff', '#06b6d4', '#1e293b', '#0f172a'],
      typography: {
        primary: 'Inter',
        secondary: 'Inter',
        sizes: {
          h1: 64,
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
