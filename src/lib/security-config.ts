// Security configuration for the application

export const SECURITY_CONFIG = {
  // Rate limiting configurations
  RATE_LIMITS: {
    // Public forms (contact, inquiries)
    PUBLIC_FORMS: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // Admin forms
    ADMIN_FORMS: {
      maxRequests: 20,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // API endpoints
    API_ENDPOINTS: {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // Admin routes
    ADMIN_ROUTES: {
      maxRequests: 50,
      windowMs: 15 * 60 * 1000, // 15 minutes
    }
  },

  // File upload security
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
    SCAN_FOR_MALWARE: false, // Set to true if you have malware scanning
  },

  // Input validation rules
  VALIDATION_RULES: {
    NAME: {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-'\.]+$/,
      sanitize: true
    },
    EMAIL: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254,
      sanitize: true
    },
    PHONE: {
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      sanitize: true
    },
    MESSAGE: {
      minLength: 10,
      maxLength: 1000,
      sanitize: true
    },
    DESCRIPTION: {
      minLength: 10,
      maxLength: 2000,
      sanitize: true
    },
    ADDRESS: {
      minLength: 5,
      maxLength: 200,
      sanitize: true
    },
    SLUG: {
      pattern: /^[a-z0-9\-]+$/,
      minLength: 3,
      maxLength: 50
    }
  },

  // Honeypot field names (for bot detection)
  HONEYPOT_FIELDS: [
    'website',
    'url',
    'homepage',
    'confirm_email',
    'email_confirm',
    'phone_confirm',
    'website_url',
    'bot_check',
    'spam_check',
    'human_check',
    'verification',
    'captcha'
  ],

  // Suspicious patterns to detect
  SUSPICIOUS_PATTERNS: [
    // Script injection
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    
    // Event handlers
    /on\w+\s*=/gi,
    /onload/gi,
    /onerror/gi,
    /onclick/gi,
    
    // CSS injection
    /expression\s*\(/gi,
    /url\s*\(/gi,
    
    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    
    // Command injection
    /(\||&|;|\$\(|\`)/gi,
    
    // Path traversal
    /\.\.\//gi,
    /\.\.\\/gi
  ],

  // CSRF token configuration
  CSRF: {
    TOKEN_LENGTH: 64,
    TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  },

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  },

  // Content Security Policy
  CSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'", "https://api.stripe.com", "https://*.convex.cloud"],
    'frame-src': ["'self'", "https://js.stripe.com"],
  },

  // Logging configuration
  LOGGING: {
    LOG_SECURITY_EVENTS: true,
    LOG_RATE_LIMIT_HITS: true,
    LOG_SUSPICIOUS_ACTIVITY: true,
    LOG_FILE_UPLOADS: true,
  }
};

// Helper function to get rate limit config by type
export function getRateLimitConfig(type: keyof typeof SECURITY_CONFIG.RATE_LIMITS) {
  return SECURITY_CONFIG.RATE_LIMITS[type];
}

// Helper function to validate against suspicious patterns
export function containsSuspiciousContent(text: string): boolean {
  return SECURITY_CONFIG.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(text));
}

// Helper function to get validation rules by field type
export function getValidationRules(fieldType: keyof typeof SECURITY_CONFIG.VALIDATION_RULES) {
  return SECURITY_CONFIG.VALIDATION_RULES[fieldType];
}
