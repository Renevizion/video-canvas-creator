# Video Creation Gateway - Intelligent Orchestration System

## 🌐 Architecture Overview

The Video Creation Gateway is an **intelligent orchestration layer** that routes, coordinates, and manages the entire video creation pipeline. It's not a simple input→output function, but a sophisticated system that:

- **Routes** requests to appropriate thinking patterns and services
- **Coordinates** multiple AI calls and external services
- **Maintains** context across multi-step interactions
- **Decides** what needs to happen next
- **Handles** errors and fallbacks gracefully
- **Optimizes** the entire workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     VIDEO CREATION GATEWAY                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Input Router & Intent Analyzer             │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Workflow Orchestrator                    │  │
│  │  • Decides what services to call                     │  │
│  │  • Manages call sequence and dependencies            │  │
│  │  • Handles branching logic                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌────────────┬────────────┬────────────┬──────────────┐  │
│  │  Thinking  │   Asset    │   Web      │    Video     │  │
│  │  Patterns  │  Pipeline  │  Scraper   │   Analyzer   │  │
│  └────────────┴────────────┴────────────┴──────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Video Plan Generator & Optimizer             │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Response Formatter                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Gateway Core Concepts

### 1. **Workflow** (Not Just Function Calls)
A workflow is a multi-step process with:
- Sequential steps
- Parallel steps
- Conditional branches
- Loops and retries
- Context passing between steps

### 2. **Services** (Modular Components)
- Text Analysis Service
- Web Scraping Service
- Brand Extraction Service
- Image Generation Service
- Video Analysis Service
- Asset Processing Service
- Video Plan Generation Service
- Quality Validation Service

### 3. **Context** (Stateful Processing)
Maintains state across the entire workflow:
```typescript
interface WorkflowContext {
  requestId: string;
  userId: string;
  input: any;
  currentStep: string;
  completedSteps: string[];
  data: {
    extractedBrand?: BrandData;
    analyzedAssets?: AssetAnalysis[];
    webContent?: WebContent;
    thinkingPattern?: string;
    intermediateResults?: any;
  };
  decisions: Decision[];
  metadata: {
    startTime: number;
    estimatedDuration?: number;
    confidence?: number;
  };
}
```

---

## 🔀 Gateway Request Flow

### Example 1: Simple Text Prompt
```
User Input: "Create a video about climate change"
           ↓
    [Input Router]
           ↓
    Analyzes: text-only, no assets, no URL
    Pattern: Conceptual
           ↓
    [Workflow Orchestrator]
    Workflow: SIMPLE_TEXT
           ↓
    Step 1: Text Analysis (extract intent, tone, keywords)
    Step 2: Generate Video Plan (using conceptual pattern)
    Step 3: Validate Plan
           ↓
    [Response] → Video Plan
```

### Example 2: Complex Multi-Input
```
User Input: {
  prompt: "Make promo video",
  url: "https://mycompany.com",
  logo: <file>,
  goalType: "increase_signups"
}
           ↓
    [Input Router]
           ↓
    Analyzes: text + URL + asset + goal
    Pattern: Multi-modal + Strategic
    Complexity: HIGH
           ↓
    [Workflow Orchestrator]
    Workflow: COMPLEX_MULTIMODAL
           ↓
    ┌─ Step 1: Web Scraping (parallel)
    │  └─ Extract: colors, fonts, images, text, CTAs
    │
    ├─ Step 2: Logo Analysis (parallel)
    │  └─ Extract: primary colors, style, dimensions
    │
    ├─ Step 3: Brand Synthesis (sequential, waits for 1 & 2)
    │  └─ Merge web data + logo data → unified brand profile
    │
    ├─ Step 4: Goal Analysis (parallel with 1-3)
    │  └─ Analyze: "increase signups" → what video structure works?
    │
    ├─ Step 5: Strategic Planning (waits for all above)
    │  └─ Combine brand + goal → determine scenes, CTAs, structure
    │
    ├─ Step 6: Asset Gap Detection
    │  └─ Do we need generated images? Stock footage? More assets?
    │
    ├─ Step 7: Content Generation (conditional)
    │  └─ IF gaps exist: generate missing images/assets
    │
    ├─ Step 8: Video Plan Generation
    │  └─ Create detailed video plan with all elements
    │
    └─ Step 9: Quality Validation
       └─ Check: brand consistency, goal alignment, technical validity
           ↓
    [Response] → Complete Video Plan + Asset URLs + Confidence Score
```

### Example 3: Interactive Workflow
```
User Input: "Help me create a video to pitch my startup"
           ↓
    [Input Router]
           ↓
    Analyzes: vague goal-oriented request
    Pattern: Strategic (needs more info)
    Decision: INITIATE_INTERACTIVE_MODE
           ↓
    [Workflow Orchestrator]
    Workflow: INTERACTIVE_STRATEGIC
           ↓
    Step 1: Ask Clarifying Questions
           ↓
    [Response] → {
      type: "clarification_needed",
      questions: [
        "What industry is your startup in?",
        "Who is your target audience for this pitch?",
        "Do you have any existing brand materials (logo, colors)?",
        "What's the main problem your startup solves?",
        "How long should the video be?"
      ],
      workflowId: "abc123" // to resume later
    }
    
    [User responds with answers]
           ↓
    Step 2: Resume Workflow (with context)
    Step 3: Analyze Industry + Audience
    Step 4: Generate Strategic Structure
    Step 5: Create Pitch-Optimized Video Plan
           ↓
    [Response] → Video Plan optimized for startup pitch
```

---

## 🏗️ Gateway Implementation

### Core Gateway Class

```typescript
class VideoCreationGateway {
  private services: ServiceRegistry;
  private workflowEngine: WorkflowEngine;
  private contextManager: ContextManager;
  
  constructor() {
    this.services = new ServiceRegistry();
    this.workflowEngine = new WorkflowEngine();
    this.contextManager = new ContextManager();
  }
  
  /**
   * Main entry point - handles any type of video creation request
   */
  async process(input: GatewayInput): Promise<GatewayResponse> {
    // 1. Create workflow context
    const context = await this.contextManager.create(input);
    
    // 2. Analyze input and route
    const routing = await this.analyzeAndRoute(input, context);
    
    // 3. Select and execute workflow
    const workflow = this.workflowEngine.getWorkflow(routing.workflowType);
    const result = await workflow.execute(context, this.services);
    
    // 4. Format and return response
    return this.formatResponse(result, context);
  }
  
  /**
   * Analyze input and decide routing
   */
  private async analyzeAndRoute(
    input: GatewayInput,
    context: WorkflowContext
  ): Promise<RoutingDecision> {
    const analyzer = new InputAnalyzer();
    
    // Analyze input complexity
    const complexity = analyzer.assessComplexity(input);
    
    // Detect input types
    const inputTypes = analyzer.detectTypes(input);
    
    // Determine thinking pattern
    const pattern = analyzer.selectThinkingPattern(input, inputTypes);
    
    // Check if interactive mode needed
    const needsClarification = analyzer.needsClarification(input);
    
    // Select workflow type
    const workflowType = this.selectWorkflow(
      complexity,
      inputTypes,
      pattern,
      needsClarification
    );
    
    return {
      workflowType,
      pattern,
      complexity,
      needsClarification,
      estimatedSteps: this.estimateSteps(workflowType),
    };
  }
  
  /**
   * Select appropriate workflow based on analysis
   */
  private selectWorkflow(
    complexity: ComplexityLevel,
    types: InputType[],
    pattern: ThinkingPattern,
    needsClarification: boolean
  ): WorkflowType {
    if (needsClarification) {
      return 'INTERACTIVE';
    }
    
    if (types.includes('url') && types.includes('assets')) {
      return 'MULTIMODAL_WEB_ASSETS';
    }
    
    if (types.includes('url')) {
      return 'WEB_EXTRACTION';
    }
    
    if (types.includes('referenceVideo')) {
      return 'TEMPLATE_BASED';
    }
    
    if (types.includes('assets') && types.length === 1) {
      return 'ASSET_CENTRIC';
    }
    
    if (complexity === 'HIGH') {
      return 'COMPLEX_STRATEGIC';
    }
    
    return 'SIMPLE_TEXT';
  }
}
```

---

## 🔄 Workflow Definitions

### Workflow: SIMPLE_TEXT

```typescript
class SimpleTextWorkflow implements Workflow {
  async execute(
    context: WorkflowContext,
    services: ServiceRegistry
  ): Promise<WorkflowResult> {
    const steps: WorkflowStep[] = [
      {
        name: 'analyze_text',
        service: 'textAnalysis',
        action: async () => {
          return await services.textAnalysis.analyze(context.input.prompt);
        }
      },
      {
        name: 'generate_plan',
        service: 'videoPlanGenerator',
        dependsOn: ['analyze_text'],
        action: async (ctx) => {
          const analysis = ctx.data.analyze_text;
          return await services.videoPlanGenerator.generate({
            pattern: 'conceptual',
            analysis,
            duration: context.input.duration || 30,
          });
        }
      },
      {
        name: 'validate',
        service: 'validator',
        dependsOn: ['generate_plan'],
        action: async (ctx) => {
          const plan = ctx.data.generate_plan;
          return await services.validator.validate(plan);
        }
      }
    ];
    
    return await this.executeSteps(steps, context);
  }
}
```

### Workflow: MULTIMODAL_WEB_ASSETS

```typescript
class MultimodalWebAssetsWorkflow implements Workflow {
  async execute(
    context: WorkflowContext,
    services: ServiceRegistry
  ): Promise<WorkflowResult> {
    const steps: WorkflowStep[] = [
      // Parallel: Web scraping + Asset analysis
      {
        name: 'scrape_web',
        service: 'webScraper',
        parallel: 'group1',
        action: async () => {
          return await services.webScraper.scrape(context.input.url);
        }
      },
      {
        name: 'analyze_assets',
        service: 'assetAnalyzer',
        parallel: 'group1',
        action: async () => {
          return await services.assetAnalyzer.analyze(context.input.assets);
        }
      },
      
      // Sequential: Synthesize results
      {
        name: 'synthesize_brand',
        service: 'brandSynthesizer',
        dependsOn: ['scrape_web', 'analyze_assets'],
        action: async (ctx) => {
          const webData = ctx.data.scrape_web;
          const assetData = ctx.data.analyze_assets;
          return await services.brandSynthesizer.synthesize(webData, assetData);
        }
      },
      
      // Conditional: Generate missing assets
      {
        name: 'detect_gaps',
        service: 'gapDetector',
        dependsOn: ['synthesize_brand'],
        action: async (ctx) => {
          return await services.gapDetector.detect(ctx.data.synthesize_brand);
        }
      },
      {
        name: 'generate_assets',
        service: 'assetGenerator',
        dependsOn: ['detect_gaps'],
        condition: (ctx) => ctx.data.detect_gaps.hasGaps,
        action: async (ctx) => {
          const gaps = ctx.data.detect_gaps.gaps;
          return await services.assetGenerator.generate(gaps);
        }
      },
      
      // Final: Generate video plan
      {
        name: 'generate_plan',
        service: 'videoPlanGenerator',
        dependsOn: ['synthesize_brand', 'generate_assets'],
        action: async (ctx) => {
          return await services.videoPlanGenerator.generate({
            pattern: 'multimodal',
            brand: ctx.data.synthesize_brand,
            assets: [
              ...ctx.input.assets,
              ...(ctx.data.generate_assets?.assets || [])
            ],
            webContent: ctx.data.scrape_web,
          });
        }
      },
      
      // Validate
      {
        name: 'validate',
        service: 'validator',
        dependsOn: ['generate_plan'],
        action: async (ctx) => {
          return await services.validator.validate(ctx.data.generate_plan);
        }
      }
    ];
    
    return await this.executeSteps(steps, context);
  }
}
```

### Workflow: INTERACTIVE

```typescript
class InteractiveWorkflow implements Workflow {
  async execute(
    context: WorkflowContext,
    services: ServiceRegistry
  ): Promise<WorkflowResult> {
    // Check if this is initial request or continuation
    if (!context.data.clarificationResponses) {
      // Initial - need clarification
      const questions = await this.generateQuestions(context, services);
      
      // Save workflow state
      await this.contextManager.save(context);
      
      return {
        type: 'clarification_needed',
        questions,
        workflowId: context.requestId,
        message: 'I need some more information to create the perfect video for you.',
      };
    }
    
    // Continuation - user provided answers
    const answers = context.data.clarificationResponses;
    
    // Now execute actual video plan generation with enriched context
    const enrichedInput = await this.enrichInput(context.input, answers);
    
    // Determine appropriate workflow based on answers
    const nextWorkflow = this.selectNextWorkflow(answers);
    
    // Execute selected workflow
    return await nextWorkflow.execute(
      { ...context, input: enrichedInput },
      services
    );
  }
  
  private async generateQuestions(
    context: WorkflowContext,
    services: ServiceRegistry
  ): Promise<Question[]> {
    const analyzer = new InputAnalyzer();
    const missing = analyzer.detectMissingInfo(context.input);
    
    const questions: Question[] = [];
    
    if (missing.includes('industry')) {
      questions.push({
        id: 'industry',
        question: 'What industry or niche is this video for?',
        type: 'text',
        required: true,
      });
    }
    
    if (missing.includes('audience')) {
      questions.push({
        id: 'audience',
        question: 'Who is your target audience?',
        type: 'select',
        options: ['B2B', 'B2C', 'Internal', 'Investors', 'General Public'],
        required: true,
      });
    }
    
    if (missing.includes('duration')) {
      questions.push({
        id: 'duration',
        question: 'How long should the video be?',
        type: 'select',
        options: ['15s', '30s', '60s', '90s', '2+ minutes'],
        required: true,
      });
    }
    
    if (missing.includes('style')) {
      questions.push({
        id: 'style',
        question: 'What style do you prefer?',
        type: 'select',
        options: ['Professional', 'Fun & Casual', 'Bold & Dynamic', 'Minimal & Clean'],
        required: false,
      });
    }
    
    if (missing.includes('assets')) {
      questions.push({
        id: 'has_assets',
        question: 'Do you have logos, images, or videos to include?',
        type: 'boolean',
        followUp: {
          true: 'Please upload them',
          false: 'We\'ll generate visuals for you'
        }
      });
    }
    
    return questions;
  }
}
```

---

## 🎮 Gateway API

### REST API

```typescript
// POST /api/gateway/video/create
{
  "input": {
    "type": "text" | "assets" | "url" | "multimodal",
    "prompt": "string",
    "url": "string?",
    "assets": "Asset[]?",
    "goal": "string?",
    "duration": "number?",
    "style": "string?",
    "referenceVideo": "VideoPlan?"
  },
  "options": {
    "interactive": boolean,  // Allow clarification questions
    "async": boolean,        // Return immediately with workflowId
    "quality": "draft" | "standard" | "premium",
    "includeAssetGeneration": boolean,
  }
}

// Response (Synchronous)
{
  "status": "success",
  "workflowId": "abc123",
  "videoPlan": VideoPlan,
  "metadata": {
    "pattern": "conceptual",
    "complexity": "medium",
    "stepsExecuted": 5,
    "executionTime": "2.3s",
    "confidence": 0.92,
  },
  "assets": [
    { "id": "img1", "url": "...", "type": "generated" },
    { "id": "img2", "url": "...", "type": "uploaded" }
  ]
}

// Response (Clarification Needed)
{
  "status": "clarification_needed",
  "workflowId": "abc123",
  "message": "I need more information...",
  "questions": [
    {
      "id": "industry",
      "question": "What industry is this for?",
      "type": "text",
      "required": true
    }
  ]
}

// Continue with Clarification
// POST /api/gateway/video/continue
{
  "workflowId": "abc123",
  "answers": {
    "industry": "SaaS",
    "audience": "B2B",
    "duration": "30s"
  }
}
```

### WebSocket API (Real-time Progress)

```typescript
// Connect
ws://api/gateway/video/stream

// Send
{
  "action": "create",
  "input": { ... }
}

// Receive Progress Updates
{
  "type": "progress",
  "workflowId": "abc123",
  "step": "analyze_assets",
  "progress": 0.40,
  "message": "Analyzing uploaded images..."
}

{
  "type": "progress",
  "workflowId": "abc123",
  "step": "generate_plan",
  "progress": 0.80,
  "message": "Creating video plan..."
}

{
  "type": "complete",
  "workflowId": "abc123",
  "videoPlan": { ... },
  "metadata": { ... }
}
```

---

## 🔌 Service Registry

```typescript
class ServiceRegistry {
  private services: Map<string, Service> = new Map();
  
  register(name: string, service: Service) {
    this.services.set(name, service);
  }
  
  get(name: string): Service {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
  
  // Convenience getters
  get textAnalysis() { return this.get('textAnalysis') as TextAnalysisService; }
  get webScraper() { return this.get('webScraper') as WebScraperService; }
  get assetAnalyzer() { return this.get('assetAnalyzer') as AssetAnalyzerService; }
  get brandSynthesizer() { return this.get('brandSynthesizer') as BrandSynthesizerService; }
  get videoPlanGenerator() { return this.get('videoPlanGenerator') as VideoPlanGeneratorService; }
  get validator() { return this.get('validator') as ValidatorService; }
  get assetGenerator() { return this.get('assetGenerator') as AssetGeneratorService; }
}
```

---

## 🧪 Example Usage

### Example 1: Simple Call

```typescript
const gateway = new VideoCreationGateway();

const result = await gateway.process({
  input: {
    type: 'text',
    prompt: 'Create a video about renewable energy',
    duration: 30,
  }
});

console.log(result.videoPlan);
```

### Example 2: Complex Multi-Input

```typescript
const gateway = new VideoCreationGateway();

const result = await gateway.process({
  input: {
    type: 'multimodal',
    prompt: 'Make a promo video for our new app',
    url: 'https://myapp.com',
    assets: [logoFile, screenshotFile],
    goal: 'increase app downloads',
    duration: 45,
  },
  options: {
    includeAssetGeneration: true,
    quality: 'premium',
  }
});

if (result.status === 'success') {
  console.log('Video plan created:', result.videoPlan);
  console.log('Generated assets:', result.assets);
}
```

### Example 3: Interactive Mode

```typescript
const gateway = new VideoCreationGateway();

const result = await gateway.process({
  input: {
    type: 'text',
    prompt: 'Help me create a pitch video',
  },
  options: {
    interactive: true,
  }
});

if (result.status === 'clarification_needed') {
  console.log('Questions:', result.questions);
  
  // User answers questions
  const answers = {
    industry: 'FinTech',
    audience: 'Investors',
    duration: '90s',
    style: 'Professional',
  };
  
  // Continue workflow
  const finalResult = await gateway.continue({
    workflowId: result.workflowId,
    answers,
  });
  
  console.log('Video plan:', finalResult.videoPlan);
}
```

---

## 📊 Monitoring & Analytics

The gateway should track:
- Request patterns (which workflows are most common)
- Success rates (which workflows fail most)
- Performance (which steps are slowest)
- User satisfaction (which patterns get best results)
- Error patterns (what goes wrong most often)

This data feeds back into improving the routing logic and workflow definitions.

---

## 🚀 Implementation Roadmap

### Phase 1: Core Gateway (Week 1-2)
- [ ] Input router and analyzer
- [ ] Basic workflow engine
- [ ] Context manager
- [ ] Service registry
- [ ] 2-3 simple workflows (SIMPLE_TEXT, ASSET_CENTRIC)

### Phase 2: Advanced Workflows (Week 3-4)
- [ ] WEB_EXTRACTION workflow
- [ ] MULTIMODAL workflow
- [ ] INTERACTIVE workflow
- [ ] Parallel step execution
- [ ] Conditional step execution

### Phase 3: Services Integration (Week 5-6)
- [ ] Web scraper service
- [ ] Asset analyzer service
- [ ] Brand synthesizer service
- [ ] Image generation service
- [ ] Quality validator service

### Phase 4: Optimization & Monitoring (Week 7-8)
- [ ] Performance optimization
- [ ] Error handling & retries
- [ ] Analytics and monitoring
- [ ] WebSocket real-time updates
- [ ] Workflow caching

This creates a true **gateway** - not just a function, but an intelligent orchestration system that handles the complexity of video creation.
