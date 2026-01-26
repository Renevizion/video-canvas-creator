/**
 * Request Tier Classifier
 * 
 * Analyzes user requests and classifies them by complexity.
 * Each tier has different token and API call budgets.
 */

export type RequestTier = 0 | 1 | 2 | 3 | 4;

export interface RequestClassification {
  tier: RequestTier;
  reasoning: string;
  skipAI: boolean;
  primaryAgent?: string;
  maxTokens: number;
  maxAPICalls: number;
  estimatedCost: number;
  cachingRequired: boolean;
}

/**
 * Classify request complexity
 */
export function classifyRequest(userInput: string): RequestClassification {
  const input = userInput.toLowerCase().trim();
  const wordCount = userInput.split(/\s+/).length;

  // Tier 0: Direct commands (no AI needed)
  if (isDirectCommand(input)) {
    return {
      tier: 0,
      reasoning: 'Direct command - no AI needed',
      skipAI: true,
      maxTokens: 0,
      maxAPICalls: 0,
      estimatedCost: 0,
      cachingRequired: false,
    };
  }

  // Tier 1: Simple single-task (50-200 tokens)
  if (isSimpleRequest(input, wordCount)) {
    return {
      tier: 1,
      reasoning: 'Simple request - single agent, no external data',
      skipAI: false,
      primaryAgent: detectAgent(input),
      maxTokens: 200,
      maxAPICalls: 0,
      estimatedCost: 0.001,
      cachingRequired: true,
    };
  }

  // Count external resources mentioned
  const externalResourceCount = countExternalResources(input);

  // Tier 2: Medium request (200-1000 tokens)
  if (wordCount <= 30 && externalResourceCount <= 3) {
    return {
      tier: 2,
      reasoning: `Medium request - ${externalResourceCount} external fetches`,
      skipAI: false,
      primaryAgent: detectAgent(input),
      maxTokens: 1000,
      maxAPICalls: externalResourceCount + 1,
      estimatedCost: 0.005,
      cachingRequired: true,
    };
  }

  // Tier 3: Complex request (1000-5000 tokens)
  if (wordCount <= 100 && externalResourceCount <= 10) {
    return {
      tier: 3,
      reasoning: 'Complex request - multi-step workflow',
      skipAI: false,
      maxTokens: 5000,
      maxAPICalls: 10,
      estimatedCost: 0.025,
      cachingRequired: true,
    };
  }

  // Tier 4: Expert request (5000+ tokens)
  return {
    tier: 4,
    reasoning: 'Expert request - full system access',
    skipAI: false,
    maxTokens: 20000,
    maxAPICalls: 50,
    estimatedCost: 0.10,
    cachingRequired: true,
  };
}

function isDirectCommand(input: string): boolean {
  const directCommands = [
    /^list\s+compositions?$/,
    /^show\s+stats?$/,
    /^render\s+\w+$/,
    /^preview\s+\w+$/,
    /^delete\s+\w+$/,
    /^get\s+\w+$/,
    /^help$/,
    /^status$/,
  ];

  return directCommands.some((pattern) => pattern.test(input));
}

function isSimpleRequest(input: string, wordCount: number): boolean {
  if (wordCount <= 10 && !hasExternalDependency(input)) {
    return true;
  }

  const simplePatterns = [
    /^create\s+(a\s+)?video\s+about\s+\w+$/,
    /^make\s+(a\s+)?video\s+(about|of|for)\s+\w+$/,
    /^(show|display|add)\s+\w+\s+(chart|graph|stat)$/,
  ];

  return simplePatterns.some((pattern) => pattern.test(input));
}

function hasExternalDependency(input: string): boolean {
  return (
    input.includes('http://') ||
    input.includes('https://') ||
    input.includes('www.') ||
    input.includes('logo') ||
    input.includes('fetch') ||
    input.includes('search') ||
    input.includes('find') ||
    (input.includes('get') && (input.includes('from') || input.includes('web')))
  );
}

function countExternalResources(input: string): number {
  let count = 0;

  // URLs
  count += (input.match(/https?:\/\/[^\s]+/g) || []).length;

  // Company names
  const companies = [
    'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook',
    'tesla', 'netflix', 'uber', 'airbnb', 'spotify',
  ];
  companies.forEach((company) => {
    if (input.includes(company)) count++;
  });

  // Logo mentions
  if (input.includes('logo')) {
    const segments = input.split(/logo[s]?/)[1]?.split(/,|and/) || [];
    count += Math.max(segments.length - 1, 0);
  }

  return count;
}

function detectAgent(input: string): string {
  if (input.includes('http://') || input.includes('https://')) {
    return 'BrandAgent';
  }

  if (
    input.includes('image') ||
    input.includes('photo') ||
    input.includes('asset') ||
    input.includes('logo')
  ) {
    return 'AssetAgent';
  }

  if (
    input.includes('data') ||
    input.includes('chart') ||
    input.includes('graph') ||
    input.includes('stat')
  ) {
    return 'DataAgent';
  }

  if (
    input.includes('goal') ||
    input.includes('objective') ||
    input.includes('achieve') ||
    input.includes('get hired')
  ) {
    return 'GoalAgent';
  }

  return 'StoryAgent';
}
