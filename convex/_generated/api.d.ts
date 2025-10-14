/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as files from "../files.js";
import type * as floorPlanImages from "../floorPlanImages.js";
import type * as floorPlans from "../floorPlans.js";
import type * as homeImages from "../homeImages.js";
import type * as homes from "../homes.js";
import type * as images from "../images.js";
import type * as inquiries from "../inquiries.js";
import type * as settings from "../settings.js";
import type * as socialMediaLinks from "../socialMediaLinks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  files: typeof files;
  floorPlanImages: typeof floorPlanImages;
  floorPlans: typeof floorPlans;
  homeImages: typeof homeImages;
  homes: typeof homes;
  images: typeof images;
  inquiries: typeof inquiries;
  settings: typeof settings;
  socialMediaLinks: typeof socialMediaLinks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
