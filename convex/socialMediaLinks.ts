import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialMediaLinks")
      .withIndex("by_order")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

export const getAllForAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialMediaLinks")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("socialMediaLinks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    platform: v.string(),
    url: v.string(),
    icon: v.string(),
    label: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(args.url)) {
      throw new Error("URL must start with http:// or https://");
    }

    // Check if platform already exists
    const existing = await ctx.db
      .query("socialMediaLinks")
      .withIndex("by_platform", (q) => q.eq("platform", args.platform))
      .first();

    if (existing) {
      throw new Error("A link for this platform already exists");
    }

    return await ctx.db.insert("socialMediaLinks", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("socialMediaLinks"),
    platform: v.optional(v.string()),
    url: v.optional(v.string()),
    icon: v.optional(v.string()),
    label: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Validate URL if provided
    if (updateData.url) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(updateData.url)) {
        throw new Error("URL must start with http:// or https://");
      }
    }

    // Check for duplicate platform if platform is being updated
    if (updateData.platform) {
      const existing = await ctx.db
        .query("socialMediaLinks")
        .withIndex("by_platform", (q) => q.eq("platform", updateData.platform!))
        .filter((q) => q.neq(q.field("_id"), id))
        .first();

      if (existing) {
        throw new Error("A link for this platform already exists");
      }
    }

    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("socialMediaLinks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: {
    items: v.array(v.object({
      id: v.id("socialMediaLinks"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const updates = args.items.map(async (item) => {
      return await ctx.db.patch(item.id, {
        order: item.order,
        updatedAt: Date.now(),
      });
    });

    await Promise.all(updates);
    return { success: true };
  },
});

export const toggleActive = mutation({
  args: { id: v.id("socialMediaLinks") },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.id);
    if (!link) {
      throw new Error("Social media link not found");
    }

    return await ctx.db.patch(args.id, {
      isActive: !link.isActive,
      updatedAt: Date.now(),
    });
  },
});
