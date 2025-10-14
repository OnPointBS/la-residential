import { Id } from "@/convex/_generated/dataModel";

/**
 * Get the full URL for a Convex storage file
 */
export function getConvexStorageUrl(storageId: Id<"_storage">): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return `${convexUrl}/api/storage/${storageId}`;
}

/**
 * Get the Convex URL from environment variables
 */
export function getConvexUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return convexUrl;
}
