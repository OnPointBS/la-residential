import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("images")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("images") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const search = query({
  args: { 
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("images");

    if (args.category) {
      query = query.withIndex("by_category", (q) => q.eq("category", args.category));
    }

    const images = await query.collect();

    // Filter by search term and tags
    return images.filter((image) => {
      const matchesSearch = !args.searchTerm || 
        image.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        image.altText.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        (image.caption && image.caption.toLowerCase().includes(args.searchTerm.toLowerCase()));

      const matchesTags = !args.tags || args.tags.length === 0 || 
        args.tags.some(tag => image.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    altText: v.string(),
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
    fileSize: v.number(),
    mimeType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("images", {
      name: args.name,
      altText: args.altText,
      caption: args.caption,
      storageId: args.storageId,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      width: args.width,
      height: args.height,
      category: args.category,
      tags: args.tags || [],
      isPublic: args.isPublic ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("images"),
    name: v.optional(v.string()),
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("images") },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.id);
    if (image) {
      // Delete the file from storage
      await ctx.storage.delete(image.storageId);
      // Delete the record
      await ctx.db.delete(args.id);
    }
  },
});

export const bulkDelete = mutation({
  args: { ids: v.array(v.id("images")) },
  handler: async (ctx, args) => {
    const images = await Promise.all(
      args.ids.map(id => ctx.db.get(id))
    );

    // Delete files from storage
    await Promise.all(
      images.map(image => 
        image ? ctx.storage.delete(image.storageId) : Promise.resolve()
      )
    );

    // Delete records
    await Promise.all(
      args.ids.map(id => ctx.db.delete(id))
    );
  },
});
