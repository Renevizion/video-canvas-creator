import { describe, it, expect } from 'vitest';
import { 
  detectMotionGraphics, 
  detectContentType,
  validatePromptQuality,
  getMotionGraphicsTips 
} from '@/lib/contentTypeDetector';

describe('Content Type Detector', () => {
  describe('detectMotionGraphics', () => {
    it('should detect motion graphics keywords', () => {
      expect(detectMotionGraphics('Create a motion graphics video')).toBe(true);
      expect(detectMotionGraphics('Animated shapes and geometric patterns')).toBe(true);
      expect(detectMotionGraphics('Abstract animation with circles')).toBe(true);
      expect(detectMotionGraphics('Logo reveal with motion graphic')).toBe(true);
    });

    it('should not detect motion graphics in regular prompts', () => {
      expect(detectMotionGraphics('Create a product showcase video')).toBe(false);
      expect(detectMotionGraphics('SaaS demo video')).toBe(false);
      expect(detectMotionGraphics('Brand storytelling')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(detectMotionGraphics('MOTION GRAPHICS VIDEO')).toBe(true);
      expect(detectMotionGraphics('Motion Graphics Video')).toBe(true);
    });
  });

  describe('detectContentType', () => {
    it('should detect motion graphics content', () => {
      const result = detectContentType('Create a motion graphics intro with animated shapes');
      expect(result.type).toBe('motion-graphics');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.suggestedElements.length).toBeGreaterThan(0);
      expect(result.hints.length).toBeGreaterThan(0);
    });

    it('should detect tech/SaaS content', () => {
      const result = detectContentType('Create a video for our SaaS analytics platform');
      expect(result.type).toBe('tech-saas');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.suggestedElements.some(el => el.toLowerCase().includes('code'))).toBe(true);
    });

    it('should detect product content', () => {
      const result = detectContentType('Showcase our new product line');
      expect(result.type).toBe('product');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should detect service content', () => {
      const result = detectContentType('Professional consulting services video');
      expect(result.type).toBe('service');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should detect brand/lifestyle content', () => {
      const result = detectContentType('Our brand story and mission');
      expect(result.type).toBe('brand-lifestyle');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should detect explainer content', () => {
      const result = detectContentType('How to guide tutorial video explaining our features');
      expect(result.type).toBe('explainer');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should default to general for ambiguous prompts', () => {
      const result = detectContentType('Make a video');
      expect(result.type).toBe('general');
      expect(result.confidence).toBeLessThan(0.6);
    });
  });

  describe('validatePromptQuality', () => {
    it('should rate high-quality prompts well', () => {
      const result = validatePromptQuality(
        'Create a modern motion graphics video with vibrant blue and purple colors, showcasing our SaaS platform features with animated icons and smooth transitions'
      );
      expect(result.score).toBeGreaterThan(60);
      expect(result.isGood).toBe(true);
      expect(result.suggestions.length).toBeLessThan(2);
    });

    it('should identify low-quality prompts', () => {
      const result = validatePromptQuality('Make video');
      expect(result.score).toBeLessThan(60);
      expect(result.isGood).toBe(false);
      expect(result.suggestions.length).toBeGreaterThan(2);
    });

    it('should provide helpful suggestions', () => {
      const result = validatePromptQuality('Create a video for my company');
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.some(s => s.toLowerCase().includes('detail') || s.toLowerCase().includes('specific'))).toBe(true);
    });

    it('should reward specific details', () => {
      const withDetails = validatePromptQuality(
        'Create a professional modern video with blue colors showcasing our features'
      );
      const withoutDetails = validatePromptQuality('Create a video');
      
      expect(withDetails.score).toBeGreaterThan(withoutDetails.score);
    });
  });

  describe('getMotionGraphicsTips', () => {
    it('should return helpful tips', () => {
      const tips = getMotionGraphicsTips();
      expect(tips.length).toBeGreaterThan(5);
      expect(tips.every(tip => typeof tip === 'string')).toBe(true);
      expect(tips.every(tip => tip.length > 0)).toBe(true);
    });

    it('should include emoji for visual appeal', () => {
      const tips = getMotionGraphicsTips();
      expect(tips.some(tip => /[\u{1F300}-\u{1F9FF}]/u.test(tip))).toBe(true);
    });
  });
});
