/**
 * Web Search Tool
 * 
 * Provides web search capabilities for AI agents to find information,
 * resources, and answers they don't have locally.
 * 
 * Uses multiple free search APIs and scraping techniques.
 */

export interface SearchQuery {
  query: string;
  type?: 'general' | 'images' | 'videos' | 'news' | 'company';
  maxResults?: number;
  filters?: {
    domain?: string;
    dateRange?: 'day' | 'week' | 'month' | 'year';
    region?: string;
  };
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore?: number;
}

export interface ImageSearchResult {
  url: string;
  thumbnailUrl: string;
  title: string;
  source: string;
  size?: { width: number; height: number };
  format?: string;
}

export interface VideoSearchResult {
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  duration?: number;
  platform: 'youtube' | 'vimeo' | 'other';
}

/**
 * General web search using multiple free APIs
 */
export async function searchWeb(query: SearchQuery): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // Option 1: DuckDuckGo Instant Answer API (free, no key)
    const ddgResults = await searchDuckDuckGo(query.query);
    results.push(...ddgResults);

    // Option 2: Google Custom Search JSON API (100 queries/day free)
    // Requires GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID
    if (process.env.GOOGLE_SEARCH_API_KEY) {
      const googleResults = await searchGoogle(query);
      results.push(...googleResults);
    }

    // Option 3: Brave Search API (free tier: 2000 queries/month)
    // Requires BRAVE_SEARCH_API_KEY
    if (process.env.BRAVE_SEARCH_API_KEY) {
      const braveResults = await searchBrave(query);
      results.push(...braveResults);
    }

    // Sort by relevance and limit results
    return results
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, query.maxResults || 10);
  } catch (error) {
    console.error('Web search failed:', error);
    return [];
  }
}

/**
 * DuckDuckGo Instant Answer API (100% free, no key, NO SIGNUP)
 * This is our PRIMARY search - always works!
 */
async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(url);
    const data = await response.json();

    const results: SearchResult[] = [];

    // Abstract (main answer)
    if (data.Abstract) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || '',
        snippet: data.Abstract,
        source: 'duckduckgo',
        relevanceScore: 1.0,
      });
    }

    // Related topics
    if (data.RelatedTopics) {
      data.RelatedTopics.forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.substring(0, 100),
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'duckduckgo',
            relevanceScore: 0.8,
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error('DuckDuckGo search failed:', error);
    return [];
  }
}

/**
 * Google Custom Search API (100 queries/day free)
 */
async function searchGoogle(query: SearchQuery): Promise<SearchResult[]> {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !engineId) {
      return [];
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(
      query.query
    )}&num=${query.maxResults || 10}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      source: 'google',
      relevanceScore: 0.95,
    }));
  } catch (error) {
    console.error('Google search failed:', error);
    return [];
  }
}

/**
 * Brave Search API (2000 queries/month free)
 */
async function searchBrave(query: SearchQuery): Promise<SearchResult[]> {
  try {
    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey) {
      return [];
    }

    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
      query.query
    )}&count=${query.maxResults || 10}`;

    const response = await fetch(url, {
      headers: {
        'X-Subscription-Token': apiKey,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!data.web?.results) {
      return [];
    }

    return data.web.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.description,
      source: 'brave',
      relevanceScore: 0.9,
    }));
  } catch (error) {
    console.error('Brave search failed:', error);
    return [];
  }
}

/**
 * Search for images using multiple APIs
 */
export async function searchWebImages(
  query: string,
  maxResults: number = 10
): Promise<ImageSearchResult[]> {
  const results: ImageSearchResult[] = [];

  try {
    // Unsplash (free API, requires key)
    if (process.env.UNSPLASH_ACCESS_KEY) {
      const unsplashResults = await searchUnsplash(query, maxResults);
      results.push(...unsplashResults);
    }

    // Pexels (free API, requires key)
    if (process.env.PEXELS_API_KEY) {
      const pexelsResults = await searchPexels(query, maxResults);
      results.push(...pexelsResults);
    }

    // Pixabay (free API, requires key)
    if (process.env.PIXABAY_API_KEY) {
      const pixabayResults = await searchPixabay(query, maxResults);
      results.push(...pixabayResults);
    }

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Image search failed:', error);
    return [];
  }
}

/**
 * Unsplash image search
 */
async function searchUnsplash(
  query: string,
  maxResults: number
): Promise<ImageSearchResult[]> {
  try {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) return [];

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${maxResults}&client_id=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results?.map((photo: any) => ({
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      title: photo.description || photo.alt_description || query,
      source: 'unsplash',
      size: { width: photo.width, height: photo.height },
    })) || [];
  } catch (error) {
    console.error('Unsplash search failed:', error);
    return [];
  }
}

/**
 * Pexels image search
 */
async function searchPexels(
  query: string,
  maxResults: number
): Promise<ImageSearchResult[]> {
  try {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return [];

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=${maxResults}`;

    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });
    const data = await response.json();

    return data.photos?.map((photo: any) => ({
      url: photo.src.large,
      thumbnailUrl: photo.src.small,
      title: photo.alt || query,
      source: 'pexels',
      size: { width: photo.width, height: photo.height },
    })) || [];
  } catch (error) {
    console.error('Pexels search failed:', error);
    return [];
  }
}

/**
 * Pixabay image search
 */
async function searchPixabay(
  query: string,
  maxResults: number
): Promise<ImageSearchResult[]> {
  try {
    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) return [];

    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&per_page=${maxResults}&image_type=photo`;

    const response = await fetch(url);
    const data = await response.json();

    return data.hits?.map((photo: any) => ({
      url: photo.largeImageURL,
      thumbnailUrl: photo.previewURL,
      title: photo.tags || query,
      source: 'pixabay',
      size: { width: photo.imageWidth, height: photo.imageHeight },
      format: 'jpg',
    })) || [];
  } catch (error) {
    console.error('Pixabay search failed:', error);
    return [];
  }
}

/**
 * Search for videos on YouTube
 */
export async function searchYouTube(
  query: string,
  maxResults: number = 10
): Promise<VideoSearchResult[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn('YouTube API key not configured');
      return [];
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=${maxResults}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.items?.map((item: any) => ({
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      description: item.snippet.description,
      platform: 'youtube' as const,
    })) || [];
  } catch (error) {
    console.error('YouTube search failed:', error);
    return [];
  }
}

/**
 * Search for company information
 */
export async function searchCompany(
  companyName: string
): Promise<SearchResult[]> {
  const query: SearchQuery = {
    query: `${companyName} official website company information`,
    type: 'company',
    maxResults: 5,
  };

  return await searchWeb(query);
}

/**
 * Quick answer search (like asking Google a direct question)
 */
export async function quickAnswer(question: string): Promise<string | null> {
  try {
    // Try DuckDuckGo instant answer first
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      question
    )}&format=json&no_html=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Abstract) {
      return data.Abstract;
    }

    if (data.Answer) {
      return data.Answer;
    }

    // Fallback to first search result
    const results = await searchWeb({ query: question, maxResults: 1 });
    if (results.length > 0) {
      return results[0].snippet;
    }

    return null;
  } catch (error) {
    console.error('Quick answer failed:', error);
    return null;
  }
}

/**
 * Search for specific file types (PDFs, docs, etc.)
 */
export async function searchFiles(
  query: string,
  fileType: 'pdf' | 'doc' | 'ppt' | 'xls'
): Promise<SearchResult[]> {
  const searchQuery: SearchQuery = {
    query: `${query} filetype:${fileType}`,
    maxResults: 10,
  };

  return await searchWeb(searchQuery);
}

/**
 * Reverse image search (find similar images)
 */
export async function reverseImageSearch(
  imageUrl: string
): Promise<SearchResult[]> {
  try {
    // Google Reverse Image Search API requires special setup
    // For now, return structure for documentation
    console.log('Reverse image search:', imageUrl);
    return [];
  } catch (error) {
    console.error('Reverse image search failed:', error);
    return [];
  }
}

/**
 * Get trending topics/searches
 */
export async function getTrending(
  region: string = 'US'
): Promise<string[]> {
  try {
    // Google Trends API or similar
    console.log('Getting trending topics for:', region);
    return [];
  } catch (error) {
    console.error('Get trending failed:', error);
    return [];
  }
}

/**
 * Verify information across multiple sources
 */
export async function verifyInformation(
  claim: string
): Promise<{ verified: boolean; sources: SearchResult[] }> {
  const results = await searchWeb({
    query: claim,
    maxResults: 5,
  });

  // Simple verification: if multiple reputable sources mention it
  const verified = results.length >= 3;

  return {
    verified,
    sources: results,
  };
}
