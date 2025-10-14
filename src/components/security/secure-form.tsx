"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { generateCSRFToken, checkRateLimit, checkHoneypot } from '@/lib/security';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData, csrfToken: string) => Promise<{ success: boolean; errors?: string[] }>;
  rateLimitKey?: string;
  maxRequests?: number;
  windowMs?: number;
  className?: string;
}

export function SecureForm({ 
  children, 
  onSubmit, 
  rateLimitKey = 'default',
  maxRequests = 5,
  windowMs = 15 * 60 * 1000,
  className = ''
}: SecureFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; resetTime: number } | null>(null);

  useEffect(() => {
    // Generate CSRF token on mount
    setCsrfToken(generateCSRFToken());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Check rate limiting
    const rateLimitResult = checkRateLimit(rateLimitKey, maxRequests, windowMs);
    if (!rateLimitResult.allowed) {
      setSubmitError(`Too many requests. Please try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)} minutes.`);
      return;
    }

    setRateLimitInfo({
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime
    });

    const formData = new FormData(e.currentTarget);
    
    // Check for honeypot fields
    const formObject = Object.fromEntries(formData.entries());
    if (checkHoneypot(formObject)) {
      setSubmitError('Bot detected. Submission blocked.');
      return;
    }

    // Validate CSRF token
    const submittedToken = formData.get('csrf_token') as string;
    if (!submittedToken || submittedToken !== csrfToken) {
      setSubmitError('Invalid security token. Please refresh the page and try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await onSubmit(formData, csrfToken);
      
      if (result.success) {
        // Reset form and generate new CSRF token
        e.currentTarget.reset();
        setCsrfToken(generateCSRFToken());
        setRateLimitInfo(null);
      } else {
        setSubmitError(result.errors?.join(', ') || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* CSRF Token */}
      <input 
        type="hidden" 
        name="csrf_token" 
        value={csrfToken} 
      />
      
      {/* Honeypot fields (hidden from users) */}
      <div style={{ display: 'none' }}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        <input type="text" name="confirm_email" tabIndex={-1} autoComplete="off" />
        <input type="text" name="phone_confirm" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Form content */}
      {children}

      {/* Error display */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
          {submitError}
        </div>
      )}

      {/* Rate limit info */}
      {rateLimitInfo && (
        <div className="text-sm text-gray-600 mt-2">
          Requests remaining: {rateLimitInfo.remaining}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
