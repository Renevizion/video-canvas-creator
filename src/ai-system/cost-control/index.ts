/**
 * Cost Control Index
 * 
 * Central export point for all cost control modules.
 */

export { classifyRequest, type RequestTier, type RequestClassification } from './classifier';
export { TokenBudget } from './tokenBudget';
export { APICallLimiter } from './apiLimiter';
export { BudgetedRequestExecutor } from './executor';

/**
 * Budget limits for each tier
 */
export interface BudgetLimits {
  tokens: number;
  apiCalls: number;
  timeoutMs: number;
}

export function getBudgetLimits(tier: number): BudgetLimits {
  const budgets: Record<number, BudgetLimits> = {
    0: { tokens: 0, apiCalls: 0, timeoutMs: 1000 },
    1: { tokens: 200, apiCalls: 0, timeoutMs: 5000 },
    2: { tokens: 1000, apiCalls: 3, timeoutMs: 10000 },
    3: { tokens: 5000, apiCalls: 10, timeoutMs: 30000 },
    4: { tokens: 20000, apiCalls: 50, timeoutMs: 60000 },
  };

  return budgets[tier] || budgets[1];
}

/**
 * Suggest optimizations for over-budget requests
 */
export function suggestOptimizations(
  maxTokens: number,
  maxAPICalls: number,
  actualTokens: number,
  actualAPICalls: number,
  tier: number
): string[] {
  const suggestions: string[] = [];

  if (actualTokens > maxTokens) {
    suggestions.push(
      `Token usage (${actualTokens}) exceeded budget (${maxTokens}). Consider breaking into smaller requests.`
    );
  }

  if (actualAPICalls > maxAPICalls) {
    suggestions.push(
      `API calls (${actualAPICalls}) exceeded limit (${maxAPICalls}). Enable caching or batch requests.`
    );
  }

  if (tier > 2) {
    suggestions.push(
      'This is a complex request. Consider simplifying or providing more data upfront to reduce AI work.'
    );
  }

  return suggestions;
}
