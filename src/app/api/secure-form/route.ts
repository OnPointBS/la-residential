import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeForm, checkRateLimit, validateCSRFToken, checkHoneypot } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting check
    const rateLimitResult = checkRateLimit(`api-${clientIP}`, 10, 15 * 60 * 1000); // 10 requests per 15 minutes
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      );
    }

    // Validate CSRF token
    const { csrfToken, formData } = body;
    if (!validateCSRFToken(csrfToken, request.headers.get('x-csrf-token') || '')) {
      return NextResponse.json(
        { success: false, error: 'Invalid security token' },
        { status: 403 }
      );
    }

    // Check for honeypot fields
    if (checkHoneypot(formData)) {
      return NextResponse.json(
        { success: false, error: 'Bot detected' },
        { status: 403 }
      );
    }

    // Validate and sanitize form data
    const validationRules = {
      name: {
        required: true,
        type: 'string' as const,
        minLength: 2,
        maxLength: 100,
        sanitize: true
      },
      email: {
        required: true,
        type: 'email' as const,
        sanitize: true
      },
      phone: {
        required: false,
        type: 'phone' as const,
        sanitize: true
      },
      message: {
        required: true,
        type: 'text' as const,
        minLength: 10,
        maxLength: 1000,
        sanitize: true
      }
    };

    const validationResult = validateAndSanitizeForm(formData, validationRules);

    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validationResult.errors 
        },
        { status: 400 }
      );
    }

    // Additional security checks
    const suspiciousPatterns = [
      /script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload/i,
      /onerror/i,
      /eval\(/i,
      /expression\(/i
    ];

    for (const [field, value] of Object.entries(validationResult.sanitizedData)) {
      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            return NextResponse.json(
              { success: false, error: `Suspicious content detected in ${field}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Log the submission for monitoring
    console.log('Secure form submission:', {
      ip: clientIP,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      formType: formData.formType || 'contact'
    });

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      sanitizedData: validationResult.sanitizedData
    });

  } catch (error) {
    console.error('Secure form API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
