/**
 * Content Type Detector
 * Analyzes user prompts to determine video content type and provide helpful hints
 */

export type VideoContentType = 
  | 'motion-graphics' 
  | 'tech-saas' 
  | 'product' 
  | 'service' 
  | 'brand-lifestyle' 
  | 'explainer'
  | 'general';

export interface ContentTypeResult {
  type: VideoContentType;
  confidence: number; // 0-1
  suggestedElements: string[];
  hints: string[];
}

/**
 * Detects if a prompt is requesting a motion graphics video
 */
export function detectMotionGraphics(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  const motionGraphicsKeywords = [
    'motion graphics',
    'motion graphic',
    'animated shapes',
    'geometric animation',
    'abstract animation',
    'animated logo',
    'logo reveal',
    'kinetic typography',
    'shape animation',
    'geometric shapes',
    'abstract shapes',
    'animated pattern',
  ];
  
  return motionGraphicsKeywords.some(keyword => lowerPrompt.includes(keyword));
}

/**
 * Detects the content type of a video prompt
 */
export function detectContentType(prompt: string): ContentTypeResult {
  const lowerPrompt = prompt.toLowerCase();
  
  // Motion Graphics detection
  if (detectMotionGraphics(lowerPrompt)) {
    return {
      type: 'motion-graphics',
      confidence: 0.9,
      suggestedElements: [
        'Geometric shapes (circles, triangles, stars)',
        'Abstract patterns and textures',
        'AI-generated icons and illustrations',
        'Dynamic scale/rotate/translate animations',
        'Staggered timing for visual interest',
      ],
      hints: [
        'Use vibrant colors and smooth animations',
        'Combine geometric shapes with AI-generated assets for rich visuals',
        'Consider adding abstract backgrounds or particle effects',
        'Great for logo reveals, intros, and explainer videos',
      ],
    };
  }
  
  // Tech/SaaS detection
  const techKeywords = ['saas', 'software', 'app', 'platform', 'dashboard', 'analytics', 'api', 'developer', 'code', 'tech'];
  if (techKeywords.some(k => lowerPrompt.includes(k))) {
    return {
      type: 'tech-saas',
      confidence: 0.85,
      suggestedElements: [
        'Code editor with syntax highlighting',
        'Terminal with command animations',
        'Metrics and progress bars',
        'Dashboard mockups',
        'Tech-focused color schemes',
      ],
      hints: [
        'Use dark themes with accent colors',
        'Include code snippets or terminal commands',
        'Show data visualization and metrics',
        'Highlight key features with callouts',
      ],
    };
  }
  
  // Product detection
  const productKeywords = ['product', 'item', 'merchandise', 'shop', 'store', 'buy', 'purchase', 'ecommerce'];
  if (productKeywords.some(k => lowerPrompt.includes(k))) {
    return {
      type: 'product',
      confidence: 0.8,
      suggestedElements: [
        'Product images and mockups',
        '3D card presentations',
        'Feature highlights',
        'Price displays',
        'Call-to-action buttons',
      ],
      hints: [
        'Use high-quality product imagery',
        'Highlight unique features and benefits',
        'Include clear pricing and CTAs',
        'Show the product in use or context',
      ],
    };
  }
  
  // Service detection
  const serviceKeywords = ['service', 'consulting', 'agency', 'solution', 'support', 'help', 'professional'];
  if (serviceKeywords.some(k => lowerPrompt.includes(k))) {
    return {
      type: 'service',
      confidence: 0.75,
      suggestedElements: [
        'Benefit-focused text',
        'Process flow diagrams',
        'Testimonial elements',
        'Trust indicators',
        'Team or professional imagery',
      ],
      hints: [
        'Focus on benefits and outcomes',
        'Show the process or methodology',
        'Include social proof if available',
        'Use professional, trustworthy aesthetics',
      ],
    };
  }
  
  // Brand/Lifestyle detection
  const brandKeywords = ['brand', 'lifestyle', 'identity', 'story', 'about us', 'mission', 'vision', 'values'];
  if (brandKeywords.some(k => lowerPrompt.includes(k))) {
    return {
      type: 'brand-lifestyle',
      confidence: 0.8,
      suggestedElements: [
        'Lifestyle imagery',
        'Emotional storytelling elements',
        'Brand colors and typography',
        'Minimal text, strong visuals',
        'Atmosphere and mood setting',
      ],
      hints: [
        'Use emotive imagery and colors',
        'Focus on storytelling and values',
        'Keep text minimal and impactful',
        'Match the brand personality',
      ],
    };
  }
  
  // Explainer detection
  const explainerKeywords = ['how to', 'explain', 'tutorial', 'guide', 'learn', 'understand', 'what is'];
  if (explainerKeywords.some(k => lowerPrompt.includes(k))) {
    return {
      type: 'explainer',
      confidence: 0.85,
      suggestedElements: [
        'Step-by-step visuals',
        'Infographic elements',
        'Icons and illustrations',
        'Clear text explanations',
        'Sequential animations',
      ],
      hints: [
        'Break down complex ideas into steps',
        'Use simple, clear visuals',
        'Include icons to represent concepts',
        'Guide the viewer through the process',
      ],
    };
  }
  
  // Default to general
  return {
    type: 'general',
    confidence: 0.5,
    suggestedElements: [
      'Versatile text and imagery',
      'Flexible layouts',
      'Standard animations',
      'Balanced composition',
    ],
    hints: [
      'Use a clear structure with beginning, middle, and end',
      'Include a strong call-to-action',
      'Match visuals to the content tone',
      'Keep messaging clear and concise',
    ],
  };
}

/**
 * Gets helpful tips for motion graphics videos
 */
export function getMotionGraphicsTips(): string[] {
  return [
    '🎨 Use vibrant, contrasting colors for visual impact',
    '⚡ Combine geometric shapes with AI-generated assets',
    '🎬 Stagger animations by 0.15-0.3s for professional flow',
    '📐 Use circles, triangles, stars, and polygons for variety',
    '🌊 Add organic motion with noise-based animations',
    '✨ Layer shapes with different sizes and opacities for depth',
    '🎯 Consider abstract backgrounds or particle effects',
    '💫 Perfect for logo reveals, intros, and brand videos',
  ];
}

/**
 * Validates if a prompt provides enough detail for AI generation
 */
export function validatePromptQuality(prompt: string): {
  isGood: boolean;
  score: number; // 0-100
  suggestions: string[];
} {
  const wordCount = prompt.trim().split(/\s+/).length;
  let score = 0;
  const suggestions: string[] = [];
  
  // Check length
  if (wordCount < 5) {
    suggestions.push('Add more detail - describe what you want to showcase');
  } else if (wordCount < 10) {
    score += 20;
    suggestions.push('Good start! Consider adding more specific details');
  } else if (wordCount < 20) {
    score += 40;
  } else {
    score += 60;
  }
  
  // Check for specific elements
  const hasColors = /color|blue|red|green|purple|cyan|orange|yellow|pink|gradient/i.test(prompt);
  const hasStyle = /style|modern|minimal|professional|playful|elegant|bold|clean/i.test(prompt);
  const hasDuration = /\d+\s*second|\d+s|short|long|quick/i.test(prompt);
  const hasAction = /show|display|reveal|animate|showcase|highlight|present/i.test(prompt);
  
  if (hasColors) score += 10;
  else suggestions.push('Consider specifying colors or color preferences');
  
  if (hasStyle) score += 10;
  else suggestions.push('Mention a visual style (e.g., modern, minimal, bold)');
  
  if (hasDuration) score += 10;
  
  if (hasAction) score += 10;
  else suggestions.push('Add action verbs (e.g., "showcase features", "reveal logo")');
  
  return {
    isGood: score >= 60,
    score,
    suggestions,
  };
}
