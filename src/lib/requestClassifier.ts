/**
 * Request Classifier & Cost Control
 * 
 * Prevents AI from going crazy and wasting tokens/API calls.
 * Classifies requests by complexity and enforces budgets.
 */

export type RequestTier = 0 | 1 | 2 | 3 | 4;

export interface RequestClassification {
  tier: RequestTier;
  reasoning: string;
  skipAI: boolean;
  primaryAgent?: string;
  maxTokens: number;
  maxAPICalls: number;
  estimatedCost: number; // in USD
  cachingRequired: boolean;
}

export interface BudgetLimits {
  tokens: number;
  apiCalls: number;
  timeoutMs: number;
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
      maxAPICalls: externalResourceCount + 1, // +1 buffer
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

/**
 * Check if this is a direct command that needs no AI
 */
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

/**
 * Check if this is a simple request
 */
function isSimpleRequest(input: string, wordCount: number): boolean {
  // Short requests with no dependencies
  if (wordCount <= 10 && !hasExternalDependency(input)) {
    return true;
  }

  // Common simple patterns
  const simplePatterns = [
    /^create\s+(a\s+)?video\s+about\s+\w+$/,
    /^make\s+(a\s+)?video\s+(about|of|for)\s+\w+$/,
    /^(show|display|add)\s+\w+\s+(chart|graph|stat)$/,
  ];

  return simplePatterns.some((pattern) => pattern.test(input));
}

/**
 * Check if request has external dependencies
 */
function hasExternalDependency(input: string): boolean {
  return (
    input.includes('http://') ||
    input.includes('https://') ||
    input.includes('www.') ||
    input.includes('logo') ||
    input.includes('fetch') ||
    input.includes('search') ||
    input.includes('find') ||
    input.includes('get') && (input.includes('from') || input.includes('web'))
  );
}

/**
 * Count how many external resources are mentioned
 */
function countExternalResources(input: string): number {
  let count = 0;

  // URLs
  count += (input.match(/https?:\/\/[^\s]+/g) || []).length;

  // Company names (common ones)
  const companies = [
    'apple',
    'google',
    'microsoft',
    'amazon',
    'meta',
    'facebook',
    'tesla',
    'netflix',
    'uber',
    'airbnb',
    'spotify',
  ];
  companies.forEach((company) => {
    if (input.includes(company)) count++;
  });

  // Logo mentions
  if (input.includes('logo')) {
    // Count comma-separated items
    const segments = input.split(/logo[s]?/)[1]?.split(/,|and/) || [];
    count += Math.max(segments.length - 1, 0);
  }

  return count;
}

/**
 * Detect primary agent for request
 */
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

/**
 * Token Budget Enforcer
 */
export class TokenBudget {
  private used = 0;
  private limit: number;

  constructor(limit: number) {
    this.limit = limit;
  }

  canSpend(amount: number): boolean {
    return this.used + amount <= this.limit;
  }

  spend(amount: number): void {
    if (!this.canSpend(amount)) {
      throw new Error(
        `Token budget exceeded: trying to spend ${amount}, but only ${this.remaining()} remaining`
      );
    }
    this.used += amount;
  }

  remaining(): number {
    return this.limit - this.used;
  }

  getUsed(): number {
    return this.used;
  }

  getLimit(): number {
    return this.limit;
  }

  getUsagePercent(): number {
    return (this.used / this.limit) * 100;
  }
}

/**
 * API Call Limiter
 */
export class APICallLimiter {
  private calls = 0;
  private limit: number;
  private callLog: Array<{ timestamp: Date; endpoint: string }> = [];

  constructor(limit: number) {
    this.limit = limit;
  }

  canCall(): boolean {
    return this.calls < this.limit;
  }

  recordCall(endpoint: string): void {
    if (!this.canCall()) {
      throw new Error(
        `API call limit exceeded: ${this.calls}/${this.limit}. No more calls allowed.`
      );
    }
    this.calls++;
    this.callLog.push({ timestamp: new Date(), endpoint });
  }

  getCallCount(): number {
    return this.calls;
  }

  getLimit(): number {
    return this.limit;
  }

  getCallLog(): Array<{ timestamp: Date; endpoint: string }> {
    return this.callLog;
  }

  remaining(): number {
    return this.limit - this.calls;
  }
}

/**
 * Request Executor with Budget Control
 */
export class BudgetedRequestExecutor {
  private tokenBudget: TokenBudget;
  private apiLimiter: APICallLimiter;
  private classification: RequestClassification;

  constructor(classification: RequestClassification) {
    this.classification = classification;
    this.tokenBudget = new TokenBudget(classification.maxTokens);
    this.apiLimiter = new APICallLimiter(classification.maxAPICalls);
  }

  canExecuteAICall(estimatedTokens: number): boolean {
    return this.tokenBudget.canSpend(estimatedTokens);
  }

  executeAICall(actualTokens: number): void {
    this.tokenBudget.spend(actualTokens);
  }

  canExecuteAPICall(): boolean {
    return this.apiLimiter.canCall();
  }

  executeAPICall(endpoint: string): void {
    this.apiLimiter.recordCall(endpoint);
  }

  getReport(): {
    classification: RequestClassification;
    tokensUsed: number;
    tokensRemaining: number;
    apiCallsUsed: number;
    apiCallsRemaining: number;
    actualCost: number;
  } {
    const tokensUsed = this.tokenBudget.getUsed();
    const actualCost = (tokensUsed / 1000000) * 15; // $15 per 1M tokens (GPT-4 pricing)

    return {
      classification: this.classification,
      tokensUsed,
      tokensRemaining: this.tokenBudget.remaining(),
      apiCallsUsed: this.apiLimiter.getCallCount(),
      apiCallsRemaining: this.apiLimiter.remaining(),
      actualCost,
    };
  }

  checkBudgetHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    message: string;
  } {
    const tokenUsage = this.tokenBudget.getUsagePercent();
    const apiUsage =
      (this.apiLimiter.getCallCount() / this.apiLimiter.getLimit()) * 100;

    if (tokenUsage > 90 || apiUsage > 90) {
      return {
        status: 'critical',
        message: `Budget nearly exhausted: ${tokenUsage.toFixed(1)}% tokens, ${apiUsage.toFixed(1)}% API calls`,
      };
    }

    if (tokenUsage > 70 || apiUsage > 70) {
      return {
        status: 'warning',
        message: `Budget high: ${tokenUsage.toFixed(1)}% tokens, ${apiUsage.toFixed(1)}% API calls`,
      };
    }

    return {
      status: 'healthy',
      message: `Budget OK: ${tokenUsage.toFixed(1)}% tokens, ${apiUsage.toFixed(1)}% API calls`,
    };
  }
}

/**
 * Get budget limits for tier
 */
export function getBudgetLimits(tier: RequestTier): BudgetLimits {
  const budgets: Record<RequestTier, BudgetLimits> = {
    0: { tokens: 0, apiCalls: 0, timeoutMs: 1000 },
    1: { tokens: 200, apiCalls: 0, timeoutMs: 5000 },
    2: { tokens: 1000, apiCalls: 3, timeoutMs: 10000 },
    3: { tokens: 5000, apiCalls: 10, timeoutMs: 30000 },
    4: { tokens: 20000, apiCalls: 50, timeoutMs: 60000 },
  };

  return budgets[tier];
}

/**
 * Suggest optimizations for over-budget requests
 */
export function suggestOptimizations(
  classification: RequestClassification,
  actualTokens: number,
  actualAPICalls: number
): string[] {
  const suggestions: string[] = [];

  if (actualTokens > classification.maxTokens) {
    suggestions.push(
      `Token usage (${actualTokens}) exceeded budget (${classification.maxTokens}). Consider breaking into smaller requests.`
    );
  }

  if (actualAPICalls > classification.maxAPICalls) {
    suggestions.push(
      `API calls (${actualAPICalls}) exceeded limit (${classification.maxAPICalls}). Enable caching or batch requests.`
    );
  }

  if (classification.tier > 2) {
    suggestions.push(
      'This is a complex request. Consider simplifying or providing more data upfront to reduce AI work.'
    );
  }

  return suggestions;
}
