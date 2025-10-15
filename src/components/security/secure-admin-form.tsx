"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { generateCSRFToken, checkRateLimit, checkHoneypot, validateFileUpload } from '@/lib/security';

interface SecureAdminFormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData, csrfToken: string) => Promise<{ success: boolean; errors?: string[] }>;
  onFileUpload?: (file: File) => Promise<{ success: boolean; error?: string; url?: string }>;
  rateLimitKey?: string;
  maxRequests?: number;
  windowMs?: number;
  className?: string;
}

export function SecureAdminForm({ 
  children, 
  onSubmit, 
  onFileUpload,
  rateLimitKey = 'admin-form',
  maxRequests = 10,
  windowMs = 15 * 60 * 1000,
  className = ''
}: SecureAdminFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; resetTime: number } | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Generate CSRF token on mount
    setCsrfToken(generateCSRFToken());
  }, []);

  const handleFileUpload = async (file: File, fieldName: string): Promise<{ success: boolean; error?: string; url?: string }> => {
    // Validate file
    const fileValidation = validateFileUpload(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']
    });

    if (!fileValidation.isValid) {
      return { success: false, error: fileValidation.error };
    }

    if (!onFileUpload) {
      return { success: false, error: 'File upload not configured' };
    }

    setUploadingFiles(prev => new Set(prev).add(fieldName));

    try {
      const result = await onFileUpload(file);
      return result;
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: 'File upload failed' };
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Check rate limiting (more lenient for admin)
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
      setSubmitError('Security violation detected. Submission blocked.');
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
        <input type="text" name="bot_check" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Form content */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SecureAdminInput) {
          return React.cloneElement(child, {
            onFileUpload: handleFileUpload,
            uploadingFiles
          } as any);
        }
        return child;
      })}

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
        disabled={isSubmitting || uploadingFiles.size > 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? 'Submitting...' : uploadingFiles.size > 0 ? 'Uploading Files...' : 'Submit'}
      </button>
    </form>
  );
}

interface SecureAdminInputProps {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'number' | 'file';
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
  className?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  onFileUpload?: (file: File, fieldName: string) => Promise<{ success: boolean; error?: string; url?: string }>;
  uploadingFiles?: Set<string>;
}

export function SecureAdminInput({
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  minLength,
  maxLength,
  pattern,
  sanitize = true,
  className = '',
  value = '',
  onChange,
  error,
  onFileUpload,
  uploadingFiles = new Set()
}: SecureAdminInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [validationError, setValidationError] = useState<string>('');
  const [fileUploadError, setFileUploadError] = useState<string>('');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (onChange) {
      if (type === 'number') {
        onChange(parseFloat(newValue) || 0);
      } else {
        onChange(newValue);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;

    setFileUploadError('');
    const result = await onFileUpload(file, name);
    
    if (!result.success) {
      setFileUploadError(result.error || 'Upload failed');
    }
  };

  const displayError = error || validationError || fileUploadError;

  const inputClasses = `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500
    ${displayError ? 'border-red-300' : 'border-gray-300'}
    ${className}
  `.trim();

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'file' ? (
        <div>
          <input
            id={name}
            name={name}
            type="file"
            onChange={handleFileChange}
            className={inputClasses}
            accept="image/*,.pdf"
            disabled={uploadingFiles.has(name)}
          />
          {uploadingFiles.has(name) && (
            <p className="mt-1 text-sm text-blue-600">Uploading...</p>
          )}
        </div>
      ) : (
        <InputComponent
          id={name}
          name={name}
          type={type === 'textarea' ? undefined : type}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          className={inputClasses}
          rows={type === 'textarea' ? 4 : undefined}
          min={type === 'number' ? 0 : undefined}
          step={type === 'number' ? 'any' : undefined}
          autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
          spellCheck={type === 'email' || type === 'tel' ? false : true}
        />
      )}
      
      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
      
      {maxLength && typeof inputValue === 'string' && (
        <p className="mt-1 text-xs text-gray-500">
          {inputValue.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
