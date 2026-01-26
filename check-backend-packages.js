#!/usr/bin/env node

/**
 * Backend Package Checker
 * 
 * This script validates that a backend render service has all required
 * Remotion packages installed. Run this in your backend render service
 * directory (NOT in the video-canvas-creator frontend).
 * 
 * Usage:
 *   node check-backend-packages.js
 * 
 * Or make executable:
 *   chmod +x check-backend-packages.js
 *   ./check-backend-packages.js
 */

const fs = require('fs');
const path = require('path');

// Required packages for backend render service
const REQUIRED_PACKAGES = {
  // Core packages
  'react': '^18.0.0',
  'react-dom': '^18.0.0',
  'remotion': '^4.0.0',
  
  // Remotion feature packages
  '@remotion/bundler': '^4.0.0',
  '@remotion/cli': '^4.0.0',
  '@remotion/renderer': '^4.0.0',
  '@remotion/player': '^4.0.0',
  '@remotion/shapes': '^4.0.0',
  '@remotion/transitions': '^4.0.0',
  '@remotion/motion-blur': '^4.0.0',
  '@remotion/noise': '^4.0.0',
  '@remotion/paths': '^4.0.0',
  '@remotion/media': '^4.0.0',
  '@remotion/media-utils': '^4.0.0',
  '@remotion/media-parser': '^4.0.0',
  '@remotion/layout-utils': '^4.0.0',
  '@remotion/google-fonts': '^4.0.0',
  '@remotion/captions': '^4.0.0',
  '@remotion/animated-emoji': '^4.0.0',
};

console.log('🔍 Checking backend render service packages...\n');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in current directory');
  console.error('   Make sure you run this in your backend render service directory\n');
  process.exit(1);
}

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

console.log(`📦 Project: ${packageJson.name || 'Unknown'}\n`);

// Check each required package
const missing = [];
const outdated = [];
const installed = [];

for (const [pkg, minVersion] of Object.entries(REQUIRED_PACKAGES)) {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  
  if (deps[pkg]) {
    // Package is present
    try {
      // Try to resolve the package
      require.resolve(pkg);
      installed.push(pkg);
      console.log(`✅ ${pkg} - ${deps[pkg]}`);
    } catch (e) {
      // Package in package.json but not in node_modules
      missing.push(pkg);
      console.log(`⚠️  ${pkg} - in package.json but not installed (run npm install)`);
    }
  } else {
    // Package not in package.json
    missing.push(pkg);
    console.log(`❌ ${pkg} - NOT in package.json`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('Summary:');
console.log('='.repeat(60));
console.log(`✅ Installed: ${installed.length}`);
console.log(`❌ Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n❌ Missing packages:');
  missing.forEach(pkg => console.log(`   - ${pkg}`));
  
  console.log('\n📝 To fix, add these to package.json dependencies:');
  console.log('```json');
  console.log('{');
  console.log('  "dependencies": {');
  missing.forEach((pkg, i) => {
    const comma = i < missing.length - 1 ? ',' : '';
    console.log(`    "${pkg}": "${REQUIRED_PACKAGES[pkg]}"${comma}`);
  });
  console.log('  }');
  console.log('}');
  console.log('```');
  
  console.log('\nThen run: npm install\n');
  process.exit(1);
}

console.log('\n✅ All required packages are installed!');
console.log('   Your backend render service is ready.\n');

// Check node_modules size
try {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('💡 Tip: Make sure node_modules is deployed with your backend');
    console.log('   (Railway auto-installs packages, but other platforms may need configuration)\n');
  }
} catch (e) {
  // Ignore
}

process.exit(0);
