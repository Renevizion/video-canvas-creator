/**
 * Auto-Implementer System
 * 
 * Automatically searches the internet for missing resources and implements them
 * into video plans without manual intervention.
 * 
 * Examples:
 * - User mentions "Apple, Google, Microsoft" → Fetches logos and adds to video
 * - User wants "iPhone mockup" → Finds assets and implements phone-mockup element
 * - User needs "sales data visualization" → Creates chart with placeholder/real data
 * - User mentions "background music" → Adds audio visualization element
 */

import {
  fetchCompanyLogo,
  searchImages,
  extractDomain,
  type LogoResult,
  type ImageResult,
} from './webResourceFetcher';

export interface AutoImplementRequest {
  intent: string; // What the user wants
  entities: ExtractedEntity[]; // What we detected in their request
  context: Record<string, any>; // Additional context
}

export interface ExtractedEntity {
  type: 'company' | 'person' | 'product' | 'concept' | 'data' | 'asset';
  value: string;
  confidence: number;
}

export interface ImplementationResult {
  success: boolean;
  elementsAdded: VideoElement[];
  resourcesFetched: FetchedResource[];
  errors: string[];
}

export interface VideoElement {
  id: string;
  type: string;
  content?: string;
  style?: Record<string, any>;
  position?: { x: number; y: number; z: number };
  size?: { width: number; height: number };
  animation?: string;
}

export interface FetchedResource {
  type: 'logo' | 'image' | 'data' | 'audio';
  source: string;
  url: string;
  usedIn: string[]; // Element IDs that use this resource
}

/**
 * Main auto-implementation function
 * Takes user input and automatically implements missing resources
 */
export async function autoImplement(
  request: AutoImplementRequest
): Promise<ImplementationResult> {
  const result: ImplementationResult = {
    success: true,
    elementsAdded: [],
    resourcesFetched: [],
    errors: [],
  };

  // Process each entity and implement it
  for (const entity of request.entities) {
    try {
      switch (entity.type) {
        case 'company':
          await implementCompany(entity, result);
          break;
        case 'product':
          await implementProduct(entity, result);
          break;
        case 'concept':
          await implementConcept(entity, result);
          break;
        case 'data':
          await implementData(entity, result);
          break;
        case 'asset':
          await implementAsset(entity, result);
          break;
      }
    } catch (error) {
      result.errors.push(
        `Failed to implement ${entity.type} "${entity.value}": ${error}`
      );
      result.success = false;
    }
  }

  return result;
}

/**
 * Implement company mentions - fetch logo and add to video
 */
async function implementCompany(
  entity: ExtractedEntity,
  result: ImplementationResult
): Promise<void> {
  const companyName = entity.value;
  const domain = extractDomain(companyName);

  // Fetch logo from multiple sources
  const logos = await fetchCompanyLogo(companyName, domain || undefined);

  if (logos.length === 0) {
    result.errors.push(`Could not find logo for ${companyName}`);
    return;
  }

  // Use the first (best) logo
  const logo = logos[0];

  // Create element ID
  const elementId = `logo-${companyName.toLowerCase().replace(/\s+/g, '-')}`;

  // Add logo element to video
  result.elementsAdded.push({
    id: elementId,
    type: 'image',
    content: logo.url,
    style: {
      objectFit: 'contain',
      alt: `${companyName} logo`,
    },
    size: { width: 200, height: 200 },
    animation: 'fade-in',
  });

  // Record fetched resource
  result.resourcesFetched.push({
    type: 'logo',
    source: logo.source,
    url: logo.url,
    usedIn: [elementId],
  });
}

/**
 * Implement product mentions - search for images and add mockups
 */
async function implementProduct(
  entity: ExtractedEntity,
  result: ImplementationResult
): Promise<void> {
  const productName = entity.value;

  // Check if it's a phone/device product
  if (
    productName.toLowerCase().includes('iphone') ||
    productName.toLowerCase().includes('android') ||
    productName.toLowerCase().includes('phone')
  ) {
    // Add phone mockup element
    const elementId = `phone-${Date.now()}`;
    result.elementsAdded.push({
      id: elementId,
      type: 'phone-mockup',
      style: {
        phoneType: productName.toLowerCase().includes('iphone')
          ? 'iphone'
          : 'android',
      },
      position: { x: 960, y: 540, z: 2 },
      animation: 'float',
    });
  } else {
    // Search for product images
    const images = await searchImages(productName, 1);
    if (images.length > 0) {
      const image = images[0];
      const elementId = `product-${productName.toLowerCase().replace(/\s+/g, '-')}`;

      result.elementsAdded.push({
        id: elementId,
        type: 'image',
        content: image.url,
        style: {
          objectFit: 'cover',
          alt: productName,
        },
        size: { width: 800, height: 600 },
        animation: 'zoom-in',
      });

      result.resourcesFetched.push({
        type: 'image',
        source: image.source,
        url: image.url,
        usedIn: [elementId],
      });
    }
  }
}

/**
 * Implement concepts - add appropriate elements based on concept type
 */
async function implementConcept(
  entity: ExtractedEntity,
  result: ImplementationResult
): Promise<void> {
  const concept = entity.value.toLowerCase();

  // Music/audio visualization
  if (
    concept.includes('music') ||
    concept.includes('audio') ||
    concept.includes('sound') ||
    concept.includes('waveform')
  ) {
    result.elementsAdded.push({
      id: `music-viz-${Date.now()}`,
      type: 'music-visualization',
      position: { x: 50, y: 700, z: 1 },
      size: { width: 1820, height: 300 },
      animation: 'pulse',
    });
  }

  // Captions
  if (
    concept.includes('caption') ||
    concept.includes('subtitle') ||
    concept.includes('text')
  ) {
    result.elementsAdded.push({
      id: `captions-${Date.now()}`,
      type: 'tiktok-captions',
      content: 'Your caption text here',
      style: { fontSize: 52, fontWeight: 'bold' },
      position: { x: 960, y: 200, z: 3 },
    });
  }

  // Statistics/counter
  if (
    concept.includes('stat') ||
    concept.includes('number') ||
    concept.includes('count') ||
    concept.includes('metric')
  ) {
    result.elementsAdded.push({
      id: `stats-${Date.now()}`,
      type: 'stats-counter',
      style: {
        value: 1000,
        label: 'Total Count',
        delay: 0,
      },
      position: { x: 960, y: 540, z: 2 },
    });
  }

  // Chart/graph
  if (
    concept.includes('chart') ||
    concept.includes('graph') ||
    concept.includes('visualization')
  ) {
    result.elementsAdded.push({
      id: `chart-${Date.now()}`,
      type: 'data-viz',
      style: {
        chartType: 'bar',
        data: [
          { label: 'Q1', value: 25 },
          { label: 'Q2', value: 45 },
          { label: 'Q3', value: 60 },
          { label: 'Q4', value: 80 },
        ],
      },
      position: { x: 960, y: 540, z: 2 },
      size: { width: 800, height: 500 },
    });
  }
}

/**
 * Implement data - create data visualizations
 */
async function implementData(
  entity: ExtractedEntity,
  result: ImplementationResult
): Promise<void> {
  // Parse data from entity value
  // This is a simplified example - real implementation would parse actual data
  const elementId = `data-${Date.now()}`;

  result.elementsAdded.push({
    id: elementId,
    type: 'data-viz',
    style: {
      chartType: 'bar',
      data: [
        { label: 'Item 1', value: 30 },
        { label: 'Item 2', value: 50 },
        { label: 'Item 3', value: 70 },
      ],
      title: entity.value,
    },
    position: { x: 960, y: 540, z: 2 },
    size: { width: 800, height: 500 },
  });
}

/**
 * Implement asset requests - fetch from web
 */
async function implementAsset(
  entity: ExtractedEntity,
  result: ImplementationResult
): Promise<void> {
  const assetDescription = entity.value;

  // Search for images matching the description
  const images = await searchImages(assetDescription, 1);

  if (images.length > 0) {
    const image = images[0];
    const elementId = `asset-${Date.now()}`;

    result.elementsAdded.push({
      id: elementId,
      type: 'image',
      content: image.url,
      style: {
        objectFit: 'cover',
        alt: assetDescription,
      },
      size: { width: 1920, height: 1080 },
    });

    result.resourcesFetched.push({
      type: 'image',
      source: image.source,
      url: image.url,
      usedIn: [elementId],
    });
  }
}

/**
 * Extract entities from user input using NLP patterns
 */
export function extractEntities(userInput: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  const input = userInput.toLowerCase();

  // Company name patterns (capitalized words, Inc, Corp, etc.)
  const companyPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc|Corp|LLC|Ltd|Company|Technologies)/g,
    /\b(Apple|Google|Microsoft|Amazon|Facebook|Meta|Tesla|Netflix|Uber|Airbnb|Spotify|Twitter|X|LinkedIn|Instagram|TikTok|Snapchat|Pinterest|Reddit|Discord|Slack|Zoom|Dropbox|Adobe|Oracle|IBM|Intel|NVIDIA|AMD|Samsung|Sony|Nintendo|Disney|Warner|Paramount|Universal|HBO|Hulu|Peacock|Max)\b/gi,
  ];

  companyPatterns.forEach((pattern) => {
    const matches = userInput.matchAll(pattern);
    for (const match of matches) {
      entities.push({
        type: 'company',
        value: match[1] || match[0],
        confidence: 0.9,
      });
    }
  });

  // Product patterns
  if (input.includes('iphone') || input.includes('android phone')) {
    entities.push({
      type: 'product',
      value: input.includes('iphone') ? 'iPhone' : 'Android Phone',
      confidence: 0.95,
    });
  }

  // Concept patterns
  const concepts = [
    { keywords: ['music', 'audio', 'sound'], value: 'music visualization' },
    { keywords: ['caption', 'subtitle'], value: 'captions' },
    { keywords: ['stat', 'metric', 'number'], value: 'statistics' },
    { keywords: ['chart', 'graph'], value: 'chart' },
  ];

  concepts.forEach((concept) => {
    if (concept.keywords.some((kw) => input.includes(kw))) {
      entities.push({
        type: 'concept',
        value: concept.value,
        confidence: 0.8,
      });
    }
  });

  // Data patterns (numbers with context)
  const dataPattern = /(\d+(?:,\d{3})*(?:\.\d+)?)\s*([a-z]+)/gi;
  const dataMatches = userInput.matchAll(dataPattern);
  for (const match of dataMatches) {
    entities.push({
      type: 'data',
      value: `${match[1]} ${match[2]}`,
      confidence: 0.7,
    });
  }

  return entities;
}

/**
 * High-level function: Process user input and auto-implement
 */
export async function processAndImplement(
  userInput: string,
  context: Record<string, any> = {}
): Promise<ImplementationResult> {
  // Extract entities from input
  const entities = extractEntities(userInput);

  // Create request
  const request: AutoImplementRequest = {
    intent: userInput,
    entities,
    context,
  };

  // Auto-implement
  return await autoImplement(request);
}
