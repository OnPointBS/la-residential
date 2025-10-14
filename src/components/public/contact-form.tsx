"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SecureForm } from "@/components/security/secure-form";
import { SecureInput } from "@/components/security/secure-input";
import { validateAndSanitizeForm } from "@/lib/security";

interface ContactFormProps {
  homeId?: Id<"homes">;
  className?: string;
}

export function ContactForm({ homeId, className = "" }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createInquiry = useMutation(api.inquiries.create);

  const handleSecureSubmit = async (formData: FormData, _csrfToken: string) => {
    // Validate and sanitize form data
    const validationResult = validateAndSanitizeForm(
      Object.fromEntries(formData.entries()),
      {
        name: {
          required: true,
          type: 'string',
          minLength: 2,
          maxLength: 100,
          sanitize: true
        },
        email: {
          required: true,
          type: 'email',
          sanitize: true
        },
        phone: {
          required: false,
          type: 'phone',
          sanitize: true
        },
        message: {
          required: true,
          type: 'text',
          minLength: 10,
          maxLength: 1000,
          sanitize: true
        }
      }
    );

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors
      };
    }

    try {
      await createInquiry({
        name: validationResult.sanitizedData.name,
        email: validationResult.sanitizedData.email,
        phone: validationResult.sanitizedData.phone || '',
        message: validationResult.sanitizedData.message,
        homeId,
      });
      
      setIsSubmitted(true);
      return { success: true };
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      return {
        success: false,
        errors: ["There was an error submitting your inquiry. Please try again."]
      };
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-green-600 mb-2">✅</div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Thank You!
          </h3>
          <p className="text-green-700">
            We've received your inquiry and will get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SecureForm
      onSubmit={handleSecureSubmit}
      rateLimitKey={`contact-form-${homeId || 'general'}`}
      maxRequests={3}
      windowMs={15 * 60 * 1000} // 15 minutes
      className={className}
    >
      <SecureInput
        name="name"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        required
        minLength={2}
        maxLength={100}
        sanitize
      />

      <SecureInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        required
        sanitize
      />

      <SecureInput
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="Enter your phone number"
        sanitize
      />

      <SecureInput
        name="message"
        type="textarea"
        label="Message"
        placeholder={homeId ? "Tell us more about your interest in this home..." : "How can we help you?"}
        required
        minLength={10}
        maxLength={1000}
        sanitize
      />
    </SecureForm>
  );
}
