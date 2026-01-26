/**
 * Auto-Implementer with Safeguards
 * 
 * Enhanced version with user confirmation, cost tracking, and fallback options.
 * Addresses concerns about "magic" behavior and wrong resource fetching.
 */

import {
  autoImplement,
  extractEntities,
  type AutoImplementRequest,
  type ImplementationResult,
  type ExtractedEntity,
  type VideoElement,
  type FetchedResource,
} from './autoImplementer';

export interface SafeImplementationOptions {
  /**
   * Require user confirmation before fetching resources?
   * DEFAULT: true - prevents "magic" behavior
   */
  requireConfirmation?: boolean;

  /**
   * Minimum confidence score (0-1) to auto-fetch
   * Resources below this threshold will ask for confirmation
   * DEFAULT: 0.8
   */
  minConfidence?: number;

  /**
   * Maximum cost in USD before requiring approval
   * DEFAULT: 0.01 ($0.01 = 1 cent)
   */
  maxCostWithoutApproval?: number;

  /**
   * Maximum API calls before requiring approval
   * DEFAULT: 3
   */
  maxAPICallsWithoutApproval?: number;

  /**
   * Dry run mode - show what WOULD be fetched without actually fetching
   * DEFAULT: false
   */
  dryRun?: boolean;

  /**
   * Fallback options for each resource type
   */
  fallbackOptions?: {
    useLocalCache?: boolean; // Use cached resources if available
    useplaceholders?: boolean; // Use placeholder images/data if fetch fails
    askUserForURL?: boolean; // Ask user to provide URL if auto-fetch fails
  };
}

export interface SafeImplementationPlan {
  /**
   * What will be fetched
   */
  actions: PlannedAction[];

  /**
   * Estimated costs
   */
  estimatedCost: {
    apiCalls: number;
    tokens: number;
    dollarCost: number;
  };

  /**
   * Resources with low confidence that need confirmation
   */
  uncertainResources: UncertainResource[];

  /**
   * Can proceed without confirmation?
   */
  canProceedAutomatically: boolean;

  /**
   * Warning messages
   */
  warnings: string[];
}

export interface PlannedAction {
  actionType: 'fetch-logo' | 'fetch-image' | 'fetch-data' | 'create-element';
  entity: ExtractedEntity;
  description: string;
  confidence: number;
  estimatedCost: number; // in USD
  alternatives?: string[]; // Alternative resources if this one fails
}

export interface UncertainResource {
  entity: ExtractedEntity;
  reason: string; // Why we're uncertain
  suggestions: string[]; // Possible alternatives
  needsUserInput: boolean;
}

export interface ImplementationApproval {
  approved: boolean;
  modifications?: {
    // User can modify entities before fetching
    entityId: string;
    newValue: string;
  }[];
  skipEntities?: string[]; // Entities to skip
}

/**
 * Step 1: Analyze user input and create implementation plan
 * Shows what WILL be done before doing it
 */
export async function createImplementationPlan(
  userInput: string,
  options: SafeImplementationOptions = {}
): Promise<SafeImplementationPlan> {
  const {
    minConfidence = 0.8,
    maxCostWithoutApproval = 0.01,
    maxAPICallsWithoutApproval = 3,
  } = options;

  // Extract entities
  const entities = extractEntities(userInput);

  const plan: SafeImplementationPlan = {
    actions: [],
    estimatedCost: {
      apiCalls: 0,
      tokens: 0,
      dollarCost: 0,
    },
    uncertainResources: [],
    canProceedAutomatically: true,
    warnings: [],
  };

  // Analyze each entity and create action plan
  for (const entity of entities) {
    const action = createActionForEntity(entity);
    plan.actions.push(action);

    // Update cost estimates
    plan.estimatedCost.apiCalls += 1;
    plan.estimatedCost.tokens += 50; // Estimated tokens for API call
    plan.estimatedCost.dollarCost += action.estimatedCost;

    // Check confidence
    if (entity.confidence < minConfidence) {
      plan.uncertainResources.push({
        entity,
        reason: `Low confidence (${(entity.confidence * 100).toFixed(0)}%)`,
        suggestions: getAlternativeSuggestions(entity),
        needsUserInput: true,
      });
      plan.canProceedAutomatically = false;
    }

    // Check for ambiguous entities
    if (isAmbiguous(entity)) {
      plan.uncertainResources.push({
        entity,
        reason: 'Multiple possible matches',
        suggestions: getAlternativeSuggestions(entity),
        needsUserInput: true,
      });
      plan.canProceedAutomatically = false;
    }
  }

  // Check cost limits
  if (plan.estimatedCost.dollarCost > maxCostWithoutApproval) {
    plan.warnings.push(
      `Estimated cost $${plan.estimatedCost.dollarCost.toFixed(4)} exceeds limit $${maxCostWithoutApproval}`
    );
    plan.canProceedAutomatically = false;
  }

  if (plan.estimatedCost.apiCalls > maxAPICallsWithoutApproval) {
    plan.warnings.push(
      `${plan.estimatedCost.apiCalls} API calls exceed limit ${maxAPICallsWithoutApproval}`
    );
    plan.canProceedAutomatically = false;
  }

  // Add summary warning
  if (!plan.canProceedAutomatically) {
    plan.warnings.push(
      `This request requires user confirmation before proceeding.`
    );
  }

  return plan;
}

/**
 * Step 2: Execute implementation with safeguards
 */
export async function executeImplementationWithSafeguards(
  userInput: string,
  approval: ImplementationApproval,
  options: SafeImplementationOptions = {}
): Promise<ImplementationResult> {
  const { dryRun = false, fallbackOptions = {} } = options;

  if (!approval.approved) {
    return {
      success: false,
      elementsAdded: [],
      resourcesFetched: [],
      errors: ['User did not approve implementation'],
    };
  }

  // DRY RUN - show what would be done without doing it
  if (dryRun) {
    const plan = await createImplementationPlan(userInput, options);
    return {
      success: true,
      elementsAdded: plan.actions.map((a) => ({
        id: `dry-run-${a.entity.value}`,
        type: 'placeholder',
        content: `Would create: ${a.description}`,
      })),
      resourcesFetched: plan.actions.map((a) => ({
        type: 'logo',
        source: 'dry-run',
        url: `Would fetch: ${a.entity.value}`,
        usedIn: [],
      })),
      errors: [],
    };
  }

  // Extract and modify entities based on user approval
  let entities = extractEntities(userInput);

  // Apply user modifications
  if (approval.modifications) {
    entities = entities.map((e) => {
      const mod = approval.modifications?.find(
        (m) => m.entityId === `${e.type}-${e.value}`
      );
      if (mod) {
        return { ...e, value: mod.newValue };
      }
      return e;
    });
  }

  // Filter out skipped entities
  if (approval.skipEntities) {
    entities = entities.filter(
      (e) => !approval.skipEntities?.includes(`${e.type}-${e.value}`)
    );
  }

  // Execute with fallback handling
  const request: AutoImplementRequest = {
    intent: userInput,
    entities,
    context: { fallbackOptions },
  };

  try {
    let result = await autoImplement(request);

    // Apply fallbacks for failed fetches
    if (result.errors.length > 0 && fallbackOptions.useplaceholders) {
      result = await applyFallbacks(result, entities);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      elementsAdded: [],
      resourcesFetched: [],
      errors: [`Implementation failed: ${error}`],
    };
  }
}

/**
 * Create an action plan for a single entity
 */
function createActionForEntity(entity: ExtractedEntity): PlannedAction {
  switch (entity.type) {
    case 'company':
      return {
        actionType: 'fetch-logo',
        entity,
        description: `Fetch logo for ${entity.value}`,
        confidence: entity.confidence,
        estimatedCost: 0.001, // $0.001 per logo fetch
        alternatives: [
          `Use ${entity.value} brand colors instead`,
          'Use text logo',
          'Ask user for URL',
        ],
      };

    case 'product':
      return {
        actionType: 'fetch-image',
        entity,
        description: `Fetch image for ${entity.value}`,
        confidence: entity.confidence,
        estimatedCost: 0.002, // $0.002 per image search
        alternatives: [
          'Use placeholder image',
          'Use icon representation',
          'Ask user for URL',
        ],
      };

    case 'concept':
      return {
        actionType: 'create-element',
        entity,
        description: `Create ${entity.value} element`,
        confidence: entity.confidence,
        estimatedCost: 0, // No API cost for creating elements
        alternatives: [],
      };

    case 'data':
      return {
        actionType: 'create-element',
        entity,
        description: `Visualize data: ${entity.value}`,
        confidence: entity.confidence,
        estimatedCost: 0,
        alternatives: ['Use table instead of chart', 'Show raw numbers'],
      };

    case 'asset':
      return {
        actionType: 'fetch-image',
        entity,
        description: `Fetch asset: ${entity.value}`,
        confidence: entity.confidence,
        estimatedCost: 0.002,
        alternatives: ['Use placeholder', 'Use icon', 'Ask user for URL'],
      };

    default:
      return {
        actionType: 'create-element',
        entity,
        description: `Create element for ${entity.value}`,
        confidence: entity.confidence,
        estimatedCost: 0,
        alternatives: [],
      };
  }
}

/**
 * Check if an entity is ambiguous (multiple possible matches)
 */
function isAmbiguous(entity: ExtractedEntity): boolean {
  // Companies with common names
  const ambiguousNames = ['Apple', 'Meta', 'X', 'Amazon'];

  if (
    entity.type === 'company' &&
    ambiguousNames.some((name) =>
      entity.value.toLowerCase().includes(name.toLowerCase())
    )
  ) {
    return true;
  }

  // Products with version numbers might be ambiguous
  if (entity.type === 'product' && /\d+/.test(entity.value)) {
    return true;
  }

  return false;
}

/**
 * Get alternative suggestions for an entity
 */
function getAlternativeSuggestions(entity: ExtractedEntity): string[] {
  switch (entity.type) {
    case 'company':
      return [
        `${entity.value} Inc.`,
        `${entity.value} Corporation`,
        `${entity.value} Technologies`,
        'Provide exact company name',
      ];

    case 'product':
      return [
        `${entity.value} (latest version)`,
        `${entity.value} Pro`,
        `${entity.value} Standard`,
        'Specify product version',
      ];

    default:
      return ['Use placeholder', 'Ask user for clarification'];
  }
}

/**
 * Apply fallbacks when fetches fail
 */
async function applyFallbacks(
  result: ImplementationResult,
  entities: ExtractedEntity[]
): Promise<ImplementationResult> {
  // For each error, add a placeholder element
  const newElements: VideoElement[] = [];

  for (const error of result.errors) {
    // Extract entity name from error message
    const match = error.match(/Could not find .* for (.+)/);
    if (match) {
      const entityName = match[1];

      // Add placeholder
      newElements.push({
        id: `placeholder-${entityName.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'text',
        content: `[${entityName}]`,
        style: {
          fontSize: 48,
          fontWeight: 'bold',
          color: '#888',
          border: '2px dashed #ccc',
          padding: '20px',
        },
        size: { width: 300, height: 200 },
      });
    }
  }

  return {
    ...result,
    elementsAdded: [...result.elementsAdded, ...newElements],
    errors: result.errors.map((e) => `${e} (using placeholder)`),
  };
}

/**
 * Helper: Format plan for display to user
 */
export function formatPlanForUser(plan: SafeImplementationPlan): string {
  let output = '🎬 Implementation Plan\n\n';

  output += '📋 Actions to be performed:\n';
  plan.actions.forEach((action, i) => {
    const confidenceBar = '█'.repeat(Math.floor(action.confidence * 10));
    output += `${i + 1}. ${action.description}\n`;
    output += `   Confidence: ${confidenceBar} ${(action.confidence * 100).toFixed(0)}%\n`;
    if (action.estimatedCost > 0) {
      output += `   Cost: $${action.estimatedCost.toFixed(4)}\n`;
    }
  });

  output += `\n💰 Estimated Total Cost:\n`;
  output += `   API Calls: ${plan.estimatedCost.apiCalls}\n`;
  output += `   Tokens: ${plan.estimatedCost.tokens}\n`;
  output += `   Dollar Cost: $${plan.estimatedCost.dollarCost.toFixed(4)}\n`;

  if (plan.uncertainResources.length > 0) {
    output += `\n⚠️ Resources needing confirmation:\n`;
    plan.uncertainResources.forEach((resource, i) => {
      output += `${i + 1}. ${resource.entity.value} - ${resource.reason}\n`;
      output += `   Suggestions: ${resource.suggestions.join(', ')}\n`;
    });
  }

  if (plan.warnings.length > 0) {
    output += `\n⚠️ Warnings:\n`;
    plan.warnings.forEach((warning) => {
      output += `   • ${warning}\n`;
    });
  }

  if (plan.canProceedAutomatically) {
    output += `\n✅ Can proceed automatically`;
  } else {
    output += `\n⛔ Requires your confirmation to proceed`;
  }

  return output;
}
