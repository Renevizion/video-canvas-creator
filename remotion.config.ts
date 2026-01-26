import { Config } from '@remotion/cli/config';

// Remotion configuration for high-grade video rendering
// Documentation: https://www.remotion.dev/docs/config

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// High quality settings for production renders
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');

// Concurrency settings - adjust based on your server capacity
// For local development, use fewer threads (automatically adjusted based on CPU cores)
Config.setConcurrency(2);

// Chrome/Puppeteer settings for better performance
Config.setChromiumOpenGlRenderer('angle');
// Let Remotion automatically determine the best browser configuration

