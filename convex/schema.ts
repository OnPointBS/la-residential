import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  homes: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_floor_plan", ["floorPlanId"])
    .index("by_featured", ["isFeatured"]),

  floorPlans: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    squareFootage: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    imageId: v.optional(v.id("_storage")),
    pdfId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  homeImages: defineTable({
    homeId: v.id("homes"),
    imageId: v.optional(v.id("_storage")),
    altText: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    isInterior: v.boolean(),
    createdAt: v.number(),
  }).index("by_home", ["homeId"])
    .index("by_home_order", ["homeId", "order"]),

  floorPlanImages: defineTable({
    floorPlanId: v.id("floorPlans"),
    imageId: v.optional(v.id("_storage")),
    altText: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    fileType: v.union(v.literal("image"), v.literal("pdf")),
    createdAt: v.number(),
  }).index("by_floor_plan", ["floorPlanId"])
    .index("by_floor_plan_order", ["floorPlanId", "order"]),

  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    homeId: v.optional(v.id("homes")),
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index("by_read", ["isRead"])
    .index("by_created", ["createdAt"]),

  // General images table for admin image management
  images: defineTable({
    name: v.string(),
    altText: v.string(),
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
    fileSize: v.number(),
    mimeType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    category: v.optional(v.string()), // e.g., "hero", "gallery", "logo", etc.
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_created", ["createdAt"])
    .index("by_public", ["isPublic"]),

  settings: defineTable({
    companyName: v.string(),
    companyEmail: v.string(),
    companyPhone: v.string(),
    companyAddress: v.string(),
    metaTitle: v.string(),
    metaDescription: v.string(),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
  }),

  // Simple auth tables
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expires", ["expiresAt"]),
});
