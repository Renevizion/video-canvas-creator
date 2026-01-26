# AI Thinking System for Video Generation

This document outlines the intelligent reasoning system for generating video plans from different input types and goals.

## 🧠 Overview

The AI thinking system uses **pattern-based reasoning** to analyze different types of inputs and generate appropriate video plans. Each pattern has its own structure, analysis steps, and output format.

## 📋 Thinking Patterns

### Pattern 1: **Text Prompt → Video** (Conceptual Thinking)
**Input Type:** Natural language description  
**Example:** "Create a video about sustainable energy solutions"

**Thinking Steps:**
1. **Intent Analysis** - What is the core message?
2. **Audience Identification** - Who is this for?
3. **Narrative Structure** - Story arc (intro, body, conclusion)
4. **Visual Concepts** - What should be shown?
5. **Pacing Strategy** - How fast/slow should it be?
6. **Call-to-Action** - What should viewers do?

**Output Structure:**
```
- 3-5 scenes with clear narrative flow
- Text-heavy with supporting visuals
- Transitions that support story progression
- Strong opening hook and closing CTA
```

---

### Pattern 2: **Assets → Video** (Asset-Centric Thinking)
**Input Type:** Images, videos, audio files  
**Example:** User uploads 5 product photos and a logo

**Thinking Steps:**
1. **Asset Inventory** - Catalog what's provided
2. **Asset Analysis** - Image content, dimensions, quality
3. **Asset Relationships** - How do they connect?
4. **Gap Identification** - What's missing?
5. **Sequencing Logic** - Best order to show assets
6. **Enhancement Needs** - Effects, text overlays needed

**Output Structure:**
```
- Scene per asset or asset grouping
- Transitions that showcase each asset
- Text overlays for context
- Background music/effects to enhance
- Logo/branding in intro/outro
```

---

### Pattern 3: **Web URL → Video** (Content Extraction Thinking)
**Input Type:** Website URL  
**Example:** "Make a video from https://company.com/product"

**Thinking Steps:**
1. **Content Scraping** - Extract text, images, colors
2. **Hierarchy Analysis** - Headlines, subheads, body text
3. **Brand Extraction** - Logo, fonts, color palette
4. **Key Message Identification** - What's the main point?
5. **Visual Asset Selection** - Which images to use?
6. **Structure Mapping** - Web structure → video structure

**Output Structure:**
```
- Intro with logo/branding
- Key features as separate scenes
- Screenshots or extracted images
- Brand colors throughout
- CTA matching website
```

---

### Pattern 4: **Goal-Oriented → Video** (Strategic Thinking)
**Input Type:** Specific objective  
**Example:** "Create a video proposal to get hired at Disney"

**Thinking Steps:**
1. **Goal Decomposition** - What makes this successful?
2. **Audience Analysis** - Who's the decision maker?
3. **Credibility Building** - What proves competence?
4. **Emotional Connection** - How to resonate?
5. **Differentiation** - What makes this unique?
6. **Success Metrics** - What defines "good enough"?

**Output Structure:**
```
- Personal brand intro (who you are)
- Problem/opportunity identification
- Your unique solution/skills
- Proof (portfolio, achievements)
- Vision for future collaboration
- Strong, memorable closing
```

---

### Pattern 5: **Reference Video → New Video** (Template Thinking)
**Input Type:** Existing video to emulate  
**Example:** "Make something like this Apple ad"

**Thinking Steps:**
1. **Structure Analysis** - Scene count, duration, pacing
2. **Style Extraction** - Colors, fonts, transitions
3. **Pattern Recognition** - Recurring elements
4. **Technique Identification** - Camera moves, effects
5. **Adaptation Planning** - How to apply to new content
6. **Innovation Points** - Where to add uniqueness

**Output Structure:**
```
- Same scene count as reference
- Similar pacing and rhythm
- Matching transition styles
- Comparable visual complexity
- Adapted color scheme
- Similar text placement
```

---

### Pattern 6: **Data → Video** (Data Visualization Thinking)
**Input Type:** Statistics, charts, numbers  
**Example:** "Make a year-in-review video from our analytics"

**Thinking Steps:**
1. **Data Analysis** - Key metrics and trends
2. **Narrative Discovery** - What story do numbers tell?
3. **Visualization Selection** - Best way to show each metric
4. **Hierarchy Establishment** - Most to least important
5. **Comparison Strategy** - Show growth/change
6. **Context Addition** - Make numbers meaningful

**Output Structure:**
```
- Stats counter animations
- Progress bars for milestones
- Bar charts for comparisons
- Timeline for year progression
- Celebratory closing
```

---

### Pattern 7: **Multi-Modal → Video** (Synthesis Thinking)
**Input Type:** Mixed inputs (text + assets + URL)  
**Example:** "Use my logo, this website, and create a promo video"

**Thinking Steps:**
1. **Input Prioritization** - Which is primary?
2. **Consistency Analysis** - Do inputs align?
3. **Gap Filling** - What's needed to connect?
4. **Integration Strategy** - How to blend inputs
5. **Conflict Resolution** - Handle contradictions
6. **Cohesion Creation** - Make it feel unified

**Output Structure:**
```
- Blended approach using all inputs
- Prioritized primary input
- Secondary inputs as support
- Consistent style throughout
- Smooth integration
```

---

## 🎯 Pattern Selection Algorithm

```typescript
function selectThinkingPattern(input: VideoInput): ThinkingPattern {
  if (input.type === 'text' && !input.assets && !input.url) {
    return 'conceptual';
  }
  
  if (input.assets && input.assets.length > 0 && !input.url) {
    return 'asset-centric';
  }
  
  if (input.url && !input.assets) {
    return 'content-extraction';
  }
  
  if (input.goal && isGoalOriented(input.prompt)) {
    return 'strategic';
  }
  
  if (input.referenceVideo) {
    return 'template';
  }
  
  if (input.data && hasStructuredData(input)) {
    return 'data-visualization';
  }
  
  if (input.assets && input.url) {
    return 'synthesis';
  }
  
  return 'conceptual'; // default
}
```

---

## 🏗️ Implementation Architecture

### Step 1: Input Analysis
```typescript
interface VideoInput {
  type: 'text' | 'assets' | 'url' | 'goal' | 'reference' | 'data' | 'multi';
  prompt?: string;
  assets?: Asset[];
  url?: string;
  goal?: string;
  referenceVideo?: VideoPlan;
  data?: any;
}
```

### Step 2: Pattern Execution
```typescript
interface ThinkingStep {
  step: string;
  question: string;
  analysis: string;
  decision: string;
}

interface ThinkingResult {
  pattern: string;
  steps: ThinkingStep[];
  plan: VideoPlan;
  reasoning: string;
}
```

### Step 3: Video Plan Generation
Each pattern produces a customized `VideoPlan` with:
- Scenes structured according to pattern logic
- Elements chosen based on pattern analysis
- Transitions appropriate for pattern style
- Timing calculated from pattern requirements

---

## 💡 Examples by Pattern

### Example 1: Conceptual (Text Prompt)
**Input:** "Create a video explaining blockchain technology"

**Thinking Process:**
1. Intent: Educational
2. Audience: Tech beginners
3. Narrative: Problem → Solution → Future
4. Visuals: Abstract animations, diagrams
5. Pacing: Moderate (3-5 sec per concept)
6. CTA: "Learn more"

**Result:** 4 scenes, 30 seconds
- Scene 1: Problem (current financial system issues)
- Scene 2: Solution (how blockchain works)
- Scene 3: Benefits (transparency, security)
- Scene 4: Future (what's possible)

### Example 2: Goal-Oriented
**Input:** "Make a video proposal to get hired at Disney"

**Thinking Process:**
1. Goal: Get interview at Disney
2. Audience: Disney HR/creative directors
3. Credibility: Portfolio of animation work
4. Emotional: Love for Disney storytelling
5. Differentiation: Unique animation style
6. Success: Memorable, professional, Disney-aligned

**Result:** 6 scenes, 45 seconds
- Scene 1: "Why Disney?" (emotional connection)
- Scene 2: Your creative philosophy
- Scene 3: Portfolio highlight #1 (best work)
- Scene 4: Portfolio highlight #2
- Scene 5: Your vision for contributing
- Scene 6: Call to action ("Let's create magic together")

### Example 3: Web URL
**Input:** URL to SaaS product landing page

**Thinking Process:**
1. Scrape: Extract hero text, features, pricing, screenshots
2. Hierarchy: Hero → Features → Social proof → CTA
3. Brand: Extract logo, colors (#3b82f6, #1e293b)
4. Message: "Simplify team collaboration"
5. Assets: 3 product screenshots, 1 logo
6. Structure: Linear feature showcase

**Result:** 5 scenes, 40 seconds
- Scene 1: Logo + hero headline
- Scene 2: Feature #1 with screenshot
- Scene 3: Feature #2 with screenshot  
- Scene 4: Feature #3 with screenshot
- Scene 5: CTA "Start free trial"

---

## 🔄 Adaptive Thinking

The system should **adapt its thinking** based on:

### Context Awareness
- If assets are low quality → suggest enhancement or text focus
- If prompt is vague → ask clarifying questions
- If brand data exists → prioritize brand consistency
- If duration is short → simplify structure

### Quality Optimization
- If generating images → plan scenes around generated content
- If using stock footage → plan around available clips
- If text-only → focus on typography and animation
- If audio provided → sync visuals to audio

### Goal Alignment
- Corporate video → professional, polished
- Social media → fast-paced, trendy
- Educational → clear, methodical
- Promotional → exciting, persuasive

---

## 📊 Decision Trees

### Scene Count Decision
```
Duration < 15s → 2-3 scenes
Duration 15-30s → 3-5 scenes
Duration 30-60s → 5-8 scenes
Duration > 60s → 8-12 scenes
```

### Element Density Decision
```
Fast-paced → 3-5 elements per scene
Moderate → 2-3 elements per scene
Slow/Cinematic → 1-2 elements per scene
```

### Transition Selection
```
Corporate → fade, dissolve
Tech/Modern → wipe, slide
Creative → creative transitions
Fast-paced → cut, quick fade
```

---

## 🚀 Implementation Priority

1. **Phase 1:** Implement pattern detection (which pattern to use)
2. **Phase 2:** Implement 3 core patterns (conceptual, asset-centric, goal-oriented)
3. **Phase 3:** Add URL scraping and content extraction
4. **Phase 4:** Add reference video analysis
5. **Phase 5:** Add data visualization pattern
6. **Phase 6:** Add multi-modal synthesis

---

## 📝 Prompt Templates for AI

Each pattern should have a specialized prompt template:

### Conceptual Pattern Prompt
```
You are a video strategist analyzing a text prompt to create a video plan.

PROMPT: "{user_prompt}"

Think through this step-by-step:
1. What is the core message?
2. Who is the target audience?
3. What narrative structure makes sense?
4. What visuals support the message?
5. What pacing feels right?
6. What CTA is appropriate?

Based on this analysis, create a video plan with {scene_count} scenes...
```

### Goal-Oriented Pattern Prompt
```
You are a strategic video consultant helping achieve a specific goal.

GOAL: "{user_goal}"

Think strategically:
1. What does success look like?
2. Who is the decision maker/audience?
3. What builds credibility?
4. What creates emotional connection?
5. What differentiates this from others?
6. What makes it memorable?

Design a video plan that maximizes chance of achieving this goal...
```

---

## 🎓 Learning System

The AI should learn from:
- Successful video plans (high engagement)
- User edits (what they change reveals preferences)
- Pattern effectiveness (which patterns work best for which goals)
- Common mistakes (what to avoid)

This creates an **adaptive thinking system** that improves over time.
