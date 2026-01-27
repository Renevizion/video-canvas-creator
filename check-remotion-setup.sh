#!/bin/bash
# Remotion Studio Setup Verification Script
# This script checks if your Remotion setup is correct

echo "🔍 Checking Remotion Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo "1️⃣ Checking package.json..."
if grep -q '"@remotion/cli"' package.json; then
    echo -e "${GREEN}✅ @remotion/cli is listed in dependencies${NC}"
else
    echo -e "${RED}❌ @remotion/cli not found in package.json${NC}"
    exit 1
fi

echo ""
echo "2️⃣ Checking entry point files..."

if [ -f "src/remotion/index.ts" ]; then
    echo -e "${GREEN}✅ src/remotion/index.ts exists${NC}"
    if grep -q "registerRoot" src/remotion/index.ts; then
        echo -e "${GREEN}   ✅ registerRoot() call found${NC}"
    else
        echo -e "${RED}   ❌ registerRoot() call not found${NC}"
    fi
else
    echo -e "${RED}❌ src/remotion/index.ts not found${NC}"
fi

if [ -f "src/remotion/Root.tsx" ]; then
    echo -e "${GREEN}✅ src/remotion/Root.tsx exists${NC}"
else
    echo -e "${RED}❌ src/remotion/Root.tsx not found${NC}"
fi

echo ""
echo "3️⃣ Checking component files..."

MISSING_FILES=0
COMPONENTS=(
    "src/components/remotion/DynamicVideo.tsx"
    "src/components/remotion/showcases/MusicVisualization.tsx"
    "src/components/remotion/showcases/CaptionsShowcase.tsx"
    "src/components/remotion/showcases/ScreencastShowcase.tsx"
    "src/components/remotion/showcases/YearInReview.tsx"
    "src/components/remotion/showcases/RenderProgressShowcase.tsx"
    "src/components/remotion/showcases/CommunityPackagesShowcase.tsx"
    "src/components/remotion/showcases/CompleteExampleVideo.tsx"
    "src/components/remotion/showcases/UltimateMegaVideo.tsx"
    "src/components/remotion/showcases/ModernShowcases.tsx"
    "src/components/remotion/elements/AudioVisualization.tsx"
    "src/components/remotion/elements/AspectRatioSupport.tsx"
    "src/components/remotion/elements/ColorGrading.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo -e "${GREEN}✅ $component${NC}"
    else
        echo -e "${RED}❌ $component (MISSING)${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
echo "4️⃣ Checking type definitions..."

if [ -f "src/types/video.ts" ]; then
    echo -e "${GREEN}✅ src/types/video.ts exists${NC}"
    if grep -q "VideoPlan" src/types/video.ts; then
        echo -e "${GREEN}   ✅ VideoPlan type found${NC}"
    else
        echo -e "${YELLOW}   ⚠️  VideoPlan type not found${NC}"
    fi
else
    echo -e "${RED}❌ src/types/video.ts not found${NC}"
fi

echo ""
echo "5️⃣ Checking Composition registrations in Root.tsx..."

COMPOSITIONS=(
    "DynamicVideo"
    "ShowcaseElementsDemo"
    "MusicVisualization"
    "CaptionsShowcase"
    "ScreencastShowcase"
    "YearInReview"
    "RenderProgressShowcase"
    "CommunityPackages"
    "AudioVisualization"
    "AspectRatios"
    "VerticalVideo"
    "SquareVideo"
    "ColorGrading"
    "EffectsStack"
    "BeforeAfter"
    "CompleteVerticalVideo"
    "CompleteLandscapeVideo"
    "UltimateMegaVideo"
    "ModernMusicVisualization"
    "ModernCaptions"
    "ModernYearInReview"
    "ModernScreencast"
    "ModernRenderProgress"
)

REGISTERED_COUNT=0
for comp in "${COMPOSITIONS[@]}"; do
    if grep -q "id=\"$comp\"" src/remotion/Root.tsx; then
        REGISTERED_COUNT=$((REGISTERED_COUNT + 1))
    fi
done

echo -e "${GREEN}✅ Found $REGISTERED_COUNT registered compositions${NC}"

echo ""
echo "6️⃣ Checking node_modules..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
    
    if [ -f "node_modules/.bin/remotion" ] || [ -f "node_modules/@remotion/cli/dist/cli.js" ]; then
        echo -e "${GREEN}✅ Remotion CLI is installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Remotion CLI binary not found. Try: npm install${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  node_modules not found. Run: npm install${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your Remotion setup looks good.${NC}"
    echo ""
    echo "To start Remotion Studio, run:"
    echo -e "${YELLOW}  npm run dev:studio${NC}"
    echo ""
    echo "Or to start both the app and studio:"
    echo -e "${YELLOW}  npm run dev${NC}"
    echo ""
else
    echo -e "${RED}❌ Found $MISSING_FILES missing files. Please check the errors above.${NC}"
    echo ""
fi
