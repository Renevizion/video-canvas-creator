/**
 * Caption Manager for Social Media Videos
 * Handles TikTok-style captions, SRT parsing, and caption rendering
 */

import type { CaptionData } from '@/types/video';

/**
 * Aspect ratio presets for different social media platforms
 */
export const ASPECT_RATIOS = {
  landscape: { width: 1920, height: 1080, label: 'Landscape (16:9)', platforms: ['YouTube', 'LinkedIn'] },
  portrait: { width: 1080, height: 1920, label: 'Portrait (9:16)', platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'] },
  square: { width: 1080, height: 1080, label: 'Square (1:1)', platforms: ['Instagram Feed', 'Facebook'] },
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;

/**
 * Get resolution for aspect ratio
 */
export function getResolutionForAspectRatio(aspectRatio: AspectRatioKey) {
  return ASPECT_RATIOS[aspectRatio];
}

/**
 * Parse SRT (SubRip) caption file format
 * Format:
 * 1
 * 00:00:00,000 --> 00:00:02,000
 * First caption text
 */
export function parseSRT(srtContent: string): CaptionData[] {
  const captions: CaptionData[] = [];
  const blocks = srtContent.trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;

    // Parse timestamp line (format: 00:00:00,000 --> 00:00:02,000)
    const timestampLine = lines[1];
    const match = timestampLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    
    if (!match) continue;

    const [, startH, startM, startS, startMs, endH, endM, endS, endMs] = match;
    
    const startTime = 
      parseInt(startH) * 3600 +
      parseInt(startM) * 60 +
      parseInt(startS) +
      parseInt(startMs) / 1000;
      
    const endTime =
      parseInt(endH) * 3600 +
      parseInt(endM) * 60 +
      parseInt(endS) +
      parseInt(endMs) / 1000;

    // Text is everything after the timestamp line
    const text = lines.slice(2).join('\n');

    captions.push({
      startTime,
      endTime,
      text,
    });
  }

  return captions;
}

/**
 * Serialize captions to SRT format
 */
export function serializeSRT(captions: CaptionData[]): string {
  return captions.map((caption, index) => {
    const startTime = formatSRTTime(caption.startTime);
    const endTime = formatSRTTime(caption.endTime);
    
    return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n`;
  }).join('\n');
}

/**
 * Format time in SRT format (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return num.toString().padStart(size, '0');
}

/**
 * Generate captions from voiceover text
 * Splits text into timed segments for display
 */
export function generateCaptionsFromText(
  text: string,
  duration: number,
  wordsPerSecond: number = 2.5 // Average speaking rate
): CaptionData[] {
  const words = text.trim().split(/\s+/);
  const captions: CaptionData[] = [];
  
  // TikTok-style: Show 3-5 words at a time
  const wordsPerCaption = 4;
  const totalTime = duration;
  const timePerCaption = (totalTime / words.length) * wordsPerCaption;

  let currentTime = 0;
  for (let i = 0; i < words.length; i += wordsPerCaption) {
    const captionWords = words.slice(i, i + wordsPerCaption);
    const endTime = Math.min(currentTime + timePerCaption, totalTime);

    captions.push({
      startTime: currentTime,
      endTime: endTime,
      text: captionWords.join(' '),
    });

    currentTime = endTime;
  }

  return captions;
}

/**
 * Get captions active at a specific time
 */
export function getCaptionAtTime(captions: CaptionData[], time: number): CaptionData | null {
  return captions.find(caption => 
    time >= caption.startTime && time < caption.endTime
  ) || null;
}

/**
 * TikTok-style caption styling options
 */
export const CAPTION_STYLES = {
  tiktok: {
    fontSize: 48,
    fontWeight: 900,
    textTransform: 'uppercase' as const,
    color: '#ffffff',
    stroke: '#000000',
    strokeWidth: 8,
    textAlign: 'center' as const,
    backgroundColor: 'transparent',
    padding: 20,
    letterSpacing: 2,
    wordHighlight: true, // Highlight words as they're spoken
  },
  simple: {
    fontSize: 36,
    fontWeight: 700,
    textTransform: 'none' as const,
    color: '#ffffff',
    stroke: 'transparent',
    strokeWidth: 0,
    textAlign: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    letterSpacing: 0,
    wordHighlight: false,
  },
  minimal: {
    fontSize: 32,
    fontWeight: 600,
    textTransform: 'none' as const,
    color: '#ffffff',
    stroke: 'transparent',
    strokeWidth: 0,
    textAlign: 'center' as const,
    backgroundColor: 'transparent',
    padding: 12,
    letterSpacing: 0,
    wordHighlight: false,
  },
} as const;

/**
 * Validate caption timing
 */
export function validateCaptions(captions: CaptionData[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (let i = 0; i < captions.length; i++) {
    const caption = captions[i];

    // Check timing
    if (caption.startTime >= caption.endTime) {
      errors.push(`Caption ${i + 1}: Start time must be before end time`);
    }

    // Check overlap with next caption
    if (i < captions.length - 1) {
      const nextCaption = captions[i + 1];
      if (caption.endTime > nextCaption.startTime) {
        errors.push(`Caption ${i + 1}: Overlaps with next caption`);
      }
    }

    // Check text
    if (!caption.text.trim()) {
      errors.push(`Caption ${i + 1}: Empty text`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export captions for different platforms
 */
export function exportCaptionsForPlatform(
  captions: CaptionData[],
  platform: 'tiktok' | 'youtube' | 'instagram'
): string {
  switch (platform) {
    case 'tiktok':
    case 'instagram':
      // These platforms typically use burned-in captions
      return 'Captions are burned into video';
    
    case 'youtube':
      // YouTube uses SRT format
      return serializeSRT(captions);
    
    default:
      return serializeSRT(captions);
  }
}

/**
 * Generate caption file for download
 */
export function downloadCaptionFile(captions: CaptionData[], filename: string = 'captions.srt') {
  const srtContent = serializeSRT(captions);
  const blob = new Blob([srtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
