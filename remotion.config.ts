import { Config } from '@remotion/cli/config';

// Remotion configuration for high-grade video rendering
// Documentation: https://www.remotion.dev/docs/config

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// High quality settings for production renders
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');

// Concurrency settings - adjust based on your server capacity
// Set to 2 for compatibility, but you may increase based on your CPU cores
// For example: Math.max(1, os.cpus().length - 1) for optimal performance
Config.setConcurrency(2);

// Chrome/Puppeteer settings for better performance
Config.setChromiumOpenGlRenderer('angle');
// Let Remotion automatically determine the best browser configuration

