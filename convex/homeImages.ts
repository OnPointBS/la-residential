import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all images for a specific home
export const getByHome = query({
  args: { homeId: v.id("homes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("homeImages")
      .withIndex("by_home_order", (q) => q.eq("homeId", args.homeId))
      .collect();
  },
});

// Create a new home image
export const create = mutation({
  args: {
    homeId: v.id("homes"),
    imageId: v.id("_storage"),
    altText: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    isInterior: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("homeImages", {
      ...args,
      createdAt: now,
    });
  },
});

// Update an existing home image
export const update = mutation({
  args: {
    id: v.id("homeImages"),
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    isInterior: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Update the order of an image
export const updateOrder = mutation({
  args: {
    imageId: v.id("homeImages"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    // Get all images for this home
    const allImages = await ctx.db
      .query("homeImages")
      .withIndex("by_home_order", (q) => q.eq("homeId", image.homeId))
      .collect();

    // Update orders
    for (const img of allImages) {
      if (img._id === args.imageId) {
        await ctx.db.patch(img._id, { order: args.newOrder });
      } else if (img.order >= args.newOrder) {
        await ctx.db.patch(img._id, { order: img.order + 1 });
      }
    }
  },
});

// Remove a home image
export const remove = mutation({
  args: { id: v.id("homeImages") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (!image) {
      throw new Error("Image not found");
    }

    // Delete the storage file
    if (image.imageId) {
      await ctx.storage.delete(image.imageId);
    }

    return await ctx.db.delete(args.id);
  },
});

// Remove all images for a home
export const removeAllForHome = mutation({
  args: { homeId: v.id("homes") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("homeImages")
      .withIndex("by_home_order", (q) => q.eq("homeId", args.homeId))
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