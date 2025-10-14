import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      // Return default settings if none exist
      return {
        _id: "" as any,
        _creationTime: 0,
        companyName: "LA Residential - A Branch of Furr Construction",
        companyEmail: "info@furrconstruction.com",
        companyPhone: "(555) 999-8888",
        companyAddress: "123 Main St, Charlotte, NC 28202",
        metaTitle: "LA Residential - A Branch of Furr Construction - Family-Owned Home Builders",
        metaDescription: "Family-owned home construction and development services in North Carolina. Quality craftsmanship, modern designs, and exceptional customer service.",
        logoId: undefined,
        socialLinks: {
          facebook: "",
          instagram: "",
          youtube: "",
        },
      };
    }
    return settings;
  },
});

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").first();
    if (!existing) {
      const defaultSettings = {
        companyName: "LA Residential - A Branch of Furr Construction",
        companyEmail: "info@furrconstruction.com",
        companyPhone: "(555) 999-8888",
        companyAddress: "123 Main St, Charlotte, NC 28202",
        metaTitle: "LA Residential - A Branch of Furr Construction - Family-Owned Home Builders",
        metaDescription: "Family-owned home construction and development services in North Carolina. Quality craftsmanship, modern designs, and exceptional customer service.",
        logoId: undefined,
        socialLinks: {
          facebook: "",
          instagram: "",
          youtube: "",
        },
      };
      return await ctx.db.insert("settings", defaultSettings);
    }
    return existing._id;
  },
});

export const update = mutation({
  args: {
    companyName: v.optional(v.string()),
    companyEmail: v.optional(v.string()),
    companyPhone: v.optional(v.string()),
    companyAddress: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    logoId: v.optional(v.id("_storage")),
    socialLinks: v.optional(v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      throw new Error("Settings not found");
    }
    
    return await ctx.db.patch(settings._id, args);
  },
});

export const uploadLogo = mutation({
  args: {
    logoStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      throw new Error("Settings not found");
    }
    
    // Delete old logo if it exists
    if (settings.logoId) {
      await ctx.storage.delete(settings.logoId);
    }
    
    return await ctx.db.patch(settings._id, { logoId: args.logoStorageId });
  },
});
