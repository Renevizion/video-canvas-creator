/**
 * Content Type Detector
 * Analyzes user prompts to determine video content type and provide helpful hints
 */

// Keyword arrays for content type detection - expanded for better motion graphics recognition
const MOTION_GRAPHICS_KEYWORDS = [
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
  'abstract intro',
  'logo animation',
  'animated intro',
  'particles',
  'floating shapes',
  'animated background',
  'dynamic shapes',
];

const TECH_SAAS_KEYWORDS = [
  'saas', 'software', 'app', 'platform', 'dashboard', 
  'analytics', 'api', 'developer', 'code', 'tech'
];

const PRODUCT_KEYWORDS = [
  'product', 'item', 'merchandise', 'shop', 'store', 
  'buy', 'purchase', 'ecommerce'
];

const SERVICE_KEYWORDS = [
  'service', 'consulting', 'agency', 'solution', 
  'support', 'help', 'professional'
];

const BRAND_KEYWORDS = [
  'brand', 'lifestyle', 'identity', 'story', 
  'about us', 'mission', 'vision', 'values'
];

const EXPLAINER_KEYWORDS = [
  'how to', 'explain', 'tutorial', 'guide', 
  'learn', 'understand', 'what is'
];

const COLOR_KEYWORDS = [
  'color', 'blue', 'red', 'green', 'purple', 
  'cyan', 'orange', 'yellow', 'pink', 'gradient'
];

const STYLE_KEYWORDS = [
  'style', 'modern', 'minimal', 'professional', 
  'playful', 'elegant', 'bold', 'clean'
];

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
  return MOTION_GRAPHICS_KEYWORDS.some(keyword => lowerPrompt.includes(keyword));
}

/**
 * Detects the content type of a video prompt
 */
export function detectContentType(prompt: string): ContentTypeResult {
  const lowerPrompt = prompt.toLowerCase();
  
  // Motion Graphics detection - higher confidence and better suggestions
  if (detectMotionGraphics(lowerPrompt)) {
    return {
      type: 'motion-graphics',
      confidence: 0.95,
      suggestedElements: [
        'Multiple geometric shapes (4-8 per scene) with staggered timing',
        'Circles, triangles, stars, and polygons with varied sizes',
        'AI-generated abstract assets (blobs, icons, patterns)',
        'Dynamic scale, rotate, and float animations',
        'Layered elements with different z-indexes for depth',
        'Coordinated color palette from brand or style',
      ],
      hints: [
        '🎨 Create 4-8 shapes per scene with delays 0.1s, 0.2s, 0.3s for "flow"',
        '⚡ Shapes auto-animate with pulse, drift, and rotation',
        '📐 Mix shape types: circles + triangles + stars for variety',
        '🌊 Use varied sizes (small 50px, medium 150px, large 300px)',
        '✨ Staggered entrance creates professional choreography',
      ],
    };
  }
  
  // Tech/SaaS detection
  if (TECH_SAAS_KEYWORDS.some(k => lowerPrompt.includes(k))) {
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
  if (PRODUCT_KEYWORDS.some(k => lowerPrompt.includes(k))) {
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
  if (SERVICE_KEYWORDS.some(k => lowerPrompt.includes(k))) {
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
  if (BRAND_KEYWORDS.some(k => lowerPrompt.includes(k))) {
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
  if (EXPLAINER_KEYWORDS.some(k => lowerPrompt.includes(k))) {
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
  const lowerPrompt = prompt.toLowerCase();
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
  const hasColors = COLOR_KEYWORDS.some(k => lowerPrompt.includes(k));
  const hasStyle = STYLE_KEYWORDS.some(k => lowerPrompt.includes(k));
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
