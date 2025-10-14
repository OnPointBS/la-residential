import { Doc, Id } from "@/convex/_generated/dataModel";

export type Home = Doc<"homes"> & {
  images?: Doc<"homeImages">[];
  floorPlan?: Doc<"floorPlans">;
};

export type FloorPlan = Doc<"floorPlans"> & {
  homes?: Doc<"homes">[];
};

export type HomeImage = Doc<"homeImages">;

export type Inquiry = Doc<"inquiries">;

export type Settings = Doc<"settings">;

export type HomeStatus = "available" | "under-construction" | "sold" | "coming-soon";

export interface HomeFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  status: HomeStatus;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  lotSize: string;
  address: string;
  floorPlanId: Id<"floorPlans">;
  features: string[];
  tourUrl3d?: string;
  videoTourUrl?: string;
}

export interface FloorPlanFormData {
  name: string;
  slug: string;
  description: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  homeId?: Id<"homes">;
}

export interface SettingsFormData {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  metaTitle: string;
  metaDescription: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface ImageUploadData {
  file: File;
  altText: string;
  caption?: string;
  isInterior: boolean;
  order: number;
}

export interface FilterOptions {
  status?: HomeStatus;
  minPrice?: number;
  maxPrice?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
}
