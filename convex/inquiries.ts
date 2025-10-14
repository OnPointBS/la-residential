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
    return await ctx.db.insert("inquiries", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
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
