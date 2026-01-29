/**
 * Input sanitization utilities
 * Used to sanitize user input before storing in database or displaying in UI
 */

/**
 * Sanitize text input by removing potentially dangerous characters
 * while preserving legitimate content
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length to prevent excessive data
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }
  
  return sanitized;
}

/**
 * Sanitize HTML content by escaping special characters
 */
export function escapeHtml(input: string | null | undefined): string {
  if (!input) return '';
  
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitize URL input
 * Note: This function only accepts absolute HTTP/HTTPS URLs.
 * Relative URLs and other protocols are rejected.
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input) return '';
  
  const sanitized = sanitizeText(input);
  
  // Ensure URL starts with http:// or https://
  if (sanitized && !sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return '';
  }
  
  try {
    // Validate URL format
    new URL(sanitized);
    return sanitized;
  } catch {
    return '';
  }
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string | null | undefined): string {
  if (!input) return '';
  
  const sanitized = sanitizeText(input).toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize JSON input
 */
export function sanitizeJson<T>(input: unknown): T | null {
  try {
    // If already an object, validate it
    if (typeof input === 'object' && input !== null) {
      // Remove any functions or undefined values
      const cleaned = JSON.parse(JSON.stringify(input));
      return cleaned as T;
    }
    
    // If string, parse and validate
    if (typeof input === 'string') {
      const parsed = JSON.parse(sanitizeText(input));
      return parsed as T;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(
  input: string | number | null | undefined,
  min?: number,
  max?: number
): number | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }
  
  const num = typeof input === 'number' ? input : parseFloat(input);
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  if (min !== undefined && num < min) {
    return min;
  }
  
  if (max !== undefined && num > max) {
    return max;
  }
  
  return num;
}

/**
 * Sanitize filename for storage
 * Note: Only preserves the last extension (e.g., .tar.gz becomes .gz)
 */
export function sanitizeFilename(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove path traversal attempts
  let sanitized = input.replace(/\.\./g, '');
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  const MAX_LENGTH = 255;
  if (sanitized.length > MAX_LENGTH) {
    const lastDotIndex = sanitized.lastIndexOf('.');
    if (lastDotIndex > 0) {
      const ext = sanitized.substring(lastDotIndex);
      const nameLength = MAX_LENGTH - ext.length;
      sanitized = sanitized.substring(0, nameLength) + ext;
    } else {
      sanitized = sanitized.substring(0, MAX_LENGTH);
    }
  }
  
  return sanitized;
}

/**
 * Sanitize color hex code
 */
export function sanitizeColor(input: string | null | undefined): string {
  if (!input) return '#000000';
  
  // Remove any non-hex characters
  let sanitized = input.replace(/[^#0-9a-fA-F]/g, '');
  
  // Ensure it starts with #
  if (!sanitized.startsWith('#')) {
    sanitized = '#' + sanitized;
  }
  
  // Ensure proper length (3 or 6 hex digits after #)
  if (sanitized.length === 4) {
    // Short form: #RGB -> #RRGGBB
    const r = sanitized[1];
    const g = sanitized[2];
    const b = sanitized[3];
    sanitized = `#${r}${r}${g}${g}${b}${b}`;
  } else if (sanitized.length !== 7) {
    // Invalid length, return default
    return '#000000';
  }
  
  return sanitized.toLowerCase();
}
