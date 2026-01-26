/**
 * Image Asset Manager
 * Handles AI-generated images for Remotion videos
 * Ensures images are properly loaded and work with Remotion's <Img> component
 */

import { generateAsset } from './api';
import type { AssetRequirement, PlannedElement } from '@/types/video';

export interface ImageAssetMetadata {
  id: string;
  description: string;
  width: number;
  height: number;
  style: string;
  url?: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  error?: string;
}

/**
 * Extracts image requirements from video plan elements
 */
export function extractImageRequirements(elements: PlannedElement[]): AssetRequirement[] {
  const requirements: AssetRequirement[] = [];

  for (const element of elements) {
    if (element.type === 'image') {
      const content = element.content || '';
      const style = element.style as Record<string, unknown>;
      
      // Check if image already has a URL (user-provided or already generated)
      const hasUrl = content.startsWith('http') || 
                     content.startsWith('data:') || 
                     (style?.src && typeof style.src === 'string');

      if (!hasUrl) {
        // This image needs to be generated
        requirements.push({
          id: element.id,
          type: 'image',
          description: content || 'Generated image',
          specifications: {
            width: element.size?.width || 1024,
            height: element.size?.height || 1024,
            style: (style?.imageStyle as string) || 'photorealistic',
          },
          providedByUser: false,
        });
      }
    }
  }

  return requirements;
}

/**
 * Generates AI images for elements that need them
 * Returns a map of element IDs to generated image URLs
 */
export async function generateImagesForPlan(
  requirements: AssetRequirement[],
  onProgress?: (assetId: string, status: string) => void
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();

  for (const req of requirements) {
    try {
      onProgress?.(req.id, 'generating');

      const result = await generateAsset(
        req.id,
        req.description,
        req.specifications.width,
        req.specifications.height,
        req.specifications.style
      );

      if (result.url) {
        imageMap.set(req.id, result.url);
        onProgress?.(req.id, 'ready');
      } else {
        throw new Error('No URL returned from asset generation');
      }
    } catch (error) {
      console.error(`Failed to generate image for ${req.id}:`, error);
      onProgress?.(req.id, 'error');
      // Continue with other images even if one fails
    }
  }

  return imageMap;
}

/**
 * Updates plan elements with generated image URLs
 * This ensures the images are properly set before rendering
 */
export function injectImageUrls(
  elements: PlannedElement[],
  imageMap: Map<string, string>
): PlannedElement[] {
  return elements.map(element => {
    if (element.type === 'image' && imageMap.has(element.id)) {
      const url = imageMap.get(element.id)!;
      
      // Set the URL in the content field (primary) and style.src (fallback)
      return {
        ...element,
        content: url,
        style: {
          ...element.style,
          src: url,
        },
      };
    }
    return element;
  });
}

/**
 * Validates that all images in the plan are ready for rendering
 * Returns list of missing/problematic images
 */
export function validateImagesForRendering(elements: PlannedElement[]): {
  valid: boolean;
  missingImages: string[];
  issues: string[];
} {
  const missingImages: string[] = [];
  const issues: string[] = [];

  for (const element of elements) {
    if (element.type === 'image') {
      const content = element.content || '';
      const style = element.style as Record<string, unknown>;
      
      const hasUrl = content.startsWith('http') || 
                     content.startsWith('data:') || 
                     (style?.src && typeof style.src === 'string');

      if (!hasUrl) {
        missingImages.push(element.id);
        issues.push(`Image element "${element.id}" has no URL or source`);
      } else {
        // Check if URL is valid
        try {
          new URL(content.startsWith('http') ? content : style.src as string);
        } catch {
          issues.push(`Image element "${element.id}" has invalid URL format`);
        }
      }
    }
  }

  return {
    valid: missingImages.length === 0 && issues.length === 0,
    missingImages,
    issues,
  };
}

/**
 * Preloads images to ensure they're cached before rendering
 * This improves Remotion rendering performance
 */
export async function preloadImages(elements: PlannedElement[]): Promise<void> {
  const imageUrls: string[] = [];

  for (const element of elements) {
    if (element.type === 'image') {
      const content = element.content || '';
      const style = element.style as Record<string, unknown>;
      
      if (content.startsWith('http')) {
        imageUrls.push(content);
      } else if (style?.src && typeof style.src === 'string' && style.src.startsWith('http')) {
        imageUrls.push(style.src as string);
      }
    }
  }

  // Preload all images in parallel
  await Promise.all(
    imageUrls.map(url => 
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      }).catch(err => {
        console.warn(`Failed to preload image: ${url}`, err);
        // Don't fail the whole operation if one image fails to preload
      })
    )
  );
}

/**
 * Optimizes image URLs for Remotion rendering
 * Adds query parameters for optimal size/format if the URL supports it
 */
export function optimizeImageUrl(
  url: string,
  targetWidth?: number,
  targetHeight?: number
): string {
  try {
    const urlObj = new URL(url);
    
    // For Supabase Storage URLs, add transformation parameters
    if (urlObj.hostname.includes('supabase')) {
      if (targetWidth) urlObj.searchParams.set('width', targetWidth.toString());
      if (targetHeight) urlObj.searchParams.set('height', targetHeight.toString());
      urlObj.searchParams.set('quality', '90');
      urlObj.searchParams.set('format', 'webp');
    }
    
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

/**
 * Gets recommended image dimensions for video resolution
 */
export function getRecommendedImageSize(videoWidth: number, videoHeight: number): {
  width: number;
  height: number;
} {
  // For 1080p video, recommend 1920x1080 images
  // For 4K video, recommend 3840x2160 images
  return {
    width: videoWidth,
    height: videoHeight,
  };
}

/**
 * Batch generate images for an entire video plan
 * Handles all scenes and their image elements
 */
export async function generateAllPlanImages(
  plan: any,
  onProgress?: (sceneIndex: number, elementId: string, status: string) => void
): Promise<any> {
  const updatedScenes = [];

  for (let sceneIndex = 0; sceneIndex < plan.scenes.length; sceneIndex++) {
    const scene = plan.scenes[sceneIndex];
    const requirements = extractImageRequirements(scene.elements || []);

    if (requirements.length > 0) {
      const imageMap = await generateImagesForPlan(
        requirements,
        (assetId, status) => onProgress?.(sceneIndex, assetId, status)
      );

      const updatedElements = injectImageUrls(scene.elements || [], imageMap);
      updatedScenes.push({
        ...scene,
        elements: updatedElements,
      });
    } else {
      updatedScenes.push(scene);
    }
  }

  return {
    ...plan,
    scenes: updatedScenes,
  };
}
