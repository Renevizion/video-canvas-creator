# AI Efficiency & Cost Control System

## Problem Statement

AI agents should NOT:
- ❌ Call multiple tools when one is enough
- ❌ Fetch resources that weren't explicitly requested
- ❌ Over-analyze simple requests
- ❌ Use expensive operations for cheap tasks
- ❌ Auto-implement things the user didn't ask for

## ⚠️ Auto-Implementation Safeguards

**Before auto-fetching any resources, see:** [AUTO_IMPLEMENTATION_SAFEGUARDS.md](./AUTO_IMPLEMENTATION_SAFEGUARDS.md)

Key safeguards:
- ✅ **Always show plan first** - never fetch without user seeing
- ✅ **User approval required** - explicit confirmation before fetching
- ✅ **Cost limits enforced** - configurable $ and API call limits
- ✅ **Confidence scores** - flag uncertain resources
- ✅ **Edit capabilities** - user can modify before fetching
- ✅ **Fallback options** - graceful handling of failures

**Default behavior:** `requireConfirmation: true` (never auto-fetch without asking)

## Solution: Request Complexity Classifier

### Complexity Tiers

#### Tier 0: No AI Needed (0 tokens)
**Pattern matching only, no LLM calls**

Examples:
- "list compositions" → Direct query, no AI
- "show me stats" → Database query, no AI
- "render video X" → Direct action, no AI

**Action:** Route directly to function, skip AI entirely

---

#### Tier 1: Simple Request (50-200 tokens)
**Single-step, single-agent, minimal context**

Examples:
- "Create a video about sustainable fashion"
- "Add Apple logo" (user provided domain/name)
- "Show bar chart of Q1-Q4 sales"

**Action:** 
- One agent call only
- No external searches
- Use provided data only
- Quick response mode

**Cost:** ~$0.001 per request

---

#### Tier 2: Medium Request (200-1000 tokens)
**Multi-step OR requires 1-2 external fetches**

Examples:
- "Create promo video for https://mysite.com" (needs brand extraction)
- "Show Apple, Google, Microsoft logos" (needs 3 logo fetches)
- "Create video with these images" (needs analysis)

**Action:**
- One or two agent calls
- Max 3 external API calls
- Limited context passing
- Standard response mode

**Cost:** ~$0.005 per request

---

#### Tier 3: Complex Request (1000-5000 tokens)
**Multi-agent coordination OR many external fetches**

Examples:
- "Create pitch video for Disney using my portfolio" (strategy + assets + narrative)
- "Make video like this reference video" (analysis + recreation)
- "Show our year in review with data from database" (data fetch + visualization + narrative)

**Action:**
- Multiple agent calls (sequential)
- Up to 10 external API calls
- Full context passing
- Deep analysis mode

**Cost:** ~$0.025 per request

---

#### Tier 4: Expert Request (5000+ tokens)
**Complex multi-step with iterations**

Examples:
- "Analyze 5 competitor videos and create our version"
- "Build interactive video selector with 10 variations"
- "Generate video series (10 videos) with consistent branding"

**Action:**
- Multiple agent calls (parallel + sequential)
- Unlimited external calls (with caching)
- Full context + memory
- Expert mode

**Cost:** ~$0.10+ per request

---

## Request Classifier Algorithm

```typescript
function classifyRequest(userInput: string): RequestTier {
  const input = userInput.toLowerCase();
  const wordCount = userInput.split(/\s+/).length;
  
  // Tier 0: Direct commands (no AI needed)
  if (isDirectCommand(input)) {
    return {
      tier: 0,
      reasoning: 'Direct command, no AI needed',
      skipAI: true,
    };
  }
  
  // Tier 1: Simple single-task
  if (wordCount <= 10 && !hasExternalDependency(input)) {
    return {
      tier: 1,
      reasoning: 'Simple request, single agent, no external data',
      maxAgents: 1,
      maxAPICalls: 0,
      maxTokens: 200,
    };
  }
  
  // Tier 2: Medium with some dependencies
  if (wordCount <= 30 || countExternalResources(input) <= 3) {
    return {
      tier: 2,
      reasoning: 'Medium complexity, may need external data',
      maxAgents: 2,
      maxAPICalls: 3,
      maxTokens: 1000,
    };
  }
  
  // Tier 3: Complex multi-step
  if (wordCount <= 100 || countExternalResources(input) <= 10) {
    return {
      tier: 3,
      reasoning: 'Complex request, multi-agent coordination',
      maxAgents: 4,
      maxAPICalls: 10,
      maxTokens: 5000,
    };
  }
  
  // Tier 4: Expert level
  return {
    tier: 4,
    reasoning: 'Expert request, full system access',
    maxAgents: 10,
    maxAPICalls: 50,
    maxTokens: 20000,
  };
}
```

## Agent Behavior Rules

### Rule 1: Explicit > Implicit
**Only do what's explicitly requested**

❌ Bad: User says "add Apple logo" → AI searches for Apple website, extracts colors, finds competitors, creates comparison
✅ Good: User says "add Apple logo" → AI adds Apple logo. Done.

### Rule 2: Ask Before Fetching
**Don't auto-fetch unless user implied it**

❌ Bad: User mentions "Apple" → AI auto-fetches logo, website, stock price, news
✅ Good: User says "show Apple logo" → AI fetches logo (explicit)
✅ Good: User says "Apple" in text → AI doesn't fetch anything (just text)

### Rule 3: Minimal Tool Calls
**Use the least expensive tool that works**

❌ Bad: Check if user has logo → Call webSearch → Call logoFetcher → Call imageAnalysis
✅ Good: Check if user has logo → If not, call logoFetcher. Done.

### Rule 4: No Speculative Work
**Don't prepare for future steps**

❌ Bad: User asks for video → AI pre-fetches common logos "just in case"
✅ Good: User asks for video → AI creates video with provided assets only

### Rule 5: Cache Everything
**Never fetch the same resource twice**

✅ Good: Apple logo fetched once, cached, reused forever
❌ Bad: Apple logo fetched every time it's mentioned

## Implementation: Request Router

```typescript
interface RoutingDecision {
  tier: 0 | 1 | 2 | 3 | 4;
  skipAI: boolean;
  agent?: string;
  maxTokenBudget: number;
  maxAPICalls: number;
  cachingEnabled: boolean;
  reasoning: string;
}

function routeRequest(userInput: string): RoutingDecision {
  const classification = classifyRequest(userInput);
  
  // Tier 0: Skip AI entirely
  if (classification.tier === 0) {
    return {
      tier: 0,
      skipAI: true,
      maxTokenBudget: 0,
      maxAPICalls: 0,
      cachingEnabled: true,
      reasoning: 'Direct command execution',
    };
  }
  
  // Tier 1: Minimal AI
  if (classification.tier === 1) {
    return {
      tier: 1,
      skipAI: false,
      agent: 'StoryAgent', // Single agent
      maxTokenBudget: 200,
      maxAPICalls: 0,
      cachingEnabled: true,
      reasoning: 'Simple single-agent task',
    };
  }
  
  // Tier 2: Standard AI
  if (classification.tier === 2) {
    return {
      tier: 2,
      skipAI: false,
      agent: detectPrimaryAgent(userInput),
      maxTokenBudget: 1000,
      maxAPICalls: 3,
      cachingEnabled: true,
      reasoning: 'Medium complexity, limited resources',
    };
  }
  
  // Tier 3+: Full AI (budget controlled)
  return {
    tier: classification.tier,
    skipAI: false,
    maxTokenBudget: classification.maxTokens,
    maxAPICalls: classification.maxAPICalls,
    cachingEnabled: true,
    reasoning: classification.reasoning,
  };
}
```

## Cost Monitoring

### Token Budget Enforcer
```typescript
class TokenBudgetEnforcer {
  private usedTokens = 0;
  private budget: number;
  
  constructor(budget: number) {
    this.budget = budget;
  }
  
  canSpend(estimatedTokens: number): boolean {
    return this.usedTokens + estimatedTokens <= this.budget;
  }
  
  spend(tokens: number): void {
    this.usedTokens += tokens;
    if (this.usedTokens > this.budget) {
      throw new Error(`Token budget exceeded: ${this.usedTokens}/${this.budget}`);
    }
  }
  
  remaining(): number {
    return this.budget - this.usedTokens;
  }
}
```

### API Call Limiter
```typescript
class APICallLimiter {
  private callCount = 0;
  private limit: number;
  
  constructor(limit: number) {
    this.limit = limit;
  }
  
  canCall(): boolean {
    return this.callCount < this.limit;
  }
  
  recordCall(): void {
    this.callCount++;
    if (this.callCount > this.limit) {
      throw new Error(`API call limit exceeded: ${this.callCount}/${this.limit}`);
    }
  }
}
```

## Agent Prompt Updates

### Simple Mode Prompt (Tier 1)
```
You are in SIMPLE MODE. Token budget: 200.

Rules:
- No external searches
- No tool calls
- Use provided data only
- Single response
- Be direct and concise

User request: {input}
Available data: {providedData}

Create the video plan now.
```

### Standard Mode Prompt (Tier 2)
```
You are in STANDARD MODE. Token budget: 1000. Max API calls: 3.

Rules:
- Minimal external fetches (max 3)
- Only fetch explicitly mentioned resources
- No speculative work
- Be efficient

User request: {input}
Available data: {providedData}

If you need to fetch external resources:
1. List exactly what you need
2. Wait for approval
3. Proceed with confirmed fetches only
```

### Expert Mode Prompt (Tier 3+)
```
You are in EXPERT MODE. Token budget: 5000. Max API calls: 10.

You have more flexibility but still be cost-conscious:
- Use caching aggressively
- Batch API calls when possible
- Ask before expensive operations

User request: {input}
```

## Examples

### Example 1: Simple Request ✅
**Input:** "Create a video about cats"
**Classification:** Tier 1 (simple, no dependencies)
**Action:** StoryAgent creates narrative. No external calls. 150 tokens.
**Cost:** $0.001

### Example 2: Explicit Fetch ✅
**Input:** "Add Apple and Google logos"
**Classification:** Tier 2 (2 logo fetches)
**Action:** 
1. Fetch Apple logo (1 API call)
2. Fetch Google logo (1 API call)
3. Add to video plan
**Total:** 2 API calls, 300 tokens
**Cost:** $0.002

### Example 3: Over-engineering ❌
**Input:** "Add Apple logo"
**Bad AI behavior:**
1. Searches web for Apple info (unnecessary)
2. Fetches Apple logo (good)
3. Fetches Apple colors (not requested)
4. Fetches Apple competitors (not requested)
5. Creates comparison chart (not requested)
**Total:** 15 API calls, 2000 tokens
**Cost:** $0.015 (15x more expensive!)

**Good AI behavior:**
1. Fetch Apple logo (requested)
2. Add to video
**Total:** 1 API call, 100 tokens
**Cost:** $0.001

### Example 4: Complex But Controlled ✅
**Input:** "Create year in review video with our 2024 stats"
**Classification:** Tier 3 (multi-step)
**Action:**
1. DataAgent queries stats database (1 call)
2. Creates visualizations (no external calls)
3. StoryAgent creates narrative (no external calls)
4. Combines into video plan
**Total:** 1 API call, 800 tokens
**Cost:** $0.005

## Best Practices

1. **Default to Tier 1** unless clear evidence of complexity
2. **Cache aggressively** - never fetch twice
3. **Ask before expensive ops** - "This will use 10 API calls, proceed?"
4. **Fail fast** - if budget exceeded, stop immediately
5. **Log everything** - track actual vs estimated costs

## Monitoring Dashboard

Track these metrics:
- Average tokens per request tier
- Average API calls per request tier
- % of requests that exceed budget
- Most expensive request types
- Cache hit rate

## Summary

✅ **Request classification** prevents over-engineering
✅ **Token budgets** prevent runaway costs
✅ **API call limits** prevent abuse
✅ **Explicit > Implicit** prevents speculation
✅ **Caching** prevents redundant work

Result: **10-100x cost reduction** for simple requests!
