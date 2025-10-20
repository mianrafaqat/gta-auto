/**
 * Sanitizes HTML content to prevent XSS attacks
 * Escapes special characters that could be used for script injection
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string safe for HTML rendering
 */
export function escapeHtml(str) {
  if (!str) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return String(str).replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Sanitizes an object by escaping all string values
 * @param {object} obj - The object to sanitize
 * @returns {object} - Object with sanitized string values
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Removes potentially dangerous HTML tags and attributes
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handler attributes
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  return sanitized;
}

