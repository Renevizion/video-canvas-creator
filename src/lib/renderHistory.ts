/**
 * Render History Management
 * Stores and retrieves video render history from localStorage
 */

export interface RenderHistoryItem {
  id: string;
  projectId: string;
  videoUrl: string;
  timestamp: number;
  duration: number;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
  title?: string;
}

const STORAGE_KEY = 'video_render_history';
const MAX_HISTORY_ITEMS = 50; // Keep last 50 renders

/**
 * Get all render history items, sorted by most recent first
 */
export function getRenderHistory(): RenderHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored) as RenderHistoryItem[];
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load render history:', error);
    return [];
  }
}

/**
 * Add a new render to history
 */
export function addRenderToHistory(item: Omit<RenderHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const history = getRenderHistory();
    
    const newItem: RenderHistoryItem = {
      ...item,
      id: `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    // Add to beginning of array
    history.unshift(newItem);
    
    // Keep only last MAX_HISTORY_ITEMS
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save render to history:', error);
  }
}

/**
 * Remove a render from history by ID
 */
export function removeRenderFromHistory(id: string): void {
  try {
    const history = getRenderHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove render from history:', error);
  }
}

/**
 * Clear all render history
 */
export function clearRenderHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear render history:', error);
  }
}

/**
 * Get render history for a specific project
 */
export function getProjectRenderHistory(projectId: string): RenderHistoryItem[] {
  const history = getRenderHistory();
  return history.filter(item => item.projectId === projectId);
}
