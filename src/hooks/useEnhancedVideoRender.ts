/**
 * Enhanced Video Rendering Hook
 * Automatically prepares video plans with proper imports and assets before rendering
 */

import { useMutation } from '@tanstack/react-query';
import { renderVideo } from '@/lib/api';
import { generateRequiredImports, validatePlanCompatibility, getPlanFeatureSummary } from '@/lib/remotionCodeHelper';
import { generateAllPlanImages, validateImagesForRendering, preloadImages } from '@/lib/imageAssetManager';
import type { VideoPlan } from '@/types/video';
import { toast } from 'sonner';

interface RenderVideoOptions {
  planId: string;
  plan: VideoPlan;
  autoGenerateImages?: boolean;
  preloadAssets?: boolean;
}

/**
 * Enhanced rendering hook that automatically:
 * 1. Validates plan compatibility
 * 2. Generates required imports dynamically
 * 3. Generates missing AI images
 * 4. Preloads assets
 * 5. Sends to backend for rendering
 */
export function useEnhancedVideoRender() {
  return useMutation({
    mutationFn: async ({
      planId,
      plan,
      autoGenerateImages = true,
      preloadAssets = true,
    }: RenderVideoOptions) => {
      
      // Step 1: Validate plan compatibility
      const validation = validatePlanCompatibility(plan);
      if (validation.warnings.length > 0) {
        console.warn('Plan validation warnings:', validation.warnings);
        toast.info(`Note: ${validation.warnings.length} compatibility warnings`);
      }

      // Step 2: Show what features will be used
      const featureSummary = getPlanFeatureSummary(plan);
      console.log('🎬 Rendering with features:', {
        packages: featureSummary.packages,
        elements: Array.from(featureSummary.elementTypes),
        animations: Array.from(featureSummary.animationTypes),
      });

      // Step 3: Generate required imports dynamically
      const requiredImports = generateRequiredImports(plan);
      console.log('📦 Dynamic imports generated:', requiredImports.split('\n').length, 'packages');

      // Step 4: Generate missing images if enabled
      let updatedPlan = plan;
      if (autoGenerateImages) {
        const imageValidation = validateImagesForRendering(
          plan.scenes.flatMap(s => s.elements || [])
        );

        if (imageValidation.missingImages.length > 0) {
          toast.info(`Generating ${imageValidation.missingImages.length} AI images...`);
          
          try {
            updatedPlan = await generateAllPlanImages(
              plan,
              (sceneIndex, elementId, status) => {
                console.log(`Image ${elementId} in scene ${sceneIndex}: ${status}`);
              }
            );
            
            toast.success('AI images generated successfully');
          } catch (error) {
            console.error('Failed to generate images:', error);
            toast.error('Some images failed to generate. Continuing anyway...');
          }
        }
      }

      // Step 5: Preload assets if enabled
      if (preloadAssets) {
        try {
          await preloadImages(updatedPlan.scenes.flatMap(s => s.elements || []));
          console.log('✓ Assets preloaded');
        } catch (error) {
          console.warn('Asset preloading failed:', error);
          // Continue anyway - not critical
        }
      }

      // Step 6: Final validation before render
      const finalValidation = validateImagesForRendering(
        updatedPlan.scenes.flatMap(s => s.elements || [])
      );

      if (!finalValidation.valid) {
        throw new Error(`Cannot render: ${finalValidation.issues.join(', ')}`);
      }

      // Step 7: Send to backend
      // The backend will use the plan and generate code with dynamic imports
      console.log('🚀 Sending render request to backend...');
      return await renderVideo(planId);
    },
    onSuccess: () => {
      toast.success('Render started successfully');
    },
    onError: (error: Error) => {
      console.error('Render error:', error);
      toast.error(`Render failed: ${error.message}`);
    },
  });
}

/**
 * Hook to get feature summary without rendering
 * Useful for showing users what packages/features their video uses
 */
export function useVideoFeatureSummary(plan: VideoPlan | null) {
  if (!plan) {
    return {
      packages: [],
      elementTypes: new Set<string>(),
      animationTypes: new Set<string>(),
      transitionTypes: new Set<string>(),
      importsCode: '',
    };
  }

  const summary = getPlanFeatureSummary(plan);
  const importsCode = generateRequiredImports(plan);

  return {
    ...summary,
    importsCode,
  };
}
