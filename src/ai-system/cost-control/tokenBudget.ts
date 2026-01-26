/**
 * Token Budget Enforcer
 * 
 * Tracks and enforces token usage limits to prevent runaway costs.
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

  reset(): void {
    this.used = 0;
  }
}
