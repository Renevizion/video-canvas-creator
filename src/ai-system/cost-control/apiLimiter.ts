/**
 * API Call Limiter
 * 
 * Tracks and limits external API calls to prevent abuse and over-fetching.
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

  reset(): void {
    this.calls = 0;
    this.callLog = [];
  }
}
