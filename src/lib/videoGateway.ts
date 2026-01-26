/**
 * Video Creation Gateway - Core Implementation
 * 
 * This is the intelligent orchestration layer for video creation.
 * It routes requests, coordinates services, and manages workflows.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type InputType = 'text' | 'assets' | 'url' | 'goal' | 'reference' | 'data' | 'multimodal';
export type ComplexityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type WorkflowType = 
  | 'SIMPLE_TEXT'
  | 'ASSET_CENTRIC'
  | 'WEB_EXTRACTION'
  | 'MULTIMODAL_WEB_ASSETS'
  | 'TEMPLATE_BASED'
  | 'COMPLEX_STRATEGIC'
  | 'INTERACTIVE';

export interface GatewayInput {
  type: InputType;
  prompt?: string;
  url?: string;
  assets?: any[];
  goal?: string;
  referenceVideo?: any;
  data?: any;
  duration?: number;
  style?: string;
}

export interface GatewayOptions {
  interactive?: boolean;
  async?: boolean;
  quality?: 'draft' | 'standard' | 'premium';
  includeAssetGeneration?: boolean;
}

export interface WorkflowContext {
  requestId: string;
  userId?: string;
  input: GatewayInput;
  options: GatewayOptions;
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  decisions: any[];
  metadata: {
    startTime: number;
    estimatedDuration?: number;
    confidence?: number;
  };
}

export interface RoutingDecision {
  workflowType: WorkflowType;
  pattern: string;
  complexity: ComplexityLevel;
  needsClarification: boolean;
  estimatedSteps: number;
}

export interface WorkflowStep {
  name: string;
  service: string;
  dependsOn?: string[];
  parallel?: string;
  condition?: (ctx: WorkflowContext) => boolean;
  action: (ctx: WorkflowContext) => Promise<any>;
}

export interface WorkflowResult {
  status: 'success' | 'clarification_needed' | 'error';
  workflowId: string;
  videoPlan?: any;
  metadata?: any;
  assets?: any[];
  questions?: any[];
  message?: string;
  error?: string;
}

export interface Service {
  name: string;
  execute: (input: any, context: WorkflowContext) => Promise<any>;
}

export interface Workflow {
  type: WorkflowType;
  execute: (context: WorkflowContext, services: ServiceRegistry) => Promise<WorkflowResult>;
}

// ============================================================================
// INPUT ANALYZER
// ============================================================================

export class InputAnalyzer {
  /**
   * Assess complexity of input
   */
  assessComplexity(input: GatewayInput): ComplexityLevel {
    let score = 0;
    
    // Check number of input types
    if (input.url) score += 2;
    if (input.assets && input.assets.length > 0) score += 2;
    if (input.referenceVideo) score += 2;
    if (input.goal) score += 1;
    if (input.data) score += 1;
    
    // Check content complexity
    if (input.prompt && input.prompt.length > 200) score += 1;
    if (input.assets && input.assets.length > 5) score += 1;
    
    if (score >= 5) return 'HIGH';
    if (score >= 2) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * Detect all input types present
   */
  detectTypes(input: GatewayInput): InputType[] {
    const types: InputType[] = [];
    
    if (input.prompt) types.push('text');
    if (input.url) types.push('url');
    if (input.assets && input.assets.length > 0) types.push('assets');
    if (input.goal) types.push('goal');
    if (input.referenceVideo) types.push('reference');
    if (input.data) types.push('data');
    
    if (types.length > 1) types.push('multimodal');
    
    return types;
  }
  
  /**
   * Select appropriate thinking pattern
   */
  selectThinkingPattern(input: GatewayInput, types: InputType[]): string {
    if (types.includes('reference')) return 'template';
    if (types.includes('data')) return 'data-visualization';
    if (types.includes('goal')) return 'strategic';
    if (types.includes('url') && !types.includes('assets')) return 'content-extraction';
    if (types.includes('assets') && !types.includes('url')) return 'asset-centric';
    if (types.includes('multimodal')) return 'synthesis';
    return 'conceptual';
  }
  
  /**
   * Determine if clarification is needed
   */
  needsClarification(input: GatewayInput): boolean {
    // Check if prompt is too vague
    if (input.prompt && input.prompt.length < 20) {
      return true;
    }
    
    // Check if goal-oriented but missing key info
    if (input.goal && !input.url && !input.assets) {
      return true;
    }
    
    // Check if no duration specified
    if (!input.duration) {
      return false; // We can default this
    }
    
    return false;
  }
  
  /**
   * Detect missing information
   */
  detectMissingInfo(input: GatewayInput): string[] {
    const missing: string[] = [];
    
    if (!input.prompt || input.prompt.length < 20) {
      missing.push('detailed_description');
    }
    
    if (!input.duration) {
      missing.push('duration');
    }
    
    if (!input.style) {
      missing.push('style');
    }
    
    if (input.goal && !input.url && !input.assets) {
      missing.push('brand_materials');
    }
    
    return missing;
  }
}

// ============================================================================
// SERVICE REGISTRY
// ============================================================================

export class ServiceRegistry {
  private services: Map<string, Service> = new Map();
  
  register(service: Service) {
    this.services.set(service.name, service);
  }
  
  get(name: string): Service {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found in registry`);
    }
    return service;
  }
  
  has(name: string): boolean {
    return this.services.has(name);
  }
}

// ============================================================================
// CONTEXT MANAGER
// ============================================================================

export class ContextManager {
  private contexts: Map<string, WorkflowContext> = new Map();
  
  async create(input: GatewayInput, options: GatewayOptions = {}): Promise<WorkflowContext> {
    const context: WorkflowContext = {
      requestId: this.generateId(),
      input,
      options,
      currentStep: 'init',
      completedSteps: [],
      data: {},
      decisions: [],
      metadata: {
        startTime: Date.now(),
      },
    };
    
    this.contexts.set(context.requestId, context);
    return context;
  }
  
  async get(requestId: string): Promise<WorkflowContext | null> {
    return this.contexts.get(requestId) || null;
  }
  
  async save(context: WorkflowContext): Promise<void> {
    this.contexts.set(context.requestId, context);
  }
  
  async delete(requestId: string): Promise<void> {
    this.contexts.delete(requestId);
  }
  
  private generateId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// WORKFLOW ENGINE
// ============================================================================

export class WorkflowEngine {
  private workflows: Map<WorkflowType, Workflow> = new Map();
  
  register(workflow: Workflow) {
    this.workflows.set(workflow.type, workflow);
  }
  
  getWorkflow(type: WorkflowType): Workflow {
    const workflow = this.workflows.get(type);
    if (!workflow) {
      throw new Error(`Workflow ${type} not found`);
    }
    return workflow;
  }
  
  /**
   * Execute workflow steps with dependency management
   */
  async executeSteps(
    steps: WorkflowStep[],
    context: WorkflowContext,
    services: ServiceRegistry
  ): Promise<any> {
    const results: Record<string, any> = {};
    const executed: Set<string> = new Set();
    
    // Group parallel steps
    const parallelGroups: Map<string, WorkflowStep[]> = new Map();
    const sequentialSteps: WorkflowStep[] = [];
    
    for (const step of steps) {
      if (step.parallel) {
        if (!parallelGroups.has(step.parallel)) {
          parallelGroups.set(step.parallel, []);
        }
        parallelGroups.get(step.parallel)!.push(step);
      } else {
        sequentialSteps.push(step);
      }
    }
    
    // Execute parallel groups first
    for (const [group, groupSteps] of parallelGroups) {
      console.log(`Executing parallel group: ${group}`);
      const promises = groupSteps.map(step => this.executeStep(step, context, results));
      const groupResults = await Promise.all(promises);
      
      groupSteps.forEach((step, i) => {
        results[step.name] = groupResults[i];
        executed.add(step.name);
      });
    }
    
    // Execute sequential steps
    for (const step of sequentialSteps) {
      // Check dependencies
      if (step.dependsOn) {
        const allDepsExecuted = step.dependsOn.every(dep => executed.has(dep));
        if (!allDepsExecuted) {
          throw new Error(`Step ${step.name} dependencies not met`);
        }
      }
      
      // Check condition
      if (step.condition && !step.condition(context)) {
        console.log(`Skipping step ${step.name} - condition not met`);
        continue;
      }
      
      console.log(`Executing step: ${step.name}`);
      const result = await this.executeStep(step, context, results);
      results[step.name] = result;
      executed.add(step.name);
      context.completedSteps.push(step.name);
    }
    
    return results;
  }
  
  private async executeStep(
    step: WorkflowStep,
    context: WorkflowContext,
    previousResults: Record<string, any>
  ): Promise<any> {
    const enrichedContext = {
      ...context,
      data: { ...context.data, ...previousResults }
    };
    
    return await step.action(enrichedContext);
  }
}

// ============================================================================
// VIDEO CREATION GATEWAY
// ============================================================================

export class VideoCreationGateway {
  private services: ServiceRegistry;
  private workflowEngine: WorkflowEngine;
  private contextManager: ContextManager;
  private inputAnalyzer: InputAnalyzer;
  
  constructor() {
    this.services = new ServiceRegistry();
    this.workflowEngine = new WorkflowEngine();
    this.contextManager = new ContextManager();
    this.inputAnalyzer = new InputAnalyzer();
    
    this.initializeServices();
    this.initializeWorkflows();
  }
  
  /**
   * Main entry point - process any video creation request
   */
  async process(
    input: GatewayInput,
    options: GatewayOptions = {}
  ): Promise<WorkflowResult> {
    try {
      // 1. Create context
      const context = await this.contextManager.create(input, options);
      console.log(`[Gateway] Processing request ${context.requestId}`);
      
      // 2. Analyze and route
      const routing = await this.analyzeAndRoute(input, context);
      console.log(`[Gateway] Routing: ${routing.workflowType} (${routing.pattern})`);
      
      // 3. Get and execute workflow
      const workflow = this.workflowEngine.getWorkflow(routing.workflowType);
      const result = await workflow.execute(context, this.services);
      
      // 4. Cleanup context (unless interactive)
      if (result.status !== 'clarification_needed') {
        await this.contextManager.delete(context.requestId);
      }
      
      return result;
      
    } catch (error) {
      console.error('[Gateway] Error:', error);
      return {
        status: 'error',
        workflowId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Continue an interactive workflow
   */
  async continue(workflowId: string, answers: Record<string, any>): Promise<WorkflowResult> {
    const context = await this.contextManager.get(workflowId);
    if (!context) {
      throw new Error(`Workflow ${workflowId} not found`);
    }
    
    // Add answers to context
    context.data.clarificationResponses = answers;
    
    // Re-process with enriched context
    const workflow = this.workflowEngine.getWorkflow('INTERACTIVE');
    return await workflow.execute(context, this.services);
  }
  
  /**
   * Analyze input and determine routing
   */
  private async analyzeAndRoute(
    input: GatewayInput,
    context: WorkflowContext
  ): Promise<RoutingDecision> {
    const complexity = this.inputAnalyzer.assessComplexity(input);
    const inputTypes = this.inputAnalyzer.detectTypes(input);
    const pattern = this.inputAnalyzer.selectThinkingPattern(input, inputTypes);
    const needsClarification = this.inputAnalyzer.needsClarification(input);
    
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
   * Select appropriate workflow
   */
  private selectWorkflow(
    complexity: ComplexityLevel,
    types: InputType[],
    pattern: string,
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
    
    if (types.includes('reference')) {
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
  
  private estimateSteps(workflowType: WorkflowType): number {
    const stepCounts: Record<WorkflowType, number> = {
      'SIMPLE_TEXT': 3,
      'ASSET_CENTRIC': 4,
      'WEB_EXTRACTION': 5,
      'MULTIMODAL_WEB_ASSETS': 8,
      'TEMPLATE_BASED': 4,
      'COMPLEX_STRATEGIC': 7,
      'INTERACTIVE': 2,
    };
    return stepCounts[workflowType] || 3;
  }
  
  /**
   * Initialize services (to be implemented)
   */
  private initializeServices() {
    // Register sophisticated video production as STANDARD service
    this.services.register({
      name: 'sophisticatedProduction',
      execute: async (input: any, context: WorkflowContext) => {
        const { generateSophisticatedVideo } = await import('@/services/SophisticatedVideoGenerator');
        
        const options = {
          prompt: input.prompt || context.input.prompt || '',
          duration: input.duration || context.input.duration || 30,
          style: this.inferStyle(context.input),
          motionStyle: this.inferMotionStyle(context.input),
          enableCameraPaths: true,  // ALWAYS enabled - this is standard now
          enableCurvedPaths: true,   // ALWAYS enabled - this is standard now
          enableParallax: true,      // ALWAYS enabled - this is standard now
          enableColorGrading: true,  // ALWAYS enabled - this is standard now
          fps: 30
        };
        
        console.log('[Gateway] Applying sophisticated production (STANDARD)...');
        return await generateSophisticatedVideo(options);
      }
    });
    
    // Other services...
    // this.services.register(new TextAnalysisService());
    // this.services.register(new WebScraperService());
  }
  
  /**
   * Initialize workflows (to be implemented)
   */
  private initializeWorkflows() {
    // All workflows now use sophisticated production by default
    this.workflowEngine.register({
      type: 'SIMPLE_TEXT',
      execute: async (context: WorkflowContext, services: ServiceRegistry) => {
        // Execute sophisticated production (standard)
        const sophisticatedService = services.get('sophisticatedProduction');
        const videoPlan = await sophisticatedService.execute({}, context);
        
        return {
          status: 'success',
          workflowId: context.requestId,
          videoPlan,
          metadata: {
            productionGrade: videoPlan.sophisticatedMetadata?.productionGrade || 'professional',
            qualityScore: 85 // Sophisticated is standard
          }
        };
      }
    });
    
    // Register other workflows with sophisticated production built-in
    // this.workflowEngine.register(new MultimodalWorkflow());
  }
  
  /**
   * Infer video style from input
   */
  private inferStyle(input: GatewayInput): 'space-journey' | 'product-launch' | 'data-story' | 'cinematic' {
    const prompt = (input.prompt || '').toLowerCase();
    
    if (prompt.includes('github') || prompt.includes('stats') || prompt.includes('wrapped')) {
      return 'space-journey';
    }
    if (prompt.includes('product') || prompt.includes('launch') || prompt.includes('feature')) {
      return 'product-launch';
    }
    if (prompt.includes('data') || prompt.includes('analytics') || prompt.includes('chart')) {
      return 'data-story';
    }
    
    return 'cinematic'; // Default to highest quality
  }
  
  /**
   * Infer motion style from input
   */
  private inferMotionStyle(input: GatewayInput): 'cinematic' | 'tech' | 'corporate' | 'creative' | 'social' | 'minimal' {
    const prompt = (input.prompt || '').toLowerCase();
    
    if (prompt.includes('corporate') || prompt.includes('business')) return 'corporate';
    if (prompt.includes('tech') || prompt.includes('software')) return 'tech';
    if (prompt.includes('social') || prompt.includes('tiktok')) return 'social';
    if (prompt.includes('minimal') || prompt.includes('clean')) return 'minimal';
    
    return 'cinematic'; // Default to highest quality
  }
}

// Export singleton instance
export const gateway = new VideoCreationGateway();
