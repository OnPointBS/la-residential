"use client";

import React, { useState, useEffect } from 'react';
import { validateAndSanitizeForm } from '@/lib/security';

interface SecureInputProps {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SecureInput({
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
  error
}: SecureInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Real-time validation
    const validationResult = validateAndSanitizeForm(
      { [name]: newValue },
      {
        [name]: {
          required,
          type: type === 'tel' ? 'phone' : type === 'email' ? 'email' : type === 'url' ? 'url' : 'string',
          minLength,
          maxLength,
          pattern,
          sanitize
        }
      }
    );

    if (!validationResult.isValid) {
      setValidationError(validationResult.errors[0]);
    } else {
      setValidationError('');
    }

    if (onChange) {
      onChange(validationResult.sanitizedData[name]);
    }
  };

  const displayError = error || validationError;

  const inputClasses = `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
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
      
      <InputComponent
        id={name}
        name={name}
        type={type === 'textarea' ? undefined : type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className={inputClasses}
        rows={type === 'textarea' ? 4 : undefined}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
        spellCheck={type === 'email' || type === 'tel' ? false : true}
      />
      
      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
      
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          {inputValue.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}

interface SecureSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SecureSelect({
  name,
  label,
  required = false,
  options,
  className = '',
  value = '',
  onChange,
  error
}: SecureSelectProps) {
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const selectClasses = `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={selectValue}
        onChange={handleChange}
        className={selectClasses}
      >
        {!required && <option value="">Select an option...</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
