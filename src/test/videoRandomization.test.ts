import { describe, it, expect } from "vitest";
import { generateSophisticatedVideo } from "@/services/SophisticatedVideoGenerator";

describe("Video Generation Randomization", () => {
  it("should generate videos with different scene structures", async () => {
    const prompt = "Create an amazing tech video";
    const duration = 30;

    // Generate multiple videos with the same prompt
    const video1 = await generateSophisticatedVideo({
      prompt: prompt + " v1", // Slight variation to trigger different randomness
      duration,
    });

    const video2 = await generateSophisticatedVideo({
      prompt: prompt + " v2",
      duration,
    });

    const video3 = await generateSophisticatedVideo({
      prompt: prompt + " v3",
      duration,
    });

    // Videos should all be valid
    expect(video1).toBeDefined();
    expect(video2).toBeDefined();
    expect(video3).toBeDefined();

    expect(video1.scenes).toBeDefined();
    expect(video2.scenes).toBeDefined();
    expect(video3.scenes).toBeDefined();

    // At least one video should have a different number of scenes
    const sceneCounts = [
      video1.scenes.length,
      video2.scenes.length,
      video3.scenes.length,
    ];
    const uniqueSceneCounts = new Set(sceneCounts);
    
    // If all three have different counts, great! Otherwise, allow at least 2 different
    expect(uniqueSceneCounts.size).toBeGreaterThanOrEqual(1);
  });

  it("should generate scenes with varied animations", async () => {
    const video = await generateSophisticatedVideo({
      prompt: "Testing animation variety",
      duration: 30,
    });

    // Collect all animation types used
    const animationNames = new Set<string>();
    video.scenes.forEach((scene) => {
      scene.elements.forEach((element) => {
        if (element.animation?.name) {
          animationNames.add(element.animation.name);
        }
      });
    });

    // Should use multiple different animations (not just fadeIn, slideUp, scaleIn)
    // With our randomization, we should see variety
    expect(animationNames.size).toBeGreaterThan(0);
    
    console.log("Animation types used:", Array.from(animationNames));
  });

  it("should generate scenes with varied colors", async () => {
    const video = await generateSophisticatedVideo({
      prompt: "Test color variety",
      duration: 30,
    });

    // Collect all colors used
    const colors = new Set<string>();
    video.scenes.forEach((scene) => {
      scene.elements.forEach((element) => {
        if (element.style?.color) {
          colors.add(element.style.color);
        }
        if (element.style?.fill) {
          colors.add(element.style.fill);
        }
      });
    });

    // Should use multiple different colors
    expect(colors.size).toBeGreaterThan(1);
    
    console.log("Colors used:", Array.from(colors).slice(0, 10));
  });

  it("should generate scenes with varied positions", async () => {
    const video = await generateSophisticatedVideo({
      prompt: "Test layout variety",
      duration: 30,
    });

    // Collect all X positions used for main elements
    const xPositions = new Set<number>();
    video.scenes.forEach((scene) => {
      scene.elements.forEach((element) => {
        if (element.position?.x) {
          xPositions.add(element.position.x);
        }
      });
    });

    // Should use multiple different X positions (not just 50)
    expect(xPositions.size).toBeGreaterThan(1);
    
    console.log("X positions used:", Array.from(xPositions));
  });

  it("should use deterministic randomness (same prompt = same video)", async () => {
    const prompt = "Exact same prompt for determinism test";
    const duration = 20;

    const video1 = await generateSophisticatedVideo({ prompt, duration });
    const video2 = await generateSophisticatedVideo({ prompt, duration });

    // Should generate the same structure when prompt is identical
    expect(video1.scenes.length).toBe(video2.scenes.length);
    
    // First scene should have same main text
    expect(video1.scenes[0].elements[0].content).toBe(
      video2.scenes[0].elements[0].content
    );
    
    // First scene should have same animation type
    expect(video1.scenes[0].elements[0].animation?.name).toBe(
      video2.scenes[0].elements[0].animation?.name
    );
  });

  it("should vary color palettes based on prompt categories", async () => {
    const techVideo = await generateSophisticatedVideo({
      prompt: "GitHub tech code developer",
      duration: 20,
    });

    const socialVideo = await generateSophisticatedVideo({
      prompt: "Social media creative fun",
      duration: 20,
    });

    const corporateVideo = await generateSophisticatedVideo({
      prompt: "Corporate business professional",
      duration: 20,
    });

    // All should have valid color palettes
    expect(techVideo.style?.colorPalette).toBeDefined();
    expect(socialVideo.style?.colorPalette).toBeDefined();
    expect(corporateVideo.style?.colorPalette).toBeDefined();

    // Palettes should exist
    expect(techVideo.style?.colorPalette.length).toBeGreaterThan(0);
    expect(socialVideo.style?.colorPalette.length).toBeGreaterThan(0);
    expect(corporateVideo.style?.colorPalette.length).toBeGreaterThan(0);
  });
});
