import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inquiries")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getUnread = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("inquiries")
      .withIndex("by_read", (q) => q.eq("isRead", false))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    homeId: v.optional(v.id("homes")),
  },
  handler: async (ctx, args) => {
    // Server-side validation
    const errors: string[] = [];

    // Validate name
    if (!args.name || args.name.trim().length < 2 || args.name.trim().length > 100) {
      errors.push("Name must be between 2 and 100 characters");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!args.email || !emailRegex.test(args.email)) {
      errors.push("Valid email address is required");
    }

    // Validate phone (optional but if provided, must be valid)
    if (args.phone && args.phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(args.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push("Invalid phone number format");
      }
    }

    // Validate message
    if (!args.message || args.message.trim().length < 10 || args.message.trim().length > 1000) {
      errors.push("Message must be between 10 and 1000 characters");
    }

    // Check for suspicious content
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /expression\s*\(/gi
    ];

    const allText = `${args.name} ${args.email} ${args.phone} ${args.message}`.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(allText)) {
        errors.push("Submission contains potentially malicious content");
        break;
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Sanitize data
    const sanitizedData = {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone ? args.phone.trim() : '',
      message: args.message.trim(),
      homeId: args.homeId,
      isRead: false,
      createdAt: Date.now(),
    };

    return await ctx.db.insert("inquiries", sanitizedData);
  },
});

export const markAsRead = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { isRead: true });
  },
});

export const markAsUnread = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { isRead: false });
  },
});

export const remove = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
