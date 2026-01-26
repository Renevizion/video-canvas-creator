/**
 * Video Templates Library
 * Professional templates based on video analysis
 */

import type { VideoTemplate } from '@/services/video-generation/VideoGenerationService';

/**
 * Product Demo Template (like Bookedin.ai example from video)
 */
export const productDemoTemplate: VideoTemplate = {
  id: 'product-demo-professional',
  name: 'Product Demo',
  description: 'Professional product demonstration with features showcase',
  category: 'product-demo',
  config: {
    duration: 60,
    fps: 30,
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
  },
  variables: [
    { key: 'productName', label: 'Product Name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text', required: true },
    { key: 'feature1', label: 'Feature 1', type: 'text', required: true },
    { key: 'feature2', label: 'Feature 2', type: 'text', required: true },
    { key: 'feature3', label: 'Feature 3', type: 'text', required: true },
    { key: 'ctaText', label: 'Call to Action', type: 'text', default: 'Get Started Today' },
  ],
  scenes: [
    {
      id: 'intro',
      name: 'Product Introduction',
      startFrame: 0,
      durationInFrames: 90, // 3 seconds
      background: {
        type: 'gradient',
        value: {
          type: 'linear',
          colors: ['#0f172a', '#1e293b'],
          angle: 135,
        },
      },
      layers: [
        {
          id: 'product-name',
          type: 'text',
          startFrame: 0,
          durationInFrames: 90,
          properties: {
            x: 960,
            y: 400,
            width: 1200,
            height: 150,
            text: '{{productName}}',
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 0,
              durationInFrames: 20,
              easing: 'easeOut',
            },
            {
              property: 'y',
              from: 450,
              to: 400,
              startFrame: 0,
              durationInFrames: 30,
              easing: 'spring',
            },
          ],
        },
        {
          id: 'tagline',
          type: 'text',
          startFrame: 20,
          durationInFrames: 70,
          properties: {
            x: 960,
            y: 550,
            width: 1000,
            height: 60,
            text: '{{tagline}}',
            fontSize: 28,
            fontWeight: 400,
            color: '#94a3b8',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 20,
              durationInFrames: 20,
              easing: 'easeOut',
            },
          ],
        },
      ],
      transition: {
        type: 'fade',
        durationInFrames: 15,
      },
    },
    {
      id: 'features',
      name: 'Features Showcase',
      startFrame: 90,
      durationInFrames: 270, // 9 seconds
      background: {
        type: 'color',
        value: '#ffffff',
      },
      layers: [
        {
          id: 'feature-1',
          type: 'component',
          startFrame: 90,
          durationInFrames: 90,
          properties: {
            x: 300,
            y: 400,
            width: 400,
            height: 200,
            componentType: 'feature-card',
            icon: '📅',
            title: '{{feature1}}',
            description: 'Streamline your workflow',
          },
          animations: [
            {
              property: 'scale',
              from: 0.8,
              to: 1,
              startFrame: 90,
              durationInFrames: 20,
              easing: 'spring',
            },
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 90,
              durationInFrames: 15,
              easing: 'easeOut',
            },
          ],
        },
        {
          id: 'feature-2',
          type: 'component',
          startFrame: 150,
          durationInFrames: 90,
          properties: {
            x: 760,
            y: 400,
            width: 400,
            height: 200,
            componentType: 'feature-card',
            icon: '💰',
            title: '{{feature2}}',
            description: 'Grow your revenue',
          },
          animations: [
            {
              property: 'scale',
              from: 0.8,
              to: 1,
              startFrame: 150,
              durationInFrames: 20,
              easing: 'spring',
            },
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 150,
              durationInFrames: 15,
              easing: 'easeOut',
            },
          ],
        },
        {
          id: 'feature-3',
          type: 'component',
          startFrame: 210,
          durationInFrames: 90,
          properties: {
            x: 1220,
            y: 400,
            width: 400,
            height: 200,
            componentType: 'feature-card',
            icon: '🌍',
            title: '{{feature3}}',
            description: 'Global accessibility',
          },
          animations: [
            {
              property: 'scale',
              from: 0.8,
              to: 1,
              startFrame: 210,
              durationInFrames: 20,
              easing: 'spring',
            },
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 210,
              durationInFrames: 15,
              easing: 'easeOut',
            },
          ],
        },
      ],
      transition: {
        type: 'slide',
        durationInFrames: 20,
      },
    },
    {
      id: 'cta',
      name: 'Call to Action',
      startFrame: 360,
      durationInFrames: 240, // 8 seconds
      background: {
        type: 'gradient',
        value: {
          type: 'linear',
          colors: ['#3b82f6', '#8b5cf6'],
          angle: 135,
        },
      },
      layers: [
        {
          id: 'cta-text',
          type: 'text',
          startFrame: 360,
          durationInFrames: 240,
          properties: {
            x: 960,
            y: 500,
            width: 1200,
            height: 100,
            text: '{{ctaText}}',
            fontSize: 56,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'scale',
              from: 0.9,
              to: 1,
              startFrame: 360,
              durationInFrames: 30,
              easing: 'spring',
            },
          ],
        },
      ],
      transition: {
        type: 'fade',
        durationInFrames: 20,
      },
    },
  ],
};

/**
 * YouTube Video Template
 */
export const youtubeVideoTemplate: VideoTemplate = {
  id: 'youtube-standard',
  name: 'YouTube Video',
  description: 'Professional YouTube video with intro and outro',
  category: 'youtube',
  config: {
    duration: 120,
    fps: 30,
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
  },
  variables: [
    { key: 'channelName', label: 'Channel Name', type: 'text', required: true },
    { key: 'videoTitle', label: 'Video Title', type: 'text', required: true },
    { key: 'contentText', label: 'Main Content', type: 'text', required: true },
  ],
  scenes: [
    {
      id: 'intro',
      name: 'Channel Intro',
      startFrame: 0,
      durationInFrames: 90,
      background: {
        type: 'gradient',
        value: {
          type: 'radial',
          colors: ['#1e293b', '#0f172a'],
        },
      },
      layers: [
        {
          id: 'channel-name',
          type: 'text',
          startFrame: 0,
          durationInFrames: 90,
          properties: {
            x: 960,
            y: 540,
            width: 1000,
            height: 120,
            text: '{{channelName}}',
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'scale',
              from: 0.5,
              to: 1,
              startFrame: 0,
              durationInFrames: 40,
              easing: 'spring',
            },
          ],
        },
      ],
      transition: {
        type: 'fade',
        durationInFrames: 15,
      },
    },
    {
      id: 'content',
      name: 'Main Content',
      startFrame: 90,
      durationInFrames: 450,
      background: {
        type: 'color',
        value: '#f8fafc',
      },
      layers: [
        {
          id: 'title',
          type: 'text',
          startFrame: 90,
          durationInFrames: 450,
          properties: {
            x: 960,
            y: 200,
            width: 1600,
            height: 100,
            text: '{{videoTitle}}',
            fontSize: 48,
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
          },
        },
        {
          id: 'content',
          type: 'text',
          startFrame: 120,
          durationInFrames: 420,
          properties: {
            x: 960,
            y: 540,
            width: 1400,
            height: 400,
            text: '{{contentText}}',
            fontSize: 32,
            fontWeight: 400,
            color: '#334155',
            textAlign: 'center',
          },
        },
      ],
      transition: {
        type: 'slide',
        durationInFrames: 20,
      },
    },
  ],
};

/**
 * Social Media Post Template
 */
export const socialMediaTemplate: VideoTemplate = {
  id: 'social-media-square',
  name: 'Social Media Post',
  description: 'Quick social media video for Instagram/Facebook',
  category: 'social-media',
  config: {
    duration: 15,
    fps: 30,
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
  },
  variables: [
    { key: 'headline', label: 'Headline', type: 'text', required: true },
    { key: 'message', label: 'Message', type: 'text', required: true },
  ],
  scenes: [
    {
      id: 'post',
      name: 'Social Post',
      startFrame: 0,
      durationInFrames: 450,
      background: {
        type: 'gradient',
        value: {
          type: 'linear',
          colors: ['#ec4899', '#8b5cf6'],
          angle: 45,
        },
      },
      layers: [
        {
          id: 'headline',
          type: 'text',
          startFrame: 0,
          durationInFrames: 450,
          properties: {
            x: 540,
            y: 400,
            width: 900,
            height: 150,
            text: '{{headline}}',
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'scale',
              from: 0.8,
              to: 1,
              startFrame: 0,
              durationInFrames: 25,
              easing: 'spring',
            },
          ],
        },
        {
          id: 'message',
          type: 'text',
          startFrame: 20,
          durationInFrames: 430,
          properties: {
            x: 540,
            y: 600,
            width: 800,
            height: 100,
            text: '{{message}}',
            fontSize: 32,
            fontWeight: 500,
            color: '#f8fafc',
            textAlign: 'center',
          },
          animations: [
            {
              property: 'opacity',
              from: 0,
              to: 1,
              startFrame: 20,
              durationInFrames: 20,
              easing: 'easeOut',
            },
          ],
        },
      ],
      transition: null,
    },
  ],
};

/**
 * All available templates
 */
export const VIDEO_TEMPLATES: VideoTemplate[] = [
  productDemoTemplate,
  youtubeVideoTemplate,
  socialMediaTemplate,
];
