/**
 * Validates if a redirect URL is safe to use
 * Prevents open redirect vulnerabilities by only allowing internal paths
 * @param {string} url - The URL to validate
 * @param {string} fallback - Fallback URL if validation fails
 * @returns {string} - Safe redirect URL
 */
export function validateRedirectUrl(url, fallback = '/dashboard') {
  if (!url) {
    return fallback;
  }

  try {
    // Remove any leading/trailing whitespace
    const trimmedUrl = url.trim();

    // Only allow relative paths that start with /
    if (trimmedUrl.startsWith('/')) {
      // Prevent protocol-relative URLs like //evil.com
      if (trimmedUrl.startsWith('//')) {
        return fallback;
      }

      // Prevent javascript: and data: URLs
      if (
        trimmedUrl.toLowerCase().startsWith('javascript:') ||
        trimmedUrl.toLowerCase().startsWith('data:')
      ) {
        return fallback;
      }

      // Additional check: ensure it's a valid path
      // Should not contain @, which could indicate user@domain pattern
      if (trimmedUrl.includes('@')) {
        return fallback;
      }

      return trimmedUrl;
    }

    // Reject absolute URLs
    return fallback;
  } catch (error) {
    console.error('Error validating redirect URL:', error);
    return fallback;
  }
}

/**
 * Checks if a URL is an internal path
 * @param {string} url - The URL to check
 * @returns {boolean} - True if internal, false otherwise
 */
export function isInternalPath(url) {
  if (!url) return false;

  const trimmedUrl = url.trim();

  // Check if it's a relative path
  if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
    return true;
  }

  // Check if it matches current domain
  try {
    const urlObj = new URL(trimmedUrl, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

