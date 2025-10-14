import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("homes").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("homes")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const allHomes = await ctx.db.query("homes").collect();
    return allHomes.filter(home => home.isFeatured === true);
  },
});

export const getById = query({
  args: { id: v.id("homes") },
  handler: async (ctx, args) => {
    const home = await ctx.db.get(args.id);
    return home;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const home = await ctx.db
      .query("homes")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!home) return null;
    
    // Get associated images
    const images = await ctx.db
      .query("homeImages")
      .withIndex("by_home_order", (q) => q.eq("homeId", home._id))
      .collect();
    
    // Get floor plan
    const floorPlan = home.floorPlanId ? await ctx.db.get(home.floorPlanId) : null;
    
    return {
      ...home,
      images,
      floorPlan,
    };
  },
});

export const getAvailable = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("homes")
      .withIndex("by_status", (q) => q.eq("status", "available"))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    status: v.union(
      v.literal("available"),
      v.literal("under-construction"),
      v.literal("sold"),
      v.literal("coming-soon")
    ),
    squareFootage: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    lotSize: v.string(),
    address: v.string(),
    floorPlanId: v.optional(v.id("floorPlans")),
    heroImageId: v.optional(v.id("_storage")),
    features: v.array(v.string()),
    tourUrl3d: v.optional(v.string()),
    videoTourUrl: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("homes", {
      ...args,
      isFeatured: args.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("homes"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("available"),
      v.literal("under-construction"),
      v.literal("sold"),
      v.literal("coming-soon")
    )),
    squareFootage: v.optional(v.number()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    lotSize: v.optional(v.string()),
    address: v.optional(v.string()),
    floorPlanId: v.optional(v.id("floorPlans")),
    heroImageId: v.optional(v.id("_storage")),
    features: v.optional(v.array(v.string())),
    tourUrl3d: v.optional(v.string()),
    videoTourUrl: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
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
  args: { id: v.id("homes") },
  handler: async (ctx, args) => {
    // Delete associated images
    const images = await ctx.db
      .query("homeImages")
      .withIndex("by_home", (q) => q.eq("homeId", args.id))
      .collect();
    
    for (const image of images) {
      if (image.imageId) {
        await ctx.storage.delete(image.imageId);
      }
      await ctx.db.delete(image._id);
    }
    
    return await ctx.db.delete(args.id);
  },
});
