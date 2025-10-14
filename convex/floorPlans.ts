import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("floorPlans").collect();
  },
});

export const getById = query({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const floorPlan = await ctx.db
      .query("floorPlans")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!floorPlan) return null;
    
    // Get homes using this floor plan
    const homes = await ctx.db
      .query("homes")
      .withIndex("by_floor_plan", (q) => q.eq("floorPlanId", floorPlan._id))
      .collect();
    
    return {
      ...floorPlan,
      homes,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    squareFootage: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    imageId: v.optional(v.id("_storage")),
    pdfId: v.optional(v.id("_storage")),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("floorPlans", {
      ...args,
      createdAt: args.createdAt || now,
      updatedAt: args.updatedAt || now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("floorPlans"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    squareFootage: v.optional(v.number()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    imageId: v.optional(v.id("_storage")),
    pdfId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("floorPlans") },
  handler: async (ctx, args) => {
    // Delete associated files
    const floorPlan = await ctx.db.get(args.id);
    if (floorPlan) {
      if (floorPlan.imageId) {
        await ctx.storage.delete(floorPlan.imageId);
      }
      if (floorPlan.pdfId) {
        await ctx.storage.delete(floorPlan.pdfId);
      }
    }
    
    return await ctx.db.delete(args.id);
  },
});
