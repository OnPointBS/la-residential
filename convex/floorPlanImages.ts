import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByFloorPlan = query({
  args: { floorPlanId: v.id("floorPlans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("floorPlanImages")
      .withIndex("by_floor_plan", (q) => q.eq("floorPlanId", args.floorPlanId))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    floorPlanId: v.id("floorPlans"),
    imageId: v.optional(v.id("_storage")),
    altText: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    fileType: v.union(v.literal("image"), v.literal("pdf")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("floorPlanImages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("floorPlanImages"),
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const updateOrder = mutation({
  args: {
    imageId: v.id("floorPlanImages"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.imageId, {
      order: args.newOrder,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("floorPlanImages") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (image && image.imageId) {
      await ctx.storage.delete(image.imageId);
    }
    return await ctx.db.delete(args.id);
  },
});

export const removeAllForFloorPlan = mutation({
  args: { floorPlanId: v.id("floorPlans") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("floorPlanImages")
      .withIndex("by_floor_plan", (q) => q.eq("floorPlanId", args.floorPlanId))
      .collect();
    
    for (const image of images) {
      if (image.imageId) {
        await ctx.storage.delete(image.imageId);
      }
      await ctx.db.delete(image._id);
    }
    
    return images.length;
  },
});
