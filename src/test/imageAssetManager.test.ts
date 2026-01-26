import { describe, it, expect } from 'vitest';
import { 
  extractImageRequirements,
  injectImageUrls,
  validateImagesForRendering 
} from '@/lib/imageAssetManager';
import type { PlannedElement, AssetRequirement } from '@/types/video';

describe('Image Asset Manager', () => {
  describe('extractImageRequirements', () => {
    it('should extract requirements from image elements without URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'A beautiful sunset',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const requirements = extractImageRequirements(elements);
      expect(requirements).toHaveLength(1);
      expect(requirements[0].id).toBe('img1');
      expect(requirements[0].description).toBe('A beautiful sunset');
    });

    it('should skip elements with existing URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'https://example.com/image.jpg',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const requirements = extractImageRequirements(elements);
      expect(requirements).toHaveLength(0);
    });

    it('should prioritize plan.requiredAssets specifications', () => {
      const elements: PlannedElement[] = [
        {
          id: 'asset_1',
          type: 'image',
          content: 'Generic description',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 1024, height: 1024 },
          style: {},
        },
      ];

      const planRequiredAssets: AssetRequirement[] = [
        {
          id: 'asset_1',
          type: 'image',
          description: 'Detailed AI-generated description',
          specifications: {
            width: 512,
            height: 512,
            style: 'abstract',
          },
          providedByUser: false,
        },
      ];

      const requirements = extractImageRequirements(elements, planRequiredAssets);
      expect(requirements).toHaveLength(1);
      expect(requirements[0].description).toBe('Detailed AI-generated description');
      expect(requirements[0].specifications.width).toBe(512);
      expect(requirements[0].specifications.style).toBe('abstract');
    });

    it('should process both requiredAssets and inline elements', () => {
      const elements: PlannedElement[] = [
        {
          id: 'asset_1',
          type: 'image',
          content: 'Image from requiredAssets',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 512, height: 512 },
          style: {},
        },
        {
          id: 'img2',
          type: 'image',
          content: 'Inline image element',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const planRequiredAssets: AssetRequirement[] = [
        {
          id: 'asset_1',
          type: 'image',
          description: 'AI-specified asset',
          specifications: {
            width: 512,
            height: 512,
            style: 'icon',
          },
          providedByUser: false,
        },
      ];

      const requirements = extractImageRequirements(elements, planRequiredAssets);
      expect(requirements).toHaveLength(2);
      expect(requirements[0].id).toBe('asset_1');
      expect(requirements[1].id).toBe('img2');
    });

    it('should handle non-image elements gracefully', () => {
      const elements: PlannedElement[] = [
        {
          id: 'text1',
          type: 'text',
          content: 'Hello World',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 100, height: 50 },
          style: {},
        },
        {
          id: 'img1',
          type: 'image',
          content: 'Image description',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const requirements = extractImageRequirements(elements);
      expect(requirements).toHaveLength(1);
      expect(requirements[0].id).toBe('img1');
    });
  });

  describe('injectImageUrls', () => {
    it('should inject URLs into image elements', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'Description',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const imageMap = new Map([['img1', 'https://example.com/generated.jpg']]);
      const updated = injectImageUrls(elements, imageMap);

      expect(updated[0].content).toBe('https://example.com/generated.jpg');
      expect((updated[0].style as any).src).toBe('https://example.com/generated.jpg');
    });

    it('should not modify elements without matching URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'Description',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const imageMap = new Map([['img2', 'https://example.com/generated.jpg']]);
      const updated = injectImageUrls(elements, imageMap);

      expect(updated[0].content).toBe('Description');
    });

    it('should preserve other element properties', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'Description',
          position: { x: 25, y: 75, z: 2 },
          size: { width: 400, height: 300 },
          style: { opacity: 0.8 },
        },
      ];

      const imageMap = new Map([['img1', 'https://example.com/generated.jpg']]);
      const updated = injectImageUrls(elements, imageMap);

      expect(updated[0].position.x).toBe(25);
      expect(updated[0].position.y).toBe(75);
      expect(updated[0].size.width).toBe(400);
      expect((updated[0].style as any).opacity).toBe(0.8);
    });
  });

  describe('validateImagesForRendering', () => {
    it('should validate elements with proper URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'https://example.com/image.jpg',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const validation = validateImagesForRendering(elements);
      expect(validation.valid).toBe(true);
      expect(validation.missingImages).toHaveLength(0);
      expect(validation.issues).toHaveLength(0);
    });

    it('should identify missing image URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'No URL here',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const validation = validateImagesForRendering(elements);
      expect(validation.valid).toBe(false);
      expect(validation.missingImages).toContain('img1');
      expect(validation.issues.length).toBeGreaterThan(0);
    });

    it('should validate data URLs', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'data:image/png;base64,iVBORw0KG...',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const validation = validateImagesForRendering(elements);
      // Data URLs should be recognized as valid
      expect(validation.missingImages).toHaveLength(0);
    });

    it('should accept URLs in style.src', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'Description',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: { src: 'https://example.com/image.jpg' },
        },
      ];

      const validation = validateImagesForRendering(elements);
      expect(validation.valid).toBe(true);
    });

    it('should handle mixed valid and invalid elements', () => {
      const elements: PlannedElement[] = [
        {
          id: 'img1',
          type: 'image',
          content: 'https://example.com/valid.jpg',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
        {
          id: 'img2',
          type: 'image',
          content: 'No URL',
          position: { x: 50, y: 50, z: 1 },
          size: { width: 800, height: 600 },
          style: {},
        },
      ];

      const validation = validateImagesForRendering(elements);
      expect(validation.valid).toBe(false);
      expect(validation.missingImages).toContain('img2');
      expect(validation.missingImages).not.toContain('img1');
    });
  });
});
