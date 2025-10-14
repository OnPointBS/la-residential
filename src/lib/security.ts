import validator from 'validator';
import { SECURITY_CONFIG } from './security-config';

// Simple HTML sanitization function
function sanitizeHtml(input: string): string {
  // Basic sanitization that works both client and server-side
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
}

export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: Record<string, any>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting function
 */
export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }

  // Increment count
  current.count++;
  rateLimitStore.set(key, current);

  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  };
}

/**
 * Sanitize HTML content
 */
export { sanitizeHtml };

/**
 * Validate and sanitize form data
 */
export function validateAndSanitizeForm(
  data: Record<string, any>,
  rules: Record<string, {
    required?: boolean;
    type?: 'string' | 'email' | 'phone' | 'number' | 'url' | 'text';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    sanitize?: boolean;
  }>
): SecurityValidationResult {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Check required fields
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      sanitizedData[field] = '';
      continue;
    }

    let sanitizedValue = value;

    // Sanitize HTML if requested
    if (rule.sanitize && typeof value === 'string') {
      sanitizedValue = sanitizeHtml(value);
    }

    // Type-specific validation
    switch (rule.type) {
      case 'email':
        if (!validator.isEmail(sanitizedValue)) {
          errors.push(`${field} must be a valid email address`);
        }
        sanitizedValue = validator.normalizeEmail(sanitizedValue) || sanitizedValue;
        break;

      case 'phone':
        if (!validator.isMobilePhone(sanitizedValue, 'any')) {
          errors.push(`${field} must be a valid phone number`);
        }
        break;

      case 'number':
        if (!validator.isNumeric(sanitizedValue)) {
          errors.push(`${field} must be a valid number`);
        }
        sanitizedValue = parseFloat(sanitizedValue);
        break;

      case 'url':
        if (!validator.isURL(sanitizedValue)) {
          errors.push(`${field} must be a valid URL`);
        }
        break;

      case 'string':
      case 'text':
      default:
        if (typeof sanitizedValue !== 'string') {
          sanitizedValue = String(sanitizedValue);
        }
        break;
    }

    // Length validation
    if (typeof sanitizedValue === 'string') {
      if (rule.minLength && sanitizedValue.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters long`);
      }
      if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
        errors.push(`${field} must be no more than ${rule.maxLength} characters long`);
      }
    }

    // Pattern validation
    if (rule.pattern && typeof sanitizedValue === 'string' && !rule.pattern.test(sanitizedValue)) {
      errors.push(`${field} format is invalid`);
    }

    // Additional security checks
    if (typeof sanitizedValue === 'string') {
      // Check for suspicious patterns
      for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
        if (pattern.test(sanitizedValue)) {
          errors.push(`${field} contains potentially malicious content`);
          break;
        }
      }
    }

    sanitizedData[field] = sanitizedValue;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64;
}

/**
 * Check for honeypot fields (bot detection)
 */
export function checkHoneypot(data: Record<string, any>): boolean {
  for (const field of SECURITY_CONFIG.HONEYPOT_FIELDS) {
    if (data[field] && data[field].trim() !== '') {
      return true; // Bot detected
    }
  }

  return false;
}

/**
 * Validate file upload security
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension ${extension} is not allowed`
    };
  }

  return { isValid: true };
}

/**
 * Generate a secure random string for form tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  
  return result;
}
