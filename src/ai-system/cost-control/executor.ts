/**
 * Budgeted Request Executor
 * 
 * Coordinates token budget and API limiter for a single request.
 * Provides health monitoring and reporting.
 */

import { TokenBudget } from './tokenBudget';
import { APICallLimiter } from './apiLimiter';
import type { RequestClassification } from './classifier';

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
    const actualCost = (tokensUsed / 1000000) * 15; // $15 per 1M tokens

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
