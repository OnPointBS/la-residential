import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple password hashing (for demo purposes - use proper hashing in production)
function hashPassword(password: string): string {
  // Simple hash for demo - use bcrypt or similar in production
  return btoa(password + "_hash");
}

// Simple token generation
function generateToken(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Register a new user
export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: hashPassword(args.password),
      name: args.name,
      role: "admin", // Default to admin for simplicity
      createdAt: Date.now(),
    });

    return { userId, success: true };
  },
});

// Login user
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    if (user.passwordHash !== hashPassword(args.password)) {
      throw new Error("Invalid email or password");
    }

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    const sessionId = await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    // Update last login
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

// Logout user
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find and delete session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Get current user from token
export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired (don't delete here, just return null)
    if (session.expiresAt < Date.now()) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

// Clean up expired sessions
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_expires", (q) => q.lt("expiresAt", Date.now()))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }

    return { cleaned: expiredSessions.length };
  },
});

// Create default admin user (for initial setup)
export const createDefaultAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if any admin users exist
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first();

    if (existingAdmin) {
      throw new Error("Admin user already exists");
    }

    // Create default admin user
    const userId = await ctx.db.insert("users", {
      email: "admin@laresidential.com",
      passwordHash: hashPassword("admin123"), // Default password
      name: "Admin User",
      role: "admin",
      createdAt: Date.now(),
    });

    return { userId, email: "admin@laresidential.com", password: "admin123" };
  },
});