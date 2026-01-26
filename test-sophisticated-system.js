#!/usr/bin/env node
/**
 * Test Script: Verify Sophisticated Video System
 * 
 * This script tests that the sophisticated video generation system
 * is properly wired and produces A-grade videos.
 */

import { generateSophisticatedVideo } from './src/services/SophisticatedVideoGenerator.ts';

console.log('🧪 Testing Sophisticated Video Generation System\n');
console.log('=' .repeat(60));

async function testSophisticatedGeneration() {
  const testCases = [
    {
      name: 'GitHub Wrapped Style',
      prompt: 'Create a video showcasing my 2024 GitHub contributions',
      duration: 30,
      expectedStyle: 'space-journey'
    },
    {
      name: 'Product Launch',
      prompt: 'Product launch video for sustainable coffee brand',
      duration: 30,
      expectedStyle: 'product-launch'
    },
    {
      name: 'Generic Business',
      prompt: 'Marketing video for my AI startup',
      duration: 30,
      expectedStyle: 'cinematic'
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`   Prompt: "${testCase.prompt}"`);
    
    try {
      const result = await generateSophisticatedVideo({
        prompt: testCase.prompt,
        duration: testCase.duration,
        fps: 30
      });

      // Verify structure
      const checks = {
        'Has EnhancedVideoPlan structure': !!result,
        'Has sophisticated metadata': !!result.sophisticatedMetadata,
        'Has camera paths': !!result.cameraPath,
        'Has curved character paths': result.characterPaths && result.characterPaths.size > 0,
        'Has parallax config': !!result.parallaxConfig,
        'Has color grading': !!result.colorGrading,
        'Has scenes with narrative structure': result.scenes && result.scenes.length >= 3,
        'Quality score ≥ 85': result.sophisticatedMetadata?.finalQualityScore >= 85,
        'Production grade is professional/cinematic': ['professional', 'cinematic'].includes(result.sophisticatedMetadata?.productionGrade)
      };

      console.log('\n   ✓ Video Generated Successfully');
      console.log(`   Production Grade: ${result.sophisticatedMetadata?.productionGrade?.toUpperCase() || 'N/A'}`);
      console.log(`   Quality Score: ${result.sophisticatedMetadata?.finalQualityScore || 'N/A'}/100`);
      console.log(`   Scenes: ${result.scenes.length}`);
      console.log(`   Duration: ${result.duration}s`);
      
      console.log('\n   Feature Checks:');
      let allChecksPassed = true;
      for (const [check, passed] of Object.entries(checks)) {
        const icon = passed ? '✅' : '❌';
        console.log(`   ${icon} ${check}`);
        if (!passed) allChecksPassed = false;
      }

      if (result.sophisticatedMetadata) {
        console.log('\n   Sophisticated Features:');
        console.log(`   - Orbital Camera: ${result.sophisticatedMetadata.usesOrbitalCamera ? '✓' : '✗'}`);
        console.log(`   - Forward Tracking: ${result.sophisticatedMetadata.usesForwardTracking ? '✓' : '✗'}`);
        console.log(`   - Curved Paths: ${result.sophisticatedMetadata.usesCurvedPaths ? '✓' : '✗'}`);
        console.log(`   - Parallax: ${result.sophisticatedMetadata.usesParallax ? '✓' : '✗'}`);
        console.log(`   - Color Grading: ${result.sophisticatedMetadata.usesColorGrading ? '✓' : '✗'}`);
      }

      if (allChecksPassed) {
        console.log('\n   ✅ TEST PASSED');
        passedTests++;
      } else {
        console.log('\n   ❌ TEST FAILED - Some checks did not pass');
        failedTests++;
      }

    } catch (error) {
      console.log(`\n   ❌ TEST FAILED - Error: ${error.message}`);
      console.error(error);
      failedTests++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Results: ${passedTests}/${testCases.length} passed`);
  
  if (failedTests === 0) {
    console.log('\n✅ ALL TESTS PASSED - Sophisticated system is working correctly!\n');
    console.log('🎬 System Status: A-GRADE');
    console.log('   ✓ All videos use sophisticated production');
    console.log('   ✓ Camera paths enabled');
    console.log('   ✓ Curved animations enabled');
    console.log('   ✓ Parallax depth enabled');
    console.log('   ✓ Color grading enabled');
    console.log('   ✓ Quality scores ≥ 85');
    return 0;
  } else {
    console.log(`\n❌ ${failedTests} TEST(S) FAILED - System needs fixes\n`);
    return 1;
  }
}

// Run tests
testSophisticatedGeneration()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
